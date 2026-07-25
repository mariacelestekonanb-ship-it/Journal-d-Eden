import { ImageResponse } from "next/og";

import { questions } from "@/data/questions";
import { getQuestionBySlug } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return questions.map((question) => ({ slug: question.slug }));
}

/** Image de partage dédiée à chaque fiche : reprend l'identité visuelle du site avec la question en avant. */
export default async function FicheOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const question = getQuestionBySlug(slug);

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
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            borderRadius: 28,
            background: "rgba(255,255,255,0.1)",
          }}
        >
          <svg
            width="28"
            height="28"
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
        <span style={{ fontSize: 28, fontWeight: 700 }}>
          {siteConfig.name} — Comprendre
        </span>
      </div>

      <span
        style={{
          marginTop: 48,
          fontSize: 48,
          fontWeight: 700,
          lineHeight: 1.2,
          maxWidth: 980,
        }}
      >
        {question?.question ?? "Fiche introuvable"}
      </span>

      {question ? (
        <span style={{ marginTop: 24, fontSize: 22, color: "#9aa2b1" }}>
          {question.niveau} · {question.tempsLecture} min de lecture
        </span>
      ) : null}
    </div>,
    { ...size },
  );
}
