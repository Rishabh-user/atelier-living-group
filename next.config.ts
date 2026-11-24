import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /gallery is now /media.
  async redirects() {
    return [
      { source: "/gallery", destination: "/media", permanent: true },
    ];
  },

  // Do not advertise the framework in a response header.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Next 16 writes AGENTS.md / CLAUDE.md into the repo on dev start. Opted
  // out: those files were not asked for and CLAUDE.md would silently steer
  // future AI sessions.
  agentRules: false,

  images: {
    // Served in preference order. AVIF is roughly 20-30% smaller than WebP at
    // the same quality, and every browser that lacks it falls through.
    formats: ["image/avif", "image/webp"],
    // Blog images uploaded in /admin are stored in Vercel Blob.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
