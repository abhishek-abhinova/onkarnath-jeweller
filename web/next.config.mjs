/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return [
      { source: '/api-be/rates', destination: `${api}/api/rates` },
      { source: '/api-be/products', destination: `${api}/api/products` },
      { source: '/api-be/categories', destination: `${api}/api/categories` },
      { source: '/api-be/gallery', destination: `${api}/api/gallery` },
      { source: '/api-be/settings', destination: `${api}/api/settings` },
      { source: '/api-be/contact', destination: `${api}/api/contact` },
    ];
  },
};

export default nextConfig;