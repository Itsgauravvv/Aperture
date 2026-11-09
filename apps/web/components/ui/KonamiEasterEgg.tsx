"use client";

import React, { useEffect, useState } from "react";
import { usePreferences } from "../layout/ThemeProvider";

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function KonamiEasterEgg() {
  const [active, setActive] = useState(false);
  const { reduceMotion } = usePreferences();

  useEffect(() => {
    let index = 0;

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expected = KONAMI_SEQUENCE[index];

      if (key === expected) {
        index += 1;
        if (index === KONAMI_SEQUENCE.length) {
          setActive((prev) => !prev);
          index = 0;
        }
      } else {
        index = 0;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!active) return null;

  return (
    <div
      data-lens-ignore="true"
      className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center p-6"
    >
      {/* Full-Viewport Chromatic Dispersion Ring */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-4 rounded-3xl opacity-80"
        style={{
          background:
            "conic-gradient(from 0deg, #06b6d4, #8b5cf6, #ec4899, #f59e0b, #10b981, #06b6d4)",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 4px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 4px))",
          animation: reduceMotion ? "none" : "spin 12s linear infinite",
        }}
      />

      {/* Telemetry Banner */}
      <div
        role="status"
        aria-live="polite"
        style={{ fontFamily: "var(--font-mono)" }}
        className="pointer-events-auto flex items-center gap-4 rounded-xl border bg-[var(--surface)] px-4 py-2.5 text-xs shadow-xl"
      >
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-fuchsia-500" />
        <span> PRISM OVERDRIVE // FULL-SPECTRUM DISPERSION ACTIVE</span>
        <button
          type="button"
          onClick={() => setActive(false)}
          className="min-h-[44px] cursor-pointer rounded-lg border px-3 text-xs font-bold uppercase hover:border-[var(--accent)]"
        >
          Disable [ESC]
        </button>
      </div>
    </div>
  );
}