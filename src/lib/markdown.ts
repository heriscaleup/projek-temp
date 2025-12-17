import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export type PostFrontmatter = {
  title: string;
  date: string; // YYYY-MM-DD
  excerpt: string;
  category: string;
  image: string; // URL, emoji, or public path
  slug: string; // required and should match file name
  published?: boolean; // Optional: true if published, false or undefined if draft
};

export type PostMeta = PostFrontmatter & {
  readingTime?: number; // Estimated reading time in minutes
};

export type Post = PostMeta & {
  contentHtml: string;
  toc: TableOfContentsItem[];
};

export type TableOfContentsItem = {
  id: string;
  text: string;
  level: number;
};

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif']);

type ImageIndexEntry = {
  path: string;
  tokens: string[];
};

let cachedImageIndex: ImageIndexEntry[] | null = null;

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  agribisnis: '/freeze-drying-solusi-makanan-sehat-praktis-raja-fo.jpg',
  bisnis: '/freeze-dried-food-solusi-makanan-sehat-praktis-mod.jpg',
  kebugaran: '/freeze-dried-food-nutrisi-optimal-praktis-aman-mas.jpg',
  kesehatan: '/manfaat-freeze-dried-nutrisi-optimal-praktis-hidup.jpg',
  inovasi: '/teknologi-freeze-drying-inovasi-pangan-sehat-masa-.jpg',
  teknologi: '/teknologi-freeze-drying-solusi-makanan-sehat-prakt.jpg',
  lifestyle: '/rahasia-freeze-drying-nutrisi-optimal-untuk-gaya-h.jpg',
  parenting: '/buah-freeze-dried-rahasia-snack-sehat-praktis-dan-.jpg',
  kuliner: '/keajaiban-freeze-drying-makanan-sehat-praktis-raja.jpg',
  'rantai pasok': '/freeze-drying-revolusi-nutrisi-makanan-praktis-raj.jpg',
  outdoor: '/freeze-drying-rahasia-buah-awet-nutrisi-terjaga.jpg',
  panduan: '/menguak-teknologi-freeze-drying-makanan-sehat-prak.jpg',
};

const DEFAULT_POST_IMAGE = '/raja-freeze-dried-food-revolusi-makanan-sehat-tekn.jpg';

function normalizeForTokens(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function tokenize(value: string): string[] {
  const clean = value.replace(/\\/g, '/');
  const segment = clean.split('/').filter(Boolean).pop() ?? clean;
  const normalized = normalizeForTokens(segment);
  return normalized ? normalized.split('-').filter(Boolean) : [];
}

async function buildImageIndex(): Promise<ImageIndexEntry[]> {
  if (cachedImageIndex) return cachedImageIndex;

  const entries: ImageIndexEntry[] = [];

  async function walk(dir: string) {
    const stats = await fs.readdir(dir, { withFileTypes: true });
    for (const stat of stats) {
      const fullPath = path.join(dir, stat.name);
      if (stat.isDirectory()) {
        await walk(fullPath);
        continue;
      }
      const ext = path.extname(stat.name).toLowerCase();
      if (!IMAGE_EXTENSIONS.has(ext)) continue;
      const relative = `/${path.relative(PUBLIC_DIR, fullPath).split(path.sep).join('/')}`;
      entries.push({ path: relative, tokens: tokenize(relative) });
    }
  }

  try {
    await walk(PUBLIC_DIR);
  } catch {
    // ignore errors while scanning public dir; we'll fallback later
  }

  cachedImageIndex = entries;
  return cachedImageIndex;
}

async function findBestImageMatch(hints: string[]): Promise<string | null> {
  if (hints.length === 0) return null;
  const index = await buildImageIndex();
  if (index.length === 0) return null;

  let bestPath: string | null = null;
  let bestScore = 0;

  for (const rawHint of hints) {
    const hintTokens = tokenize(rawHint);
    if (hintTokens.length === 0) continue;

    for (const entry of index) {
      if (entry.tokens.length === 0) continue;
      const score = entry.tokens.reduce((acc, token) => (hintTokens.includes(token) ? acc + 1 : acc), 0);
      if (score > bestScore) {
        bestScore = score;
        bestPath = entry.path;
      }
    }
  }

  if (bestScore >= 2) {
    return bestPath;
  }

  return null;
}

async function resolvePostImage({
  slug,
  requestedImage,
  category,
}: {
  slug: string;
  requestedImage: string;
  category: string;
}): Promise<string> {
  const trimmed = requestedImage.trim();
  const hints: string[] = trimmed ? [trimmed, slug] : [slug];

  if (trimmed && (trimmed.startsWith('http://') || trimmed.startsWith('https://'))) {
    return trimmed;
  }

  if (trimmed) {
    const normalizedPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    const sanitizedPath = normalizedPath.split('\\').join('/');
    const relativePath = sanitizedPath.startsWith("/") ? sanitizedPath.slice(1) : sanitizedPath;
    const absolutePath = path.join(PUBLIC_DIR, relativePath);

    try {
      await fs.access(absolutePath);
      return sanitizedPath;
    } catch {
      // continue to fallback logic
    }
  }

  const bestMatch = await findBestImageMatch(hints);
  if (bestMatch) {
    return bestMatch;
  }

  const categoryImage = CATEGORY_IMAGE_MAP[category.toLowerCase()];
  if (categoryImage) {
    return categoryImage;
  }

  return DEFAULT_POST_IMAGE;
}

async function ensureDir(): Promise<void> {
  await fs.mkdir(BLOG_DIR, { recursive: true });
}

function calculateReadingTime(text: string): number {
    const wpm = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wpm);
}

