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
  seoTitle?: string;
  date: string; // YYYY-MM-DD
  updated?: string; // YYYY-MM-DD
  excerpt: string;
  category: string;
  image: string; // URL, emoji, or public path
  imageAlt?: string;
  slug: string; // required and should match file name
  author?: string;
  reviewer?: string;
  focusKeyword?: string;
  searchIntent?: string;
  tags?: string[];
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

const DEFAULT_POST_IMAGE = '/raja-freeze-dried-food-revolusi-makanan-sehat-tekn.jpg';

async function resolvePostImage({
  requestedImage,
}: {
  requestedImage: string;
}): Promise<string> {
  const trimmed = requestedImage.trim();

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
      requestedImage: typeof frontmatter.image === 'string' ? frontmatter.image : '',
    });

    const optionalString = (key: string): string | undefined => {
      const value = frontmatter[key];
      return typeof value === 'string' && value.trim() ? value.trim() : undefined;
    };
    const tags = Array.isArray(frontmatter.tags)
      ? frontmatter.tags.filter((tag): tag is string => typeof tag === 'string' && Boolean(tag.trim()))
      : undefined;

    const meta: PostMeta = {
      title: frontmatter.title as string,
      seoTitle: optionalString('seoTitle'),
      date: date as string,
      updated: optionalString('updated'),
      excerpt: frontmatter.excerpt as string,
      category: frontmatter.category as string,
      image: resolvedImage,
      imageAlt: optionalString('imageAlt'),
      slug,
      author: optionalString('author'),
      reviewer: optionalString('reviewer'),
      focusKeyword: optionalString('focusKeyword'),
      searchIntent: optionalString('searchIntent'),
      tags,
      published: frontmatter.published === false ? false : true,
      readingTime,
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
  const current = allPosts.find((post) => post.slug === currentSlug);
  const currentTags = new Set((current?.tags ?? []).map((tag) => tag.toLowerCase()));

  return allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      const sharedTags = (post.tags ?? []).filter((tag) => currentTags.has(tag.toLowerCase())).length;
      const categoryScore = post.category === category ? 3 : 0;
      return { post, score: categoryScore + sharedTags * 2 };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1))
    .slice(0, limit)
    .map(({ post }) => post);
}
