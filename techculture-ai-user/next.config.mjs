/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow high-quality renders (Next 15+ defaults to [75] only)
    qualities: [75, 90, 100],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640, 750],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
        port: "",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "seoc-html-v2.vercel.app",
        port: "",
      },
      {
        protocol: "https",
        hostname: "api.techculture.ai",
        port: "",
      },
      {
        protocol: "https",
        hostname: "bharatdemographic.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.ezwealth.in",
        port: "",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5050",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5050",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/webdevelopment-ai",
        destination: "/",
        permanent: true,
      },
      {
        source: "/webdevelopment-ai/:path*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/tracking-system",
        destination: "/tracking",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
