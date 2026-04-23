import type { Metadata } from "next";
import TemplateDokumenStudio from "@/components/TemplateDokumenStudio";

export const metadata: Metadata = {
  title: "Template Dokumen Tepat Laser",
  description:
    "Template quotation, proforma invoice, dan invoice dengan kop surat Tepat Laser Cutting.",
};

export default function TemplateDokumenPage() {
  return <TemplateDokumenStudio />;
}
