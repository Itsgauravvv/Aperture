"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePreferences } from "../layout/ThemeProvider";

const KONAMI_CODE = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
].join(",");

type Stage = "idle" | "dissolving-page" | "fading-in-darkroom" | "active" | "restoring";

interface DarkroomNode {
  id: string;
  label: string;
  srAnnouncement: string;
  speechText: string;
  isTarget?: boolean;
}

const DARKROOM_NODES: DarkroomNode[] = [
  {
    id: "node-1",
    label: "Decorative Banner",
    srAnnouncement: 'IMAGE [aria-hidden="true"] — Ignored graphic.',
    speechText: "Image, decorative banner, aria hidden true. Ignored.",
  },
  {
    id: "node-2",
    label: "Unlabeled Icon Button",
    srAnnouncement:
      'BUTTON [Missing aria-label!] — Screen reader only says "button". Dead end.',
    speechText: "Button. This is a dead end.",
  },
  {
    id: "node-3",
    label: "Unlabeled Promo Input",
    srAnnouncement:
      'EDIT TEXT [Missing <label>] — Placeholder vanished. Context lost.',
    speechText: "Placeholder vanished. Context lost.",
  },
  {
    id: "node-4",
    label: "Confirm Accessible Deploy",
    srAnnouncement:
      'BUTTON [aria-label="Confirm Accessible Deploy"] — Target found! Press Enter.',
    speechText:
      "Button, Confirm Accessible Deploy! Target located. Press Enter to activate.",
    isTarget: true,
  },
  {
    id: "node-5",
    label: "Footer Privacy Link",
    srAnnouncement: 'LINK [role="link"] — Secondary navigation.',
    speechText: "Link, Footer Privacy Policy.",
  },
];

