"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Oops! Terjadi Kesalahan
        </h2>
        <p className="text-gray-600 mb-6">
          Maaf, kami mengalami masalah saat memuat halaman ini.
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => reset()}
            className="w-full py-2 px-4 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
          >
            Coba Lagi
          </button>
          <Link
            href="/"
            className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
