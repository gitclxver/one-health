import type { NextConfig } from "next";

const apiUrl = process.env.API_URL ?? "http://127.0.0.1:3001";

function cdnRemotePattern() {
  const cdn = process.env.NEXT_PUBLIC_CDN_URL;
  if (!cdn) return null;
  try {
    const { protocol, hostname } = new URL(cdn);
    return {
      protocol: protocol.replace(":", "") as "http" | "https",
      hostname,
    };
  } catch {
    return null;
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
      ...(cdnRemotePattern() ? [cdnRemotePattern()!] : []),
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
