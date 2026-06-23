import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * GET /api/og?type=founder&pos=279   → "I'm Founder #0279 — find Otti" card
 * GET /api/og?type=university&name=BRAC&count=278 → "BRAC takes the lead" card
 * Premium share images (next/og / Satori). Referenced from per-page metadata.
 * Note: every box uses display:flex + an explicit column container (Satori rule).
 */
const col: React.CSSProperties = {
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "#f5f7fc",
  fontFamily: "monospace",
  textAlign: "center",
};

export function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const type = sp.get("type") ?? "founder";

  if (type === "university") {
    const name = (sp.get("name") ?? "BRAC").slice(0, 16);
    const count = sp.get("count") ?? "278";
    return new ImageResponse(
      (
        <div
          style={{
            ...col,
            background:
              "radial-gradient(60% 60% at 50% 20%, #4a2d8f 0%, #070611 60%), #070611",
          }}
        >
          <div style={{ display: "flex", fontSize: 30, letterSpacing: 6, color: "#ffb347" }}>
            🔥 THE UNIVERSITY RACE
          </div>
          <div style={{ display: "flex", fontSize: 120, fontWeight: 800, letterSpacing: -2, marginTop: 16 }}>
            {name}
          </div>
          <div style={{ display: "flex", fontSize: 40, color: "#34f5e4", marginTop: 8 }}>
            takes the lead · {count} explorers
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#b2bacb", marginTop: 40 }}>
            Can your campus catch up? · find Otti
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const pos = (sp.get("pos") ?? "279").replace(/\D/g, "").slice(0, 4) || "279";
  return new ImageResponse(
    (
      <div
        style={{
          ...col,
          background:
            "radial-gradient(60% 60% at 50% 25%, #123a6b 0%, #06070d 60%), #06070d",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 8, color: "#ffb347" }}>
          A FOUNDING EXPLORER
        </div>
        <div style={{ display: "flex", fontSize: 60, fontWeight: 700, marginTop: 20 }}>
          I&apos;m Founder
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 170,
            fontWeight: 800,
            letterSpacing: -4,
            lineHeight: 1,
            marginTop: 4,
            background: "linear-gradient(90deg, #ffb347, #ff7a45)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          #{pos.padStart(4, "0")}
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#b2bacb", marginTop: 30 }}>
          Only 1000 spots ever · find Otti · 08.05.2026
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
