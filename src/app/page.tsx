"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWidgetsWrapper from "@/components/FloatingWidgetsWrapper";

// Static Image Imports
import durianImg from "@/assets/images/durian.webp";
import manggisImg from "@/assets/images/manggis.webp";
import apelImg from "@/assets/images/apel.webp";
import manggaImg from "@/assets/images/mangga.webp";
import manggaJusBarImg from "@/assets/images/manggajusbar.webp";
import pisangImg from "@/assets/images/pisang.webp";
import fotoAwalHeroImg from "@/assets/images/fotoawalhero.webp";
import slider1Img from "@/assets/images/slider1.webp";
import slider2Img from "@/assets/images/slider2.webp";
import slider3Img from "@/assets/images/slider3.webp";
import tokpedIcon from "@/assets/images/tokped.svg";

// Fonts
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  weight: ["700", "800", "900"],
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const WA_LINK =
  "https://wa.me/+6282124985339?text=Halo%20Raja%20Freeze%20Dried%20Food%2C%20saya%20ingin%20konsultasi%20jasa%20freeze%20drying";

// ─── Data ───────────────────────────────────────────────────────────────────

const products = [
  {
    name: "Durian",
    description:
      "Cita rasa durian premium yang intens, diawetkan sempurna tanpa kehilangan aroma dan rasa khasnya.",
    image: durianImg,
    tag: "Best Seller",
  },
  {
    name: "Manggis",
    description:
      "Antioksidan tinggi manggis terjaga utuh. Renyah, segar, dengan rasa manis-asam khas.",
    image: manggisImg,
    tag: "Kaya Antioksidan",
  },
  {
    name: "Apel",
    description:
      "Snack sehat bebas pengawet dengan nutrisi apel segar yang terkunci sempurna dalam setiap keping.",
    image: apelImg,
    tag: "Tanpa Pengawet",
  },
  {
    name: "Mangga",
    description:
      "Manisnya mangga tropis dalam bentuk renyah yang praktis dibawa ke mana saja.",
    image: manggaImg,
    tag: "Favorit",
  },
  {
    name: "Jus Bar Mangga",
    description:
      "Inovasi jus bar mangga freeze dried — sensasi jus segar kapan saja, di mana saja.",
    image: manggaJusBarImg,
    tag: "Inovasi",
  },
  {
    name: "Pisang",
    description:
      "Pisang premium pilihan dengan kandungan kalium dan energi alami, renyah dan tahan lama.",
    image: pisangImg,
    tag: "Kaya Kalium",
  },
];

const testimonials = [
  {
    name: "Budi Santoso",
    city: "Surabaya",
    business: "Pemilik Toko Oleh-oleh",
    initials: "BS",
    rating: 5,
    quote:
      "Kualitasnya luar biasa! Durian freeze dried tetap harum dan renyah sampai di tangan pelanggan. Toko saya langsung repeat order setiap minggu.",
  },
  {
    name: "Sari Dewi",
    city: "Bandung",
    business: "Brand Snack Sehat",
    initials: "SD",
    rating: 5,
    quote:
      "Sudah pakai jasa FD ini 2 tahun untuk produk manggis saya. Proses cepat, kualitas stabil, dan tim sangat responsif. Highly recommended!",
  },
  {
    name: "Ahmad Fauzi",
    city: "Medan",
    business: "Pengusaha UMKM Kuliner",
    initials: "AF",
    rating: 5,
    quote:
      "Kirim 10kg buah lokal untuk di-freeze dry. Hasilnya memuaskan — tekstur dan warna terjaga sempurna. Worth it banget untuk bisnis saya!",
  },
];

