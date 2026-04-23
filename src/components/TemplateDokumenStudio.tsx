"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import DocumentPrintToolbar from "@/components/DocumentPrintToolbar";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const company = {
  name: "TEPAT Laser Cutting",
  tagline: "Precision Beyond Expectation",
  address: "Jl. Bintaro BSD No 1D",
  logoSrc: "/tepat-laser/logo-kopsurat.png",
  stampSrc: "/tepat-laser/stempel-ttd.png",
  signer: "Heri",
  signerTitle: "Authorized Signatory",
  payment: {
    bankName: "BCA",
    accountNumber: "6090125182",
    accountHolder: "Heri Asari",
    whatsapp: "+62 821-2129-2937",
    confirmationNote:
      "Mohon kirim bukti transfer ke WhatsApp setelah pembayaran agar proses verifikasi dan produksi dapat dipercepat.",
  },
};

type LineItem = {
  description: string;
  qty: string;
  unitPrice: number;
  total: number;
};

type TotalRow = {
  label: string;
  amount: number;
  emphasized?: boolean;
};

type DocumentTone = "quoted" | "proforma" | "invoiced";

type DocumentTemplate = {
  slug: string;
  badge: string;
  title: string;
  intro: string;
  tone: DocumentTone;
  customer: string;
  customerAddress: string;
  project: string;
  meta: Array<{ label: string; value: string }>;
  highlights: string[];
  items: LineItem[];
  termsTitle: string;
  terms: string[];
  totals: TotalRow[];
};

type StudioFormState = {
  customerName: string;
  customerAddress: string;
  projectName: string;
  referenceNumber: string;
  quotationNumber: string;
  proformaNumber: string;
  invoiceNumber: string;
  quotationDate: string;
  validUntil: string;
  proformaDate: string;
  dpDueDate: string;
  invoiceDate: string;
  invoiceDueDate: string;
  leadTime: string;
  mainItemDescription: string;
  mainItemQty: number;
  mainItemUnit: string;
  mainItemUnitPrice: number;
  finishingLabel: string;
  finishingFee: number;
  packingLabel: string;
  packingFee: number;
  taxPercent: number;
  downPaymentPercent: number;
};

type PricingSummary = {
  mainTotal: number;
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  downPaymentAmount: number;
  remainingBalance: number;
};

const defaultFormState: StudioFormState = {
  customerName: "PT Arunika Interior",
  customerAddress: "Attn. Divisi Project\nJl. Cendana Raya No. 18\nJakarta Selatan",
  projectName: "Laser cutting akrilik clear 3 mm untuk panel display retail",
  referenceNumber: "PO / Approval Customer",
  quotationNumber: "Q-2026-04-019",
  proformaNumber: "PI-2026-04-019",
  invoiceNumber: "INV-2026-04-019",
  quotationDate: "2026-04-19",
  validUntil: "2026-04-26",
  proformaDate: "2026-04-19",
  dpDueDate: "2026-04-22",
  invoiceDate: "2026-04-26",
  invoiceDueDate: "2026-04-29",
  leadTime: "5 hari kerja setelah approval",
  mainItemDescription: "Laser cutting akrilik clear 3 mm - 24 pcs panel display",
  mainItemQty: 24,
  mainItemUnit: "pcs",
  mainItemUnitPrice: 67500,
  finishingLabel: "Deburring dan edge cleanup",
  finishingFee: 288000,
  packingLabel: "QC akhir dan protective packing",
  packingFee: 180000,
  taxPercent: 12,
  downPaymentPercent: 50,
};

const stringKeys = [
  "customerName",
  "customerAddress",
  "projectName",
  "referenceNumber",
  "quotationNumber",
  "proformaNumber",
  "invoiceNumber",
  "quotationDate",
  "validUntil",
  "proformaDate",
  "dpDueDate",
  "invoiceDate",
  "invoiceDueDate",
  "leadTime",
  "mainItemDescription",
  "mainItemUnit",
  "finishingLabel",
  "packingLabel",
] as const;

const numberKeys = [
  "mainItemQty",
  "mainItemUnitPrice",
  "finishingFee",
  "packingFee",
  "taxPercent",
  "downPaymentPercent",
] as const;

function formatCurrency(amount: number) {
  return currency.format(amount);
}

function formatDateLabel(value: string) {
  if (!value) {
    return "-";
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return value;
  }

  return dateFormatter.format(new Date(year, month - 1, day));
}

function readNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeFormState(
  input: Partial<Record<keyof StudioFormState, unknown>>,
): StudioFormState {
  const next: StudioFormState = { ...defaultFormState };

  for (const key of stringKeys) {
    const raw = input[key];

    if (raw !== undefined && raw !== null) {
      next[key] = String(raw);
    }
  }

  for (const key of numberKeys) {
    const raw = input[key];

    if (raw !== undefined && raw !== null) {
      next[key] = typeof raw === "number" ? raw : readNumber(String(raw));
    }
  }

  return next;
}

function serializeFormState(form: StudioFormState) {
  const params = new URLSearchParams();

  for (const key of stringKeys) {
    if (form[key]) {
      params.set(key, form[key]);
    }
  }

  for (const key of numberKeys) {
    params.set(key, String(form[key]));
  }

  return params.toString();
}

function deserializeFormState(search: string) {
  const params = new URLSearchParams(search);

  if ([...params.keys()].length === 0) {
    return null;
  }

  const raw: Partial<Record<keyof StudioFormState, unknown>> = {};

  for (const key of stringKeys) {
    if (params.has(key)) {
      raw[key] = params.get(key) ?? "";
    }
  }

  for (const key of numberKeys) {
    if (params.has(key)) {
      raw[key] = params.get(key) ?? "";
    }
  }

  return normalizeFormState(raw);
}

function createDraftFileName(customerName: string) {
  const cleaned = customerName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return cleaned || "draft-customer";
}

function calculatePricing(form: StudioFormState): PricingSummary {
  const mainTotal = Math.max(0, form.mainItemQty) * Math.max(0, form.mainItemUnitPrice);
  const finishingFee = Math.max(0, form.finishingFee);
  const packingFee = Math.max(0, form.packingFee);
  const subtotal = mainTotal + finishingFee + packingFee;
  const taxAmount = Math.round((subtotal * Math.max(0, form.taxPercent)) / 100);
  const grandTotal = subtotal + taxAmount;
  const downPaymentAmount = Math.round(
    (grandTotal * Math.min(Math.max(0, form.downPaymentPercent), 100)) / 100,
  );
  const remainingBalance = grandTotal - downPaymentAmount;

  return {
    mainTotal,
    subtotal,
    taxAmount,
    grandTotal,
    downPaymentAmount,
    remainingBalance,
  };
}

