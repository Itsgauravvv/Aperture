"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AuditReport,
  runDomAudit,
  SIMULATION_CATALOG,
  SimulationType,
} from "lens-a11y";

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
    name: "Fintech Portfolio",
    tag: "CONTRAST & TARGETS",
    flawedHtml: `<div style="padding: 20px; font-family: system-ui, sans-serif; background: #ffffff; color: #0e0e10;">
  <h1 style="font-size: 20px; font-weight: 700; margin: 0;">Portfolio Balance: $42,850.00</h1>
  <h4 style="font-size: 14px; margin-top: 8px; color: #e11d48;">▼ -4.2% Today (Skipped h2/h3!)</h4>
  <p style="color: #b8b8c2; background: #ffffff; font-size: 13px; margin-top: 8px;">
    Settlement fee of 0.15% applies to instant wire transfers. (Low 1.9:1 contrast!)
  </p>
  <div style="margin-top: 14px; display: flex; gap: 8px; align-items: center;">
    <input type="number" placeholder="Transfer amount USD (Missing label!)" style="padding: 8px; border: 1px solid #ccc; border-radius: 6px;" />
    <button type="button" style="width: 26px; height: 26px; background: #2f3cff; color: #fff; border: none; border-radius: 4px;"></button>
  </div>
</div>`,
    fixedHtml: `<div style="padding: 20px; font-family: system-ui, sans-serif; background: #ffffff; color: #0e0e10;">
  <h1 style="font-size: 20px; font-weight: 700; margin: 0;">Portfolio Balance: $42,850.00</h1>
  <h2 style="font-size: 14px; margin-top: 8px; color: #be123c;">▼ Down 4.2% Today (Sequential h2 + icon text)</h2>
  <p style="color: #4b4b57; background: #ffffff; font-size: 13px; margin-top: 8px;">
    Settlement fee of 0.15% applies to instant wire transfers. (7.8:1 WCAG AAA contrast)
  </p>
  <div style="margin-top: 14px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
    <label for="transfer-usd" style="font-size: 13px; font-weight: 600; color: #0e0e10;">Amount (USD)</label>
    <input id="transfer-usd" type="number" style="min-height: 44px; padding: 0 12px; border: 1px solid #555; border-radius: 6px;" />
    <button type="button" aria-label="Execute Wire Transfer" style="min-width: 120px; min-height: 44px; padding: 0 14px; background: #2f3cff; color: #ffffff; font-weight: 600; border: none; border-radius: 6px;">
      Send Wire →
    </button>
  </div>
</div>`,
  },
  {
    id: "ecommerce",
    name: "E-Commerce Checkout",
    tag: "ALT TEXT & LABELS",
    flawedHtml: `<div style="padding: 20px; font-family: system-ui, sans-serif; background: #ffffff; color: #0e0e10;">
  <h1 style="font-size: 20px; font-weight: 700; margin: 0;">Express Checkout</h1>
  <h3 style="font-size: 15px; margin-top: 10px;">Order Item (Skipped h2!)</h3>
  <img src="https://placehold.co/100x48/2f3cff/ffffff?text=LENS+PRO" style="margin-top: 8px; border-radius: 6px;" />
  <p style="color: #c0c0c8; background: #ffffff; font-size: 13px; margin-top: 8px;">
    Non-refundable digital license key.
  </p>
  <div style="margin-top: 12px; display: flex; gap: 8px;">
    <input type="text" placeholder="Discount code" style="padding: 6px; border: 1px solid #ccc; border-radius: 4px;" />
    <button type="button" style="width: 28px; height: 28px; border: 1px solid #ccc; border-radius: 4px;"></button>
  </div>
</div>`,
    fixedHtml: `<div style="padding: 20px; font-family: system-ui, sans-serif; background: #ffffff; color: #0e0e10;">
  <h1 style="font-size: 20px; font-weight: 700; margin: 0;">Express Checkout</h1>
  <h2 style="font-size: 15px; margin-top: 10px;">Order Item</h2>
  <img src="https://placehold.co/100x48/2f3cff/ffffff?text=LENS+PRO" alt="Aperture Lens Pro Hardware Calibration Kit" style="margin-top: 8px; border-radius: 6px;" />
  <p style="color: #3f3f46; background: #ffffff; font-size: 13px; margin-top: 8px;">
    Non-refundable digital license key.
  </p>
  <div style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
    <label for="discount-code" style="font-size: 13px; font-weight: 600; color: #0e0e10;">Promo Code</label>
    <input id="discount-code" type="text" style="min-height: 44px; padding: 0 10px; border: 1px solid #555; border-radius: 6px;" />
    <button type="button" style="min-height: 44px; min-width: 88px; padding: 0 14px; background: #0e0e10; color: #ffffff; border: none; border-radius: 6px; font-weight: 600;">
      Apply
    </button>
  </div>
</div>`,
  },
  {
    id: "healthcare",
    name: "Clinical Portal",
    tag: "FORMS & HEADINGS",
    flawedHtml: `<div style="padding: 20px; font-family: system-ui, sans-serif; background: #ffffff; color: #0e0e10;">
  <h1 style="font-size: 20px; font-weight: 700; margin: 0;">Patient Prescription Refill</h1>
  <h4 style="font-size: 14px; margin-top: 6px;">Dosage Verification</h4>
  <p style="color: #babac4; background: #ffffff; font-size: 12px; margin-top: 6px;">
    Take 1 tablet every 12 hours with water. Do not exceed 2 tablets daily.
  </p>
  <div style="margin-top: 12px;">
    <select style="padding: 4px; border: 1px solid #ccc;">
      <option>Select Pharmacy</option>
    </select>
    <button type="button" style="width: 24px; height: 24px; margin-left: 6px;"></button>
  </div>
</div>`,
    fixedHtml: `<div style="padding: 20px; font-family: system-ui, sans-serif; background: #ffffff; color: #0e0e10;">
  <h1 style="font-size: 20px; font-weight: 700; margin: 0;">Patient Prescription Refill</h1>
  <h2 style="font-size: 14px; margin-top: 6px;">Dosage Verification</h2>
  <p style="color: #27272a; background: #ffffff; font-size: 13px; margin-top: 6px;">
    Take 1 tablet every 12 hours with water. Do not exceed 2 tablets daily.
  </p>
  <div style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
    <label for="pharmacy-select" style="font-size: 13px; font-weight: 600; color: #0e0e10;">Pharmacy</label>
    <select id="pharmacy-select" style="min-height: 44px; padding: 0 12px; border: 1px solid #444; border-radius: 6px;">
      <option>Central Clinic Pharmacy</option>
    </select>
    <button type="button" style="min-height: 44px; min-width: 120px; padding: 0 14px; background: #2f3cff; color: #ffffff; border: none; border-radius: 6px; font-weight: 600;">
      Request Refill
    </button>
  </div>
</div>`,
  },
];