const faqs = [
  {
    q: "Bahan apa saja yang bisa di-freeze dry?",
    a: "Hampir semua jenis buah, sayuran, daging, seafood, susu, yogurt, hingga bunga dapat di-freeze dry. Kami berpengalaman menangani ratusan jenis bahan. Konsultasikan bahan Anda dengan tim kami untuk solusi terbaik.",
  },
  {
    q: "Berapa harga jasa freeze drying per kg?",
    a: "Harga bervariasi tergantung jenis bahan, kadar air, dan volume order. Kami menyediakan penawaran khusus untuk bulk order. Hubungi kami via WhatsApp untuk mendapat estimasi harga yang akurat dan kompetitif.",
  },
  {
    q: "Minimum order berapa kg?",
    a: "Minimum order kami adalah 5 kg untuk bahan segar. Untuk order di bawah minimum, silakan konsultasikan dulu dengan tim kami — kami berusaha memberikan solusi terbaik untuk semua skala bisnis.",
  },
  {
    q: "Berapa lama proses setelah bahan diterima?",
    a: "Proses freeze drying membutuhkan 3–7 hari kerja tergantung jenis dan volume bahan. Setelah selesai, produk dikemas vakum dan dikirim ke seluruh Indonesia via ekspedisi pilihan Anda.",
  },
  {
    q: "Apakah ada garansi kualitas?",
    a: "Ya! Kami memberikan garansi kualitas pada setiap batch produksi. Kami tersertifikasi P-IRT dan menggunakan mesin vacuum freeze dryer berstandar industri. Kepuasan pelanggan adalah prioritas utama kami.",
  },
  {
    q: "Apakah bisa menerima order dari luar Jakarta?",
    a: "Tentu! Kami melayani klien dari seluruh Indonesia. Bahan dapat dikirim via ekspedisi ke fasilitas kami di Jakarta. Kami akan panduan cara pengemasan yang benar agar bahan tetap segar saat tiba.",
  },
];

const galleryImages = [slider1Img, slider2Img, slider3Img, fotoAwalHeroImg];

// Comparison data
const comparisonRows = [
  {
    label: "Retensi Nutrisi",
    fd: "95%",
    oven: "40%",
    matahari: "30%",
    pengalengan: "50%",
    fdBest: true,
  },
  {
    label: "Daya Tahan",
    fd: "25 tahun",
    oven: "6–12 bulan",
    matahari: "3–6 bulan",
    pengalengan: "2–5 tahun",
    fdBest: true,
  },
  {
    label: "Pengurangan Berat",
    fd: "90%",
    oven: "70%",
    matahari: "60%",
    pengalengan: "0%",
    fdBest: true,
  },
  {
    label: "Bahan Pengawet",
    fd: "Tidak ada",
    oven: "Sering ditambahkan",
    matahari: "Sering ditambahkan",
    pengalengan: "Ya (garam/gula)",
    fdBest: true,
  },
  {
    label: "Rasa & Tekstur",
    fd: "Hampir sama aslinya",
    oven: "Berubah signifikan",
    matahari: "Berubah banyak",
    pengalengan: "Berubah",
    fdBest: true,
  },
  {
    label: "Dapat Rehidrasi",
    fd: "Ya, sempurna",
    oven: "Sebagian",
    matahari: "Tidak",
    pengalengan: "Ya",
    fdBest: true,
  },
];

// ─── Hooks ──────────────────────────────────────────────────────────────────

