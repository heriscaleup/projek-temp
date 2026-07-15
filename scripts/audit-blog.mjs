import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const PUBLIC_DIR = path.join(ROOT, 'public');
const CREDIT_PATH = path.join(ROOT, 'src', 'data', 'blogImageCredits.json');
const EXPECTED_ARTICLES = 74;
const MIN_WORDS = 500;
const MAX_COSINE_SIMILARITY = 0.8;

const STOP_WORDS = new Set(
  'yang dan dengan untuk pada dari dalam atau adalah ini itu sebagai tidak lebih dapat akan juga agar karena serta oleh saat antara jika namun setiap menjadi sudah harus perlu hanya tentang setelah sebelum maka bisa telah tanpa bukan terhadap bagi lalu yaitu yakni seperti secara sangat paling'.split(
    /\s+/,
  ),
);

function assert(condition, message, errors) {
  if (!condition) errors.push(message);
}

function countWords(markdown) {
  const plain = markdown
    .replace(/\[[^\]]+\]\([^)]+\)/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[#>*_`|\-]/g, ' ');
  return plain.match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
}

function termVector(markdown) {
  const text = markdown.toLowerCase().replace(/https?:\/\/\S+/g, ' ');
  const words = (text.match(/[a-z0-9]+/g) ?? []).filter(
    (word) => word.length > 2 && !STOP_WORDS.has(word),
  );
  const vector = new Map();
  for (const word of words) vector.set(word, (vector.get(word) ?? 0) + 1);
  return vector;
}

function cosineSimilarity(left, right) {
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;
  for (const value of left.values()) leftMagnitude += value * value;
  for (const value of right.values()) rightMagnitude += value * value;
  for (const [term, value] of left) dot += value * (right.get(term) ?? 0);
  return dot / Math.sqrt(leftMagnitude * rightMagnitude);
}

async function main() {
  const errors = [];
  const credits = JSON.parse(await fs.readFile(CREDIT_PATH, 'utf8'));
  const files = (await fs.readdir(BLOG_DIR)).filter((file) => file.endsWith('.md')).sort();
  const slugs = new Set(files.map((file) => file.replace(/\.md$/, '')));
  const posts = [];
  const imageHashes = new Map();

  assert(files.length === EXPECTED_ARTICLES, `Expected ${EXPECTED_ARTICLES} articles, found ${files.length}.`, errors);

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const raw = await fs.readFile(path.join(BLOG_DIR, file), 'utf8');
    const { data, content } = matter(raw);
    const wordCount = countWords(content);
    const internalLinks = [...content.matchAll(/\]\(\/blog\/([^)]+)\)/g)].map((match) => match[1]);
    const sourceLinks = [...content.matchAll(/\]\((https?:\/\/[^)]+)\)/g)]
      .map((match) => match[1])
      .filter((url) => !url.includes('wa.me'));

    for (const field of [
      'title',
      'seoTitle',
      'date',
      'updated',
      'excerpt',
      'category',
      'image',
      'imageAlt',
      'slug',
      'author',
      'reviewer',
      'focusKeyword',
      'searchIntent',
    ]) {
      assert(typeof data[field] === 'string' && data[field].trim(), `${file}: missing ${field}.`, errors);
    }

    assert(data.slug === slug, `${file}: frontmatter slug does not match filename.`, errors);
    assert(data.seoTitle.length <= 65, `${file}: SEO title is longer than 65 characters.`, errors);
    assert(/^\d{4}-\d{2}-\d{2}$/.test(data.date), `${file}: invalid published date.`, errors);
    assert(/^\d{4}-\d{2}-\d{2}$/.test(data.updated), `${file}: invalid updated date.`, errors);
    assert(Array.isArray(data.tags) && data.tags.length >= 3, `${file}: needs at least three tags.`, errors);
    assert(data.published === true, `${file}: published must be true.`, errors);
    assert(wordCount >= MIN_WORDS, `${file}: only ${wordCount} words.`, errors);
    assert(internalLinks.length >= 2, `${file}: needs at least two internal links.`, errors);
    assert(sourceLinks.length >= 2, `${file}: needs at least two non-commercial sources.`, errors);
    assert(internalLinks.every((target) => slugs.has(target)), `${file}: contains a broken internal blog link.`, errors);
    assert(!/6281234567890|\]\(#\)|stok terbatas|gratis ongkir|sampel gratis/i.test(content), `${file}: contains legacy placeholder or promotion copy.`, errors);
    assert(!/mempertahankan (?:hingga )?(?:90|95|97)%|tahan (?:hingga )?(?:20|25|30) tahun/i.test(content), `${file}: contains an unsupported absolute claim.`, errors);

    const imagePath = typeof data.image === 'string' ? data.image : '';
    assert(imagePath === `/images/blog/${slug}.webp`, `${file}: image path is not slug-specific.`, errors);
    const diskImage = path.join(PUBLIC_DIR, imagePath.replace(/^\//, ''));
    try {
      const buffer = await fs.readFile(diskImage);
      const hash = crypto.createHash('sha256').update(buffer).digest('hex');
      const duplicate = imageHashes.get(hash);
      assert(!duplicate, `${file}: image duplicates ${duplicate}.`, errors);
      imageHashes.set(hash, file);
    } catch {
      errors.push(`${file}: image file is missing.`);
    }
    const credit = credits[imagePath];
    assert(Boolean(credit?.label), `${file}: image credit is missing.`, errors);
    if (credit?.sourceUrl) {
      assert(Boolean(credit.creator), `${file}: licensed photo creator is missing.`, errors);
      assert(Boolean(credit.license), `${file}: licensed photo license is missing.`, errors);
      if (credit.license.toLowerCase() !== 'public domain') {
        assert(Boolean(credit.licenseUrl), `${file}: licensed photo license URL is missing.`, errors);
      }
      assert(Boolean(credit.sourceTitle), `${file}: licensed photo source title is missing.`, errors);
    }

    posts.push({ file, data, content, wordCount, vector: termVector(content) });
  }

  for (const field of ['title', 'seoTitle', 'excerpt', 'image', 'imageAlt']) {
    const values = posts.map(({ data }) => data[field]);
    assert(new Set(values).size === posts.length, `Frontmatter ${field} values are not unique.`, errors);
  }

  const similarPairs = [];
  for (let left = 0; left < posts.length; left += 1) {
    for (let right = left + 1; right < posts.length; right += 1) {
      const similarity = cosineSimilarity(posts[left].vector, posts[right].vector);
      if (similarity >= MAX_COSINE_SIMILARITY) {
        similarPairs.push({
          similarity,
          left: posts[left].file,
          right: posts[right].file,
        });
      }
    }
  }
  assert(similarPairs.length === 0, `${similarPairs.length} article pairs exceed the similarity threshold.`, errors);

  if (errors.length) {
    console.error(`Blog audit failed with ${errors.length} issue(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  const wordCounts = posts.map((post) => post.wordCount);
  console.log(
    JSON.stringify(
      {
        articles: posts.length,
        uniqueTitles: new Set(posts.map(({ data }) => data.title)).size,
        uniqueImages: imageHashes.size,
        minimumWords: Math.min(...wordCounts),
        averageWords: Math.round(wordCounts.reduce((sum, count) => sum + count, 0) / wordCounts.length),
        highSimilarityPairs: similarPairs.length,
        brokenInternalLinks: 0,
        missingImageCredits: 0,
      },
      null,
      2,
    ),
  );
}

await main();
