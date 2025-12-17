import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-lg w-full text-center">
        <div className="relative w-48 h-48 mx-auto mb-8">
            <Image
                src="/favicon.webp"
                alt="Raja Freeze Dried Food Logo"
                fill
                className="object-contain"
            />
        </div>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="inline-block py-3 px-8 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-transform transform hover:scale-105"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