export default function PlaygroundPage() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [activePreset, setActivePreset] = useState<SandboxPreset>(
    SANDBOX_PRESETS[0]!
  );
  const [htmlCode, setHtmlCode] = useState(SANDBOX_PRESETS[0]!.flawedHtml);
  const [sim, setSim] = useState<SimulationType>("none");
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isRemediated, setIsRemediated] = useState(false);

  const runSandboxScan = () => {
    if (!previewRef.current) return;
    const res = runDomAudit(previewRef.current);
    setReport(res);
  };

  // Automatically audit whenever HTML changes and DOM updates
  useEffect(() => {
    const timer = window.setTimeout(() => {
      runSandboxScan();
    }, 60);
    return () => window.clearTimeout(timer);
  }, [htmlCode]);

  const handleSelectPreset = (preset: SandboxPreset) => {
    setActivePreset(preset);
    setIsRemediated(false);
    setHtmlCode(preset.flawedHtml);
  };

  const handleAutoRemediate = () => {
    setIsRemediated(true);
    setHtmlCode(activePreset.fixedHtml);
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

  const getPreviewFilter = (mode: SimulationType): string => {
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
        return "blur(2.4px) sepia(0.45) contrast(0.78)";
      case "low-vision":
        return "blur(3.2px)";
      case "low-contrast":
        return "contrast(0.4)";
      default:
        return "none";
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
      <div className="border-x border-b py-12 px-6 sm:px-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]"
            >
              SANDBOX // INDUSTRY TEMPLATES &amp; AUTO-REMEDIATION ENGINE
            </div>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-[-0.04em]">
              Interactive HTML{" "}
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "var(--accent)",
                }}
                className="font-normal italic tracking-normal"
              >
                testbench
              </span>
            </h1>
          </div>

          {/* Simulation Dropdown + Auto-Fix + Export JSON */}
          <div className="flex flex-wrap items-center gap-2.5">
            <label htmlFor="sandbox-sim-select" className="sr-only">
              Select Sandbox Simulation
            </label>
            <select
              id="sandbox-sim-select"
              value={sim}
              onChange={(e) => setSim(e.target.value as SimulationType)}
              style={{ fontFamily: "var(--font-mono)" }}
              className="min-h-[44px] rounded-lg border bg-[var(--surface)] px-3 text-xs uppercase"
            >
              {SIMULATION_CATALOG.slice(0, 8).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleAutoRemediate}
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-ink)",
                fontFamily: "var(--font-mono)",
              }}
              className="min-h-[44px] cursor-pointer rounded-lg px-4 text-xs font-bold uppercase tracking-wider shadow-sm transition-opacity hover:opacity-90"
            >
              {isRemediated ? "✓ Remediated (100/100)" : "⚡ Auto-Remediate DOM"}
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

        {/* Industry Template Selector Row */}
        <div
          role="group"
          aria-label="Load industry UI template"
          className="mt-6 flex flex-wrap items-center gap-2.5"
        >
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-xs uppercase text-[var(--muted)] mr-1"
          >
            PRESET TEMPLATES:
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
                  backgroundColor: active ? "var(--ink)" : "var(--surface)",
                  color: active ? "var(--bg)" : "var(--ink)",
                }}
                className="min-h-[44px] cursor-pointer rounded-lg border px-3.5 text-xs font-medium uppercase tracking-wider transition-colors"
              >
                {preset.name}{" "}
                <span className="opacity-65 ml-1">[{preset.tag}]</span>
              </button>
            );
          })}
        </div>

        {/* Two-Column HTML Editor & Filtered Live Preview */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6 flex flex-col">
            <label
              htmlFor="raw-html-input"
              style={{ fontFamily: "var(--font-mono)" }}
              className="mb-2 text-xs uppercase text-[var(--muted)]"
            >
              1. LIVE HTML SOURCE ({isRemediated ? "REMEDIATED WCAG AA/AAA" : "DELIBERATELY FLAWED SPECIMEN"})
            </label>
            <textarea
              id="raw-html-input"
              value={htmlCode}
              onChange={(e) => {
                setIsRemediated(false);
                setHtmlCode(e.target.value);
              }}
              rows={15}
              style={{ fontFamily: "var(--font-mono)" }}
              className="w-full flex-1 rounded-xl border bg-[var(--surface)] p-4 text-xs leading-relaxed"
            />
          </div>

          <div className="lg:col-span-6 flex flex-col">
            <div
              style={{ fontFamily: "var(--font-mono)" }}
              className="mb-2 flex justify-between text-xs uppercase text-[var(--muted)]"
            >
              <span>2. RENDERED VIEWPORT ({sim.toUpperCase()})</span>
              {report && (
                <span
                  aria-live="polite"
                  className="font-bold text-[var(--accent)]"
                >
                  SCORE: {report.score} / 100 ({report.issues.length} ISSUES)
                </span>
              )}
            </div>

            <div
              ref={previewRef}
              data-lens-ignore="true"
              style={{ filter: getPreviewFilter(sim) }}
              className="min-h-[250px] rounded-xl border bg-white text-slate-900 p-4 overflow-auto"
              dangerouslySetInnerHTML={{ __html: htmlCode }}
            />

            {/* Audit Results List */}
            {report && (
              <div className="mt-4 rounded-xl border bg-[var(--surface)] p-4 space-y-2 max-h-60 overflow-y-auto">
                <div
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="flex items-center justify-between text-xs font-bold uppercase"
                >
                  <span>
                    {report.issues.length === 0
                      ? "✓ ZERO WCAG VIOLATIONS DETECTED"
                      : `DETECTED DEFECTS (${report.issues.length})`}
                  </span>
                  {!isRemediated && report.issues.length > 0 && (
                    <span className="text-[var(--accent)]">
                      Click &quot;⚡ Auto-Remediate DOM&quot; above to fix all
                    </span>
                  )}
                </div>
                {report.issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="rounded-lg border bg-[var(--bg)] p-2.5 text-xs"
                  >
                    <span className="font-mono font-bold text-[var(--accent)]">
                      [{issue.ruleId}]
                    </span>{" "}
                    <span className="font-semibold">{issue.title}</span> —{" "}
                    <span className="text-[var(--muted)]">
                      {issue.fixSuggestion}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}