function buildDocuments(
  form: StudioFormState,
  pricing: PricingSummary,
): DocumentTemplate[] {
  const customerName = form.customerName || "Nama Customer";
  const customerAddress = form.customerAddress || "Alamat customer belum diisi.";
  const referenceLabel = form.referenceNumber || form.quotationNumber;
  const quotationItems: LineItem[] = [
    {
      description: form.mainItemDescription || "Item utama pekerjaan",
      qty: `${Math.max(0, form.mainItemQty)} ${form.mainItemUnit || "pcs"}`,
      unitPrice: Math.max(0, form.mainItemUnitPrice),
      total: pricing.mainTotal,
    },
  ];

  if (form.finishingFee > 0) {
    quotationItems.push({
      description: form.finishingLabel || "Biaya finishing",
      qty: "1 lot",
      unitPrice: Math.max(0, form.finishingFee),
      total: Math.max(0, form.finishingFee),
    });
  }

  if (form.packingFee > 0) {
    quotationItems.push({
      description: form.packingLabel || "Biaya packing / QC",
      qty: "1 lot",
      unitPrice: Math.max(0, form.packingFee),
      total: Math.max(0, form.packingFee),
    });
  }

  return [
    {
      slug: "quotation",
      badge: "Penawaran Awal",
      title: "Quotation",
      intro:
        "Dokumen penawaran untuk tahap negosiasi awal, lengkap dengan rincian scope, masa berlaku harga, dan asumsi produksi.",
      tone: "quoted",
      customer: customerName,
      customerAddress,
      project: form.projectName || "Nama project",
      meta: [
        { label: "No. Dokumen", value: form.quotationNumber || "-" },
        { label: "Tanggal", value: formatDateLabel(form.quotationDate) },
        { label: "Berlaku Sampai", value: formatDateLabel(form.validUntil) },
        { label: "Lead Time", value: form.leadTime || "-" },
      ],
      highlights: [
        "Harga mengikuti input customer terbaru dan akan ter-update otomatis saat nilai berubah.",
        "Cocok dipakai untuk approval customer sebelum produksi dimulai.",
        "Item tambahan seperti finishing dan packing tetap dipisah agar audit harga lebih mudah.",
      ],
      items: quotationItems,
      termsTitle: "Catatan Penawaran",
      terms: [
        "Harga di atas belum termasuk revisi desain mayor di luar file final yang disetujui.",
        "Produksi dimulai setelah customer memberikan persetujuan tertulis atas quotation ini.",
        "Lead time mengikuti jadwal material dan slot produksi yang tersedia saat approval.",
      ],
      totals: [
        { label: "Subtotal", amount: pricing.subtotal },
        { label: `PPN ${form.taxPercent}%`, amount: pricing.taxAmount },
        { label: "Total Penawaran", amount: pricing.grandTotal, emphasized: true },
      ],
    },
    {
      slug: "proforma",
      badge: "Permintaan DP",
      title: "Proforma Invoice",
      intro:
        "Dokumen penagihan awal sebelum produksi dimulai, difokuskan pada uang muka dan acuan pembayaran yang jelas.",
      tone: "proforma",
      customer: customerName,
      customerAddress,
      project: `Standard package - ${form.projectName || "nama project"}`,
      meta: [
        { label: "No. Dokumen", value: form.proformaNumber || "-" },
        { label: "Referensi", value: form.quotationNumber || referenceLabel },
        { label: "Tanggal", value: formatDateLabel(form.proformaDate) },
        { label: "Jatuh Tempo DP", value: formatDateLabel(form.dpDueDate) },
      ],
      highlights: [
        `Nominal DP otomatis dihitung ${form.downPaymentPercent}% dari total proyek.`,
        "Format ini lebih formal daripada quotation tetapi belum merupakan tagihan final.",
        "Cocok untuk mengunci jadwal produksi dan pembelian material lebih cepat.",
      ],
      items: [
        {
          description: form.projectName || "Nilai proyek",
          qty: "1 proyek",
          unitPrice: pricing.subtotal,
          total: pricing.subtotal,
        },
        {
          description: `PPN ${form.taxPercent}%`,
          qty: "1",
          unitPrice: pricing.taxAmount,
          total: pricing.taxAmount,
        },
        {
          description: `Uang muka produksi ${form.downPaymentPercent}%`,
          qty: "1",
          unitPrice: pricing.downPaymentAmount,
          total: pricing.downPaymentAmount,
        },
      ],
      termsTitle: "Instruksi Pembayaran",
      terms: [
        "Pembayaran DP mengunci jadwal produksi dan pemesanan material.",
        "Pelunasan sisa tagihan dilakukan sebelum pengiriman atau saat barang diambil.",
        "Cantumkan nomor proforma pada bukti transfer agar rekonsiliasi lebih cepat.",
      ],
      totals: [
        { label: "Nilai Proyek", amount: pricing.grandTotal },
        { label: `DP ${form.downPaymentPercent}%`, amount: pricing.downPaymentAmount },
        { label: "Tagihan Saat Ini", amount: pricing.downPaymentAmount, emphasized: true },
      ],
    },
    {
      slug: "invoice",
      badge: "Tagihan Final",
      title: "Invoice",
      intro:
        "Dokumen tagihan final setelah pekerjaan disetujui untuk ditagihkan, lengkap dengan referensi quotation/proforma dan saldo akhir.",
      tone: "invoiced",
      customer: customerName,
      customerAddress,
      project: `Pelunasan produksi - ${form.projectName || "nama project"}`,
      meta: [
        { label: "No. Dokumen", value: form.invoiceNumber || "-" },
        {
          label: "Referensi",
          value: form.referenceNumber || `${form.proformaNumber} / ${form.quotationNumber}`,
        },
        { label: "Tanggal Invoice", value: formatDateLabel(form.invoiceDate) },
        { label: "Jatuh Tempo", value: formatDateLabel(form.invoiceDueDate) },
      ],
      highlights: [
        "DP yang sudah dibayarkan langsung menjadi pengurang pada saldo akhir invoice.",
        "Referensi dapat mengikuti quotation, proforma, atau nomor PO customer.",
        "Siap dipakai sebagai tagihan final setelah QC dan approval selesai.",
      ],
      items: [
        {
          description: form.projectName || "Nilai proyek",
          qty: "1 proyek",
          unitPrice: pricing.subtotal,
          total: pricing.subtotal,
        },
        {
          description: `PPN ${form.taxPercent}%`,
          qty: "1",
          unitPrice: pricing.taxAmount,
          total: pricing.taxAmount,
        },
        {
          description: `DP diterima - ${form.proformaNumber || "proforma"}`,
          qty: "1",
          unitPrice: -pricing.downPaymentAmount,
          total: -pricing.downPaymentAmount,
        },
      ],
      termsTitle: "Catatan Invoice",
      terms: [
        "Mohon kirim bukti pelunasan agar dokumen serah terima dapat diproses lebih cepat.",
        "Invoice ini mengikuti scope dan harga yang telah disetujui pada quotation dan proforma.",
        "Setelah pelunasan diterima, dokumen ini dapat dipakai sebagai arsip transaksi final.",
      ],
      totals: [
        { label: "Nilai Proyek", amount: pricing.grandTotal },
        { label: "DP Diterima", amount: -pricing.downPaymentAmount },
        { label: "Sisa Tagihan", amount: pricing.remainingBalance, emphasized: true },
      ],
    },
  ];
}

