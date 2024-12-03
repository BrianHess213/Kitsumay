import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tenor.com",
      },
      {
        protocol: "https",
        hostname: "media1.tenor.com",
      },
      
    ],
  },

  reactStrictMode: false,

};

export default nextConfig;
