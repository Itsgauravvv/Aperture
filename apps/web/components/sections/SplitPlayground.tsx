"use client";

import React, { useRef, useState } from "react";

interface SplitSimOption {
  id: string;
  label: string;
  getFilter: (intensity: number) => string;
}

const SPLIT_OPTIONS: SplitSimOption[] = [
  {
    id: "deuteranopia",
    label: "Deuteranopia",
    getFilter: () => "url(#showcase-deuteranopia)",
  },
  {
    id: "protanopia",
    label: "Protanopia",
    getFilter: () => "url(#showcase-protanopia)",
  },
  {
    id: "cataracts",
    label: "Cataracts",
    getFilter: (val) =>
      `blur(${(1 + (val / 100) * 4).toFixed(1)}px) sepia(${(
        0.25 +
        (val / 100) * 0.45
      ).toFixed(2)}) contrast(0.78)`,
  },
  {
    id: "low-vision",
    label: "Low Vision",
    getFilter: (val) => `blur(${(1.2 + (val / 100) * 5.5).toFixed(1)}px)`,
  },
  {
    id: "achromatopsia",
    label: "Achromatopsia",
    getFilter: () => "url(#showcase-achromatopsia)",
  },
];

function PricingMockCard({ badgeText }: { badgeText: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3 select-none">
      {[
        {
          tier: "STARTER",
          price: "$0",
          status: "Available",
          statusClass: "bg-emerald-600 text-white",
          btnClass: "border bg-[var(--surface)] text-[var(--ink)]",
          features: ["1,000 monthly checks", "Community support", "Basic SVG filters"],
        },
        {
          tier: "OPTICAL PRO",
          price: "$29",
          status: "Most Popular",
          statusClass: "bg-indigo-600 text-white",
          btnClass: "bg-indigo-600 text-white",
          features: ["Unlimited DOM audits", "CI/CD contrast gate", "Custom color matrices"],
        },
        {
          tier: "DEPRECATED TIER",
          price: "$99",
          status: "Quota Exceeded",
          statusClass: "bg-rose-600 text-white",
          btnClass: "bg-rose-600 text-white",
          features: ["Legacy API v0", "Red-only alert badges", "Requires manual patch"],
        },
      ].map((plan) => (
        <div
          key={plan.tier}
          className="flex flex-col justify-between rounded-xl border bg-[var(--bg)] p-5"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs font-semibold tracking-wider text-[var(--muted)]"
              >
                {plan.tier}
              </span>
              <span
                className={`rounded px-2 py-0.5 text-[11px] font-semibold ${plan.statusClass}`}
              >
                {plan.status}
              </span>
            </div>
            <div className="mt-3 text-3xl font-bold tracking-[-0.03em]">
              {plan.price}
              <span className="text-xs font-normal text-[var(--muted)]">
                /mo
              </span>
            </div>
            <ul className="mt-4 space-y-2 text-xs text-[var(--muted)]">
              {plan.features.map((f) => (
                <li key={f}>&bull; {f}</li>
              ))}
            </ul>
          </div>
          <div
            className={`mt-5 rounded-lg px-3 py-2 text-center text-xs font-semibold ${plan.btnClass}`}
          >
            {badgeText}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SplitPlayground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitPct, setSplitPct] = useState(50);
  const [selectedSim, setSelectedSim] = useState<SplitSimOption>(SPLIT_OPTIONS[0]!);
  const [intensity, setIntensity] = useState(65);
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplitPct(Math.max(5, Math.min(95, Math.round(pct))));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSplitPct((p) => Math.max(5, p - 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setSplitPct((p) => Math.min(95, p + 5));
    }
  };

  return (
    <div>
      <div
        style={{ fontFamily: "var(--font-mono)" }}
        className="mb-3 text-xs uppercase tracking-[0.14em] text-[var(--muted)]"
      >
        02 / BEFORE &amp; AFTER PLAYGROUND
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2
          id="playground-heading"
          className="text-2xl sm:text-4xl font-bold tracking-[-0.04em]"
        >
          Compare normal vs.{" "}
          <span
            style={{ fontFamily: "var(--font-serif)", color: "var(--accent)" }}
            className="font-normal italic tracking-normal"
          >
            simulated
          </span>{" "}
          optics
        </h2>

        {/* Intensity Slider */}
        <div className="flex items-center gap-3">
          <label
            htmlFor="split-intensity-slider"
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-xs uppercase text-[var(--muted)]"
          >
            Intensity ({intensity}%)
          </label>
          <input
            id="split-intensity-slider"
            type="range"
            min={15}
            max={100}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="min-h-[44px] w-32 accent-[var(--accent)] cursor-pointer"
          />
        </div>
      </div>

      {/* Simulation Filter Chips */}
      <div
        role="group"
        aria-label="Select simulation filter for split comparison"
        className="mt-6 flex flex-wrap gap-2"
      >
        {SPLIT_OPTIONS.map((opt) => {
          const active = selectedSim.id === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedSim(opt)}
              aria-pressed={active}
              style={{
                fontFamily: "var(--font-mono)",
                backgroundColor: active ? "var(--accent)" : "var(--surface)",
                color: active ? "var(--accent-ink)" : "var(--ink)",
              }}
              className="min-h-[44px] cursor-pointer rounded-lg border px-3.5 text-xs font-medium uppercase tracking-wider transition-colors"
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Split Comparison Viewport */}
      <div
        ref={containerRef}
        onPointerMove={(e) => {
          if (dragging) updateFromClientX(e.clientX);
        }}
        onPointerUp={() => setDragging(false)}
        onPointerLeave={() => setDragging(false)}
        className="relative mt-6 overflow-hidden rounded-xl border bg-[var(--surface)]"
      >
        {/* Left Layer: Normal Vision */}
        <div aria-label="Normal vision preview">
          <PricingMockCard badgeText="Normal Vision Layer" />
        </div>

        {/* Right Layer: Simulated Vision (Clipped from splitPct% to 100%) */}
        <div
          aria-hidden="true"
          style={{
            clipPath: `inset(0 0 0 ${splitPct}%)`,
            filter: selectedSim.getFilter(intensity),
          }}
          className="pointer-events-none absolute inset-0 bg-[var(--surface)]"
        >
          <PricingMockCard badgeText={`Simulated: ${selectedSim.label}`} />
        </div>

        {/* Draggable & Keyboard-Operable Split Handle */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Split comparison divider. Use Left and Right arrow keys to adjust."
          aria-valuemin={5}
          aria-valuemax={95}
          aria-valuenow={splitPct}
          onKeyDown={handleKeyDown}
          onPointerDown={(e) => {
            setDragging(true);
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          style={{ left: `${splitPct}%` }}
          className="absolute top-0 bottom-0 z-20 -ml-5 flex w-10 cursor-ew-resize items-center justify-center select-none"
        >
          <div className="h-full w-[2px] bg-[var(--accent)]" />
          <div
            style={{
              fontFamily: "var(--font-mono)",
              backgroundColor: "var(--accent)",
              color: "var(--accent-ink)",
            }}
            className="absolute flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--bg)] text-xs font-bold shadow-md"
          >
            ⇄
          </div>
        </div>
      </div>
    </div>
  );
}