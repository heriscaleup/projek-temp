import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getPostSlugs, getRelatedPosts } from "@/lib/markdown";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Article, BreadcrumbList, WithContext } from "schema-dts";

export type PageProps = { params: Promise<{ slug: string }> };
const SITE_URL = "https://rajafreezdriedfood.com";
const fallbackImage = "/raja-freeze-dried-food-revolusi-makanan-sehat-tekn.jpg";
const WA_LINK = "https://wa.me/6282124985339?text=Halo%20Raja%20Freeze%20Dried%20Food%2C%20saya%20ingin%20konsultasi%20setelah%20membaca%20blog";

function safeImage(src?: string) { return src && (src.startsWith("/") || src.startsWith("http")) ? src : fallbackImage; }
function toAbsoluteUrl(imagePath: string): string { if (!imagePath) return ""; if (imagePath.startsWith("http")) return imagePath; return `${SITE_URL}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`; }

export async function generateStaticParams() { const slugs = await getPostSlugs(); return slugs.map((slug) => ({ slug })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params; const post = await getPostBySlug(slug); if (!post) return { title: "Artikel Tidak Ditemukan" };
  const absoluteImage = toAbsoluteUrl(safeImage(post.image));
  return { title: post.title, description: post.excerpt, alternates: { canonical: `/blog/${slug}` }, openGraph: { title: post.title, description: post.excerpt, type: "article", publishedTime: post.date, authors: ["Raja Freeze Dried Food"], images: [absoluteImage], url: `/blog/${slug}` }, twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [absoluteImage] } };
}

export default async function BlogPostDetail({ params }: PageProps) {
  const { slug } = await params; const post = await getPostBySlug(slug); if (!post) notFound();
  const relatedPosts = await getRelatedPosts(post.slug, post.category);
  const image = safeImage(post.image); const absoluteImage = toAbsoluteUrl(image);
  const articleJsonLd: WithContext<Article> = { "@context":"https://schema.org", "@type":"Article", headline: post.title, datePublished: post.date, dateModified: post.date, mainEntityOfPage: { "@type":"WebPage", "@id": `${SITE_URL}/blog/${post.slug}` }, image: [absoluteImage], author: { "@type":"Organization", name:"Raja Freeze Dried Food", url:SITE_URL }, publisher: { "@type":"Organization", name:"Raja Freeze Dried Food", logo:{ "@type":"ImageObject", url:`${SITE_URL}/favicon.webp` } }, description: post.excerpt };
  const breadcrumbJsonLd: WithContext<BreadcrumbList> = { "@context":"https://schema.org", "@type":"BreadcrumbList", itemListElement:[{ "@type":"ListItem", position:1, name:"Home", item:SITE_URL },{ "@type":"ListItem", position:2, name:"Blog", item:`${SITE_URL}/blog` },{ "@type":"ListItem", position:3, name:post.title }] };

  return (
    <>
      <Header />
      <JsonLd data={articleJsonLd} /><JsonLd data={breadcrumbJsonLd} />
      <main className="bg-[#fbfaf7] text-neutral-950">
        <article className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8 lg:py-20">
          <div className="min-w-0">
            <nav className="mb-10 text-sm text-neutral-500" aria-label="Breadcrumb"><Link href="/" className="font-semibold hover:text-neutral-950">Beranda</Link><span className="mx-2">/</span><Link href="/blog" className="font-semibold hover:text-neutral-950">Blog</Link></nav>
            <header className="border-b border-black/10 pb-8">
              <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-neutral-500"><span className="font-black uppercase tracking-[0.18em] text-orange-700">{post.category}</span><span>•</span><time dateTime={post.date}>{new Date(post.date).toLocaleDateString("id-ID", { year:"numeric", month:"long", day:"numeric" })}</time><span>•</span><span>{post.readingTime} menit baca</span></div>
              <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-7xl">{post.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-600 sm:text-xl">{post.excerpt}</p>
              <div className="mt-7 flex items-center gap-3"><div className="relative h-11 w-11 overflow-hidden rounded-full border border-black/10 bg-white"><Image src="/favicon.webp" alt="Raja Freeze Dried Food" fill sizes="44px" className="object-contain p-1" /></div><div><p className="text-sm font-bold">Raja Freeze Dried Food</p><p className="text-xs text-neutral-500">Tim editorial freeze drying</p></div></div>
            </header>
            <figure className="my-10 relative aspect-[16/9] overflow-hidden rounded-[2rem] border border-black/10 bg-neutral-100"><Image src={image} alt={post.title} fill sizes="(min-width: 1024px) 860px, 100vw" className="object-cover" priority /></figure>
            {post.toc && post.toc.length > 0 && <details className="mb-10 rounded-3xl border border-black/10 bg-white p-5 lg:hidden"><summary className="cursor-pointer text-sm font-black">Daftar Isi</summary><ul className="mt-4 space-y-3 text-sm text-neutral-600">{post.toc.map((item) => <li key={item.id} style={{ marginLeft: `${(item.level - 2) * 1}rem` }}><a href={`#${item.id}`} className="hover:text-neutral-950">{item.text}</a></li>)}</ul></details>}
            <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:tracking-[-0.035em] prose-headings:text-neutral-950 prose-p:leading-8 prose-p:text-neutral-700 prose-a:font-bold prose-a:text-neutral-950 prose-strong:text-neutral-950 prose-li:text-neutral-700"><div className="article-content prose-headings:scroll-mt-24" dangerouslySetInnerHTML={{ __html: post.contentHtml }} /></div>
          </div>
          <aside className="hidden lg:block"><div className="sticky top-24 space-y-6">{post.toc && post.toc.length > 0 && <div className="rounded-3xl border border-black/10 bg-white/80 p-6 backdrop-blur"><h2 className="mb-4 text-lg font-black">Daftar Isi</h2><ul className="space-y-3 text-sm leading-6 text-neutral-600">{post.toc.map((item) => <li key={item.id} style={{ marginLeft: `${(item.level - 2) * 1}rem` }}><a href={`#${item.id}`} className="hover:text-neutral-950">{item.text}</a></li>)}</ul></div>}<div className="rounded-3xl border border-black/10 bg-white p-6"><h2 className="text-lg font-black">Mau bikin produk freeze dried?</h2><p className="mt-3 text-sm leading-6 text-neutral-600">Konsultasi bahan, estimasi proses, dan opsi makloon dengan tim kami.</p><a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex w-full justify-center rounded-full bg-orange-700 px-5 py-3 text-sm font-black text-white hover:bg-orange-800">Konsultasi Sekarang</a></div></div></aside>
        </article>
        {relatedPosts.length > 0 && <section className="border-t border-black/10 py-14"><div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div className="mb-8 flex items-end justify-between border-b border-black/10 pb-5"><h2 className="text-2xl font-black tracking-[-0.03em]">Artikel Terkait</h2><Link href="/blog" className="text-sm font-bold text-neutral-600 hover:text-neutral-950">Lihat semua →</Link></div><div className="grid gap-7 md:grid-cols-3">{relatedPosts.map((related) => <Link key={related.slug} href={`/blog/${related.slug}`} className="group border-b border-black/10 pb-7"><div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-black/10 bg-neutral-100"><Image src={safeImage(related.image)} alt={related.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" /></div><p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-orange-700">{related.category}</p><h3 className="mt-2 text-lg font-black leading-tight group-hover:text-neutral-600">{related.title}</h3></Link>)}</div></div></section>}
      </main>
      <Footer />
    </>
  );
}
