import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Prevent the site being framed by another site (clickjacking)
          { key: "X-Frame-Options", value: "DENY" },
          // Stop browsers guessing content types away from what's declared
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Don't leak full URLs (which could contain tokens) to third-party referrers
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disable browser features this site never uses
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Force HTTPS on every future visit (Vercel already serves over HTTPS only)
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
