"use client";

import React, { useState } from "react";
import { usePreferences } from "../layout/ThemeProvider";

interface DemoDefect {
  num: number;
  ruleId: string;
  title: string;
  why: string;
  fix: string;
}

const DEMO_DEFECTS: DemoDefect[] = [
  {
    num: 1,
    ruleId: "heading-order",
    title: "Skipped heading level (<h1> to <h4>)",
    why: "Screen reader users rely on sequential h1 → h2 → h3 hierarchy to build a mental map of the page.",
    fix: "Change <h4>Order Summary</h4> to <h2>Order Summary</h2>.",
  },
  {
    num: 2,
    ruleId: "color-contrast",
    title: "Low text contrast (1.92:1 < 4.5:1)",
    why: "Light grey text (#a8a8b3 on #f4f4f6) is unreadable for users with cataracts, low vision, or screen glare.",
    fix: "Use var(--muted) (#5b5b66) to achieve >= 6.3:1 WCAG AA contrast.",
  },
  {
    num: 3,
    ruleId: "input-label",
    title: "Promo input missing <label> or aria-label",
    why: "Placeholder text disappears as soon as the user types, leaving screen readers and voice control without a label.",
    fix: 'Add <label for="promo-input">Promo Code</label> above the input.',
  },
  {
    num: 4,
    ruleId: "target-size & button-name",
    title: "24×24px icon button with no accessible name",
    why: "Tiny <44px targets fail motor tremor users, and an unlabeled icon announces simply as 'button'.",
    fix: 'Add min-h-[44px] min-w-[44px] and aria-label="Apply promo code".',
  },
];

