"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePreferences } from "../layout/ThemeProvider";

interface HeroSimPreset {
  id: string;
  name: string;
  hudReadout: string;
  filterCss: string;
}

const HERO_PRESETS: HeroSimPreset[] = [
  {
    id: "deuteranopia",
    name: "Deuteranopia",
    hudReadout: "DEUTERANOPIA / ISO 100 / f 1.8",
    filterCss: "url(#showcase-deuteranopia)",
  },
  {
    id: "protanopia",
    name: "Protanopia",
    hudReadout: "PROTANOPIA / ISO 200 / f 2.0",
    filterCss: "url(#showcase-protanopia)",
  },
  {
    id: "cataracts",
    name: "Cataracts",
    hudReadout: "CATARACTS / ISO 400 / f 2.8",
    filterCss: "blur(2.6px) sepia(0.48) contrast(0.76)",
  },
  {
    id: "tritanopia",
    name: "Tritanopia",
    hudReadout: "TRITANOPIA / ISO 160 / f 1.4",
    filterCss: "url(#showcase-tritanopia)",
  },
  {
    id: "achromatopsia",
    name: "Achromatopsia",
    hudReadout: "ACHROMATOPSIA / MONO / f 4.0",
    filterCss: "url(#showcase-achromatopsia)",
  },
];

function SampleInterfaceMock({ simulated }: { simulated: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-12 sm:p-7 select-none">
      <div className="sm:col-span-7 rounded-xl border bg-[var(--bg)] p-4">
        <div className="flex items-center justify-between">
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-xs uppercase tracking-wider text-[var(--muted)]"
          >
            SYSTEM TELEMETRY // CHROMATIC TEST
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            All Systems Nominal
          </span>
        </div>

        <div className="mt-4 text-xl font-bold tracking-[-0.02em]">
          Color-coded status alerts often fail without secondary cues
        </div>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Notice how red error states and green success badges merge into nearly
          identical olive tones under Deuteranopia and Protanopia.
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2.5 text-xs font-medium">
          <div className="rounded-lg bg-rose-600 p-2.5 text-white">
            <div>Critical Alert</div>
            <div className="mt-0.5 opacity-80 font-mono">#E11D48</div>
          </div>
          <div className="rounded-lg bg-emerald-600 p-2.5 text-white">
            <div>Passed Check</div>
            <div className="mt-0.5 opacity-80 font-mono">#059669</div>
          </div>
          <div className="rounded-lg bg-amber-500 p-2.5 text-slate-950">
            <div>Warning State</div>
            <div className="mt-0.5 opacity-80 font-mono">#F59E0B</div>
          </div>
        </div>
      </div>

      <div className="sm:col-span-5 flex flex-col justify-between rounded-xl border bg-[var(--bg)] p-4">
        <div>
          <div
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-xs uppercase text-[var(--muted)]"
          >
            OPTICAL CALIBRATION UNIT
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold">$0</span>
            <span className="text-xs text-[var(--muted)]">
              / forever open-source
            </span>
          </div>
          <ul className="mt-3 space-y-1.5 text-xs text-[var(--muted)]">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              10 SVG &amp; CSS clinical vision filters
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Live WCAG 2.1 contrast &amp; target scanner
            </li>
          </ul>
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs">
          <span className="font-mono text-[var(--muted)]">
            {simulated ? "SIMULATED LAYER" : "ORIGINAL DOM LAYER"}
          </span>
          <span className="rounded bg-indigo-600 px-2.5 py-1 font-medium text-white">
            Verify Contrast
          </span>
        </div>
      </div>
    </div>
  );
}

