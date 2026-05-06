# Audit SEO — Raja Freeze Dried Food

**Tanggal audit:** 2026-05-06
**Auditor:** —
**URL:** rajafreezdriedfood.com

---

## Ringkasan Eksekutif

| Area | Status | Prioritas |
|---|---|---|
| Meta title & description | Perlu update beberapa halaman | Tinggi |
| Konten halaman layanan | Belum ada halaman /layanan terpisah | Tinggi |
| Blog — volume konten | Sudah cukup (30+ artikel) | Sedang |
| Blog — keyword coverage | Beberapa gap di keyword transaksional | Tinggi |
| Internal linking | Perlu ditingkatkan | Sedang |
| Gambar & alt text | Perlu audit gambar blog | Sedang |
| Schema Markup | Organization + Website ada; perlu BreadcrumbList | Rendah |
| Sitemap | Ada (`/sitemap.xml`) | ✅ Baik |
| Robots.txt | Ada (`/robots.txt`) | ✅ Baik |
| Core Web Vitals | Perlu cek di PageSpeed Insights | Tinggi |

---

## Detail per Halaman

### Homepage (`/`)

| Item | Temuan | Aksi |
|---|---|---|
| Title | "Jasa Freeze Drying Makanan Custom" (38 karakter) | Tambah brand — cek ke 55–60 karakter |
| Meta description | Ada, lengkap | ✅ OK |
| H1 | Perlu cek apakah muncul di HTML | Verifikasi di devtools |
| Keyword utama | "jasa freeze drying" | ✅ Sudah di title & description |
| OG image | Ada | ✅ OK |
| Schema | Organization + WebSite | Tambah LocalBusiness schema |

---

### Tentang Kami (`/about`)

| Item | Temuan | Aksi |
|---|---|---|
| Title | "Tentang Kami - Raja Freeze Dried Food" | Tambah keyword; contoh: "Jasa Freeze Drying Jakarta — Tentang Kami" |
| Meta description | Ada | ✅ OK |
| Konten H1 | Ada | ✅ |
| Internal link | Perlu cek berapa link keluar dari halaman ini | Tambah CTA ke /contact |

---

### Halaman Blog (`/blog`)

| Item | Temuan | Aksi |
|---|---|---|
| Title | Perlu dicek | Pastikan ada keyword "blog freeze dried" |
| Pagination | Perlu cek apakah ada pagination | Jika belum, tambah jika artikel > 12 |
| Artikel published | 30+ artikel | ✅ Baik |
| Kategori filter | — | Pertimbangkan filter by kategori |

---

### Halaman Kontak (`/contact`)

| Item | Temuan | Aksi |
|---|---|---|
| Title | Perlu dicek | Pastikan ada keyword "hubungi jasa freeze drying" |
| Schema LocalBusiness | Belum ada | Tambah dengan alamat & nomor telepon |
| Form kontak | — | Pastikan form berfungsi + thank-you page |

---

## Halaman yang Perlu Dibuat (Gap Analysis)

| Halaman | Keyword Target | Prioritas |
|---|---|---|
| `/layanan` | OEM freeze dried, private label freeze dried | 🔴 Tinggi |
| `/produk` atau `/produk-freeze-dried` | produk freeze dried Indonesia | 🔴 Tinggi |
| `/harga` atau FAQ harga | harga jasa freeze drying per kg | 🟡 Sedang |
| `/mitra` atau `/b2b` | supplier freeze dried, kemitraan freeze dried | 🟡 Sedang |
| `/lokasi` | jasa freeze dried Jakarta | 🟢 Rendah |

---

## Action Items (Prioritas)

1. **Buat halaman `/layanan`** dengan keyword OEM dan private label
2. **Update title homepage** — tambah brand name di akhir
3. **Tambah LocalBusiness schema** di layout.tsx
4. **Audit alt text gambar** semua artikel blog
5. **Tambah internal link** dari artikel blog ke halaman layanan (setelah dibuat)
6. **Cek Core Web Vitals** via PageSpeed Insights — target LCP < 2.5s
7. **Buat artikel baru** sesuai CALENDAR.md — fokus keyword transaksional

---

## Tools yang Digunakan

- [ ] Google Search Console — cek kata kunci yang sudah ranking
- [ ] PageSpeed Insights — cek Core Web Vitals
- [ ] Screaming Frog / Ahrefs — crawl broken links
- [ ] Ahrefs / Ubersuggest — riset keyword baru