export function AuditDemo() {
  const { reduceMotion } = usePreferences();
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [displayScore, setDisplayScore] = useState(100);
  const [selectedDefect, setSelectedDefect] = useState<DemoDefect>(
    DEMO_DEFECTS[0]!
  );

  const runDemoScan = () => {
    setScanning(true);
    setScanned(false);

    if (reduceMotion) {
      setScanning(false);
      setScanned(true);
      setDisplayScore(62);
      setSelectedDefect(DEMO_DEFECTS[0]!);
      return;
    }

    let current = 100;
    const timer = window.setInterval(() => {
      current -= 2;
      setDisplayScore(Math.max(62, current));
      if (current <= 62) {
        window.clearInterval(timer);
        setScanning(false);
        setScanned(true);
        setSelectedDefect(DEMO_DEFECTS[0]!);
      }
    }, 28);
  };

  const renderCalloutBadge = (defect: DemoDefect) => {
    if (!scanned) return null;
    const isSelected = selectedDefect.num === defect.num;
    return (
      <div className="flex items-center gap-1.5 shrink-0 ml-3">
        {/* Thin Leader Line */}
        <span
          aria-hidden="true"
          className="hidden sm:inline-block h-[1.5px] w-5"
          style={{
            backgroundColor: isSelected ? "var(--accent)" : "#e11d48",
          }}
        />
        <button
          type="button"
          onClick={() => setSelectedDefect(defect)}
          aria-label={`Inspect issue ${defect.num}: ${defect.title}`}
          style={{
            fontFamily: "var(--font-mono)",
            backgroundColor: isSelected ? "var(--accent)" : "#e11d48",
            color: isSelected ? "var(--accent-ink)" : "#ffffff",
          }}
          className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full border-2 border-[var(--surface)] text-xs font-bold shadow-md transition-transform hover:scale-105"
        >
          #{defect.num}
        </button>
      </div>
    );
  };

  return (
    <div>
      <div
        style={{ fontFamily: "var(--font-mono)" }}
        className="mb-3 text-xs uppercase tracking-[0.14em] text-[var(--muted)]"
      >
        03 / AUTOMATED WCAG AUDITOR
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2
          id="audit-demo-heading"
          className="text-2xl sm:text-4xl font-bold tracking-[-0.04em]"
        >
          Pinpoint defects with{" "}
          <span
            style={{ fontFamily: "var(--font-serif)", color: "var(--accent)" }}
            className="font-normal italic tracking-normal"
          >
            surgical
          </span>{" "}
          annotations
        </h2>

        <button
          type="button"
          onClick={runDemoScan}
          style={{
            backgroundColor: "var(--accent)",
            color: "var(--accent-ink)",
          }}
          className="min-h-[44px] cursor-pointer rounded-[10px] px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
        >
          {scanning
            ? "Scanning DOM..."
            : scanned
            ? "Re-Run Audit Scan"
            : "Run Audit on Sample UI"}
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Deliberately Flawed Specimen UI */}
        <div
          data-lens-ignore="true"
          className="relative lg:col-span-7 overflow-hidden rounded-xl border bg-[var(--surface)] p-6"
        >
          {/* Animated Scanning Laser Line */}
          {scanning && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 z-20 h-1 bg-[var(--accent)] shadow-[0_0_16px_var(--accent)] animate-bounce"
              style={{ animationDuration: "850ms" }}
            />
          )}

          <div className="flex items-center justify-between border-b pb-3">
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-xs uppercase text-[var(--muted)]"
            >
              SPECIMEN // FLAWED CHECKOUT WIDGET
            </span>
            <span
              aria-live="polite"
              style={{ fontFamily: "var(--font-mono)" }}
              className="rounded border px-2 py-0.5 text-xs font-bold text-[var(--accent)]"
            >
              {scanned || scanning
                ? `SCORE: ${displayScore} / 100`
                : "STATUS: UNSCANNED"}
            </span>
          </div>

          {/* Specimen Mock Content — Each row gets a clean annotation box + right-aligned callout after scan */}
          <div className="mt-5 rounded-lg border bg-[var(--bg)] p-5 space-y-3.5">
            {/* Defect Row 1: Skipped Heading */}
            <div
              className={`flex items-center justify-between rounded-lg p-2.5 transition-colors ${
                scanned
                  ? "border border-dashed border-rose-500/70 bg-rose-500/5"
                  : ""
              }`}
            >
              <div className="text-lg font-bold">
                Order Summary{" "}
                
              </div>
              {renderCalloutBadge(DEMO_DEFECTS[0]!)}
            </div>

            {/* Defect Row 2: Low Contrast Text */}
            <div
              className={`flex items-center justify-between rounded-lg p-2.5 transition-colors ${
                scanned
                  ? "border border-dashed border-rose-500/70 bg-rose-500/5"
                  : ""
              }`}
            >
              <p className="text-sm opacity-55">
                Shipping taxes and customs duties are calculated at final step.
                (Low-contrast specimen text)
              </p>
              {renderCalloutBadge(DEMO_DEFECTS[1]!)}
            </div>

            {/* Defect Row 3: Unlabeled Input */}
            <div
              className={`flex items-center justify-between rounded-lg p-2.5 transition-colors ${
                scanned
                  ? "border border-dashed border-rose-500/70 bg-rose-500/5"
                  : ""
              }`}
            >
              <div className="w-full rounded border bg-[var(--surface)] px-3 py-2 text-xs text-[var(--muted)]">
                Enter promo code... (Unlabeled input specimen)
              </div>
              {renderCalloutBadge(DEMO_DEFECTS[2]!)}
            </div>

            {/* Defect Row 4: Tiny 24x24px Unlabeled Button */}
            <div
              className={`flex items-center justify-between rounded-lg p-2.5 transition-colors ${
                scanned
                  ? "border border-dashed border-rose-500/70 bg-rose-500/5"
                  : ""
              }`}
            >
              <div className="flex flex-1 items-center justify-between pr-2">
                <span className="text-sm font-semibold">Total: $49.00</span>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded border text-xs">
                  →
                </span>
              </div>
              {renderCalloutBadge(DEMO_DEFECTS[3]!)}
            </div>
          </div>
        </div>

        {/* Right: Inspector Readout Panel (Shows Standby until user clicks Run Audit!) */}
        <div className="optical-card lg:col-span-5 flex flex-col justify-between p-6">
          {!scanned ? (
            <div className="my-auto flex flex-col items-center justify-center py-12 text-center">
              <div
                style={{ fontFamily: "var(--font-mono)" }}
                className="rounded-full border px-3 py-1 text-xs uppercase tracking-widest text-[var(--muted)]"
              >
                {scanning ? "SCANNING DOM TREE..." : "AWAITING OPTICAL SCAN"}
              </div>
              <h3 className="mt-4 text-lg font-bold tracking-[-0.02em]">
                {scanning
                  ? `Evaluating WCAG 2.1 Rules (${displayScore}/100)`
                  : "No active annotations yet"}
              </h3>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-[var(--muted)]">
                Click <strong>&quot;Run Audit on Sample UI&quot;</strong> above
                to sweep the checkout specimen and reveal surgical callout
                annotations.
              </p>
              <button
                type="button"
                onClick={runDemoScan}
                style={{ fontFamily: "var(--font-mono)" }}
                className="mt-6 min-h-[44px] cursor-pointer rounded-lg border px-4 text-xs font-bold uppercase tracking-wider hover:border-[var(--accent)]"
              >
                ⚡ Start Sample Scan
              </button>
            </div>
          ) : (
            <>
              <div>
                <div
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="flex items-center justify-between text-xs text-[var(--muted)]"
                >
                  <span>ANNOTATION INSPECTOR</span>
                  <span>ISSUE #{selectedDefect.num} OF 4</span>
                </div>

                <div
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="mt-3 inline-block rounded border px-2 py-0.5 text-xs font-semibold text-[var(--accent)]"
                >
                  RULE: {selectedDefect.ruleId}
                </div>

                <h3 className="mt-2 text-lg font-bold tracking-[-0.02em]">
                  {selectedDefect.title}
                </h3>

                <div className="mt-4 space-y-3 text-xs leading-relaxed">
                  <div className="rounded-lg border bg-[var(--bg)] p-3">
                    <div
                      style={{ fontFamily: "var(--font-mono)" }}
                      className="text-[11px] uppercase text-[var(--muted)]"
                    >
                      WHY IT MATTERS
                    </div>
                    <p className="mt-1">{selectedDefect.why}</p>
                  </div>

                  <div className="rounded-lg border bg-[var(--bg)] p-3">
                    <div
                      style={{ fontFamily: "var(--font-mono)" }}
                      className="text-[11px] uppercase text-[var(--accent)]"
                    >
                      SUGGESTED FIX
                    </div>
                    <p className="mt-1 font-mono">{selectedDefect.fix}</p>
                  </div>
                </div>
              </div>

              {/* Issue Selector Buttons */}
              <div className="mt-5 grid grid-cols-4 gap-2">
                {DEMO_DEFECTS.map((d) => {
                  const active = selectedDefect.num === d.num;
                  return (
                    <button
                      key={d.num}
                      type="button"
                      onClick={() => setSelectedDefect(d)}
                      style={{
                        fontFamily: "var(--font-mono)",
                        backgroundColor: active ? "var(--accent)" : "var(--bg)",
                        color: active ? "var(--accent-ink)" : "var(--ink)",
                      }}
                      className="min-h-[44px] cursor-pointer rounded-lg border text-xs font-bold"
                    >
                      #{d.num}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}