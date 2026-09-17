import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 writes AGENTS.md / CLAUDE.md into the repo on dev start. Opted
  // out: those files were not asked for and CLAUDE.md would silently steer
  // future AI sessions.
  agentRules: false,

  images: {
    // Served in preference order. AVIF is roughly 20-30% smaller than WebP at
    // the same quality, and every browser that lacks it falls through.
    formats: ["image/avif", "image/webp"],
    // All photography is local now; kept in case an image is ever pulled
    // straight from the Poggenpohl press library again.
    remotePatterns: [{ protocol: "https", hostname: "www.poggenpohl.com" }],
  },
};

export default nextConfig;
