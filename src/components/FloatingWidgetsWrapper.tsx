"use client";

import dynamic from 'next/dynamic';

const FloatingWidgets = dynamic(() => import('./FloatingWidgets'), { ssr: false });

export default function FloatingWidgetsWrapper() {
  return <FloatingWidgets />;
}
