"use client";

import React, { useState } from "react";

const STOPS = [
  { id: 1, label: "1. Skip Link", x: 12, y: 28 },
  { id: 2, label: "2. Search Input", x: 34, y: 70 },
  { id: 3, label: "3. Filter Menu", x: 54, y: 28 },
  { id: 4, label: "4. Sort Toggle", x: 74, y: 70 },
  { id: 5, label: "5. Submit Action", x: 90, y: 35 },
];

export function KeyboardPathDemo() {
  const [activeStop, setActiveStop] = useState(3);

  const visiblePoints = STOPS.slice(0, activeStop)
    .map((s) => `${s.x},${s.y}`)
    .join(" ");

  return (
    <div>
      <div
        style={{ fontFamily: "var(--font-mono)" }}
        className="mb-3 text-xs uppercase tracking-[0.14em] text-[var(--muted)]"
      >
        04 / KEYBOARD TAB-ORDER TOPOLOGY
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2
          id="keyboard-demo-heading"
          className="text-2xl sm:text-4xl font-bold tracking-[-0.04em]"
        >
          Visualize every focus stop in{" "}
          <span
            style={{ fontFamily: "var(--font-serif)", color: "var(--accent)" }}
            className="font-normal italic tracking-normal"
          >
            sequence
          </span>
        </h2>

        <button
          type="button"
          onClick={() => setActiveStop((prev) => (prev % STOPS.length) + 1)}
          style={{ fontFamily: "var(--font-mono)" }}
          className="min-h-[44px] cursor-pointer rounded-lg border px-4 text-xs uppercase tracking-wider hover:border-[var(--accent)]"
        >
          Step Focus Path ({activeStop} / {STOPS.length}) →
        </button>
      </div>

      <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
        Press <kbd className="rounded border px-1.5 py-0.5 font-mono text-xs">Tab</kbd>{" "}
        across the controls below (or click any stop) to watch the focus vector
        trace the keyboard navigation order.
      </p>

      {/* Interactive SVG Focus Topology Canvas */}
      <div className="relative mt-6 h-56 overflow-hidden rounded-xl border bg-[var(--surface)] p-4">
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <polyline
            fill="none"
            stroke="var(--accent)"
            strokeWidth="0.8"
            strokeDasharray="2 1.5"
            points={visiblePoints}
          />
        </svg>

        {STOPS.map((stop) => {
          const reached = stop.id <= activeStop;
          return (
            <button
              key={stop.id}
              type="button"
              onFocus={() => setActiveStop(stop.id)}
              onClick={() => setActiveStop(stop.id)}
              style={{
                left: `${stop.x}%`,
                top: `${stop.y}%`,
                transform: "translate(-50%, -50%)",
                fontFamily: "var(--font-mono)",
                backgroundColor: reached ? "var(--accent)" : "var(--bg)",
                color: reached ? "var(--accent-ink)" : "var(--ink)",
              }}
              className="absolute z-10 flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold shadow-sm transition-colors"
            >
              <span>{stop.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}