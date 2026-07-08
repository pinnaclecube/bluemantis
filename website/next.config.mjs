/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site — no server runtime. See spec §3.
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
