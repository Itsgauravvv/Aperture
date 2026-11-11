"use client";

import React, { useEffect, useState } from "react";
import { usePreferences } from "../layout/ThemeProvider";

const BOOT_LOGS = [
  { threshold: 12, code: "OPT-01", text: "Loading Machado (2009) sRGB cone deficiency matrices..." },
  { threshold: 38, code: "OPT-02", text: "Calibrating crystalline lens blur & peripheral scotoma masks..." },
  { threshold: 66, code: "AUD-03", text: "Mounting alpha-blended WCAG 2.1 relative luminance scanner..." },
  { threshold: 90, code: "HUD-04", text: "Sealing hermetic Shadow-DOM viewfinder chassis [100/100]..." },
];

export function OpticalBootSequence() {
  const { reduceMotion } = usePreferences();
  const [phase, setPhase] = useState<"calibrating" | "holding" | "opening" | "done">("calibrating");
  const [progress, setProgress] = useState(0);

  const startBoot = () => {
    if (reduceMotion) {
      setPhase("done");
      return;
    }
    setProgress(0);
    setPhase("calibrating");
  };

  useEffect(() => {
    const alreadyBooted = sessionStorage.getItem("aperture-booted");
    if (alreadyBooted || reduceMotion) {
      setPhase("done");
    } else {
      sessionStorage.setItem("aperture-booted", "1");
      setPhase("calibrating");
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPhase("done");
      }
      // Press Shift + B anytime to replay the full calibration intro
      if (e.shiftKey && e.key.toLowerCase() === "b") {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA") {
          e.preventDefault();
          startBoot();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [reduceMotion]);

  useEffect(() => {
    if (phase !== "calibrating") return;

    const durationMs = 3400; // Deliberate 3.4s calibration sweep
    const startTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const rawT = Math.min(1, elapsed / durationMs);
      // Smooth cubic ease-in-out curve so the iris breathes naturally
      const easedT =
        rawT < 0.5 ? 4 * rawT * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

      const pct = Math.round(easedT * 100);
      setProgress(pct);

      if (rawT < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        // Hold at 100% for 550ms so the user can read the final locked state
        setPhase("holding");
        window.setTimeout(() => {
          setPhase("opening");
          window.setTimeout(() => {
            setPhase("done");
          }, 950);
        }, 550);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [phase]);

  if (phase === "done") return null;

  const fStop =
    progress < 25
      ? "f/16"
      : progress < 50
      ? "f/8.0"
      : progress < 75
      ? "f/4.0"
      : progress < 95
      ? "f/2.0"
      : "f/1.4";

  const diopterValue = ((1 - progress / 100) * -4.5).toFixed(2);
  const irisRadius = 9 + (progress / 100) * 37;
  const textBlurPx = Math.max(0, ((100 - progress) / 100) * 7).toFixed(1);

  return (
    <div
      data-lens-ignore="true"
      aria-hidden="true"
      style={{
        opacity: phase === "opening" ? 0 : 1,
        transform: phase === "opening" ? "scale(1.04)" : "scale(1)",
        filter: phase === "opening" ? "blur(12px)" : "blur(0px)",
        transition:
          "opacity 950ms cubic-bezier(0.22,1,0.36,1), transform 950ms cubic-bezier(0.22,1,0.36,1), filter 950ms ease",
        fontFamily: "var(--font-mono)",
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#060609] p-6 sm:p-10 text-[#f2f2f5] select-none overflow-hidden"
    >
      {/* Top Viewfinder Telemetry Bar */}
      <div className="flex w-full max-w-5xl items-center justify-between border-b border-white/10 pb-4 text-[11px] uppercase tracking-[0.18em] text-[#8e8ea0]">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-[#9aa5ff] animate-pulse" />
          <span>APERTURE // OPTICAL CALIBRATION SEQUENCE</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-[#9aa5ff]">
            DIOPTER: {diopterValue}D
          </span>
          <button
            type="button"
            onClick={() => setPhase("done")}
            className="min-h-[44px] cursor-pointer rounded-lg border border-white/15 bg-white/[0.03] px-3.5 text-[10px] font-bold tracking-wider text-white transition-colors hover:border-[#9aa5ff]"
          >
            SKIP CALIBRATION [ESC]
          </button>
        </div>
      </div>

      {/* Center Stage: Mechanical Iris + Engaging Narrative + Diagnostic Logs */}
      <div className="my-auto flex w-full max-w-3xl flex-col items-center text-center">
        {/* Mechanical SVG Camera Iris */}
        <div className="relative flex h-44 w-44 sm:h-52 sm:w-52 items-center justify-center">
          <svg viewBox="0 0 120 120" className="h-full w-full">
            {/* Outer Degree Scale */}
            <circle
              cx="60"
              cy="60"
              r="56"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.75"
              strokeDasharray="1.5 3.5"
            />
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="rgba(154,165,255,0.3)"
              strokeWidth="1"
            />
            {/* 12 Precision Iris Blades */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x1 = (60 + Math.cos(angle) * 48).toFixed(3);
              const y1 = (60 + Math.sin(angle) * 48).toFixed(3);
              const x2 = (60 + Math.cos(angle + 0.52) * irisRadius).toFixed(3);
              const y2 = (60 + Math.sin(angle + 0.52) * irisRadius).toFixed(3);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#9aa5ff"
                  strokeOpacity="0.55"
                  strokeWidth="1.15"
                />
              );
            })}
            {/* Expanding Optical Aperture */}
            <circle
              cx="60"
              cy="60"
              r={irisRadius}
              fill="rgba(154,165,255,0.10)"
              stroke="#9aa5ff"
              strokeWidth="1.75"
            />
            {/* Center Reticle Crosshair */}
            <line
              x1="55"
              y1="60"
              x2="65"
              y2="60"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="0.75"
            />
            <line
              x1="60"
              y1="55"
              x2="60"
              y2="65"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="0.75"
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {fStop}
            </span>
            <span className="mt-0.5 rounded bg-[#9aa5ff]/15 px-2 py-0.5 text-[10px] font-bold tracking-widest text-[#9aa5ff]">
              {progress}%
            </span>
          </div>
        </div>

        {/* Engaging 3-Act Editorial Narrative with Real-Time Diopter Focus Pull */}
        <div
          style={{
            fontFamily: "var(--font-sans)",
            filter: `blur(${textBlurPx}px)`,
            transition: "filter 120ms linear",
          }}
          className="mt-6 max-w-2xl px-2"
        >
          {progress < 36 ? (
            <p className="text-xl sm:text-3xl font-bold tracking-[-0.03em] text-white/90">
              2.2 billion people experience the web through a{" "}
              <span
                style={{ fontFamily: "var(--font-serif)", color: "#9aa5ff" }}
                className="italic font-normal"
              >
                different
              </span>{" "}
              lens.
            </p>
          ) : progress < 76 ? (
            <p className="text-xl sm:text-3xl font-bold tracking-[-0.03em] text-white/95">
              Yet 96% of interfaces are calibrated for a{" "}
              <span
                style={{ fontFamily: "var(--font-serif)", color: "#9aa5ff" }}
                className="italic font-normal"
              >
                single
              </span>{" "}
              pair of eyes.
            </p>
          ) : (
            <p className="text-xl sm:text-3xl font-bold tracking-[-0.03em] text-white">
              Optics locked. See your DOM the way{" "}
              <span
                style={{ fontFamily: "var(--font-serif)", color: "#9aa5ff" }}
                className="italic font-normal"
              >
                everyone
              </span>{" "}
              else does.
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-6 h-1 w-full max-w-md overflow-hidden rounded-full bg-white/10">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-[#9aa5ff] shadow-[0_0_12px_#9aa5ff]"
          />
        </div>

        {/* Live 4-Stage Subsystem Diagnostic Readout */}
        <div className="mt-6 w-full max-w-lg rounded-xl border border-white/10 bg-[#0b0b10] p-4 text-left space-y-2">
          {BOOT_LOGS.map((log) => {
            const done = progress >= log.threshold + 20 || progress === 100;
            const active = progress >= log.threshold && !done;
            return (
              <div
                key={log.code}
                style={{
                  opacity: progress >= log.threshold ? 1 : 0.25,
                }}
                className="flex items-center justify-between gap-3 text-[11px] transition-opacity duration-200"
              >
                <span className="truncate text-[#c4c4d0]">
                  <strong className="text-[#9aa5ff]">[{log.code}]</strong>{" "}
                  {log.text}
                </span>
                <span
                  className={`shrink-0 font-bold ${
                    done
                      ? "text-emerald-400"
                      : active
                      ? "text-amber-400"
                      : "text-[#6e6e80]"
                  }`}
                >
                  {done ? "[OK]" : active ? "[CALIBRATING]" : "[WAIT]"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Telemetry Strip */}
      <div className="flex w-full max-w-5xl items-center justify-between border-t border-white/10 pt-4 text-[11px] uppercase tracking-[0.16em] text-[#8e8ea0]">
        <span>LENS-A11Y // ZERO-DEPENDENCY ENGINE</span>
        <span>REPLAY ANYTIME: SHIFT + B</span>
      </div>
    </div>
  );
}