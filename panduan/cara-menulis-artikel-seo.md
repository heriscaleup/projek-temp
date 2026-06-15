# Panduan Menulis Artikel SEO — Raja Freeze Dried Food

Dokumen ini adalah SOP penulisan konten blog untuk tim cowork.

---

## 1. Sebelum Mulai Menulis

Sebelum membuka dokumen, pastikan Anda tahu:

1. **Keyword utama** — cek `KEYWORD.md`, ambil yang belum ada artikel-nya
2. **Search intent** — cari keyword di Google, lihat hasil page-1: apakah artikel informatif, halaman produk, atau video?
3. **Kompetitor teratas** — buka 3 artikel ranking teratas, catat struktur heading-nya
4. **Panjang target** — artikel kompetitor rata-rata berapa kata? Targetkan sama atau lebih panjang

---

## 2. Struktur Artikel Standar

```
H1: [Keyword Utama]: [Benefit atau Konteks]
├── Paragraf intro (150–200 kata) — muncul keyword di sini
│
├── H2: [Subtopik 1]
│   └── H3: [Detail subtopik jika perlu]
│
├── H2: [Subtopik 2]
│
├── H2: [Subtopik 3]
│
├── H2: Pertanyaan Umum (FAQ) — opsional, bagus untuk featured snippet
│   ├── H3: Pertanyaan 1?
│   └── H3: Pertanyaan 2?
│
└── H2: Kesimpulan / CTA
    └── Arahkan ke WhatsApp atau halaman /contact
```

---

## 3. Aturan Penulisan

### Paragraf
- Maksimal 3–4 kalimat per paragraf
- Gunakan kalimat aktif, hindari kalimat pasif yang panjang
- Hindari basa-basi pembuka ("Di era modern ini, banyak orang yang...")

### Keyword
- Keyword utama muncul di: H1, paragraf pertama, minimal 1 H2, dan penutup
- Density 1–2% — jangan dipaksakan
- Gunakan variasi: sinonim, pertanyaan, LSI keyword

### Gaya Bahasa
- Informatif dan profesional, tapi tidak kaku
- Gunakan "Anda" bukan "kamu"
- Boleh pakai poin-poin/list untuk konten yang bisa di-list
- Hindari klaim berlebihan tanpa data ("paling murah", "terbaik di Indonesia")

### Angka dan Data
- Selalu cantumkan sumber jika mengutip data eksternal
- Gunakan angka konkret, bukan abstrak ("kadar air turun 98%" lebih kuat dari "kadar air turun drastis")

---

## 4. Internal Linking

Setiap artikel **wajib** punya minimal 1 internal link. Gunakan anchor text deskriptif:

- ✅ `[jasa freeze drying kami](/contact)`
- ✅ `[perbedaan freeze dried dan dehidrasi](/blog/freeze-dried-vs-dehidrasi-2025-09)`
- ❌ `[klik di sini](/contact)`
- ❌ `[halaman ini](/blog/freeze-dried-vs-dehidrasi-2025-09)`

---

## 5. Template CTA Akhir Artikel

```markdown
## Mulai Proyek Freeze Drying Anda

[Nama bisnis/brand Anda] layak mendapat mitra produksi yang tepat. Raja Freeze Dried Food 
siap mendampingi dari tahap sampling hingga produksi batch penuh.

[Hubungi kami via WhatsApp](https://wa.me/6282124985339) atau kunjungi [halaman kontak](/contact) 
untuk konsultasi gratis.
```

---

## 6. Alur Submit Artikel

```
Tulis draft → Self-QC (CHECKLIST.md) → Buat branch → Push → PR ke main → Review → Merge → Deploy
```

Branch naming:
```
artikel/harga-jasa-freeze-drying-2026-05
meta/update-homepage-2026-05
```

---

## 7. Tips Cepat

| Do | Don't |
|---|---|
| Tulis untuk manusia, bukan robot | Isi konten dengan keyword berulang |
| Gunakan data dan contoh konkret | Klaim tanpa bukti |
| Update artikel lama yang ranking | Hapus artikel lama yang masih dapat traffic |
| Satu artikel = satu keyword fokus | Satu artikel untuk banyak keyword utama |