function toneClasses(tone: DocumentTone) {
  if (tone === "proforma") {
    return {
      badge:
        "border-amber-300/80 bg-amber-50 text-amber-900 shadow-[0_0_0_1px_rgba(245,158,11,0.08)]",
      bar: "from-amber-500 via-orange-500 to-stone-950",
      accent: "text-amber-900",
      panel: "border-amber-200 bg-amber-50/75",
      dot: "bg-amber-500",
    };
  }

  if (tone === "invoiced") {
    return {
      badge:
        "border-emerald-300/80 bg-emerald-50 text-emerald-900 shadow-[0_0_0_1px_rgba(16,185,129,0.08)]",
      bar: "from-emerald-500 via-teal-500 to-slate-950",
      accent: "text-emerald-900",
      panel: "border-emerald-200 bg-emerald-50/75",
      dot: "bg-emerald-500",
    };
  }

  return {
    badge:
      "border-orange-300/80 bg-orange-50 text-orange-900 shadow-[0_0_0_1px_rgba(249,115,22,0.08)]",
    bar: "from-orange-500 via-amber-500 to-slate-950",
    accent: "text-orange-900",
    panel: "border-orange-200 bg-orange-50/75",
    dot: "bg-orange-500",
  };
}

function EditorCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-stone-200 bg-white px-5 py-5 shadow-[0_18px_50px_rgba(28,25,23,0.06)]">
      <div className="border-b border-stone-200 pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
          {title}
        </p>
        <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function inputClassName() {
  return "w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-stone-950 focus:bg-white";
}

