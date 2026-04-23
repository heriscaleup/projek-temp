"use client";

export default function DocumentPrintToolbar() {
  return (
    <div className="print-hidden sticky top-4 z-30 mx-auto mb-6 flex max-w-[1180px] items-center justify-between gap-4 rounded-[24px] border border-stone-200/80 bg-white/88 px-4 py-3 shadow-[0_18px_50px_rgba(28,25,23,0.08)] backdrop-blur-md sm:px-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-500">
          Siap Cetak PDF
        </p>
        <p className="mt-1 text-sm text-stone-700">
          Gunakan tombol print lalu pilih <strong>Save as PDF</strong> untuk hasil final.
        </p>
      </div>

      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex shrink-0 items-center justify-center rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.02] hover:bg-stone-800"
      >
        Print / Save PDF
      </button>
    </div>
  );
}
