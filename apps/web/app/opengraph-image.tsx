import { ImageResponse } from "next/og";

export const alt =
  "Aperture (lens-a11y) — See your website the way everyone else does.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0b0b0e",
          color: "#f2f2f5",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.16)",
            paddingBottom: "24px",
            fontSize: "20px",
            letterSpacing: "0.14em",
            color: "#a0a0ad",
          }}
        >
          <span>00 // APERTURE (LENS-A11Y)</span>
          <span>ZERO-DEPENDENCY // &lt;15KB GZIP // WCAG 2.1 AUDITOR</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "76px",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
            }}
          >
            See your website the way{" "}
            <span style={{ color: "#9aa5ff", fontStyle: "italic" }}>
              everyone
            </span>{" "}
            else does.
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#a0a0ad",
              maxWidth: "900px",
              lineHeight: 1.4,
            }}
          >
            Simulate color blindness, cataracts, glaucoma, dyslexia, and motor
            tremors—plus run live WCAG DOM audits in one line of code.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.16)",
            paddingTop: "24px",
            fontSize: "20px",
            color: "#9aa5ff",
          }}
        >
          <span>npm install lens-a11y</span>
          <span>PROTANOPIA • DEUTERANOPIA • CATARACTS • GLAUCOMA • AUDITOR</span>
        </div>
      </div>
    ),
    { ...size }
  );
}