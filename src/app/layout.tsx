import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { Organization, WebSite, WithContext } from "schema-dts";
import FloatingWidgetsWrapper from "@/components/FloatingWidgetsWrapper";
import Script from "next/script";

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
    telephone: "+6282124985339",
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QKP92JDH0F"
          strategy="afterInteractive"
        />
        <Script id="ga4-base" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QKP92JDH0F');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <JsonLd data={jsonLdOrganization} />
        <JsonLd data={jsonLdWebsite} />
        <div className="min-h-screen bg-white">
          {children}
          <FloatingWidgetsWrapper />
        </div>
        <Script id="ga4-lead-events" strategy="afterInteractive">
          {`
            (function () {
              if (window.__ADS_AGENT_GA4_LEAD_TRACKER__) return;
              window.__ADS_AGENT_GA4_LEAD_TRACKER__ = true;

              function sendEvent(name, params) {
                if (typeof window.gtag !== 'function') return;
                window.gtag('event', name, Object.assign({
                  page_location: window.location.href,
                  page_title: document.title
                }, params || {}));
              }

              document.addEventListener('click', function (event) {
                var link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
                if (!link) return;
                var href = link.getAttribute('href') || '';
                var text = (link.innerText || link.getAttribute('aria-label') || '').trim().slice(0, 120);
                var lowerHref = href.toLowerCase();
                var lowerText = text.toLowerCase();
                var params = { link_url: href, link_text: text };

                if (lowerHref.indexOf('wa.me') !== -1 || lowerHref.indexOf('api.whatsapp.com') !== -1 || lowerHref.indexOf('whatsapp') !== -1) {
                  sendEvent('wa_click', params);
                  sendEvent('generate_lead', Object.assign({ lead_type: 'whatsapp' }, params));
                  return;
                }

                if (lowerHref.indexOf('/konsultasi') !== -1 || lowerHref.indexOf('/contact') !== -1 || lowerText.indexOf('konsultasi') !== -1 || lowerText.indexOf('hubungi') !== -1 || lowerText.indexOf('audit') !== -1) {
                  sendEvent('click_consultation', params);
                }
              }, true);

              document.addEventListener('submit', function (event) {
                var form = event.target;
                if (!form || !form.tagName || form.tagName.toLowerCase() !== 'form') return;
                var params = {
                  form_id: form.id || '',
                  form_name: form.getAttribute('name') || '',
                  form_action: form.getAttribute('action') || window.location.href
                };
                sendEvent('form_submit', params);
                sendEvent('generate_lead', Object.assign({ lead_type: 'form' }, params));
              }, true);
            })();
          `}
        </Script>      </body>
    </html>
  );
}


