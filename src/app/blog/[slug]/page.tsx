import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug, getPostSlugs, getRelatedPosts } from '@/lib/markdown';
import type { Metadata } from 'next';
import { JsonLd } from "@/components/JsonLd";
import { Article, BreadcrumbList, WithContext } from "schema-dts";

export type PageProps = { params: Promise<{ slug: string }> };

const SITE_URL = 'https://rajafreezdriedfood.com';

function toAbsoluteUrl(imagePath: string): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const normalized = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${SITE_URL}${normalized}`;
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return { title: 'Artikel Tidak Ditemukan' };
  }
  const absoluteImage = post.image ? toAbsoluteUrl(post.image) : '';

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['Raja Freeze Dried Food'],
      images: absoluteImage ? [absoluteImage] : [],
      url: `/blog/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: absoluteImage ? [absoluteImage] : [],
    },
  };
}

export default async function BlogPostDetail({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(post.slug, post.category);

  const absoluteImage = post.image ? toAbsoluteUrl(post.image) : '';

  const articleJsonLd: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    image: absoluteImage ? [absoluteImage] : [],
    author: {
      "@type": "Organization",
      name: "Raja Freeze Dried Food",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Raja Freeze Dried Food",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.webp`,
      },
    },
    description: post.excerpt,
  };

  const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": SITE_URL
      },{
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${SITE_URL}/blog`
      },{
        "@type": "ListItem",
        "position": 3,
        "name": post.title
      }]
  };

  return (
    <>
      <Header />
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <main className="min-h-screen bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link href="/" className="inline-flex items-center hover:text-gray-900">
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <Link href="/blog" className="ml-1 hover:text-gray-900 md:ml-2">Blog</Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span className="ml-1 text-gray-700 md:ml-2 truncate max-w-xs">{post.title}</span>
                  </div>
                </li>
              </ol>
          </nav>

          <article>
            <header className="mb-8 text-center border-b pb-8">
              <p className="text-base text-gray-500 mb-2">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span className="mx-2">•</span>
                <span>{post.category}</span>
                <span className="mx-2">•</span>
                <span>{post.readingTime} menit baca</span>
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                {post.title}
              </h1>
            </header>

             {post.toc && post.toc.length > 0 && (
              <aside className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-lg font-bold mb-4 text-gray-900">Daftar Isi</h2>
                <ul className="space-y-2">
                  {post.toc.map((item) => (
                    <li key={item.id} style={{ marginLeft: `${(item.level - 2) * 1}rem` }}>
                      <a href={`#${item.id}`} className="text-green-600 hover:text-green-800 hover:underline transition-colors">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            {post.image && (
              <div className="mb-8 relative w-full h-64 md:h-96">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(min-width: 768px) 800px, 100vw"
                    className="object-cover rounded-lg shadow-lg"
                    priority
                  />
              </div>
            )}
            
            <div className="prose prose-lg max-w-none text-gray-700 leading-loose">
              <p className="lead text-xl mb-6 font-medium text-gray-800">{post.excerpt}</p>
              <div 
                className="article-content prose-headings:scroll-mt-24"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />
            </div>

            {/* Author Bio Section */}
            <div className="mt-12 p-6 bg-gray-50 rounded-xl flex items-center gap-4 border border-gray-100">
               <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src="/favicon.webp"
                    alt="Raja Freeze Dried Food"
                    fill
                    className="rounded-full object-cover"
                  />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-gray-900">Raja Freeze Dried Food</h3>
                  <p className="text-sm text-gray-600">
                    Kami adalah pelopor jasa vacuum freeze dried pertama di Indonesia. Misi kami adalah menyediakan makanan sehat, awet, dan bernutrisi tinggi untuk keluarga Indonesia.
                  </p>
               </div>
            </div>

            {relatedPosts.length > 0 && (
                <section className="mt-12">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">Artikel Terkait</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedPosts.map((related) => (
                            <Link key={related.slug} href={`/blog/${related.slug}`} className="group block h-full">
                                <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                                    <div className="relative h-40 w-full">
                                        <Image
                                            src={related.image}
                                            alt={related.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-4 flex-grow">
                                        <h4 className="font-bold text-gray-900 group-hover:text-green-600 line-clamp-2 mb-2">{related.title}</h4>
                                        <p className="text-sm text-gray-500 line-clamp-3">{related.excerpt}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <footer className="mt-12 pt-8 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Kategori:</p>
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Dipublikasikan:</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(post.date).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </footer>
          </article>

          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center text-green-600 font-medium hover:text-green-700 transition-colors"
            >
              <svg
                className="mr-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Kembali ke Blog
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}