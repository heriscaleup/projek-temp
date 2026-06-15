"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navigation = [
  { name: "Beranda", href: "/" },
  { name: "Cara Kerja", href: "/#cara-kerja" },
  { name: "Manfaat", href: "/#manfaat" },
  { name: "Produk", href: "/#products" },
  { name: "Blog", href: "/blog" },
  { name: "Kontak", href: "/#kontak" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 text-neutral-900 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-3" aria-label="Freeze Dried Indonesia - Beranda">
            <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-orange-200 bg-orange-50">
              <Image src="/favicon.webp" alt="Logo Freeze Dried Indonesia" fill sizes="44px" className="object-contain p-1" unoptimized />
            </div>
            <span className="hidden text-base font-black tracking-[-0.02em] text-neutral-950 sm:block">Freeze Dried Indonesia</span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-black/10 bg-white px-2 py-1 md:flex" aria-label="Navigasi utama">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="rounded-full px-4 py-2 text-sm font-bold text-neutral-600 transition hover:bg-orange-50 hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500/40">
                {item.name}
              </Link>
            ))}
          </nav>

          <a href="https://wa.me/6282124985339?text=Halo%2C%20saya%20tertarik%20dengan%20jasa%20freeze%20dried" target="_blank" rel="noopener noreferrer" className="hidden rounded-full bg-orange-700 px-5 py-2.5 text-sm font-black text-white transition hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500/40 md:inline-flex">
            Konsultasi
          </a>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="rounded-full border border-black/10 bg-white p-2.5 text-neutral-800 md:hidden" aria-label={isMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"} aria-expanded={isMenuOpen} aria-controls="mobile-menu">
            <span className="sr-only">{isMenuOpen ? "Tutup menu" : "Buka menu"}</span>
            <div className="flex h-5 w-5 flex-col items-center justify-center" aria-hidden>
              <span className={`block h-0.5 w-5 rounded-sm bg-neutral-800 transition ${isMenuOpen ? "translate-y-1 rotate-45" : "-translate-y-0.5"}`} />
              <span className={`my-0.5 block h-0.5 w-5 rounded-sm bg-neutral-800 transition ${isMenuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`block h-0.5 w-5 rounded-sm bg-neutral-800 transition ${isMenuOpen ? "-translate-y-1 -rotate-45" : "translate-y-0.5"}`} />
            </div>
          </button>
        </div>

        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden pb-4" role="region" aria-label="Menu navigasi seluler">
            <nav className="grid gap-2 rounded-3xl border border-black/10 bg-white p-3 shadow-xl shadow-black/5">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} className="rounded-2xl px-4 py-3 text-sm font-bold text-neutral-700 transition hover:bg-orange-50 hover:text-orange-700" onClick={() => setIsMenuOpen(false)}>
                  {item.name}
                </Link>
              ))}
              <a href="https://wa.me/6282124985339?text=Halo%2C%20saya%20tertarik%20dengan%20jasa%20freeze%20dried" target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-orange-700 px-4 py-3 text-center text-sm font-black text-white hover:bg-orange-800">
                Konsultasi via WhatsApp
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
