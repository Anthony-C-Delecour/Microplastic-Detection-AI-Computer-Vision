/** @type {import('next').NextConfig} */

const API_URL = "http://fastapi:8000";

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, 
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`, 
      },
    ];
  },
  webpack(config) {
    config.watchOptions = {
      poll: 800,          
      aggregateTimeout: 300, 
    };
    return config;
  },
};

export default nextConfig;