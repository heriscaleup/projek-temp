import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { Organization, WebSite, WithContext } from "schema-dts";
import FloatingWidgetsWrapper from "@/components/FloatingWidgetsWrapper";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://rajafreezdriedfood.com"),
  title: {
    template: "%s | Raja Freeze Dried Food",
    default: "Raja Freeze Dried Food - Makanan Sehat Freeze Dried Terbaik",
  },
  description: "Raja Freeze Dried Food menyediakan makanan sehat freeze dried berkualitas tinggi. Nikmati kelezatan dan nutrisi yang terjaga dengan teknologi freeze drying terdepan.",
  icons: {
    icon: '/favicon.webp',
  },
  keywords: ["freeze dried food", "makanan sehat", "snack sehat", "freeze drying", "makanan kering", "nutrisi terjaga", "keripik buah", "buah kering"],
  authors: [{ name: "Raja Freeze Dried Food" }],
  openGraph: {
    title: "Raja Freeze Dried Food - Makanan Sehat Freeze Dried Terbaik",
    description: "Raja Freeze Dried Food menyediakan makanan sehat freeze dried berkualitas tinggi. Nikmati kelezatan dan nutrisi yang terjaga dengan teknologi freeze drying terdepan.",
    type: "website",
    locale: "id_ID",
    url: "https://rajafreezdriedfood.com",
    siteName: "Raja Freeze Dried Food",
    images: [
      {
        url: "https://rajafreezdriedfood.com/fotoawalhero.webp",
        width: 1200,
        height: 630,
        alt: "Raja Freeze Dried Food Hero Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raja Freeze Dried Food - Makanan Sehat Freeze Dried Terbaik",
    description: "Raja Freeze Dried Food menyediakan makanan sehat freeze dried berkualitas tinggi.",
    images: ["https://rajafreezdriedfood.com/fotoawalhero.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: './',
  },
};

const jsonLdOrganization: WithContext<Organization> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Raja Freeze Dried Food",
  description: "Penyedia makanan sehat freeze dried berkualitas tinggi",
  url: "https://rajafreezdriedfood.com",
  logo: "https://rajafreezdriedfood.com/favicon.webp",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+6281296361446",
    contactType: "customer service",
  },
};

const jsonLdWebsite: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Raja Freeze Dried Food",
    url: "https://rajafreezdriedfood.com",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <JsonLd data={jsonLdOrganization} />
        <JsonLd data={jsonLdWebsite} />
        <div className="min-h-screen bg-white">
          {children}
          <FloatingWidgetsWrapper />
        </div>
      </body>
    </html>
  );
}