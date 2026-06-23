import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The QR target is /findotti — the root just forwards there.
      { source: "/", destination: "/findotti", permanent: false },
    ];
  },
};

export default nextConfig;
