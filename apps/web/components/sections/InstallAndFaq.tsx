"use client";

import React, { useState } from "react";
import { CodeBlock } from "../ui/CodeBlock";

const INSTALL_SNIPPETS = {
  script: {
    filename: "index.html (One-Line CDN Script)",
    code: `<script src="https://cdn.jsdelivr.net/npm/lens-a11y@0.1/dist/lens.min.js" data-lens="deuteranopia"></script>`,
  },
  npm: {
    filename: "terminal + app.ts",
    code: `pnpm add lens-a11y\n\nimport { Lens } from "lens-a11y";\nLens.mount({ position: "bottom-right" });\nLens.simulate("cataracts");`,
  },
  react: {
    filename: "App.tsx (React / Next.js)",
    code: `"use client";\nimport { useEffect } from "react";\nimport { Lens } from "lens-a11y";\n\nexport function AccessibilityToolbar() {\n  useEffect(() => {\n    Lens.mount({ theme: "auto" });\n    return () => Lens.off();\n  }, []);\n  return null;\n}`,
  },
  bookmarklet: {
    filename: "Bookmarklet URL (Drag to Bookmarks Bar on /install)",
    code: `javascript:(function(){if(window.Lens){window.Lens.mount();return;}var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/lens-a11y@0.1/dist/lens.min.js';s.onload=function(){window.Lens&&window.Lens.mount();};document.head.appendChild(s);})();`,
  },
};

export function InstallAndFaq() {
  const [tab, setTab] = useState<keyof typeof INSTALL_SNIPPETS>("script");

  return (
    <div>
      {/* 05 / INSTALL TABS */}
      <div
        style={{ fontFamily: "var(--font-mono)" }}
        className="mb-3 text-xs uppercase tracking-[0.14em] text-[var(--muted)]"
      >
        05 / ZERO-CONFIG INTEGRATION
      </div>
      <h2
        id="install-heading"
        className="text-2xl sm:text-4xl font-bold tracking-[-0.04em]"
      >
        Drop into any stack in{" "}
        <span
          style={{ fontFamily: "var(--font-serif)", color: "var(--accent)" }}
          className="font-normal italic tracking-normal"
        >
          seconds
        </span>
      </h2>

      <div
        role="tablist"
        aria-label="Installation method tabs"
        className="mt-6 flex flex-wrap gap-2"
      >
        {[
          { id: "script", label: "Script Tag" },
          { id: "npm", label: "npm / pnpm" },
          { id: "react", label: "React / Next.js" },
          { id: "bookmarklet", label: "Bookmarklet" },
        ].map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.id as keyof typeof INSTALL_SNIPPETS)}
              style={{
                fontFamily: "var(--font-mono)",
                backgroundColor: active ? "var(--accent)" : "var(--surface)",
                color: active ? "var(--accent-ink)" : "var(--ink)",
              }}
              className="min-h-[44px] cursor-pointer rounded-lg border px-4 text-xs font-medium uppercase tracking-wider"
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <CodeBlock
          filename={INSTALL_SNIPPETS[tab].filename}
          code={INSTALL_SNIPPETS[tab].code}
        />
      </div>

      {/* 06 / FAQ SECTION */}
      <div className="mt-16 border-t pt-12">
        <div
          style={{ fontFamily: "var(--font-mono)" }}
          className="mb-3 text-xs uppercase tracking-[0.14em] text-[var(--muted)]"
        >
          06 / FREQUENTLY ASKED QUESTIONS
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
            {
              q: "Does Lens permanently alter my website's DOM or styles?",
              a: "Never. The Floating HUD lives inside an isolated Shadow DOM, and all simulations—including Dyslexia text-node swapping—restore the exact original DOM state immediately when turned off.",
            },
            {
              q: "Does it require any backend, API keys, or telemetry?",
              a: "Zero. Everything runs 100% locally in the browser using native SVG feColorMatrix filters, CSS rules, and computed styles. Bundle size is under 15 KB gzipped.",
            },
            {
              q: "How accurate are the color blindness simulations?",
              a: "Aperture uses the peer-reviewed Machado, Oliveira, and Fernandes (2009) physiologically-based color-vision deficiency matrices in sRGB space.",
            },
            {
              q: "Can I run the WCAG auditor in automated CI pipelines?",
              a: "Yes! Import runDomAudit and getContrastRatio directly from lens-a11y in Vitest or Playwright to gate pull requests on accessibility scores.",
            },
          ].map((faq) => (
            <article key={faq.q} className="optical-card p-5">
              <h3 className="text-base font-semibold tracking-[-0.01em]">
                {faq.q}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
                {faq.a}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}