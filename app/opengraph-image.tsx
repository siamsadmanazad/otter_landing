import { ImageResponse } from "next/og";

export const alt = "You found a clue. Otti is searching.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default share card for the campaign — the mystery hook. Rendered with next/og
 * (Satori), so it stays gradient + text (no heavy image fetch) for reliability.
 */
export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(60% 60% at 50% 30%, #123a6b 0%, #06070d 60%), #06070d",
          color: "#f5f7fc",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 8,
            color: "#34f5e4",
            marginBottom: 28,
          }}
        >
          // SIGNAL DETECTED
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: -2,
          }}
        >
          YOU FOUND
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: -2,
            background: "linear-gradient(90deg, #0099db, #34f5e4)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          A CLUE.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#b2bacb",
            marginTop: 36,
          }}
        >
          Otti isn&apos;t lost. He&apos;s searching.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 20,
            letterSpacing: 6,
            color: "#717a90",
            marginTop: 44,
          }}
        >
          SOMETHING IS COMING · 08.05.2026
        </div>
      </div>
    ),
    { ...size }
  );
}
