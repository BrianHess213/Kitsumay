import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io/image",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
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
