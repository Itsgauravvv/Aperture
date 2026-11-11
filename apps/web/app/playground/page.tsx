"use client";

import React, { useRef, useState } from "react";
import {
  AuditReport,
  runDomAudit,
  SIMULATION_CATALOG,
  SimulationType,
} from "lens-a11y";
import { usePreferences } from "@/components/layout/ThemeProvider";

interface SandboxPreset {
  id: string;
  name: string;
  tag: string;
  flawedHtml: string;
  fixedHtml: string;
}

const SANDBOX_PRESETS: SandboxPreset[] = [
  {
    id: "fintech",
    name: "Fintech Terminal",
    tag: "CONTRAST & TARGETS",
    flawedHtml: `<div style="padding: 22px; font-family: system-ui, -apple-system, sans-serif; background: #0d0e12; color: #f2f2f5; border-radius: 12px; border: 1px solid #232530;">
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e2029; padding-bottom: 14px;">
    <div>
      <span style="font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.12em; color: #71717a;">LIQUIDITY POOL // USD-USDC</span>
      <h1 style="font-size: 24px; font-weight: 800; margin: 4px 0 0 0; letter-spacing: -0.03em;">$142,850.40</h1>
    </div>
    <span style="background: rgba(225, 29, 72, 0.15); color: #f43f5e; padding: 4px 10px; border-radius: 99px; font-size: 12px; font-weight: 700;">
      ▼ -4.28% (24H)
    </span>
  </div>

  <!-- BUG 1: Skipped heading level h1 -> h4 -->
  <h4 style="font-size: 13px; font-weight: 700; margin: 16px 0 6px 0; color: #e2e2e8;">
    Instant Wire Execution (Skipped h2/h3!)
  </h4>

  <!-- BUG 2: Low contrast text (#383942 on #0d0e12 = 1.65:1 ratio) -->
  <p style="color: #383942; background: #0d0e12; font-size: 12.5px; line-height: 1.5; margin: 0;">
    Institutional settlement fee of 0.15% applies to cross-border SWIFT routing. (Fails WCAG 4.5:1)
  </p>

  <div style="margin-top: 16px; display: grid; grid-template-columns: 1fr auto; gap: 10px; align-items: center; background: #14161d; padding: 12px; border-radius: 10px; border: 1px solid #232530;">
    <!-- BUG 3: Input missing associated <label> or aria-label -->
    <input
      type="number"
      placeholder="Enter wire amount in USD..."
      style="width: 100%; padding: 8px 12px; background: #0d0e12; color: #ffffff; border: 1px solid #2e303e; border-radius: 6px; font-size: 13px;"
    />
    <!-- BUG 4 & 5: 26x26px undersized icon button with no accessible name -->
    <button
      type="button"
      style="width: 26px; height: 26px; background: #2f3cff; color: #ffffff; border: none; border-radius: 6px; cursor: pointer;"
    ></button>
  </div>
</div>`,
    fixedHtml: `<div style="padding: 22px; font-family: system-ui, -apple-system, sans-serif; background: #0d0e12; color: #f2f2f5; border-radius: 12px; border: 1px solid #2e3244;">
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #232634; padding-bottom: 14px;">
    <div>
      <span style="font-size: 10px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.12em; color: #a1a1aa;">LIQUIDITY POOL // USD-USDC</span>
      <h1 style="font-size: 24px; font-weight: 800; margin: 4px 0 0 0; letter-spacing: -0.03em;">$142,850.40</h1>
    </div>
    <span style="background: rgba(244, 63, 94, 0.2); color: #fda4af; border: 1px solid rgba(244, 63, 94, 0.4); padding: 4px 10px; border-radius: 99px; font-size: 12px; font-weight: 700;">
      ▼ Down 4.28% (24H)
    </span>
  </div>

  <h2 style="font-size: 14px; font-weight: 700; margin: 16px 0 6px 0; color: #f2f2f5;">
    Instant Wire Execution (Sequential &lt;h2&gt;)
  </h2>

  <p style="color: #b4b7c5; background: #0d0e12; font-size: 13px; line-height: 1.5; margin: 0;">
    Institutional settlement fee of 0.15% applies to cross-border SWIFT routing. (Verified 8.4:1 AAA Contrast)
  </p>

  <div style="margin-top: 16px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center; background: #14161d; padding: 14px; border-radius: 10px; border: 1px solid #2e3244;">
    <label for="wire-usd-input" style="font-size: 12px; font-weight: 700; color: #f2f2f5;">
      Wire Amount (USD)
    </label>
    <input
      id="wire-usd-input"
      type="number"
      value="2500"
      style="flex: 1; min-height: 44px; padding: 0 12px; background: #0d0e12; color: #ffffff; border: 1px solid #4a4e69; border-radius: 8px; font-size: 13px;"
    />
    <button
      type="button"
      aria-label="Execute Instant Wire Transfer"
      style="min-width: 136px; min-height: 44px; padding: 0 16px; background: #2f3cff; color: #ffffff; font-weight: 700; font-size: 12px; border: none; border-radius: 8px; cursor: pointer;"
    >
      Send Wire →
    </button>
  </div>
</div>`,
  },
  {
    id: "ecommerce",
    name: "Luxury Checkout",
    tag: "ALT TEXT & LABELS",
    flawedHtml: `<div style="padding: 22px; font-family: system-ui, -apple-system, sans-serif; background: #0e0e14; color: #f4f4f6; border-radius: 12px; border: 1px solid #27273a;">
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e1e2d; padding-bottom: 12px;">
    <div>
      <span style="font-size: 10px; font-family: monospace; letter-spacing: 0.14em; color: #8e8ea0;">ATELIER OPTICS // ORDER #AP-904</span>
      <h1 style="font-size: 20px; font-weight: 800; margin: 3px 0 0 0;">VIP Allocation Bag</h1>
    </div>
    <span style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700;">
      ● 1 UNIT RESERVED
    </span>
  </div>

  <!-- BUG 1: Skipped heading h1 -> h4 -->
  <h4 style="font-size: 13px; margin: 14px 0 8px 0; color: #d4d4d8;">
    Leica-Mount Diopter Calibration Kit (Skipped h2/h3!)
  </h4>

  <div style="display: flex; justify-content: space-between; align-items: center; background: #151520; padding: 12px; border-radius: 10px; border: 1px solid #27273a;">
    <div style="display: flex; gap: 12px; align-items: center;">
      <!-- BUG 2: Missing alt attribute on product image -->
      <img src="https://placehold.co/72x56/2f3cff/ffffff?text=f%2F1.4" style="border-radius: 8px;" />
      <div>
        <div style="font-weight: 700; font-size: 14px; color: #ffffff;">$680.00 USD</div>
        <!-- BUG 3: Low contrast text (#363645 on #151520 = 1.5:1) -->
        <p style="color: #363645; background: #151520; font-size: 12px; margin: 3px 0 0 0;">
          Machined titanium housing with AR sapphire glass.
        </p>
      </div>
    </div>
  </div>

  <div style="margin-top: 14px; display: flex; gap: 8px; align-items: center; background: #151520; padding: 10px; border-radius: 10px;">
    <!-- BUG 4 & 5: Unlabeled input + 26x26px unlabeled button -->
    <input type="text" placeholder="Enter founder allocation key..." style="flex: 1; padding: 7px 10px; background: #0e0e14; color: #fff; border: 1px solid #27273a; border-radius: 6px; font-size: 12px;" />
    <button type="button" style="width: 26px; height: 26px; background: #9aa5ff; color: #0b0b0e; border: none; border-radius: 6px;"></button>
  </div>
</div>`,
    fixedHtml: `<div style="padding: 22px; font-family: system-ui, -apple-system, sans-serif; background: #0e0e14; color: #f4f4f6; border-radius: 12px; border: 1px solid #32324a;">
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #252538; padding-bottom: 12px;">
    <div>
      <span style="font-size: 10px; font-family: monospace; letter-spacing: 0.14em; color: #b4b4c7;">ATELIER OPTICS // ORDER #AP-904</span>
      <h1 style="font-size: 20px; font-weight: 800; margin: 3px 0 0 0;">VIP Allocation Bag</h1>
    </div>
    <span style="background: rgba(16, 185, 129, 0.18); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.35); padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700;">
      ✓ 1 UNIT VERIFIED
    </span>
  </div>

  <h2 style="font-size: 14px; margin: 14px 0 8px 0; color: #f4f4f6;">
    Leica-Mount Diopter Calibration Kit (Sequential &lt;h2&gt;)
  </h2>

  <div style="display: flex; justify-content: space-between; align-items: center; background: #151520; padding: 12px; border-radius: 10px; border: 1px solid #32324a;">
    <div style="display: flex; gap: 12px; align-items: center;">
      <img src="https://placehold.co/72x56/2f3cff/ffffff?text=f%2F1.4" alt="Leica-Mount f/1.4 Titanium Diopter Calibration Lens" style="border-radius: 8px;" />
      <div>
        <div style="font-weight: 700; font-size: 14px; color: #ffffff;">$680.00 USD</div>
        <p style="color: #c4c4d4; background: #151520; font-size: 12.5px; margin: 3px 0 0 0;">
          Machined titanium housing with AR sapphire glass.
        </p>
      </div>
    </div>
  </div>

  <div style="margin-top: 14px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center; background: #151520; padding: 12px; border-radius: 10px; border: 1px solid #32324a;">
    <label for="vip-key-input" style="font-size: 12px; font-weight: 700; color: #f4f4f6;">Allocation Key</label>
    <input id="vip-key-input" type="text" value="APERTURE-VIP" style="flex: 1; min-height: 44px; padding: 0 12px; background: #0e0e14; color: #fff; border: 1px solid #4a4a6a; border-radius: 8px; font-size: 13px;" />
    <button type="button" style="min-height: 44px; min-width: 118px; padding: 0 16px; background: #9aa5ff; color: #0b0b0e; border: none; border-radius: 8px; font-weight: 800; font-size: 12px;">
      Apply Key →
    </button>
  </div>
</div>`,
  },
  {
    id: "healthcare",
    name: "Clinical Telemetry",
    tag: "FORMS & HEADINGS",
    flawedHtml: `<div style="padding: 22px; font-family: system-ui, -apple-system, sans-serif; background: #0b1116; color: #f0f6fc; border-radius: 12px; border: 1px solid #1e2d3d;">
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #172330; padding-bottom: 12px;">
    <div>
      <span style="font-size: 10px; font-family: monospace; letter-spacing: 0.12em; color: #38bdf8;">OPHTHALMOLOGY ICU // PATIENT #8841-A</span>
      <h1 style="font-size: 20px; font-weight: 800; margin: 3px 0 0 0;">Retinal Acuity &amp; Diopter Rx</h1>
    </div>
    <span style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-family: monospace; font-weight: 700;">
      IOP: 14 mmHg
    </span>
  </div>

  <!-- BUG 1: Skipped heading h1 -> h4 -->
  <h4 style="font-size: 13px; margin: 14px 0 6px 0; color: #bae6fd;">
    Post-Op Atropine Dosage Protocol (Skipped h2/h3!)
  </h4>

  <!-- BUG 2: Low contrast text (#263545 on #0b1116 = 1.55:1) -->
  <p style="color: #263545; background: #0b1116; font-size: 12.5px; line-height: 1.5; margin: 0;">
    Administer 1 sterile ophthalmic drop every 12 hours. Avoid uncalibrated high-glare displays.
  </p>

  <div style="margin-top: 14px; display: flex; gap: 8px; align-items: center; background: #101923; padding: 12px; border-radius: 10px; border: 1px solid #1e2d3d;">
    <!-- BUG 3, 4, 5: Unlabeled select + 24x24px unlabeled button -->
    <select style="flex: 1; padding: 6px 10px; background: #0b1116; color: #f0f6fc; border: 1px solid #1e2d3d; border-radius: 6px; font-size: 12px;">
      <option>Dispensing Unit: Surgical Optical Wing B</option>
    </select>
    <button type="button" style="width: 24px; height: 24px; background: #0284c7; color: #fff; border: none; border-radius: 6px;"></button>
  </div>
</div>`,
    fixedHtml: `<div style="padding: 22px; font-family: system-ui, -apple-system, sans-serif; background: #0b1116; color: #f0f6fc; border-radius: 12px; border: 1px solid #263b52;">
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e3042; padding-bottom: 12px;">
    <div>
      <span style="font-size: 10px; font-family: monospace; letter-spacing: 0.12em; color: #7dd3fc;">OPHTHALMOLOGY ICU // PATIENT #8841-A</span>
      <h1 style="font-size: 20px; font-weight: 800; margin: 3px 0 0 0;">Retinal Acuity &amp; Diopter Rx</h1>
    </div>
    <span style="background: rgba(56, 189, 248, 0.2); color: #bae6fd; border: 1px solid rgba(56, 189, 248, 0.4); padding: 4px 10px; border-radius: 6px; font-size: 11px; font-family: monospace; font-weight: 700;">
      IOP: 14 mmHg [NORMAL]
    </span>
  </div>

  <h2 style="font-size: 14px; margin: 14px 0 6px 0; color: #e0f2fe;">
    Post-Op Atropine Dosage Protocol (Sequential &lt;h2&gt;)
  </h2>

  <p style="color: #bae6fd; background: #0b1116; font-size: 13px; line-height: 1.5; margin: 0;">
    Administer 1 sterile ophthalmic drop every 12 hours. Avoid uncalibrated high-glare displays.
  </p>

  <div style="margin-top: 14px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center; background: #101923; padding: 12px; border-radius: 10px; border: 1px solid #263b52;">
    <label for="clinic-wing-select" style="font-size: 12px; font-weight: 700; color: #f0f6fc;">Dispensing Wing</label>
    <select id="clinic-wing-select" style="flex: 1; min-height: 44px; padding: 0 12px; background: #0b1116; color: #f0f6fc; border: 1px solid #38bdf8; border-radius: 8px; font-size: 13px;">
      <option>Surgical Optical Wing B</option>
    </select>
    <button type="button" style="min-height: 44px; min-width: 132px; padding: 0 16px; background: #0284c7; color: #ffffff; border: none; border-radius: 8px; font-weight: 700; font-size: 12px;">
      Sign Rx Order ✓
    </button>
  </div>
</div>`,
  },
];

