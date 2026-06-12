import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  assetPrefix: '',
  basePath: '',

  images: {
    // Aktifkan optimisasi gambar Next untuk menghasilkan ukuran responsif
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },

  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;

