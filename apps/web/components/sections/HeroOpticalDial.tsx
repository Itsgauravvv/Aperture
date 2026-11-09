"use client";

import React, { useState } from "react";
import { Lens, SimulationType } from "lens-a11y";

interface CalibrationSpec {
  id: SimulationType;
  label: string;
  fStop: string;
  apertureRadius: number;
  lCone: number; // Red sensitivity %
  mCone: number; // Green sensitivity %
  sCone: number; // Blue sensitivity %
  acuity: number; // Sharpness %
}

const SPECS: CalibrationSpec[] = [
  {
    id: "deuteranopia",
    label: "Deuteranopia",
    fStop: "f/1.8",
    apertureRadius: 28,
    lCone: 100,
    mCone: 0,
    sCone: 100,
    acuity: 100,
  },
  {
    id: "protanopia",
    label: "Protanopia",
    fStop: "f/2.0",
    apertureRadius: 24,
    lCone: 0,
    mCone: 100,
    sCone: 100,
    acuity: 100,
  },
  {
    id: "cataracts",
    label: "Cataracts",
    fStop: "f/5.6",
    apertureRadius: 15,
    lCone: 78,
    mCone: 72,
    sCone: 45,
    acuity: 38,
  },
  {
    id: "glaucoma",
    label: "Glaucoma",
    fStop: "f/11",
    apertureRadius: 10,
    lCone: 90,
    mCone: 90,
    sCone: 85,
    acuity: 25,
  },
];

export function HeroOpticalDial() {
  const [active, setActive] = useState<CalibrationSpec>(SPECS[0]!);
  const [copied, setCopied] = useState(false);

  const handleApplyToPage = (spec: CalibrationSpec) => {
    setActive(spec);
    Lens.mount({ position: "bottom-right" });
    Lens.simulate(spec.id);
  };

  const handleCopyCdn = async () => {
    await navigator.clipboard.writeText(
      `<script src="https://cdn.jsdelivr.net/npm/lens-a11y@0.1/dist/lens.min.js" data-lens="${active.id}"></script>`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside
      aria-label="Interactive Optical Cone & Aperture Telemetry"
      className="optical-card flex flex-col justify-between p-5 sm:p-6"
    >
      {/* Top Instrument Header */}
      <div>
        <div
          style={{ fontFamily: "var(--font-mono)" }}
          className="flex items-center justify-between border-b pb-3 text-[11px] uppercase tracking-wider text-[var(--muted)]"
        >
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            RETINAL SPECTROMETER
          </span>
          <span>APERTURE // {active.fStop}</span>
        </div>

        {/* Center Interactive SVG Mechanical Iris + Cone Telemetry */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-12 items-center">
          {/* Mechanical Iris Graphic */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full border bg-[var(--bg)]">
              <svg
                viewBox="0 0 120 120"
                className="h-full w-full"
                aria-hidden="true"
              >
                {/* Outer Degree Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.2"
                  strokeWidth="1"
                  strokeDasharray="2 4"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="44"
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.35"
                  strokeWidth="1"
                />
                {/* 8 Mechanical Aperture Blades */}
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * 45 * Math.PI) / 180;
                  const x1 = 60 + Math.cos(angle) * 44;
                  const y1 = 60 + Math.sin(angle) * 44;
                  const x2 = 60 + Math.cos(angle + 0.55) * active.apertureRadius;
                  const y2 = 60 + Math.sin(angle + 0.55) * active.apertureRadius;
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="currentColor"
                      strokeOpacity="0.55"
                      strokeWidth="1.25"
                    />
                  );
                })}
                {/* Dynamic Iris Opening */}
                <circle
                  cx="60"
                  cy="60"
                  r={active.apertureRadius}
                  fill="var(--accent)"
                  fillOpacity="0.16"
                  stroke="var(--accent)"
                  strokeWidth="1.75"
                  style={{ transition: "all 320ms cubic-bezier(0.22,1,0.36,1)" }}
                />
                <circle cx="60" cy="60" r="3" fill="var(--accent)" />
              </svg>

              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="absolute bottom-2 rounded bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--accent)] border"
              >
                {active.fStop}
              </span>
            </div>
          </div>

          {/* Live Photoreceptor Sensitivity Bars */}
          <div
            style={{ fontFamily: "var(--font-mono)" }}
            className="sm:col-span-7 space-y-3 text-xs"
          >
            {[
              { label: "L-CONE (RED 560nm)", val: active.lCone, color: "#f43f5e" },
              { label: "M-CONE (GRN 530nm)", val: active.mCone, color: "#10b981" },
              { label: "S-CONE (BLU 420nm)", val: active.sCone, color: "#38bdf8" },
              { label: "VISUAL ACUITY", val: active.acuity, color: "var(--accent)" },
            ].map((bar) => (
              <div key={bar.label}>
                <div className="flex justify-between text-[10px] text-[var(--muted)]">
                  <span>{bar.label}</span>
                  <span className="font-bold text-[var(--ink)]">{bar.val}%</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[var(--bg)] border">
                  <div
                    style={{
                      width: `${bar.val}%`,
                      backgroundColor: bar.color,
                      transition: "width 300ms ease",
                    }}
                    className="h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Mode Selector Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          {SPECS.map((spec) => {
            const isSelected = active.id === spec.id;
            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => handleApplyToPage(spec)}
                aria-pressed={isSelected}
                style={{
                  fontFamily: "var(--font-mono)",
                  backgroundColor: isSelected ? "var(--accent)" : "var(--bg)",
                  color: isSelected ? "var(--accent-ink)" : "var(--ink)",
                }}
                className="min-h-[44px] cursor-pointer rounded-lg border px-3 text-left text-[11px] font-semibold uppercase tracking-wider transition-colors hover:border-[var(--accent)] flex items-center justify-between"
              >
                <span>{spec.label}</span>
                <span className="opacity-75">{spec.fStop}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom One-Click CDN Snippet Bar */}
      <div className="mt-5 border-t pt-4">
        <div
          style={{ fontFamily: "var(--font-mono)" }}
          className="flex items-center justify-between gap-2 rounded-lg border bg-[var(--bg)] px-3 py-2 text-[11px]"
        >
          <span className="truncate text-[var(--muted)]">
            &lt;script src=&quot;.../lens.min.js&quot; data-lens=&quot;{active.id}&quot;&gt;
          </span>
          <button
            type="button"
            onClick={handleCopyCdn}
            className="min-h-[44px] min-w-[64px] shrink-0 cursor-pointer rounded border bg-[var(--surface)] px-2.5 font-bold uppercase text-[var(--ink)] hover:border-[var(--accent)]"
          >
            {copied ? "COPIED ✓" : "COPY"}
          </button>
        </div>
      </div>
    </aside>
  );
}