function DocumentCard({ document }: { document: DocumentTemplate }) {
  const tone = toneClasses(document.tone);

  return (
    <article className="document-sheet relative mx-auto w-full max-w-[210mm] overflow-hidden rounded-[32px] border border-stone-200 bg-white shadow-[0_30px_80px_rgba(28,25,23,0.12)]">
      <div className={`h-3 w-full bg-gradient-to-r ${tone.bar}`} />

      <div className="px-5 py-6 sm:px-8 sm:py-8">
        <header className="grid gap-8 border-b border-stone-200 pb-7 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="max-w-[290px]">
              <Image
                src={company.logoSrc}
                alt={`${company.name} logo`}
                width={920}
                height={460}
                priority={document.slug === "quotation"}
                className="h-auto w-full"
              />
            </div>

            <div className="mt-4 inline-flex items-center rounded-full border border-stone-300 bg-stone-50 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-700">
              TTD Heri
            </div>

            <div className="mt-4 space-y-1 text-sm text-stone-600">
              <p className="font-semibold text-stone-800">{company.tagline}</p>
              <p>{company.address}</p>
            </div>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-[linear-gradient(135deg,rgba(250,250,249,1),rgba(245,245,244,0.88))] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">
                  {document.badge}
                </p>
                <h1
                  className={`mt-2 text-4xl leading-none text-stone-900 sm:text-[2.8rem] ${cormorant.className}`}
                >
                  {document.title}
                </h1>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] ${tone.badge}`}
              >
                {document.badge}
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-stone-600">{document.intro}</p>

            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Customer
                </dt>
                <dd className="mt-2 text-sm font-semibold text-stone-900">
                  <p>{document.customer}</p>
                  <p className="mt-1 whitespace-pre-line text-xs font-medium leading-5 text-stone-600">
                    {document.customerAddress}
                  </p>
                </dd>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Project
                </dt>
                <dd className="mt-2 text-sm font-semibold text-stone-900">
                  {document.project}
                </dd>
              </div>
            </dl>
          </div>
        </header>

        <section className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {document.meta.map((entry) => (
            <div
              key={`${document.slug}-${entry.label}`}
              className="rounded-[24px] border border-stone-200 bg-stone-50/80 px-4 py-4"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
                {entry.label}
              </p>
              <p className="mt-2 text-sm font-semibold text-stone-900">{entry.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-7 grid gap-7 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="overflow-hidden rounded-[28px] border border-stone-200">
              <div className="grid grid-cols-[1.6fr_0.55fr_0.85fr_0.9fr] bg-stone-900 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-100">
                <span>Uraian</span>
                <span>Qty</span>
                <span>Harga</span>
                <span>Total</span>
              </div>

              <div className="divide-y divide-stone-200 bg-white">
                {document.items.map((item) => (
                  <div
                    key={`${document.slug}-${item.description}`}
                    className="grid grid-cols-[1.6fr_0.55fr_0.85fr_0.9fr] gap-3 px-5 py-4 text-sm text-stone-700"
                  >
                    <p className="pr-2 leading-6 text-stone-900">{item.description}</p>
                    <p className="font-medium text-stone-600">{item.qty}</p>
                    <p className="font-medium text-stone-600">
                      {formatCurrency(item.unitPrice)}
                    </p>
                    <p className="font-semibold text-stone-900">
                      {formatCurrency(item.total)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-stone-200 bg-stone-50 px-5 py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
                {document.termsTitle}
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-700">
                {document.terms.map((term) => (
                  <li key={`${document.slug}-${term}`} className="flex gap-3">
                    <span className={`mt-2 h-2 w-2 rounded-full ${tone.dot}`} />
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-6">
            <div className={`rounded-[28px] border px-5 py-5 ${tone.panel}`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
                Pembeda Dokumen
              </p>
              <div className="mt-4 space-y-3">
                {document.highlights.map((highlight) => (
                  <div
                    key={`${document.slug}-${highlight}`}
                    className="rounded-2xl border border-white/70 bg-white/85 px-4 py-4"
                  >
                    <p className="text-sm leading-6 text-stone-700">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-stone-200 bg-stone-950 px-5 py-5 text-stone-100">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-400">
                Ringkasan Nilai
              </p>
              <div className="mt-4 space-y-3">
                {document.totals.map((row) => (
                  <div
                    key={`${document.slug}-${row.label}`}
                    className={`flex items-center justify-between gap-4 rounded-2xl px-4 py-3 ${
                      row.emphasized
                        ? "bg-white text-stone-950"
                        : "bg-stone-900 text-stone-200"
                    }`}
                  >
                    <span className="text-sm font-medium">{row.label}</span>
                    <strong className="text-sm">{formatCurrency(row.amount)}</strong>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <footer className="mt-7 grid gap-7 border-t border-stone-200 pt-7 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="rounded-[28px] border border-stone-200 bg-[linear-gradient(180deg,rgba(250,250,249,1),rgba(245,245,244,0.8))] px-5 py-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
              Persetujuan
            </p>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Blok tanda tangan ini ditempatkan pada sisi kiri bawah, sejalur dengan logo
              kop surat, agar identitas brand tetap konsisten di ketiga mode dokumen.
            </p>

            <div className="mt-5 w-[170px]">
              <Image
                src={company.stampSrc}
                alt={`Stempel dan tanda tangan ${company.signer}`}
                width={768}
                height={768}
                className="h-auto w-full object-contain"
              />
            </div>

            <div className="mt-3 border-t border-dashed border-stone-300 pt-3">
              <p className="text-lg font-semibold text-stone-900">{company.signer}</p>
              <p className="text-sm text-stone-600">{company.signerTitle}</p>
            </div>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-white px-5 py-5">
            <div className="flex items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
                  Status Brand
                </p>
                <p className={`mt-2 text-xl font-semibold ${tone.accent}`}>
                  {document.title} - siap dipakai
                </p>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.badge}`}
              >
                {document.badge}
              </span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Alamat pada Kop
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-700">{company.address}</p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Posisi TTD
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-700">
                  Label &quot;TTD Heri&quot; berada tepat di bawah logo kopsurat,
                  sedangkan stempel dan tanda tangan ditempatkan di area bawah dokumen.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                Pembayaran
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Bank
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-900">
                    {company.payment.bankName}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                    No. Rekening
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-900">
                    {company.payment.accountNumber}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Atas Nama
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-900">
                    {company.payment.accountHolder}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                    WhatsApp
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-900">
                    {company.payment.whatsapp}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-stone-200 bg-white px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Konfirmasi Transfer
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-700">
                  {company.payment.confirmationNote}
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}

