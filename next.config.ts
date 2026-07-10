import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  async headers() {
    const securityHeaders = [
      { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" },
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
    ];
    const immutableHeaders = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];
    return [
      { source: "/:path*", headers: securityHeaders },
      ...["/teuteuteu.mp3", "/button-up.png", "/button-down.png", "/icon.svg"].map((source) => ({
        source,
        headers: immutableHeaders,
      })),
    ];
  },
};

export default nextConfig;
