import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Image de partage social par défaut (Open Graph / Twitter), régénérée par page si besoin via un `opengraph-image.tsx` local. */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#050b18",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: 32,
            background: "rgba(255,255,255,0.1)",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d9b94a"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v18" />
            <path d="m19 8 3 8a5 5 0 0 1-6 0zV7" />
            <path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1" />
            <path d="m5 8 3 8a5 5 0 0 1-6 0zV7" />
            <path d="M7 21h10" />
          </svg>
        </div>
        <span style={{ fontSize: 36, fontWeight: 700 }}>{siteConfig.name}</span>
      </div>
      <span
        style={{
          marginTop: 48,
          fontSize: 52,
          fontWeight: 700,
          lineHeight: 1.15,
          maxWidth: 900,
        }}
      >
        {siteConfig.tagline}
      </span>
      <span
        style={{
          marginTop: 24,
          fontSize: 24,
          color: "#9aa2b1",
          maxWidth: 820,
        }}
      >
        {siteConfig.description}
      </span>
    </div>,
    { ...size },
  );
}
