import { ImageResponse } from "next/og";

export const alt = "teuteuteu.com — Appuie sur le bouton";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
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
        <div style={{ color: "#39a1ff", fontFamily: "sans-serif", fontSize: 46, marginBottom: 38 }}>
          Appuie sur le bouton
        </div>
        <div
          style={{
            background: "radial-gradient(circle at 35% 22%, #4b82e9, #073c98 49%, #021856 76%)",
            border: "7px solid #00164f",
            borderRadius: "50%",
            boxShadow: "0 20px 0 #00154d, 0 28px 24px rgba(0, 25, 89, .4), inset 0 6px 5px rgba(255,255,255,.45)",
            display: "flex",
            height: 210,
            width: 210,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
