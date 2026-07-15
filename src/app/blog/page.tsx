import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { getAllPosts, type PostMeta } from "@/lib/markdown";

export const metadata = {
  title: { absolute: "Blog Freeze Drying: Teknologi, Produk, Bisnis & Keamanan" },
  description: "Panduan berbasis sumber tentang proses freeze drying, mutu produk, penyimpanan, aplikasi kuliner, MPASI, bisnis, dan rantai pasok.",
  keywords: ["freeze drying", "freeze dried food", "bisnis freeze dried", "teknologi pangan"],
  alternates: { canonical: "/blog" },
};

const fallbackImage = "/raja-freeze-dried-food-revolusi-makanan-sehat-tekn.jpg";

function safeImage(src?: string) {
  return src && (src.startsWith("/") || src.startsWith("http")) ? src : fallbackImage;
}

export default async function BlogPage() {
  const articles: PostMeta[] = await getAllPosts();
  const [featured, ...rest] = articles;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#fbfaf7] text-neutral-950">
        <section className="border-b border-black/10">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <Link href="/" className="mb-10 inline-flex text-sm font-semibold text-neutral-600 hover:text-neutral-950">← Kembali ke Beranda</Link>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-orange-700">Freeze Drying Journal</p>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">Blog Raja Freeze Dried Food</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-600 sm:text-xl">Tips produksi, bisnis, nutrisi, dan inspirasi pengembangan produk freeze dried dalam format editorial yang rapi dan mudah dibaca.</p>
          </div>
        </section>

        {featured && (
          <section className="border-b border-black/10">
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
              <Link href={`/blog/${featured.slug}`} className="group grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-black/10 bg-neutral-100">
                  <Image src={safeImage(featured.image)} alt={featured.imageAlt ?? featured.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" priority />
                </div>
                <div>
                  <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                    <span className="font-black uppercase tracking-[0.18em] text-orange-700">{featured.category}</span><span>•</span>
                    <time>{new Date(featured.date).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</time><span>•</span>
                    <span>{featured.readingTime ?? 4} menit baca</span>
                  </div>
                  <h2 className="text-3xl font-black leading-tight tracking-[-0.035em] sm:text-5xl">{featured.title}</h2>
                  <p className="mt-5 text-lg leading-8 text-neutral-600">{featured.excerpt}</p>
                  <span className="mt-8 inline-flex rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-bold group-hover:border-neutral-950">Baca artikel utama →</span>
                </div>
              </Link>
            </div>
          </section>
        )}

        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {articles.length === 0 ? (
              <div className="rounded-[2rem] border border-black/10 bg-white p-10 text-center"><h2 className="text-2xl font-black">Belum Ada Artikel</h2><p className="mt-3 text-neutral-600">Tambahkan file .md baru di folder src/content/blog.</p></div>
            ) : (
              <>
                <div className="mb-8 flex items-end justify-between border-b border-black/10 pb-5"><h2 className="text-2xl font-black tracking-[-0.03em]">Terbaru dari blog</h2><p className="text-sm text-neutral-500">{articles.length} artikel</p></div>
                <div className="grid gap-x-7 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((article) => (
                    <article key={article.slug} className="group border-b border-black/10 pb-8">
                      <Link href={`/blog/${article.slug}`} className="relative block aspect-[16/10] overflow-hidden rounded-3xl border border-black/10 bg-neutral-100">
                        <Image src={safeImage(article.image)} alt={article.imageAlt ?? article.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
                      </Link>
                      <div className="pt-5">
                        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500"><span className="font-black uppercase tracking-[0.16em] text-orange-700">{article.category}</span><span>•</span><time>{new Date(article.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</time></div>
                        <h3 className="text-xl font-black leading-tight tracking-[-0.025em]"><Link href={`/blog/${article.slug}`} className="group-hover:text-neutral-600">{article.title}</Link></h3>
                        <p className="mt-3 line-clamp-3 text-[15px] leading-7 text-neutral-600">{article.excerpt}</p>
                        <Link href={`/blog/${article.slug}`} className="mt-5 inline-flex text-sm font-bold underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-950">Baca selengkapnya</Link>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
