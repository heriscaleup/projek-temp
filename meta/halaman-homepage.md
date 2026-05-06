# Meta Update — Homepage (`/`)

**File target:** `src/app/page.tsx`
**Status:** ⬜ Perlu update

---

## Meta Saat Ini

```
title: "Jasa Freeze Drying Makanan Custom"
description: "Raja Freeze Dried Food melayani jasa freeze drying makanan custom, OEM, 
private label, sampling, dan order batch dari Jakarta untuk seluruh Indonesia."
```

---

## Meta yang Direkomendasikan

```typescript
export const metadata: Metadata = {
  title: "Jasa Freeze Drying Custom & OEM | Raja Freeze Dried Food Jakarta",
  description:
    "Jasa freeze drying makanan custom, OEM, private label, dan order batch dari Jakarta. "
    + "Proses vakum presisi, hasil renyah & bergizi. Hubungi kami untuk sampling gratis.",
  keywords: [
    "jasa freeze drying",
    "freeze drying makanan custom",
    "OEM freeze dried Indonesia",
    "private label freeze dried",
    "jasa freeze dried Jakarta",
    "supplier freeze dried food",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Jasa Freeze Drying Custom & OEM | Raja Freeze Dried Food Jakarta",
    description:
      "Freeze drying makanan custom untuk OEM, private label, dan batch produksi. "
      + "Dari Jakarta ke seluruh Indonesia. Mulai dari sampling.",
    url: "https://rajafreezdriedfood.com/",
    images: [
      {
        url: "https://rajafreezdriedfood.com/homepage/process-loading-unloading-mesin.png",
        width: 1536,
        height: 1024,
        alt: "Tim Raja Freeze Dried Food memproses bahan di mesin freeze dryer skala industri",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jasa Freeze Drying Custom & OEM | Raja Freeze Dried Food",
    description:
      "Jasa freeze drying makanan custom untuk OEM, private label, sampling, dan batch produksi.",
    images: ["https://rajafreezdriedfood.com/homepage/process-loading-unloading-mesin.png"],
  },
};
```

---

## Alasan Perubahan

| Item | Sebelum | Sesudah | Alasan |
|---|---|---|---|
| Title | 38 kar. | 58 kar. | Tambah keyword OEM + brand |
| Description | Umum | Ada CTA "sampling gratis" | Meningkatkan CTR |
| Alt text gambar | Singkat | Lebih deskriptif | Aksesibilitas + SEO gambar |

---

## Schema Tambahan (layout.tsx)

Tambahkan `LocalBusiness` schema di `layout.tsx`:

```typescript
const jsonLdLocalBusiness: WithContext<LocalBusiness> = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Raja Freeze Dried Food",
  description: "Jasa freeze drying makanan custom, OEM, dan private label di Jakarta.",
  url: "https://rajafreezdriedfood.com",
  telephone: "+6282121292937",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jakarta",
    addressCountry: "ID",
  },
  priceRange: "Hubungi kami",
  openingHours: "Mo-Fr 09:00-17:00",
};
```