export default function PlaygroundPage() {
  const previewRef = useRef<HTMLDivElement>(null);
  const { reduceMotion } = usePreferences();

  const [activePreset, setActivePreset] = useState<SandboxPreset>(
    SANDBOX_PRESETS[0]!
  );
  const [htmlCode, setHtmlCode] = useState(SANDBOX_PRESETS[0]!.flawedHtml);
  const [sim, setSim] = useState<SimulationType>("none");
  const [intensity, setIntensity] = useState(65);
  const [xrayMode, setXrayMode] = useState(false);

  // Pointer coordinates inside the preview box for Glaucoma (tunnel) & Macular (scotoma) masks!
  const [maskPos, setMaskPos] = useState({ x: 50, y: 50 });

  const [report, setReport] = useState<AuditReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isRemediated, setIsRemediated] = useState(false);

  const triggerScanWithLaser = (afterRemediate = false) => {
    setIsScanning(true);

    const delay = reduceMotion ? 40 : 580;
    window.setTimeout(() => {
      if (previewRef.current) {
        const res = runDomAudit(previewRef.current);
        setReport(res);
      }
      setIsScanning(false);
      if (afterRemediate) setIsRemediated(true);
    }, delay);
  };

  const handleSelectPreset = (preset: SandboxPreset) => {
    setActivePreset(preset);
    setIsRemediated(false);
    setReport(null);
    setHtmlCode(preset.flawedHtml);
  };

  const handleAutoRemediate = () => {
    setHtmlCode(activePreset.fixedHtml);
    setIsRemediated(true);
    triggerScanWithLaser(true);
  };

  const handleResetFlawed = () => {
    setHtmlCode(activePreset.flawedHtml);
    setIsRemediated(false);
    setReport(null);
  };

  const handleExportJson = () => {
    const currentReport =
      report ?? (previewRef.current ? runDomAudit(previewRef.current) : null);
    if (!currentReport) return;

    const cleanJson = JSON.stringify(
      {
        preset: activePreset.name,
        remediated: isRemediated,
        score: currentReport.score,
        timestamp: new Date(currentReport.timestamp).toISOString(),
        totalChecked: currentReport.totalChecked,
        issues: currentReport.issues.map(({ element, ...rest }) => rest),
      },
      null,
      2
    );

    const blob = new Blob([cleanJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aperture-audit-${activePreset.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPreviewFilter = (mode: SimulationType, val: number): string => {
    switch (mode) {
      case "protanopia":
        return "url(#showcase-protanopia)";
      case "deuteranopia":
        return "url(#showcase-deuteranopia)";
      case "tritanopia":
        return "url(#showcase-tritanopia)";
      case "achromatopsia":
        return "url(#showcase-achromatopsia)";
      case "cataracts":
        return `blur(${(1 + (val / 100) * 3.5).toFixed(1)}px) sepia(${(
          0.25 +
          (val / 100) * 0.4
        ).toFixed(2)}) contrast(0.78)`;
      case "low-vision":
        return `blur(${(1.2 + (val / 100) * 5).toFixed(1)}px)`;
      case "low-contrast":
        return "contrast(0.38)";
      case "glare":
        return "brightness(1.35) contrast(0.75) saturate(0.85)";
      default:
        return "none";
    }
  };

  const handlePreviewPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMaskPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
      <div className="border-x border-b py-12 px-6 sm:px-12">
        {/* Top Workbench Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-6">
          <div>
            <div
              style={{ fontFamily: "var(--font-mono)" }}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[var(--muted)]"
            >
              <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
              <span>OPTICAL DIAGNOSTIC WORKBENCH // LIVE DOM SANDBOX</span>
            </div>
            <h1 className="mt-2 text-3xl sm:text-5xl font-bold tracking-[-0.04em]">
              Inspect, break, and{" "}
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "var(--accent)",
                }}
                className="font-normal italic tracking-normal px-1"
              >
                auto-heal
              </span>{" "}
              HTML.
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => triggerScanWithLaser(false)}
              style={{ fontFamily: "var(--font-mono)" }}
              className="min-h-[44px] cursor-pointer rounded-lg border bg-[var(--surface)] px-4 text-xs font-bold uppercase tracking-wider transition-colors hover:border-[var(--accent)]"
            >
              {isScanning ? "Scanning DOM..." : "🔍 Scan Specimen"}
            </button>

            <button
              type="button"
              onClick={handleAutoRemediate}
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-ink)",
                fontFamily: "var(--font-mono)",
              }}
              className="min-h-[44px] cursor-pointer rounded-lg px-4 text-xs font-bold uppercase tracking-wider shadow-sm transition-transform active:scale-95"
            >
              {isRemediated
                ? "✓ Remediated (100/100)"
                : "✨ Auto-Remediate & Scan"}
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              style={{ fontFamily: "var(--font-mono)" }}
              className="min-h-[44px] cursor-pointer rounded-lg border bg-[var(--surface)] px-4 text-xs font-semibold uppercase tracking-wider hover:border-[var(--accent)]"
            >
              Export JSON ↓
            </button>
          </div>
        </div>

        {/* Preset Selector + Optical Controls Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-[var(--surface)] p-3.5">
          <div
            role="group"
            aria-label="Load industry UI template"
            className="flex flex-wrap items-center gap-2"
          >
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-[11px] uppercase text-[var(--muted)] px-2"
            >
              SPECIMENS:
            </span>
            {SANDBOX_PRESETS.map((preset) => {
              const active = activePreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  aria-pressed={active}
                  style={{
                    fontFamily: "var(--font-mono)",
                    backgroundColor: active ? "var(--ink)" : "var(--bg)",
                    color: active ? "var(--bg)" : "var(--ink)",
                  }}
                  className="min-h-[44px] cursor-pointer rounded-lg border px-3.5 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  {preset.name}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="sandbox-sim-select" className="sr-only">
              Select Sandbox Simulation
            </label>
            <select
              id="sandbox-sim-select"
              value={sim}
              onChange={(e) => setSim(e.target.value as SimulationType)}
              style={{ fontFamily: "var(--font-mono)" }}
              className="min-h-[44px] rounded-lg border bg-[var(--bg)] px-3 text-xs font-semibold uppercase"
            >
              {SIMULATION_CATALOG.slice(0, 11).map((item) => (
                <option key={item.id} value={item.id}>
                  LENS: {item.label}
                </option>
              ))}
            </select>

            {(sim === "cataracts" || sim === "low-vision") && (
              <div className="flex items-center gap-2 rounded-lg border bg-[var(--bg)] px-3 min-h-[44px]">
                <label
                  htmlFor="sandbox-diopter"
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[11px] text-[var(--muted)]"
                >
                  {intensity}%
                </label>
                <input
                  id="sandbox-diopter"
                  type="range"
                  min={15}
                  max={100}
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-20 accent-[var(--accent)] cursor-pointer"
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => setXrayMode(!xrayMode)}
              aria-pressed={xrayMode}
              style={{
                fontFamily: "var(--font-mono)",
                backgroundColor: xrayMode ? "var(--accent)" : "var(--bg)",
                color: xrayMode ? "var(--accent-ink)" : "var(--ink)",
              }}
              className="min-h-[44px] cursor-pointer rounded-lg border px-3.5 text-xs font-semibold uppercase tracking-wider"
            >
              {xrayMode ? "▣ X-Ray: ON" : "▢ X-Ray Wireframe"}
            </button>
          </div>
        </div>

        {/* Two-Column Workbench Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left 6 Columns: Live HTML Code Editor */}
          <div className="lg:col-span-6 flex flex-col">
            <div
              style={{ fontFamily: "var(--font-mono)" }}
              className="mb-2 flex items-center justify-between text-xs uppercase text-[var(--muted)]"
            >
              <span>
                01 // RAW DOM SOURCE (
                {isRemediated ? "REMEDIATED WCAG AA/AAA" : "FLAWED SPECIMEN"}
                )
              </span>
              {isRemediated && (
                <button
                  type="button"
                  onClick={handleResetFlawed}
                  className="min-h-[44px] cursor-pointer rounded border px-2.5 text-[11px] text-[var(--accent)] hover:underline"
                >
                  ↺ Reset to Flawed HTML
                </button>
              )}
            </div>

            <div className="relative flex-1 overflow-hidden rounded-xl border bg-[#0b0b0f] text-[#e4e4ef] shadow-inner">
              <div
                style={{ fontFamily: "var(--font-mono)" }}
                className="flex items-center justify-between border-b border-white/10 bg-[#121218] px-4 py-2 text-[11px] text-[#8e8ea0]"
              >
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2">{activePreset.id}-specimen.html</span>
                </span>
                <span>UTF-8 // LIVE EDITABLE</span>
              </div>
              <textarea
                id="raw-html-input"
                aria-label="Live HTML Source Editor"
                value={htmlCode}
                onChange={(e) => {
                  setIsRemediated(false);
                  setReport(null);
                  setHtmlCode(e.target.value);
                }}
                rows={18}
                style={{ fontFamily: "var(--font-mono)" }}
                className="w-full bg-transparent p-4 text-xs leading-relaxed text-[#e4e4ef] focus:outline-none"
              />
            </div>
          </div>

          {/* Right 6 Columns: Live Optical Viewport + Telemetry Drawer */}
          <div className="lg:col-span-6 flex flex-col">
            <div
              style={{ fontFamily: "var(--font-mono)" }}
              className="mb-2 flex items-center justify-between text-xs uppercase text-[var(--muted)]"
            >
              <span>02 // OPTICAL VIEWPORT ({sim.toUpperCase()})</span>
              <span
                aria-live="polite"
                className={`rounded border px-2.5 py-0.5 font-bold ${
                  !report
                    ? "text-[var(--muted)]"
                    : report.score === 100
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                    : "border-rose-500/40 bg-rose-500/10 text-rose-400"
                }`}
              >
                {!report
                  ? "STATUS: UNSCANNED (CLICK SCAN ABOVE)"
                  : `WCAG SCORE: ${report.score} / 100 (${report.issues.length} ISSUES)`}
              </span>
            </div>

            {/* Viewport Container (NO data-lens-ignore here so runDomAudit scans every node inside!) */}
            <div
              onPointerMove={handlePreviewPointerMove}
              className="relative overflow-hidden rounded-xl border bg-[var(--surface)] p-5"
            >
              {isScanning && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 z-30 h-1.5 bg-[var(--accent)] shadow-[0_0_24px_var(--accent)] animate-bounce"
                  style={{ animationDuration: "550ms" }}
                />
              )}

              {/* Live Glaucoma (Tunnel Vision) Radial Mask inside Sandbox */}
              {sim === "glaucoma" && (
                <div
                  aria-hidden="true"
                  style={{
                    background: `radial-gradient(circle 110px at ${maskPos.x}% ${maskPos.y}%, transparent 0%, rgba(0,0,0,0.92) 75%, #000000 100%)`,
                  }}
                  className="pointer-events-none absolute inset-0 z-20"
                />
              )}

              {/* Live Macular Degeneration (Central Scotoma) Radial Mask inside Sandbox */}
              {sim === "macular" && (
                <div
                  aria-hidden="true"
                  style={{
                    background: `radial-gradient(circle 85px at ${maskPos.x}% ${maskPos.y}%, #050507 0%, rgba(5,5,7,0.88) 55%, transparent 100%)`,
                  }}
                  className="pointer-events-none absolute inset-0 z-20"
                />
              )}

              {xrayMode && (
                <style>{`
                  .sandbox-xray * {
                    outline: 1px dashed rgba(154, 165, 255, 0.65) !important;
                  }
                `}</style>
              )}

              <div
                ref={previewRef}
                style={{ filter: getPreviewFilter(sim, intensity) }}
                className={`transition-all duration-300 ${
                  xrayMode ? "sandbox-xray" : ""
                }`}
                dangerouslySetInnerHTML={{ __html: htmlCode }}
              />
            </div>

            {/* Audit Telemetry Drawer */}
            <div className="mt-4 flex-1 rounded-xl border bg-[var(--surface)] p-5">
              {!report ? (
                <div className="flex h-full flex-col items-center justify-center py-6 text-center">
                  <div
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="rounded-full border px-3 py-1 text-[11px] uppercase tracking-widest text-[var(--muted)]"
                  >
                    DIAGNOSTIC STANDBY
                  </div>
                  <p className="mt-2 max-w-md text-xs text-[var(--muted)]">
                    Click <strong>&quot;🔍 Scan Specimen&quot;</strong> to run
                    the 8-rule WCAG 2.1 DOM auditor on the flawed UI, or click{" "}
                    <strong>&quot;✨ Auto-Remediate &amp; Scan&quot;</strong> to
                    patch all defects and verify a 100/100 score.
                  </p>
                </div>
              ) : report.issues.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-emerald-400"
                  >
                    ✓ 100 / 100 — ZERO WCAG VIOLATIONS
                  </div>
                  <p className="mt-2 max-w-md text-xs text-[var(--muted)]">
                    Every heading hierarchy, relative luminance contrast ratio,
                    form label, and 44×44px touch target inside the specimen
                    passed verification.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  <div
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="flex items-center justify-between text-xs font-bold uppercase"
                  >
                    <span className="text-rose-400">
                      ⚠ {report.issues.length} ACCESSIBILITY DEFECTS DETECTED
                    </span>
                    <span className="text-[var(--muted)]">
                      CLICK AUTO-REMEDIATE TO PATCH
                    </span>
                  </div>
                  {report.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="rounded-lg border bg-[var(--bg)] p-3 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-rose-400 uppercase">
                          [{issue.ruleId}] {issue.title}
                        </span>
                        <span className="font-mono text-[10px] text-[var(--muted)]">
                          {issue.selector}
                        </span>
                      </div>
                      <p className="text-[var(--muted)]">{issue.whyItMatters}</p>
                      <p className="font-mono text-[11px] text-[var(--accent)]">
                        Fix: {issue.fixSuggestion}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}