export function HeroLens() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { reduceMotion, resolvedTheme } = usePreferences();
  const [isClient, setIsClient] = useState(false);
  const [presetIdx, setPresetIdx] = useState(0);
  const [isPointerInside, setIsPointerInside] = useState(false);

  const targetPos = useRef({ x: 50, y: 50 });
  const currentPos = useRef({ x: 50, y: 50 });
  const [lensCoords, setLensCoords] = useState({ x: 50, y: 50 });

  const activePreset = HERO_PRESETS[presetIdx] ?? HERO_PRESETS[0]!;
  const lensRadiusPx = 125;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    let rafId: number;
    let startTime = performance.now();

    const animate = (now: number) => {
      if (reduceMotion) {
        currentPos.current = { ...targetPos.current };
        setLensCoords({ ...currentPos.current });
        return;
      }

      if (!isPointerInside) {
        const t = (now - startTime) * 0.0011;
        targetPos.current = {
          x: 50 + Math.sin(t * 1.3) * 26,
          y: 50 + Math.sin(t * 2.0) * 18,
        };
      }

      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.14;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.14;

      setLensCoords({
        x: Number(currentPos.current.x.toFixed(2)),
        y: Number(currentPos.current.y.toFixed(2)),
      });

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isClient, isPointerInside, reduceMotion]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(12, Math.min(88, ((e.clientY - rect.top) / rect.height) * 100));
    targetPos.current = { x: xPct, y: yPct };
    if (reduceMotion) {
      setLensCoords({ x: xPct, y: yPct });
    }
  };

  const cycleSimulation = () => {
    setPresetIdx((prev) => (prev + 1) % HERO_PRESETS.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = 6;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setIsPointerInside(true);
      targetPos.current.x = Math.max(10, targetPos.current.x - step);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setIsPointerInside(true);
      targetPos.current.x = Math.min(90, targetPos.current.x + step);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIsPointerInside(true);
      targetPos.current.y = Math.max(15, targetPos.current.y - step);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsPointerInside(true);
      targetPos.current.y = Math.min(85, targetPos.current.y + step);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      cycleSimulation();
    }
    if (reduceMotion) {
      setLensCoords({ ...targetPos.current });
    }
  };

  if (!isClient) {
    return (
      <div className="mt-12 rounded-xl border bg-[var(--surface)] p-6 min-h-[300px]" />
    );
  }

  return (
    <div className="mt-12">
      <div
        style={{ fontFamily: "var(--font-mono)" }}
        className="mb-2.5 flex flex-wrap items-center justify-between gap-2 text-xs"
      >
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)]" />
          <span aria-live="polite" className="font-semibold tracking-wider">
            {activePreset.hudReadout}
          </span>
        </div>
        <span className="text-[var(--muted)]">
          MOVE POINTER OR ARROW KEYS // CLICK OR PRESS ENTER TO CYCLE LENS ({presetIdx + 1}/
          {HERO_PRESETS.length})
        </span>
      </div>

      <div
        ref={containerRef}
        role="region"
        tabIndex={0}
        aria-label={`Interactive optical viewfinder currently simulating ${activePreset.name}. Press Enter to cycle simulations or use arrow keys to move the lens.`}
        onPointerEnter={() => setIsPointerInside(true)}
        onPointerLeave={() => setIsPointerInside(false)}
        onPointerMove={handlePointerMove}
        onClick={cycleSimulation}
        onKeyDown={handleKeyDown}
        className="relative overflow-hidden rounded-xl border bg-[var(--surface)] cursor-pointer"
      >
        <SampleInterfaceMock simulated={false} />

        <div
          aria-hidden="true"
          style={{
            clipPath: `circle(${lensRadiusPx}px at ${lensCoords.x}% ${lensCoords.y}%)`,
            filter: activePreset.filterCss,
          }}
          className="pointer-events-none absolute inset-0 bg-[var(--surface)]"
        >
          <SampleInterfaceMock simulated={true} />
        </div>

        <div
          aria-hidden="true"
          style={{
            left: `${lensCoords.x}%`,
            top: `${lensCoords.y}%`,
            width: `${lensRadiusPx * 2}px`,
            height: `${lensRadiusPx * 2}px`,
            transform: "translate(-50%, -50%)",
          }}
          className="pointer-events-none absolute z-10 rounded-full"
        >
          {resolvedTheme !== "contrast" && (
            <div
              className="absolute -inset-[2px] rounded-full opacity-75"
              style={{
                background:
                  "conic-gradient(from 0deg, #06b6d4, #8b5cf6, #ec4899, #f59e0b, #06b6d4)",
                WebkitMask:
                  "radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2px))",
              }}
            />
          )}

          <svg
            viewBox="0 0 250 250"
            className="h-full w-full overflow-visible"
          >
            <circle
              cx="125"
              cy="125"
              r="123"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="1.25"
              strokeOpacity="0.65"
            />
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x1 = 125 + Math.cos(angle) * 116;
              const y1 = 125 + Math.sin(angle) * 116;
              const x2 = 125 + Math.cos(angle) * 123;
              const y2 = 125 + Math.sin(angle) * 123;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="var(--ink)"
                  strokeWidth="1.5"
                />
              );
            })}
            <line
              x1="119"
              y1="125"
              x2="131"
              y2="125"
              stroke="var(--accent)"
              strokeWidth="1.25"
            />
            <line
              x1="125"
              y1="119"
              x2="125"
              y2="131"
              stroke="var(--accent)"
              strokeWidth="1.25"
            />
          </svg>

          <div
            style={{
              fontFamily: "var(--font-mono)",
              backgroundColor: "var(--ink)",
              color: "var(--bg)",
            }}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
          >
            {activePreset.name}
          </div>
        </div>
      </div>
    </div>
  );
}