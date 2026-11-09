import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0b0e",
          borderRadius: "8px",
          border: "1.5px solid rgba(255,255,255,0.22)",
        }}
      >
        <div
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "999px",
            border: "2px solid #9aa5ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "999px",
              background: "#9aa5ff",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}