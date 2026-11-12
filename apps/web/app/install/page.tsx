"use client";

import React from "react";
import { Lens } from "lens-a11y";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function InstallPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
      <div className="border-x border-b py-14 px-6 sm:px-12 space-y-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]"
            >
              INSTALLATION // EXTENSION, CDN, NPM &amp; CI QUALITY GATE
            </div>
            <h1 className="mt-2 text-3xl sm:text-5xl font-bold tracking-[-0.04em]">
              Deploy across{" "}
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "var(--accent)",
                }}
                className="font-normal italic tracking-normal"
              >
                every
              </span>{" "}
              environment
            </h1>
          </div>

          <a
            href="https://www.npmjs.com/package/lens-a11y"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: "var(--font-mono)" }}
            className="inline-flex min-h-[44px] items-center gap-2.5 rounded-lg border bg-[var(--surface)] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>lens-a11y@0.1.2 // View on npm ↗</span>
          </a>
        </div>

        {/* 1. Manifest V3 Browser Extension (CSP-Bypassing) */}
        <section
          aria-labelledby="ext-heading"
          className="optical-card p-6 sm:p-8"
        >
          <div
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-xs uppercase text-[var(--accent)] font-semibold"
          >
            RECOMMENDED FOR EXTERNAL SITES (BYPASSES CSP)
          </div>
          <h2 id="ext-heading" className="mt-1 text-xl font-bold">
            1. Chrome / Brave Manifest V3 Extension (packages/extension)
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-[var(--muted)]">
            Major websites like Google Search, Wikipedia, and GitHub enforce strict{" "}
            <code className="font-mono">Content-Security-Policy (CSP)</code> headers
            that block <code className="font-mono">javascript:</code> bookmarklets.
            Our Manifest V3 extension runs <code className="font-mono">lens.min.js</code>{" "}
            inside an isolated content-script world so the HUD mounts cleanly on any
            website on the internet.
          </p>

          <ol className="mt-4 space-y-2 text-xs sm:text-sm font-mono text-[var(--ink)]">
            <li>
              1. Run <strong>pnpm --filter lens-a11y build</strong> (bundles{" "}
              <strong>packages/extension/lens.min.js</strong>).
            </li>
            <li>
              2. Open <strong>brave://extensions</strong> (or{" "}
              <strong>chrome://extensions</strong>) and enable{" "}
              <strong>Developer mode</strong> (top right).
            </li>
            <li>
              3. Click <strong>Load unpacked</strong> and select your{" "}
              <strong>D:\Aperture\packages\extension</strong> folder.
            </li>
            <li>
              4. Open Wikipedia, Google, or any site and click the{" "}
              <strong>Aperture</strong> puzzle icon in your browser toolbar!
            </li>
          </ol>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => Lens.mount({ position: "bottom-right" })}
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-ink)",
                fontFamily: "var(--font-mono)",
              }}
              className="min-h-[44px] cursor-pointer rounded-[10px] px-5 py-2.5 text-xs font-bold uppercase tracking-wider"
            >
              ⊕ Test HUD on This Page Now
            </button>
          </div>
        </section>

        {/* 2. NPM / PNPM Package Manager */}
        <section aria-labelledby="npm-heading" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="npm-heading" className="text-xl font-bold">
              2. Package Manager (React, Next.js, Vite, Vue)
            </h2>
            <a
              href="https://www.npmjs.com/package/lens-a11y"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] hover:underline"
            >
              npmjs.com/package/lens-a11y ↗
            </a>
          </div>
          <CodeBlock
            filename="terminal & app.tsx"
            code={`# Install via npm, pnpm, or yarn
npm install lens-a11y
pnpm add lens-a11y

// Mount in development mode inside your root layout or entry file
import { Lens } from "lens-a11y";

if (process.env.NODE_ENV === "development") {
  Lens.mount({ position: "bottom-right", theme: "auto" });
}`}
          />
        </section>

        {/* 3. One-Line CDN Script */}
        <section aria-labelledby="cdn-heading" className="space-y-4">
          <h2 id="cdn-heading" className="text-xl font-bold">
            3. One-Line CDN Script Tag (jsDelivr)
          </h2>
          <CodeBlock
            filename="index.html"
            code={`<!-- Auto-mounts Floating HUD on your own websites -->
<script src="https://cdn.jsdelivr.net/npm/lens-a11y@0.1.0/dist/lens.min.js" data-lens="auto"></script>

<!-- Or boot directly into a specific simulation -->
<script src="https://cdn.jsdelivr.net/npm/lens-a11y@0.1.0/dist/lens.min.js" data-lens="protanopia"></script>`}
          />
        </section>

        {/* 4. Automated CI / Vitest Quality Gate */}
        <section aria-labelledby="ci-heading" className="space-y-4">
          <h2 id="ci-heading" className="text-xl font-bold">
            4. Automated CI / CD Accessibility Gate (Vitest / Playwright)
          </h2>
          <CodeBlock
            filename="a11y-ci.test.ts"
            code={`import { expect, test } from "vitest";
import { runDomAudit, getContrastRatio, parseColor } from "lens-a11y";

test("enforces 100/100 WCAG audit score before merge", () => {
  const report = runDomAudit(document);
  expect(report.issues).toEqual([]);
  expect(report.score).toBe(100);
});`}
          />
        </section>
      </div>
    </div>
  );
}