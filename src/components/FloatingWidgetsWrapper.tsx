"use client";

import dynamic from 'next/dynamic';
import { usePathname } from "next/navigation";

const FloatingWidgets = dynamic(() => import('./FloatingWidgets'), { ssr: false });

export default function FloatingWidgetsWrapper() {
  const pathname = usePathname();

  if (pathname?.startsWith("/template-dokumen")) {
    return null;
  }

  return <FloatingWidgets />;
}