function useCounter(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return count;
}

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useScrolled(px = 600) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > px);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [px]);
  return scrolled;
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handler = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return progress;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function SectionHeading({
  title,
  subtitle,
  light = false,
  align = "center",
}: {
  title: string;
  subtitle?: string;
  light?: boolean;
  align?: "center" | "left";
}) {
  return (
    <div className={`mb-14 ${align === "center" ? "text-center" : ""}`}>
      <h2
        className={`text-4xl md:text-5xl font-black leading-tight ${
          light ? "text-white" : "text-gray-900"
        } ${playfair.className}`}
      >
        {title}
      </h2>
      <div
        className={`w-16 h-1.5 bg-orange-600 mt-4 rounded-full ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
      {subtitle && (
        <p
          className={`mt-5 text-lg leading-relaxed max-w-2xl ${
            align === "center" ? "mx-auto" : ""
          } ${light ? "text-gray-300" : "text-gray-500"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [statsActive, setStatsActive] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const scrolled = useScrolled(700);
  const scrollProgress = useScrollProgress();

  // Stats counter trigger
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStatsActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const c500 = useCounter(500, 2000, statsActive);
  const c25 = useCounter(25, 1800, statsActive);
  const c3 = useCounter(3, 1200, statsActive);
  const c100 = useCounter(100, 2200, statsActive);

  // Section reveals
  const howRef = useReveal();
  const whyRef = useReveal();
  const compRef = useReveal();
  const jasaRef = useReveal();
  const productsRef = useReveal();
  const galleryRef = useReveal();
  const testimonialsRef = useReveal();
  const faqRef = useReveal();

  return (
    <div className={jakarta.className}>
      {/* ── Scroll Progress Bar ── */}
      <div
        className="fixed top-0 left-0 h-0.5 bg-orange-600 z-[60] transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden
      />

      {/* ══════════════════════════════════════════════
          ANNOUNCEMENT BAR
      ══════════════════════════════════════════════ */}
      {announcementVisible && (
        <div className="relative bg-orange-700 text-white text-sm py-2.5 px-4 text-center z-50">
          <span className="font-semibold">
            🎉 Promo Terbatas: Konsultasi GRATIS + Estimasi Harga dalam 1 Jam!
          </span>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 underline font-bold hover:text-orange-200 transition-colors"
          >
            Chat Sekarang →
          </a>
          <button
            onClick={() => setAnnouncementVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-xl leading-none"
            aria-label="Tutup pengumuman"
          >
            ×
          </button>
        </div>
      )}

      <Header />

      <main>
        {/* ══════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════ */}
        <section className="relative bg-white overflow-hidden">
          {/* Angled warm bg */}
          <div
            className="absolute top-0 right-0 h-full w-[55%] bg-orange-50 hidden lg:block"
            style={{ clipPath: "polygon(8% 0, 100% 0, 100% 100%, 0% 100%)" }}
          />
          <div className="absolute top-20 right-20 w-72 h-72 bg-orange-200 rounded-full opacity-25 blur-3xl pointer-events-none hidden lg:block" />
          <div className="absolute bottom-10 right-40 w-48 h-48 bg-amber-300 rounded-full opacity-20 blur-2xl pointer-events-none hidden lg:block" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              {/* ── Left ── */}
              <div className="hero-fadein">
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 text-sm font-bold px-4 py-2 rounded-full mb-6">
                  <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
                  Pelopor &amp; #1 Freeze Drying Indonesia
                </div>

                <h1
                  className={`text-5xl md:text-6xl xl:text-[4.25rem] font-black leading-[1.06] text-gray-900 ${playfair.className}`}
                >
                  Jasa Freeze Dried
                  <span className="block text-orange-700">Makanan Custom</span>
                  <span className="block">#1 di Indonesia</span>
                </h1>

                <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-[480px]">
                  Kirim bahan Anda, kami proses dengan mesin vakum terbaik —{" "}
                  <strong className="text-gray-800">rasa &amp; nutrisi terjaga hingga 25 tahun</strong>.
                  Tanpa pengawet. Tersertifikasi P-IRT.
                </p>

                {/* CTAs */}
                <div className="mt-9 flex flex-col sm:flex-row gap-4">
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 bg-green-600 text-white font-extrabold px-8 py-4 rounded-2xl text-[17px] hover:bg-green-700 transition-all shadow-lg shadow-green-600/30 hover:shadow-green-700/40 hover:-translate-y-0.5"
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                    Konsultasi Gratis via WhatsApp
                  </a>
                  <a
                    href="#products"
                    className="inline-flex items-center justify-center gap-2 border-2 border-orange-700 text-orange-700 font-extrabold px-8 py-4 rounded-2xl text-[17px] hover:bg-orange-700 hover:text-white transition-all"
                  >
                    Lihat Produk Kami
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </a>
                </div>

                {/* Trust badges */}
                <div className="mt-9 flex flex-wrap gap-3">
                  {[
                    { icon: "🏆", text: "P-IRT Certified" },
                    { icon: "🇮🇩", text: "Melayani Seluruh Indonesia" },
                    { icon: "⚡", text: "Proses 3–7 Hari Kerja" },
                    { icon: "🔒", text: "Garansi Kualitas" },
                  ].map((b) => (
                    <span
                      key={b.text}
                      className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold px-4 py-2 rounded-full"
                    >
                      {b.icon} {b.text}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Right image ── */}
              <div className="relative hero-fadein-right">
                <div className="relative h-[470px] lg:h-[560px] rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src={fotoAwalHeroImg}
                    alt="Produk freeze dried Raja Freeze Dried Food"
                    fill
                    priority
                    placeholder="blur"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

                  {/* Overlay badge bottom-left */}
                  <div className="absolute bottom-5 left-5 bg-white/96 backdrop-blur-sm rounded-2xl px-5 py-3.5 shadow-xl">
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Sertifikasi Resmi</p>
                    <p className="text-gray-900 font-extrabold text-lg mt-0.5">P-IRT Certified ✓</p>
                  </div>

                  {/* Floating stat top-right */}
                  <div className="absolute top-5 right-5 bg-orange-700 text-white rounded-2xl px-5 py-4 shadow-xl text-center">
                    <p className={`text-3xl font-black leading-none ${playfair.className}`}>25</p>
                    <p className="text-[11px] font-bold text-orange-200 mt-1">Tahun Tahan</p>
                  </div>
                </div>

                {/* Decorative shapes */}
                <div className="absolute -top-5 -right-5 w-28 h-28 bg-orange-700 rounded-2xl -z-10 opacity-15" />
                <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-amber-300 rounded-full -z-10 opacity-40" />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            STATS BAR
        ══════════════════════════════════════════════ */}
        <section ref={statsRef} className="bg-gray-900 py-14">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-700/60">
              {[
                { val: c500, suf: "+", label: "Pelanggan Puas", sub: "di seluruh Indonesia" },
                { val: c25, suf: " thn", label: "Ketahanan Produk", sub: "tanpa bahan pengawet" },
                { val: c3, suf: " hari", label: "Proses Minimal", sub: "tergantung volume & jenis" },
                { val: c100, suf: "%", label: "Tanpa Pengawet", sub: "100% alami murni" },
              ].map((s, i) => (
                <div key={i} className="text-center px-6 py-8">
                  <div className={`text-5xl font-black text-orange-500 tabular-nums ${playfair.className}`}>
                    {s.val}{s.suf}
                  </div>
                  <div className="mt-2 text-white font-bold text-base">{s.label}</div>
                  <div className="mt-1 text-gray-500 text-sm">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════════ */}
        <section className="py-24 bg-orange-50">
          <div
            ref={howRef.ref}
            className={`max-w-7xl mx-auto px-4 section-reveal ${howRef.visible ? "revealed" : ""}`}
          >
            <SectionHeading
              title="Cara Kerja Jasa Kami"
              subtitle="4 langkah mudah — dari konsultasi hingga produk jadi tiba di tangan Anda"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Connector line (desktop) */}
              <div className="hidden lg:block absolute top-[3.25rem] left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200 z-0" />

              {[
                {
                  num: "01", icon: "💬", title: "Hubungi Kami",
                  desc: "Chat via WhatsApp, ceritakan bahan & kebutuhan Anda. Konsultasi gratis, tanpa komitmen.",
                },
                {
                  num: "02", icon: "📦", title: "Kirim Bahan",
                  desc: "Kirim bahan segar ke fasilitas kami di Jakarta. Kami terima dari seluruh Indonesia.",
                },
                {
                  num: "03", icon: "❄️", title: "Proses Freeze Dry",
                  desc: "Bahan diproses dengan mesin vacuum freeze dryer berstandar industri selama 3–7 hari.",
                },
                {
                  num: "04", icon: "🎁", title: "Terima Produk Jadi",
                  desc: "Produk dikemas vakum dan dikirim kembali ke Anda dalam kondisi sempurna.",
                },
              ].map((step, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                  <div className="w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-md border-4 border-orange-100 group-hover:border-orange-500 group-hover:shadow-orange-200 group-hover:shadow-xl transition-all duration-300 mb-6">
                    <span className="text-3xl">{step.icon}</span>
                    <span className="text-[10px] font-extrabold text-orange-600 tracking-[0.12em] mt-1.5">STEP {step.num}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 text-center">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-orange-700 text-white font-extrabold px-9 py-4 rounded-2xl text-lg hover:bg-orange-800 transition-all shadow-lg shadow-orange-700/30 hover:-translate-y-0.5"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Mulai Konsultasi Sekarang
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            WHY FD TECHNOLOGY
        ══════════════════════════════════════════════ */}
        <section className="py-24 bg-white">
          <div
            ref={whyRef.ref}
            className={`max-w-7xl mx-auto px-4 section-reveal ${whyRef.visible ? "revealed" : ""}`}
          >
            <SectionHeading
              title="Mengapa Freeze Drying?"
              subtitle="Bukan sekadar dikeringkan — ini adalah teknologi pengawetan paling canggih di dunia"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🧬",
                  title: "Nutrisi Terjaga 95%",
                  badge: "vs. konvensional hanya 40%",
                  desc: "Proses sublimasi (beku → gas) tidak merusak sel. Vitamin, mineral, dan enzim tetap utuh — nutrisi hampir sama dengan bahan segar.",
                  bg: "from-orange-50 to-amber-50",
                  border: "border-orange-200",
                  accent: "text-orange-700",
                },
                {
                  icon: "⏳",
                  title: "Tahan Hingga 25 Tahun",
                  badge: "tanpa bahan pengawet kimia",
                  desc: "Kadar air diturunkan hingga <2%. Tidak ada ruang bagi bakteri dan jamur untuk berkembang biak — alami dan aman.",
                  bg: "from-amber-50 to-yellow-50",
                  border: "border-amber-200",
                  accent: "text-amber-700",
                },
                {
                  icon: "⚖️",
                  title: "Berat Berkurang 90%",
                  badge: "hemat ongkir & biaya storage",
                  desc: "Produk jauh lebih ringan dan ringkas. Logistik lebih efisien, biaya gudang turun drastis, margin bisnis meningkat signifikan.",
                  bg: "from-stone-50 to-gray-50",
                  border: "border-stone-200",
                  accent: "text-stone-700",
                },
              ].map((c, i) => (
                <div
                  key={i}
                  className={`bg-gradient-to-br ${c.bg} border ${c.border} rounded-3xl p-9 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}
                >
                  <div className="text-5xl mb-5">{c.icon}</div>
                  <h3 className={`text-2xl font-black text-gray-900 mb-2 ${playfair.className}`}>{c.title}</h3>
                  <p className={`text-sm font-bold mb-4 ${c.accent}`}>{c.badge}</p>
                  <p className="text-gray-600 leading-relaxed text-[15px]">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            COMPARISON TABLE
        ══════════════════════════════════════════════ */}
        <section className="py-24 bg-gray-50">
          <div
            ref={compRef.ref}
            className={`max-w-6xl mx-auto px-4 section-reveal ${compRef.visible ? "revealed" : ""}`}
          >
            <SectionHeading
              title="Freeze Drying vs Metode Lain"
              subtitle="Lihat sendiri mengapa freeze drying adalah standar tertinggi pengawetan makanan"
            />

            {/* Mobile: cards */}
            <div className="block md:hidden space-y-6">
              {comparisonRows.map((row, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                  <div className="bg-gray-800 text-white px-5 py-3 font-bold text-sm">{row.label}</div>
                  <div className="divide-y divide-gray-100">
                    <div className="flex items-center justify-between px-5 py-3 bg-orange-50">
                      <span className="text-sm font-bold text-orange-800">❄️ Freeze Drying</span>
                      <span className="text-sm font-extrabold text-orange-700">{row.fd}</span>
                    </div>
                    <div className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm text-gray-600">🔥 Oven/Dehidrator</span>
                      <span className="text-sm text-gray-500">{row.oven}</span>
                    </div>
                    <div className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm text-gray-600">☀️ Matahari</span>
                      <span className="text-sm text-gray-500">{row.matahari}</span>
                    </div>
                    <div className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm text-gray-600">🥫 Pengalengan</span>
                      <span className="text-sm text-gray-500">{row.pengalengan}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-hidden rounded-3xl border border-gray-200 shadow-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="bg-gray-800 text-white text-left px-6 py-5 font-bold w-[22%]">Aspek</th>
                    <th className="bg-orange-700 text-white px-6 py-5 font-extrabold text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">❄️</span>
                        <span>Freeze Drying</span>
                        <span className="text-orange-200 text-xs font-medium">(Raja FD)</span>
                      </div>
                    </th>
                    <th className="bg-gray-100 text-gray-600 px-6 py-5 font-semibold text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">🔥</span>
                        <span>Oven / Dehidrator</span>
                      </div>
                    </th>
                    <th className="bg-gray-100 text-gray-600 px-6 py-5 font-semibold text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">☀️</span>
                        <span>Matahari</span>
                      </div>
                    </th>
                    <th className="bg-gray-100 text-gray-600 px-6 py-5 font-semibold text-center rounded-tr-3xl">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">🥫</span>
                        <span>Pengalengan</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/70"}>
                      <td className="px-6 py-4 font-semibold text-gray-800 border-r border-gray-100">{row.label}</td>
                      <td className="px-6 py-4 text-center bg-orange-50 border-r border-orange-100">
                        <span className="inline-flex items-center gap-1.5 font-extrabold text-orange-700">
                          <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {row.fd}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-500 border-r border-gray-100">{row.oven}</td>
                      <td className="px-6 py-4 text-center text-gray-500 border-r border-gray-100">{row.matahari}</td>
                      <td className="px-6 py-4 text-center text-gray-500">{row.pengalengan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10 text-center">
              <p className="text-gray-500 text-sm mb-5">
                Sudah jelas kan perbedaannya? Jadikan produk Anda dengan standar tertinggi.
              </p>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-orange-700 text-white font-extrabold px-9 py-4 rounded-2xl text-lg hover:bg-orange-800 transition-all shadow-lg shadow-orange-700/30 hover:-translate-y-0.5"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Hubungi Kami Sekarang
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            JASA MAKLOON HIGHLIGHT
        ══════════════════════════════════════════════ */}
        <section className="py-20 bg-white">
          <div
            ref={jasaRef.ref}
            className={`max-w-6xl mx-auto px-4 section-reveal ${jasaRef.visible ? "revealed" : ""}`}
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[2rem] p-8 md:p-14">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-orange-600 rounded-full opacity-10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-orange-500 rounded-full opacity-10 blur-3xl pointer-events-none" />

              <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 bg-orange-700/30 text-orange-400 text-xs font-extrabold px-4 py-2 rounded-full mb-6 border border-orange-700/40 uppercase tracking-wider">
                    ⭐ Layanan Unggulan
                  </div>
                  <h3 className={`text-3xl md:text-4xl font-black text-white leading-tight ${playfair.className}`}>
                    Jasa Makloon
                    <span className="block text-orange-500">Freeze Drying Custom</span>
                  </h3>
                  <p className="mt-5 text-gray-400 text-[15px] leading-relaxed">
                    Punya bahan makanan lokal yang ingin dijadikan produk premium? Kami siap menjadi mitra produksi Anda.
                    Kirim bahan, kami proses, Anda terima produk jadi siap jual.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {[
                      "Cocok untuk UMKM, brand snack, oleh-oleh daerah",
                      "Minimum order 5 kg bahan segar",
                      "Pengemasan vakum profesional",
                      "Konsultasi gratis sebelum order",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                        <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <a
                      href={WA_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 bg-green-600 text-white font-extrabold px-7 py-4 rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-900/40"
                    >
                      <WhatsAppIcon className="w-5 h-5" />
                      Diskusi Kebutuhan Saya
                    </a>
                    <a
                      href="#products"
                      className="inline-flex items-center justify-center gap-2 border border-gray-600 text-gray-300 font-semibold px-7 py-4 rounded-2xl hover:border-orange-600 hover:text-orange-400 transition-all text-sm"
                    >
                      Lihat Contoh Produk →
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: "🌺", label: "Buah Tropis", sub: "Durian, mangga, dll" },
                    { icon: "🥬", label: "Sayuran", sub: "Bayam, wortel, dll" },
                    { icon: "🍖", label: "Daging & Seafood", sub: "Custom order" },
                    { icon: "🌸", label: "Bunga & Herbal", sub: "Untuk produk premium" },
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-800/60 border border-gray-700 rounded-2xl p-5 text-center hover:border-orange-600/50 transition-colors">
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <p className="text-white font-bold text-sm">{item.label}</p>
                      <p className="text-gray-500 text-xs mt-1">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            PRODUCTS SHOWCASE
        ══════════════════════════════════════════════ */}
        <section id="products" className="py-24 bg-gray-50">
          <div
            ref={productsRef.ref}
            className={`max-w-7xl mx-auto px-4 section-reveal ${productsRef.visible ? "revealed" : ""}`}
          >
            <SectionHeading
              title="Produk Unggulan Kami"
              subtitle="Setiap produk diproses dengan teknologi freeze dry premium — tanpa pengawet, nutrisi terjaga"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p) => (
                <article
                  key={p.name}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-orange-900/10 hover:-translate-y-2 transition-all duration-300 group flex flex-col border border-gray-100"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={p.image}
                      alt={`Freeze dried ${p.name}`}
                      fill
                      placeholder="blur"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-orange-700 text-xs font-extrabold px-3 py-1.5 rounded-full border border-orange-200">
                        {p.tag}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-orange-700 text-white text-xs font-extrabold px-3 py-1.5 rounded-full">
                        FREEZE DRIED
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className={`text-2xl font-black text-gray-900 ${playfair.className}`}>{p.name}</h3>
                    <p className="mt-3 text-gray-500 text-sm leading-relaxed flex-grow">{p.description}</p>

                    <div className="mt-5 grid grid-cols-1 gap-3">
                      <a
                        href="https://www.tokopedia.com/eenkfreeze"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3.5 px-4 rounded-xl font-bold hover:bg-green-700 transition-colors"
                      >
                        <Image src={tokpedIcon} alt="" aria-hidden width={20} height={20} />
                        Beli di Tokopedia
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* CTA below products */}
            <div className="mt-12 text-center">
              <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-orange-50 border border-orange-200 rounded-2xl px-8 py-6">
                <p className="text-gray-700 font-semibold">
                  Mau produk buah atau bahan lain yang di-freeze dry khusus untuk brand Anda?
                </p>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center gap-2 bg-orange-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-800 transition-colors text-sm"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Order Custom
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            GALLERY
        ══════════════════════════════════════════════ */}
        <section className="py-24 bg-white">
          <div
            ref={galleryRef.ref}
            className={`max-w-7xl mx-auto px-4 section-reveal ${galleryRef.visible ? "revealed" : ""}`}
          >
            <SectionHeading
              title="Fasilitas &amp; Proses Kami"
              subtitle="Mesin freeze dryer berstandar industri, kebersihan terjamin di setiap tahap"
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px]">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                    i === 0 ? "col-span-2 row-span-2" : ""
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Gallery proses freeze drying ${i + 1}`}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover group-hover:scale-107 transition-transform duration-500"
                    style={{ transform: "scale(1)" }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  {i === 0 && (
                    <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2">
                      <p className="text-gray-900 font-bold text-sm">Mesin Freeze Dryer Industri</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                Ingin melihat lebih banyak proses produksi kami?{" "}
                <a
                  href="https://www.tiktok.com/@freezedriedindonesia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-700 font-bold hover:underline"
                >
                  Kunjungi TikTok @freezedriedindonesia →
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            TESTIMONIALS
        ══════════════════════════════════════════════ */}
        <section className="py-24 bg-gray-900">
          <div
            ref={testimonialsRef.ref}
            className={`max-w-7xl mx-auto px-4 section-reveal ${testimonialsRef.visible ? "revealed" : ""}`}
          >
            <SectionHeading
              title="Kata Pelanggan Kami"
              subtitle="Ratusan pelanggan dari seluruh Indonesia telah mempercayakan bahan mereka kepada kami"
              light
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="bg-gray-800 rounded-3xl p-8 border border-gray-700 hover:border-orange-600/60 hover:shadow-2xl hover:shadow-orange-900/20 transition-all duration-300 flex flex-col"
                >
                  <StarRating count={t.rating} />

                  <svg className="w-7 h-7 text-orange-700/40 mt-4 mb-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>

                  <p className="text-gray-300 leading-relaxed flex-grow italic text-[15px]">{t.quote}</p>

                  <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-700/60">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-800 rounded-full flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-white font-bold">{t.name}</p>
                      <p className="text-gray-400 text-sm">{t.business} · {t.city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Aggregate rating */}
            <div className="mt-12 text-center">
              <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gray-800/60 border border-gray-700 rounded-2xl px-8 py-5">
                <StarRating count={5} />
                <p className="text-white font-semibold text-sm">
                  <span className="text-orange-500 font-extrabold">5.0 / 5.0</span> rata-rata rating dari 500+ pelanggan
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════════ */}
        <section className="py-24 bg-white">
          <div
            ref={faqRef.ref}
            className={`max-w-3xl mx-auto px-4 section-reveal ${faqRef.visible ? "revealed" : ""}`}
          >
            <SectionHeading
              title="Pertanyaan Umum"
              subtitle="Jawaban untuk pertanyaan yang paling sering ditanyakan calon pelanggan"
            />

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-2xl overflow-hidden hover:border-orange-300 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-orange-50/50 transition-colors"
                    aria-expanded={openFaq === i}
                  >
                    <span className="font-bold text-gray-900 pr-4 text-[15px] leading-snug">{faq.q}</span>
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-xl transition-all duration-300 ${
                        openFaq === i
                          ? "bg-orange-700 text-white rotate-45"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      +
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaq === i ? "max-h-64" : "max-h-0"
                    }`}
                  >
                    <p className="px-6 pb-6 text-gray-500 leading-relaxed text-[15px]">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-gray-500 text-sm">
                Masih ada pertanyaan lain?{" "}
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="text-orange-700 font-bold hover:underline">
                  Tanya langsung via WhatsApp →
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FINAL CTA
        ══════════════════════════════════════════════ */}
        <section className="py-28 bg-gray-900 relative overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-orange-700 rounded-full opacity-[0.07] blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-orange-500 rounded-full opacity-[0.07] blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-orange-900/25 rounded-full opacity-50 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-orange-900/20 rounded-full opacity-40 pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-orange-900/40 text-orange-400 text-sm font-bold px-4 py-2 rounded-full mb-8 border border-orange-800/50">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              Konsultasi Gratis · Respons &lt; 1 Jam
            </div>

            <h2 className={`text-5xl md:text-6xl font-black text-white leading-tight ${playfair.className}`}>
              Siap Mulai?
              <span className="block text-orange-500">Konsultasi Gratis Sekarang</span>
            </h2>

            <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Tim kami siap membantu Anda menemukan solusi freeze drying terbaik untuk bisnis Anda.
              Tidak ada biaya konsultasi, tidak ada tekanan.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-green-600 text-white font-extrabold px-10 py-5 rounded-2xl text-lg hover:bg-green-700 transition-all shadow-2xl shadow-green-900/40 hover:-translate-y-0.5"
              >
                <WhatsAppIcon className="w-6 h-6" />
                Chat WhatsApp Sekarang
              </a>
              <a
                href="mailto:info@rajafreezdriedfood.com"
                className="inline-flex items-center justify-center gap-3 border-2 border-gray-600 text-gray-300 font-bold px-10 py-5 rounded-2xl text-lg hover:border-orange-600 hover:text-orange-500 transition-all"
              >
                ✉️ Kirim Email
              </a>
            </div>

            <p className="mt-10 text-gray-600 text-sm">
              📍 Jakarta, Indonesia &nbsp;·&nbsp; ☎️ +62 821-2498-5339 &nbsp;·&nbsp;
              <a href="mailto:info@rajafreezdriedfood.com" className="hover:text-gray-400 transition-colors">
                info@rajafreezdriedfood.com
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingWidgetsWrapper />

      {/* ══════════════════════════════════════════════
          MOBILE STICKY CTA BAR
      ══════════════════════════════════════════════ */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 shadow-2xl transition-transform duration-300 ${
          scrolled ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex gap-3 p-3 pb-safe">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white font-extrabold py-3.5 rounded-xl text-sm hover:bg-green-700 transition-colors"
          >
            <WhatsAppIcon className="w-4 h-4" />
            Chat WhatsApp
          </a>
          <a
            href="https://www.tokopedia.com/eenkfreeze"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-orange-700 text-white font-extrabold py-3.5 rounded-xl text-sm hover:bg-orange-800 transition-colors"
          >
            <Image src={tokpedIcon} alt="" aria-hidden width={16} height={16} />
            Tokopedia
          </a>
        </div>
      </div>
    </div>
  );
}
