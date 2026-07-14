import { ImageResponse } from "next/og";

import { historyMessagesFor } from "@/lib/history-i18n";
import { historyStoryMessagesFor } from "@/lib/history-story-i18n";
import { messagesFor, supportedLocale } from "@/lib/i18n";

export const runtime = "nodejs";

export function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const locale = supportedLocale(searchParams.get("lang")) ?? "en";
  const messages = messagesFor(locale);
  const historyMode = searchParams.get("page") === "history";

  if (historyMode) {
    const history = historyMessagesFor(locale);
    const story = historyStoryMessagesFor(locale);
    return new ImageResponse(
      <div
        style={{
          alignItems: "stretch",
          background: "#fdfefe",
          color: "#121923",
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
          height: "100%",
          padding: "54px 62px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: "#063b9e",
            color: "white",
            display: "flex",
            fontSize: 22,
            fontWeight: 700,
            height: 42,
            justifyContent: "space-between",
            padding: "0 14px",
          }}
        >
          <span>teuteuteu.com</span>
          <span>2005 → 2026</span>
        </div>
        <div
          style={{
            border: "3px solid #b9c1c8",
            borderTop: "0",
            display: "flex",
            flex: 1,
            padding: "46px 48px",
          }}
        >
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              paddingRight: 46,
            }}
          >
            <div
              style={{
                color: "#168dea",
                display: "flex",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 2,
                marginBottom: 20,
                textTransform: "uppercase",
              }}
            >
              {history.link} · 2005–2026
            </div>
            <div
              style={{
                color: "#05296f",
                display: "flex",
                fontSize: 58,
                fontWeight: 800,
                letterSpacing: -3,
                lineHeight: 1.02,
                marginBottom: 24,
              }}
            >
              {story.title}
            </div>
            <div style={{ display: "flex", fontSize: 25, lineHeight: 1.35 }}>
              {story.intro}
            </div>
          </div>
          <div
            style={{
              alignItems: "center",
              background: "#eef7ff",
              display: "flex",
              justifyContent: "center",
              width: 320,
            }}
          >
            <div
              style={{
                background:
                  "radial-gradient(circle at 35% 22%, #4b82e9, #073c98 49%, #021856 76%)",
                border: "7px solid #00164f",
                borderRadius: "50%",
                boxShadow:
                  "0 20px 0 #00154d, 0 28px 24px rgba(0, 25, 89, .35), inset 0 6px 5px rgba(255,255,255,.45)",
                display: "flex",
                height: 180,
                width: 180,
              }}
            />
          </div>
        </div>
      </div>,
      {
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=3600",
          "Vercel-CDN-Cache-Control": "public, max-age=86400",
        },
        width: 1200,
      },
    );
  }

  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "white",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          color: "#39a1ff",
          fontFamily: "sans-serif",
          fontSize: 46,
          marginBottom: 38,
        }}
      >
        {messages.instruction}
      </div>
      <div
        style={{
          background:
            "radial-gradient(circle at 35% 22%, #4b82e9, #073c98 49%, #021856 76%)",
          border: "7px solid #00164f",
          borderRadius: "50%",
          boxShadow:
            "0 20px 0 #00154d, 0 28px 24px rgba(0, 25, 89, .4), inset 0 6px 5px rgba(255,255,255,.45)",
          display: "flex",
          height: 210,
          width: 210,
        }}
      />
    </div>,
    {
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Vercel-CDN-Cache-Control": "public, max-age=86400",
      },
      width: 1200,
    },
  );
}
