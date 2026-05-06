# Checklist QC Konten SEO — Raja Freeze Dried Food

Pakai checklist ini sebelum buat Pull Request ke `main`.

---

## Checklist Artikel Blog

### Teknis SEO
- [ ] Slug URL pakai format `keyword-utama-YYYY-MM` (lowercase, pakai strip)
- [ ] `title` 50–60 karakter, mengandung keyword utama
- [ ] `excerpt` 150–160 karakter, menarik dan mengandung keyword
- [ ] `published: false` → ubah ke `true` setelah lolos QC
- [ ] Tag dan kategori terisi sesuai topik
- [ ] `image` terisi dengan nama file yang benar (gambar sudah diupload ke `/public`)

### Konten
- [ ] Keyword utama muncul di H1, H2 pertama, dan paragraf pembuka
- [ ] Panjang artikel minimal 800 kata (target 1200–1800 untuk topik kompetitif)
- [ ] Heading hierarchy benar: H1 → H2 → H3 (tidak loncat)
- [ ] Ada minimal 1 internal link ke halaman lain di website
- [ ] Ada minimal 1 external link ke sumber terpercaya (bukan kompetitor)
- [ ] Tidak ada keyword stuffing (keyword terasa natural, tidak dipaksakan)
- [ ] Konten orisinal, bukan parafrase atau duplikat artikel lain di web

### Kualitas Bahasa
- [ ] Tidak ada typo atau kalimat tidak selesai
- [ ] Menggunakan kata baku Bahasa Indonesia (tidak campur bahasa secara tidak perlu)
- [ ] Tone sesuai brand: informatif, profesional, tidak terlalu formal
- [ ] CTA (Call to Action) ada di akhir artikel — arahkan ke WhatsApp atau halaman kontak

### Gambar
- [ ] Gambar ada (minimal 1 gambar hero)
- [ ] Nama file gambar pakai keyword (contoh: `jasa-freeze-drying-jakarta.jpg`)
- [ ] Ukuran gambar <200KB (sudah dikompresi)
- [ ] Format: `.webp` diutamakan, boleh `.jpg` jika tidak ada
- [ ] Alt text gambar deskriptif dan mengandung keyword

---

## Checklist Update Halaman Existing (Meta)

- [ ] Title tag 50–60 karakter, keyword di depan
- [ ] Meta description 150–160 karakter
- [ ] OG title dan OG description terisi
- [ ] Canonical URL benar
- [ ] Tidak ada broken link di halaman tersebut

---

## Checklist Sebelum Submit PR

- [ ] Branch name deskriptif: `artikel/nama-artikel` atau `meta/nama-halaman`
- [ ] File hanya berubah di area yang relevan (tidak ada perubahan tidak sengaja)
- [ ] PR description menjelaskan: apa yang diubah, keyword target, dan alasan
- [ ] Sudah preview di lokal (jalankan `npm run dev`) — tidak ada error

---

## Catatan Reviewer

Reviewer cek:
1. Keyword density wajar (1–2%)
2. Tidak ada duplikat dengan artikel existing
3. Internal link mengarah ke URL yang valid
4. Gambar ter-upload dengan benar
