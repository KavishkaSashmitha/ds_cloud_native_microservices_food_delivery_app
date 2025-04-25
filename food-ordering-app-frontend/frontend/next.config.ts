import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/create-payment-intent',
        destination: 'http://localhost:5000/create-payment-intent', // Proxy to backend
      },
    ];
  },
};

export default nextConfig;