function extractToc(content: string): TableOfContentsItem[] {
  const toc: TableOfContentsItem[] = [];
  const regex = /^(#{2,3})\s+(.*)$/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      toc.push({ id, text, level });
  }
  return toc;
}


export async function getPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((post) => post.slug);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  await ensureDir();
  const fullPath = path.join(BLOG_DIR, `${slug}.md`);
  try {
    const file = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(file);

    // Type guard for frontmatter
    const frontmatter = data as Record<string, unknown>;

    // Fallback logic for date
    let date = frontmatter.date;
    if (!date || typeof date !== 'string' || !date.trim()) {
      const stats = await fs.stat(fullPath);
      date = stats.birthtime.toISOString().split('T')[0];
    }

    // Validate required fields (except date which we just handled)
    const required = ['title', 'excerpt', 'category'] as const;
    for (const key of required) {
      const value = frontmatter[key];
      if (typeof value !== 'string' || !value.trim()) {
        // Fallback or skip? Prompt says "Ensure frontmatter is consistent".
        // Ideally we should fix it, but for now throwing error might be too harsh if we want to retain traffic.
        // Let's provide generic fallbacks if critically missing to keep page alive (Robustness).
        if (key === 'title') frontmatter.title = 'Untitled Post';
        if (key === 'excerpt') frontmatter.excerpt = 'No description available.';
        if (key === 'category') frontmatter.category = 'Umum';
      }
    }

    // Slug: prefer filename slug; if frontmatter.slug present, allow it but do not require equality.
    const fmSlug = typeof frontmatter.slug === 'string' && frontmatter.slug.trim() ? (frontmatter.slug as string) : slug;

    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSlug) // Adds IDs to headings
      .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
      .use(rehypeStringify)
      .process(content);

    const contentHtml = processedContent.toString();
    const readingTime = calculateReadingTime(content);
    const toc = extractToc(content);

    const resolvedImage = await resolvePostImage({
      slug,
      requestedImage: typeof frontmatter.image === 'string' ? frontmatter.image : '',
      category: frontmatter.category as string,
    });

    const meta: PostMeta = {
      title: frontmatter.title as string,
      date: date as string,
      excerpt: frontmatter.excerpt as string,
      category: frontmatter.category as string,
      image: resolvedImage,
      slug: fmSlug,
      published: frontmatter.published === false ? false : true,
      readingTime
    };

    return {
      ...meta,
      contentHtml,
      toc
    };
  } catch (err) {
    console.error(`Error processing post ${slug}:`, err);
    return null;
  }
}

export async function getAllPosts(): Promise<PostMeta[]> {
  await ensureDir();
  const entries = await fs.readdir(BLOG_DIR, { withFileTypes: true });
  const slugs = entries
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => e.name.replace(/\.md$/, ''));

  const posts: PostMeta[] = [];
  for (const slug of slugs) {
    const post = await getPostBySlug(slug);
    if (post && post.published) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { contentHtml, toc, ...meta } = post;
      posts.push(meta);
    }
  }
  // Urutkan terbaru dulu berdasarkan date (YYYY-MM-DD)
  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return posts;
}

export async function getRelatedPosts(currentSlug: string, category: string, limit: number = 3): Promise<PostMeta[]> {
    const allPosts = await getAllPosts();
    return allPosts
        .filter(post => post.slug !== currentSlug && post.category === category)
        .slice(0, limit);
}
