import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone", // 用于 Docker，Vercel 部署时不需要

  async headers() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseHost = supabaseUrl ? new URL(supabaseUrl).host : "";
    const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

    const connectSrcParts = ["'self'", supabaseUrl, "https://*.supabase.co", "https://*.run.app"];
    if (backendUrl) connectSrcParts.push(backendUrl);
    const connectSrc = `connect-src ${connectSrcParts.filter(Boolean).join(" ")}`;

    const csp = [
      "default-src 'self'",
      connectSrc,
      `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
      `style-src 'self' 'unsafe-inline'`,
      `img-src 'self' data: blob:`,
      `font-src 'self'`,
      `frame-ancestors 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp,
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
