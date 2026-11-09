"use client";

import React, { useRef, useState } from "react";
import {
  AuditReport,
  runDomAudit,
  SIMULATION_CATALOG,
  SimulationType,
} from "lens-a11y";

const DEFAULT_SANDBOX_HTML = `<div style="padding: 20px; font-family: sans-serif;">
  <h1>Checkout Sandbox</h1>
  <h4>Payment Details (Skipped h2/h3!)</h4>
  <p style="color: #b5b5be; background: #ffffff;">
    Low contrast helper text that fails WCAG 4.5:1 ratio.
  </p>
  <img src="https://placehold.co/120x40" />
  <div style="margin-top: 12px;">
    <input type="text" placeholder="Card number (missing label!)" />
    <button type="button" style="width: 28px; height: 28px;"></button>
  </div>
</div>`;

export default function PlaygroundPage() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [htmlCode, setHtmlCode] = useState(DEFAULT_SANDBOX_HTML);
  const [sim, setSim] = useState<SimulationType>("none");
  const [report, setReport] = useState<AuditReport | null>(null);

  const handleRunSandboxAudit = () => {
    if (!previewRef.current) return;
    const res = runDomAudit(previewRef.current);
    setReport(res);
  };

  const handleExportJson = () => {
    const currentReport =
      report ?? (previewRef.current ? runDomAudit(previewRef.current) : null);
    if (!currentReport) return;

    const cleanJson = JSON.stringify(
      {
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
    a.download = "aperture-audit-report.json";
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
              SANDBOX // LIVE DOM AUDITOR &amp; JSON EXPORTER
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

          <div className="flex flex-wrap items-center gap-3">
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
              onClick={handleRunSandboxAudit}
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-ink)",
              }}
              className="min-h-[44px] cursor-pointer rounded-lg px-4 text-xs font-semibold uppercase tracking-wider"
            >
              Audit Sandbox HTML
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

        {/* Two-Column HTML Editor & Filtered Live Preview */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6 flex flex-col">
            <label
              htmlFor="raw-html-input"
              style={{ fontFamily: "var(--font-mono)" }}
              className="mb-2 text-xs uppercase text-[var(--muted)]"
            >
              1. PASTE OR EDIT HTML SNIPPET
            </label>
            <textarea
              id="raw-html-input"
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              rows={14}
              style={{ fontFamily: "var(--font-mono)" }}
              className="w-full flex-1 rounded-xl border bg-[var(--surface)] p-4 text-xs leading-relaxed"
            />
          </div>

          <div className="lg:col-span-6 flex flex-col">
            <div
              style={{ fontFamily: "var(--font-mono)" }}
              className="mb-2 flex justify-between text-xs uppercase text-[var(--muted)]"
            >
              <span>2. LIVE RENDERED PREVIEW ({sim.toUpperCase()})</span>
              {report && (
                <span className="font-bold text-[var(--accent)]">
                  SCORE: {report.score} / 100 ({report.issues.length} ISSUES)
                </span>
              )}
            </div>

            <div
              ref={previewRef}
              data-lens-ignore="true"
              style={{ filter: getPreviewFilter(sim) }}
              className="min-h-[280px] rounded-xl border bg-white text-slate-900 p-4 overflow-auto"
              dangerouslySetInnerHTML={{ __html: htmlCode }}
            />

            {/* Audit Results List */}
            {report && (
              <div className="mt-4 rounded-xl border bg-[var(--surface)] p-4 space-y-2 max-h-56 overflow-y-auto">
                <div
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-xs font-bold uppercase"
                >
                  DETECTED ISSUES ({report.issues.length})
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