export function KonamiEasterEgg() {
  const [stage, setStage] = useState<Stage>("idle");
  const [focusedNode, setFocusedNode] = useState<DarkroomNode | null>(null);
  const [solved, setSolved] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const firstNodeRef = useRef<HTMLButtonElement>(null);
  const { reduceMotion } = usePreferences();

  // Helper to speak text aloud using browser's native Web Speech API
  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (!voiceEnabled) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.08;
    utterance.pitch = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const startSequence = () => {
    if (stage !== "idle") {
      exitSequence();
      return;
    }

    const mainEl = document.getElementById("main-content");
    const headerEl = document.querySelector("header");
    const rulerEl = document.querySelector("aside");

    // PHASE 1: Slowly fade & blur out the main website content (1.6 seconds)
    setStage("dissolving-page");

    const fadeDuration = reduceMotion ? "10ms" : "1600ms";
    [mainEl, headerEl, rulerEl].forEach((el) => {
      if (!el) return;
      const htmlEl = el as HTMLElement;
      htmlEl.style.transition = `opacity ${fadeDuration} cubic-bezier(0.4, 0, 0.2, 1), filter ${fadeDuration} cubic-bezier(0.4, 0, 0.2, 1), transform ${fadeDuration} ease`;
      htmlEl.style.opacity = "0";
      htmlEl.style.filter = "blur(20px)";
      htmlEl.style.transform = "scale(0.97)";
      htmlEl.style.pointerEvents = "none";
    });

    // PHASE 2: After main website vanishes, slowly fade in the Darkroom
    window.setTimeout(
      () => {
        setStage("fading-in-darkroom");
        speak(
          "Darkroom protocol initiated. Visual interface disabled. Press Tab to navigate with voice synthesis."
        );
        window.setTimeout(() => {
          setStage("active");
          firstNodeRef.current?.focus();
        }, 60);
      },
      reduceMotion ? 50 : 1550
    );
  };

  const exitSequence = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setStage("restoring");
    const mainEl = document.getElementById("main-content");
    const headerEl = document.querySelector("header");
    const rulerEl = document.querySelector("aside");

    const restoreDuration = reduceMotion ? "10ms" : "1000ms";
    [mainEl, headerEl, rulerEl].forEach((el) => {
      if (!el) return;
      const htmlEl = el as HTMLElement;
      htmlEl.style.transition = `opacity ${restoreDuration} ease, filter ${restoreDuration} ease, transform ${restoreDuration} ease`;
      htmlEl.style.opacity = "1";
      htmlEl.style.filter = "blur(0px)";
      htmlEl.style.transform = "scale(1)";
      htmlEl.style.pointerEvents = "";
    });

    window.setTimeout(
      () => {
        [mainEl, headerEl, rulerEl].forEach((el) => {
          if (!el) return;
          const htmlEl = el as HTMLElement;
          htmlEl.style.transition = "";
          htmlEl.style.opacity = "";
          htmlEl.style.filter = "";
          htmlEl.style.transform = "";
        });
        setSolved(false);
        setFocusedNode(null);
        setStage("idle");
      },
      reduceMotion ? 50 : 950
    );
  };

  useEffect(() => {
    const buffer: string[] = [];

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stage !== "idle") {
        exitSequence();
        return;
      }

      if (e.shiftKey && e.key.toLowerCase() === "p") {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA") {
          e.preventDefault();
          startSequence();
          return;
        }
      }

      buffer.push(e.key.toLowerCase());
      if (buffer.length > 10) buffer.shift();
      if (buffer.join(",") === KONAMI_CODE) {
        startSequence();
        buffer.length = 0;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  // During "idle" or "dissolving-page", render nothing so user watches the main webpage fade away!
  if (stage === "idle" || stage === "dissolving-page") {
    return null;
  }

  const isVisible = stage === "active";

  return (
    <div
      data-lens-ignore="true"
      role="dialog"
      aria-modal="true"
      aria-label="Darkroom Screen Reader Empathy Simulation"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: reduceMotion ? "none" : "opacity 1100ms ease-in-out",
      }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#050507] p-6 sm:p-12 text-[#f2f2f5]"
    >
      {/* Top Optical Telemetry Bar */}
      <div
        style={{ fontFamily: "var(--font-mono)" }}
        className="flex w-full max-w-4xl flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4 text-xs uppercase tracking-widest text-[#a0a0ad]"
      >
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#9aa5ff] animate-pulse" />
          <span>DARKROOM PROTOCOL // SPEECH SYNTHESIS ACTIVE</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const next = !voiceEnabled;
              setVoiceEnabled(next);
              if (!next && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
              }
            }}
            className="min-h-[44px] cursor-pointer rounded-lg border border-white/20 px-3.5 text-xs text-white hover:border-[#9aa5ff]"
          >
            {voiceEnabled ? "🔊 Voice: ON" : "🔇 Voice: MUTED"}
          </button>

          <button
            type="button"
            onClick={exitSequence}
            className="min-h-[44px] cursor-pointer rounded-lg border border-white/20 px-3.5 text-xs text-white hover:border-[#9aa5ff]"
          >
            Exit Darkroom [ESC]
          </button>
        </div>
      </div>

      {/* Center Interactive Empathy Stage */}
      <div className="my-auto flex w-full max-w-3xl flex-col items-center text-center">
        <div
          style={{ fontFamily: "var(--font-mono)" }}
          className="rounded-full border border-[#9aa5ff]/40 bg-[#9aa5ff]/10 px-3.5 py-1 text-xs uppercase tracking-widest text-[#9aa5ff]"
        >
          {solved
            ? "CALIBRATION VERIFIED // 100% EMPATHY"
            : "BLINDFOLD MODE // PRESS TAB TO LISTEN"}
        </div>

        <h2 className="mt-5 text-3xl sm:text-5xl font-bold tracking-[-0.04em] leading-tight">
          {solved ? (
            <>
              You found the signal in the{" "}
              <span
                style={{ fontFamily: "var(--font-serif)", color: "#9aa5ff" }}
                className="italic font-normal"
              >
                dark.
              </span>
            </>
          ) : (
            <>
              When the UI fades to black,{" "}
              <span
                style={{ fontFamily: "var(--font-serif)", color: "#9aa5ff" }}
                className="italic font-normal"
              >
                semantics
              </span>{" "}
              are all that remain.
            </>
          )}
        </h2>

        <p className="mt-4 max-w-xl text-sm sm:text-base text-[#a0a0ad]">
          {solved
            ? "Without semantic ARIA labels and logical tab order, blind users are trapped in silent DOM trees. That is why Aperture audits every node."
            : "The 5 UI controls below are hidden in darkness. Press Tab repeatedly to hear the Screen Reader inspect each node, and press Enter when you hear 'Confirm Accessible Deploy'."}
        </p>

        {/* Live Simulated Screen Reader Voice Output Box */}
        <div
          aria-live="polite"
          style={{ fontFamily: "var(--font-mono)" }}
          className="mt-8 w-full rounded-xl border border-white/15 bg-[#0b0b10] p-5 text-left"
        >
          <div className="text-[11px] uppercase tracking-wider text-[#a0a0ad]">
            VOICEOVER / WEB SPEECH API LIVE OUTPUT:
          </div>
          <div className="mt-2 text-sm sm:text-base font-semibold text-[#9aa5ff]">
            {focusedNode
              ? `🔊 ${focusedNode.srAnnouncement}`
              : "🔊 Press Tab now to hear the screen reader announce the first hidden DOM node..."}
          </div>
        </div>

        {/* 5 Obscured DOM Nodes (Invisible in the dark until Tab-focused or Solved!) */}
        <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-5">
          {DARKROOM_NODES.map((node, i) => {
            const isFocused = focusedNode?.id === node.id;
            return (
              <button
                key={node.id}
                ref={i === 0 ? firstNodeRef : undefined}
                type="button"
                onFocus={() => {
                  setFocusedNode(node);
                  speak(node.speechText);
                }}
                onMouseEnter={() => {
                  setFocusedNode(node);
                  speak(node.speechText);
                }}
                onClick={() => {
                  setFocusedNode(node);
                  if (node.isTarget) {
                    setSolved(true);
                    speak(
                      "Calibration complete! Accessible deploy confirmed. Restoring visual interface."
                    );
                  } else {
                    speak("Incorrect node. Keep pressing Tab to locate Confirm Accessible Deploy.");
                  }
                }}
                style={{
                  fontFamily: "var(--font-mono)",
                  opacity: solved || isFocused ? 1 : 0.06,
                  filter: solved || isFocused ? "blur(0px)" : "blur(6px)",
                }}
                className={`min-h-[60px] cursor-pointer rounded-xl border p-3 text-xs transition-all duration-300 ${
                  solved && node.isTarget
                    ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                    : isFocused
                    ? "border-[#9aa5ff] bg-[#9aa5ff]/20 text-white"
                    : "border-white/10 bg-transparent text-transparent"
                }`}
              >
                {solved || isFocused ? node.label : `HIDDEN NODE 0${i + 1}`}
              </button>
            );
          })}
        </div>

        {solved && (
          <button
            type="button"
            onClick={exitSequence}
            style={{ fontFamily: "var(--font-mono)" }}
            className="mt-8 min-h-[44px] cursor-pointer rounded-xl bg-[#9aa5ff] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0b0b0e]"
          >
            Restore Visual DOM &amp; Exit →
          </button>
        )}
      </div>

      {/* Bottom Telemetry Footer */}
      <div
        style={{ fontFamily: "var(--font-mono)" }}
        className="w-full max-w-4xl border-t border-white/15 pt-4 flex justify-between text-[11px] text-[#a0a0ad]"
      >
        <span>SHORTCUT: SHIFT + P OR KONAMI CODE</span>
        <span>WEB SPEECH SYNTHESIS // SEMANTIC TREE INSPECTOR</span>
      </div>
    </div>
  );
}