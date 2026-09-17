import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 writes AGENTS.md / CLAUDE.md into the repo on dev start. Opted
  // out: those files were not asked for and CLAUDE.md would silently steer
  // future AI sessions.
  agentRules: false,

  // Poggenpohl imagery is hotlinked. Listed so next/image could be adopted
  // later; plain <img> tags do not require this, but it costs nothing.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.poggenpohl.com" },
    ],
  },
};

export default nextConfig;
