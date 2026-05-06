# Cowork SEO — Raja Freeze Dried Food

Workspace kolaboratif untuk update dan produksi konten SEO website [rajafreezdriedfood.com](https://rajafreezdriedfood.com).

---

## Struktur Repo

```
/
├── artikel/          ← Draft & artikel baru (format Markdown)
├── meta/             ← Update title, description, og per halaman
├── audit/            ← Catatan audit SEO dan backlink
├── panduan/          ← SOP penulisan konten
├── KEYWORD.md        ← Master keyword target
├── CALENDAR.md       ← Kalender konten bulanan
└── CHECKLIST.md      ← Checklist QC sebelum publish
```

---

## Cara Kerja Tim

1. **Ambil tugas** dari `CALENDAR.md` — cek kolom PIC dan Status
2. **Tulis/edit artikel** di folder `artikel/` dengan format frontmatter standar (lihat contoh di bawah)
3. **Update metadata** halaman jika ada perubahan keyword di folder `meta/`
4. **Self-QC** pakai `CHECKLIST.md` sebelum buat Pull Request
5. **PR ke branch `main`** — reviewer approve → deploy ke web

---

## Format Artikel (Frontmatter Wajib)

```markdown
---
title: "Judul Artikel SEO (max 60 karakter)"
date: "YYYY-MM-DD"
excerpt: "Deskripsi 150–160 karakter. Muncul di SERP."
category: "Teknologi | Kesehatan | Bisnis | Lifestyle"
image: "/nama-file-gambar.jpg"
slug: "url-friendly-slug"
tags:
  - keyword utama
  - keyword sekunder
keyword_utama: "kata kunci fokus"
keyword_lsi:
  - variasi 1
  - variasi 2
published: false   ← ganti ke true setelah QC
---
```

---

## Kontak Tim

| Peran | Nama | Platform |
|---|---|---|
| SEO Lead | — | — |
| Content Writer | — | — |
| Reviewer | — | — |

> Edit tabel ini sesuai anggota tim aktual.
