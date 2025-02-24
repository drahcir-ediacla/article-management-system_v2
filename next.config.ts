import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/yogeek-cloudinary/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