export default function TemplateDokumenStudio() {
  const [form, setForm] = useState<StudioFormState>(defaultFormState);
  const [draftStatus, setDraftStatus] = useState(
    "Draft bisa dibagikan lewat URL atau disimpan sebagai JSON.",
  );
  const [queryReady, setQueryReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pricing = calculatePricing(form);
  const documents = buildDocuments(form, pricing);

  function updateField<Key extends keyof StudioFormState>(
    key: Key,
    value: StudioFormState[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  useEffect(() => {
    const formFromUrl = deserializeFormState(window.location.search);

    if (formFromUrl) {
      setForm(formFromUrl);
      setDraftStatus("Draft dimuat dari URL aktif.");
    }

    setQueryReady(true);
  }, []);

  useEffect(() => {
    if (!queryReady) {
      return;
    }

    const nextQuery = serializeFormState(form);
    const nextUrl = nextQuery
      ? `${window.location.pathname}?${nextQuery}`
      : window.location.pathname;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (nextUrl !== currentUrl) {
      window.history.replaceState({}, "", nextUrl);
    }
  }, [form, queryReady]);

  async function handleCopyLink() {
    const nextQuery = serializeFormState(form);
    const shareUrl = nextQuery
      ? `${window.location.origin}${window.location.pathname}?${nextQuery}`
      : `${window.location.origin}${window.location.pathname}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setDraftStatus("Link draft berhasil disalin.");
    } catch {
      setDraftStatus("Clipboard gagal diakses. Anda masih bisa copy URL dari address bar.");
    }
  }

  function handleDownloadJson() {
    const blob = new Blob([JSON.stringify(form, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `tepat-laser-${createDraftFileName(form.customerName)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setDraftStatus("Draft JSON berhasil diunduh.");
  }

  async function handleImportJson(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Partial<Record<keyof StudioFormState, unknown>>;
      setForm(normalizeFormState(parsed));
      setDraftStatus(`Draft JSON "${file.name}" berhasil dimuat.`);
    } catch {
      setDraftStatus("File JSON tidak valid dan tidak bisa dimuat.");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <main
      className={`${manrope.className} screen-shell min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_rgba(245,245,244,0.96)_26%,_rgba(231,229,228,1)_100%)] px-4 py-8 text-stone-900 sm:px-6 lg:px-8`}
    >
      <style jsx global>{`
        @page {
          size: A4;
          margin: 12mm;
        }

        @media print {
          html,
          body {
            background: #ffffff !important;
          }

          .screen-shell {
            background: #ffffff !important;
            padding: 0 !important;
          }

          .print-hidden {
            display: none !important;
          }

          .document-stack {
            gap: 0 !important;
          }

          .document-sheet {
            width: 100% !important;
            max-width: none !important;
            min-height: 0 !important;
            margin: 0 auto !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            break-after: page;
            page-break-after: always;
          }

          .document-sheet:last-child {
            break-after: auto;
            page-break-after: auto;
          }
        }
      `}</style>

      <section className="print-hidden mx-auto mb-8 max-w-[1180px] rounded-[36px] border border-stone-200/80 bg-[linear-gradient(135deg,rgba(17,24,39,0.96),rgba(41,37,36,0.94))] px-6 py-7 text-stone-100 shadow-[0_30px_80px_rgba(28,25,23,0.18)] sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-300">
              frontend-design
            </p>
            <h1 className={`mt-3 text-4xl leading-none sm:text-6xl ${cormorant.className}`}>
              Quotation, Proforma, Invoice
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-300 sm:text-base">
              Studio ini sekarang menerima input customer secara langsung. Setiap perubahan
              pada nama customer, nomor dokumen, item, PPN, dan DP akan mengalir otomatis
              ke tiga mode dokumen tanpa merusak layout cetak.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[24px] border border-white/10 bg-white/6 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400">
                1 Sumber Data
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-200">
                Isi satu form, lalu quotation, proforma, dan invoice ikut sinkron otomatis.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/6 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400">
                Siap Print
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-200">
                Toolbar dan panel input hilang saat print supaya PDF tetap bersih.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/6 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-400">
                Brand Tetap Aman
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-200">
                Logo, alamat, label TTD Heri, dan stempel tetap konsisten di semua lembar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <DocumentPrintToolbar />

      <section className="print-hidden mx-auto mb-8 grid max-w-[1180px] gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <EditorCard
            title="Data Customer"
            description="Isi identitas customer dan ringkasan project. Data ini akan muncul di semua dokumen."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nama Customer">
                <input
                  className={inputClassName()}
                  value={form.customerName}
                  onChange={(event) => updateField("customerName", event.target.value)}
                  placeholder="PT / Nama customer"
                />
              </Field>
              <Field label="Referensi / PO">
                <input
                  className={inputClassName()}
                  value={form.referenceNumber}
                  onChange={(event) => updateField("referenceNumber", event.target.value)}
                  placeholder="PO / Approval"
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Alamat Customer">
                  <textarea
                    className={`${inputClassName()} min-h-28 resize-y`}
                    value={form.customerAddress}
                    onChange={(event) => updateField("customerAddress", event.target.value)}
                    placeholder="Alamat customer"
                  />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Nama Project">
                  <textarea
                    className={`${inputClassName()} min-h-24 resize-y`}
                    value={form.projectName}
                    onChange={(event) => updateField("projectName", event.target.value)}
                    placeholder="Deskripsi project"
                  />
                </Field>
              </div>
            </div>
          </EditorCard>

          <EditorCard
            title="Nomor dan Tanggal"
            description="Atur nomor dokumen, masa berlaku quotation, dan tempo pembayaran."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="No. Quotation">
                <input
                  className={inputClassName()}
                  value={form.quotationNumber}
                  onChange={(event) => updateField("quotationNumber", event.target.value)}
                />
              </Field>
              <Field label="Tanggal Quotation">
                <input
                  type="date"
                  className={inputClassName()}
                  value={form.quotationDate}
                  onChange={(event) => updateField("quotationDate", event.target.value)}
                />
              </Field>
              <Field label="Berlaku Sampai">
                <input
                  type="date"
                  className={inputClassName()}
                  value={form.validUntil}
                  onChange={(event) => updateField("validUntil", event.target.value)}
                />
              </Field>
              <Field label="Lead Time">
                <input
                  className={inputClassName()}
                  value={form.leadTime}
                  onChange={(event) => updateField("leadTime", event.target.value)}
                />
              </Field>
              <Field label="No. Proforma">
                <input
                  className={inputClassName()}
                  value={form.proformaNumber}
                  onChange={(event) => updateField("proformaNumber", event.target.value)}
                />
              </Field>
              <Field label="Tanggal Proforma">
                <input
                  type="date"
                  className={inputClassName()}
                  value={form.proformaDate}
                  onChange={(event) => updateField("proformaDate", event.target.value)}
                />
              </Field>
              <Field label="Tempo DP">
                <input
                  type="date"
                  className={inputClassName()}
                  value={form.dpDueDate}
                  onChange={(event) => updateField("dpDueDate", event.target.value)}
                />
              </Field>
              <Field label="No. Invoice">
                <input
                  className={inputClassName()}
                  value={form.invoiceNumber}
                  onChange={(event) => updateField("invoiceNumber", event.target.value)}
                />
              </Field>
              <Field label="Tanggal Invoice">
                <input
                  type="date"
                  className={inputClassName()}
                  value={form.invoiceDate}
                  onChange={(event) => updateField("invoiceDate", event.target.value)}
                />
              </Field>
              <Field label="Jatuh Tempo Invoice">
                <input
                  type="date"
                  className={inputClassName()}
                  value={form.invoiceDueDate}
                  onChange={(event) => updateField("invoiceDueDate", event.target.value)}
                />
              </Field>
            </div>
          </EditorCard>
        </div>

        <div className="space-y-6">
          <EditorCard
            title="Nilai Proyek"
            description="Masukkan item utama dan biaya tambahan. Total quotation, DP, dan sisa invoice dihitung otomatis."
          >
            <div className="grid gap-4">
              <Field label="Deskripsi Item Utama">
                <textarea
                  className={`${inputClassName()} min-h-24 resize-y`}
                  value={form.mainItemDescription}
                  onChange={(event) => updateField("mainItemDescription", event.target.value)}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Qty">
                  <input
                    type="number"
                    min="0"
                    className={inputClassName()}
                    value={form.mainItemQty}
                    onChange={(event) =>
                      updateField("mainItemQty", readNumber(event.target.value))
                    }
                  />
                </Field>
                <Field label="Unit">
                  <input
                    className={inputClassName()}
                    value={form.mainItemUnit}
                    onChange={(event) => updateField("mainItemUnit", event.target.value)}
                  />
                </Field>
                <Field label="Harga per Unit">
                  <input
                    type="number"
                    min="0"
                    className={inputClassName()}
                    value={form.mainItemUnitPrice}
                    onChange={(event) =>
                      updateField("mainItemUnitPrice", readNumber(event.target.value))
                    }
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                <Field label="Label Finishing">
                  <input
                    className={inputClassName()}
                    value={form.finishingLabel}
                    onChange={(event) => updateField("finishingLabel", event.target.value)}
                  />
                </Field>
                <Field label="Biaya Finishing">
                  <input
                    type="number"
                    min="0"
                    className={inputClassName()}
                    value={form.finishingFee}
                    onChange={(event) =>
                      updateField("finishingFee", readNumber(event.target.value))
                    }
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                <Field label="Label QC / Packing">
                  <input
                    className={inputClassName()}
                    value={form.packingLabel}
                    onChange={(event) => updateField("packingLabel", event.target.value)}
                  />
                </Field>
                <Field label="Biaya QC / Packing">
                  <input
                    type="number"
                    min="0"
                    className={inputClassName()}
                    value={form.packingFee}
                    onChange={(event) =>
                      updateField("packingFee", readNumber(event.target.value))
                    }
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="PPN (%)">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className={inputClassName()}
                    value={form.taxPercent}
                    onChange={(event) =>
                      updateField("taxPercent", readNumber(event.target.value))
                    }
                  />
                </Field>
                <Field label="DP (%)">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className={inputClassName()}
                    value={form.downPaymentPercent}
                    onChange={(event) =>
                      updateField("downPaymentPercent", readNumber(event.target.value))
                    }
                  />
                </Field>
              </div>
            </div>
          </EditorCard>

          <EditorCard
            title="Simulasi Otomatis"
            description="Ringkasan ini mengambil nilai yang sama dengan yang dipakai ketiga dokumen."
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
                <span className="text-sm text-stone-600">Item utama</span>
                <strong className="text-sm text-stone-950">
                  {formatCurrency(pricing.mainTotal)}
                </strong>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
                <span className="text-sm text-stone-600">Subtotal</span>
                <strong className="text-sm text-stone-950">
                  {formatCurrency(pricing.subtotal)}
                </strong>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
                <span className="text-sm text-stone-600">PPN {form.taxPercent}%</span>
                <strong className="text-sm text-stone-950">
                  {formatCurrency(pricing.taxAmount)}
                </strong>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-stone-950 bg-stone-950 px-4 py-3 text-white">
                <span className="text-sm">Total proyek</span>
                <strong className="text-sm">{formatCurrency(pricing.grandTotal)}</strong>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <span className="text-sm text-amber-900">DP {form.downPaymentPercent}%</span>
                <strong className="text-sm text-amber-950">
                  {formatCurrency(pricing.downPaymentAmount)}
                </strong>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <span className="text-sm text-emerald-900">Sisa invoice</span>
                <strong className="text-sm text-emerald-950">
                  {formatCurrency(pricing.remainingBalance)}
                </strong>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
              >
                Copy Link Draft
              </button>
              <button
                type="button"
                onClick={handleDownloadJson}
                className="inline-flex items-center justify-center rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-950 hover:text-stone-950"
              >
                Download JSON
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-950 hover:text-stone-950"
              >
                Import JSON
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm(defaultFormState);
                  setDraftStatus("Draft dikembalikan ke contoh awal.");
                }}
                className="inline-flex items-center justify-center rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-950 hover:text-stone-950"
              >
                Reset Contoh
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleImportJson}
            />

            <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                Status Draft
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-700">{draftStatus}</p>
            </div>
          </EditorCard>
        </div>
      </section>

      <section className="document-stack mx-auto flex max-w-[1180px] flex-col gap-8">
        {documents.map((document) => (
          <DocumentCard key={document.slug} document={document} />
        ))}
      </section>
    </main>
  );
}
