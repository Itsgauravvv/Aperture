import React from "react";
import { CodeBlock } from "@/components/ui/CodeBlock";

const SIM_REFERENCE = [
  {
    id: '"deuteranopia"',
    category: "Color Matrix (SVG)",
    opticalSpec: "Machado M-Cone 5×4 Matrix",
    vibe: "Mutes green wavelengths; red and green status pills collapse into the same olive tone.",
  },
  {
    id: '"protanopia"',
    category: "Color Matrix (SVG)",
    opticalSpec: "Machado L-Cone 5×4 Matrix",
    vibe: "Dims red wavelengths heavily; crimson error states look dark brown or nearly black.",
  },
  {
    id: '"tritanopia"',
    category: "Color Matrix (SVG)",
    opticalSpec: "Machado S-Cone 5×4 Matrix",
    vibe: "Blue-yellow confusion; sky blues shift teal and warm yellows shift toward pale pink.",
  },
  {
    id: '"achromatopsia"',
    category: "Color Matrix (SVG)",
    opticalSpec: "Rec.709 Luminance Monochrome",
    vibe: "Zero hue perception. Pure luminance vision—proves why color alone can never convey state.",
  },
  {
    id: '"cataracts"',
    category: "CSS Optical Filter",
    opticalSpec: "Adjustable Blur + Warm Sepia Haze",
    vibe: "Simulates crystalline lens clouding. Washes out faint borders and low-contrast muted text.",
  },
  {
    id: '"low-vision"',
    category: "CSS Optical Filter",
    opticalSpec: "Diopter Gaussian Blur (1.5px–8px)",
    vibe: "Tests whether your visual hierarchy survives when 12px micro-copy blurs out.",
  },
  {
    id: '"glaucoma"',
    category: "Pointer Radial Mask",
    opticalSpec: "150px Peripheral Tunnel Vignette",
    vibe: "Cuts off peripheral vision. Shows why corner toast notifications go completely unnoticed.",
  },
  {
    id: '"macular"',
    category: "Pointer Radial Mask",
    opticalSpec: "135px Central Scotoma Blackout",
    vibe: "Blocks the exact center of gaze, forcing users to read UI using peripheral sight.",
  },
  {
    id: '"glare"',
    category: "CSS Optical Filter",
    opticalSpec: "Halation Bloom (+38% Brightness)",
    vibe: "Simulates photophobia or harsh sunlight washing out subtle light-mode surfaces.",
  },
  {
    id: '"low-contrast"',
    category: "CSS Optical Filter",
    opticalSpec: "Contrast Compression (-62%)",
    vibe: "Exposes trendy grey-on-grey typography that fails the moment screen contrast drops.",
  },
  {
    id: '"dyslexia"',
    category: "Cognitive DOM Walker",
    opticalSpec: "Lossless Internal Character Swap",
    vibe: "Simulates orthographic crowding fatigue while keeping a 100% reversible TextNode map.",
  },
  {
    id: '"tremor"',
    category: "Motor + Bounding Box",
    opticalSpec: "Pointer Jitter + <44px Target Audit",
    vibe: "Adds hand-tremor displacement and flags every tiny button that fails WCAG 44×44px rules.",
  },
  {
    id: '"keyboard-path"',
    category: "Navigation Topology",
    opticalSpec: "SVG Vector Polyline + Stop Badges",
    vibe: "Draws the exact Tab-key trajectory across the live DOM so focus traps have nowhere to hide.",
  },
];

const AUDIT_RULES = [
  {
    rule: "color-contrast",
    severity: "ERROR (-9 pts)",
    threshold: "4.5:1 (Normal) / 3.0:1 (Large)",
    explanation:
      "Walks up the DOM tree, alpha-blends semi-transparent layers, and computes exact W3C relative luminance.",
  },
  {
    rule: "target-size",
    severity: "WARNING (-5 pts)",
    threshold: ">= 44×44px bounding box",
    explanation:
      "Measures live getBoundingClientRect() dimensions on every interactive button, link, and input.",
  },
  {
    rule: "button-name",
    severity: "ERROR (-9 pts)",
    threshold: "Non-empty text or aria-label",
    explanation:
      "Catches icon-only buttons that announce simply as 'button' to VoiceOver and NVDA users.",
  },
  {
    rule: "input-label",
    severity: "ERROR (-9 pts)",
    threshold: "Associated <label> or aria-label",
    explanation:
      "Flags form inputs relying solely on placeholders (which vanish the moment a user starts typing).",
  },
  {
    rule: "img-alt",
    severity: "ERROR (-9 pts)",
    threshold: 'Explicit alt="..." attribute',
    explanation:
      "Ensures every <img> either describes its content or declares alt=\"\" for decorative graphics.",
  },
  {
    rule: "heading-order",
    severity: "WARNING (-5 pts)",
    threshold: "Sequential h1 → h2 → h3",
    explanation:
      "Flags skipped heading levels (like jumping from h1 to h4) that break screen-reader document outlines.",
  },
  {
    rule: "html-lang",
    severity: "ERROR (-9 pts)",
    threshold: 'Valid <html lang="...">',
    explanation:
      "Required so assistive speech synthesizers load the correct phonetic pronunciation rules.",
  },
  {
    rule: "landmarks",
    severity: "WARNING (-5 pts)",
    threshold: 'Present <main> or [role="main"]',
    explanation:
      "Ensures keyboard and screen-reader users can bypass repetitive navbars straight to primary content.",
  },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
      <div className="border-x border-b py-14 px-6 sm:px-12">
        {/* Top Editorial Header */}
        <div
          style={{ fontFamily: "var(--font-mono)" }}
          className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.14em] text-[var(--muted)]"
        >
          <span>FIELD MANUAL // LENS-A11Y SPECIFICATION v0.1</span>
          <span>ZERO DEPENDENCIES // &lt;15 KB GZIP // MIT</span>
        </div>

        <h1 className="mt-4 max-w-4xl text-4xl sm:text-6xl font-bold tracking-[-0.04em] leading-[1.05]">
          Ship interfaces that don&apos;t{" "}
          <span
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--accent)",
            }}
            className="font-normal italic tracking-normal px-1"
          >
            gatekeep.
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-base sm:text-lg text-[var(--muted)] leading-relaxed">
          Most accessibility tools feel like a 2008 enterprise spreadsheet.{" "}
          <strong>Aperture</strong> (`lens-a11y`) is built for design engineers
          who care about craft: a precision optical instrument that lets you
          experience your live DOM through 13 clinical vision, cognitive, and
          motor models—and catches WCAG violations before they hit production.
        </p>

        {/* Quick Architecture Pills */}
        <div
          style={{ fontFamily: "var(--font-mono)" }}
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-4 text-xs"
        >
          {[
            {
              k: "01 // ISOLATION",
              v: "Shadow-DOM HUD",
              d: "Host CSS never leaks in. Optical filters never blur the HUD.",
            },
            {
              k: "02 // FOOTPRINT",
              v: "Zero Dependencies",
              d: "Pure TypeScript + native SVG feColorMatrix. Under 15 KB.",
            },
            {
              k: "03 // REVERSIBLE",
              v: "Lossless DOM Restore",
              d: "Every text node and style restores 100% cleanly on Lens.off().",
            },
            {
              k: "04 // EASTER EGG",
              v: "Press Shift + P",
              d: "Triggers the Darkroom Screen-Reader Empathy Challenge.",
            },
          ].map((pill) => (
            <div key={pill.k} className="optical-card p-4">
              <div className="text-[var(--muted)]">{pill.k}</div>
              <div className="mt-1 text-sm font-bold text-[var(--ink)]">
                {pill.v}
              </div>
              <p className="mt-1 text-[var(--muted)] leading-normal">{pill.d}</p>
            </div>
          ))}
        </div>

        {/* Main 12-Column Documentation Layout */}
        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 border-t pt-12">
          {/* Left Sticky Table of Contents */}
          <aside className="lg:col-span-3">
            <nav
              aria-label="Documentation sections"
              style={{ fontFamily: "var(--font-mono)" }}
              className="sticky top-24 space-y-2 text-xs uppercase tracking-wider"
            >
              <div className="text-[var(--muted)] pb-2 border-b">
                INDEX // ON THIS PAGE
              </div>
              {[
                { href: "#quickstart", label: "01 / Quickstart" },
                { href: "#api-methods", label: "02 / Public API" },
                { href: "#mount-options", label: "03 / Mount Config" },
                { href: "#simulation-catalog", label: "04 / 13 Optical Modes" },
                { href: "#auditor-engine", label: "05 / WCAG Auditor Math" },
                { href: "#telemetry-events", label: "06 / DOM Events" },
                { href: "#ci-gate", label: "07 / CI/CD Quality Gate" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex min-h-[40px] items-center rounded-lg px-2.5 text-[var(--muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--ink)]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Right Documentation Content */}
          <div className="lg:col-span-9 space-y-16">
            {/* SECTION 01: QUICKSTART */}
            <section id="quickstart" className="space-y-4 scroll-mt-24">
              <div
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs uppercase tracking-widest text-[var(--accent)]"
              >
                01 / ZERO-FRICTION SETUP
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em]">
                One line for script tags. Typed ESM for modern stacks.
              </h2>
              <p className="text-sm sm:text-base text-[var(--muted)]">
                Whether you&apos;re prototyping a static HTML file or shipping a
                Next.js 15 monorepo, Aperture mounts in milliseconds with zero
                provider boilerplate.
              </p>

              <CodeBlock
                filename="Option A — Declarative CDN Script Tag (Auto-Mounts HUD)"
                code={`<!-- Drop anywhere in <head> or <body> -->
<script
  src="https://cdn.jsdelivr.net/npm/lens-a11y@0.1/dist/lens.min.js"
  data-lens="deuteranopia"
></script>`}
              />

              <CodeBlock
                filename="Option B — npm / pnpm / bun (ESM + TypeScript)"
                code={`pnpm add lens-a11y

import { Lens } from "lens-a11y";

// Mount the floating viewfinder HUD in your dev environment
if (process.env.NODE_ENV === "development") {
  Lens.mount({
    position: "bottom-right",
    theme: "auto",
  });
}`}
              />
            </section>

            {/* SECTION 02: PUBLIC API */}
            <section id="api-methods" className="space-y-4 scroll-mt-24 border-t pt-12">
              <div
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs uppercase tracking-widest text-[var(--accent)]"
              >
                02 / PROGRAMMATIC CONTROL
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em]">
                The `Lens`Singleton API
              </h2>
              <p className="text-sm sm:text-base text-[var(--muted)]">
                Every capability inside the floating HUD is exposed
                programmatically on the `Lens` controller—so you can bind
                simulations to your own keyboard shortcuts, Storybook toolbars,
                or automated test runners.
              </p>

              <CodeBlock
                filename="lens-controller-api.ts"
                code={`import { Lens, runDomAudit, getContrastRatio, parseColor } from "lens-a11y";

// 1. Mount the Shadow-DOM HUD
Lens.mount({
  initialSimulation: "none",
  initialIntensity: 65,
  position: "bottom-right",
  theme: "auto",
});

// 2. Trigger any vision, cognitive, motor, or keyboard topology mode
Lens.simulate("cataracts", 80); // Second arg sets diopter intensity (0..100)
Lens.simulate("glaucoma");      // Pointer-following peripheral tunnel mask
Lens.simulate("dyslexia");      // Reversible orthographic letter swap

// 3. Adjust intensity dynamically on active filter
Lens.setIntensity(45);

// 4. Run the 8-rule WCAG 2.1 scanner on the full document (or a scoped HTMLElement)
const report = Lens.audit();
console.log(report.score);      // e.g. 100
console.log(report.issues);     // Array of AuditIssue objects with CSS selectors & fixes

// 5. Inspect current state or cleanly tear down
const state = Lens.getState();  // { mounted, activeSimulation, intensity, lastAudit }
Lens.off();                     // Restores all DOM text/styles & unmounts HUD`}
              />
            </section>

            {/* SECTION 03: MOUNT CONFIGURATION */}
            <section id="mount-options" className="space-y-4 scroll-mt-24 border-t pt-12">
              <div
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs uppercase tracking-widest text-[var(--accent)]"
              >
                03 / CONFIGURATION SCHEMA
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em]">
                `Lens.mount(options)` Reference
              </h2>

              <div className="overflow-x-auto rounded-xl border bg-[var(--surface)]">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="border-b bg-[var(--bg)] text-xs uppercase text-[var(--muted)]"
                  >
                    <tr>
                      <th className="p-3.5">Property</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Default</th>
                      <th className="p-3.5">Behavior</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-3.5 font-mono font-semibold">initialSimulation</td>
                      <td className="p-3.5 font-mono text-[var(--accent)]">SimulationType</td>
                      <td className="p-3.5 font-mono">&quot;none&quot;</td>
                      <td className="p-3.5 text-[var(--muted)]">
                        Boots immediately into a specific vision or motor filter on mount.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-mono font-semibold">initialIntensity</td>
                      <td className="p-3.5 font-mono text-[var(--accent)]">number (0–100)</td>
                      <td className="p-3.5 font-mono">65</td>
                      <td className="p-3.5 text-[var(--muted)]">
                        Controls diopter blur and opacity strength for `low-vision` and `cataracts`.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-mono font-semibold">position</td>
                      <td className="p-3.5 font-mono text-[var(--accent)]">
                        &quot;bottom-right&quot; | &quot;bottom-left&quot; | &quot;top-right&quot; | &quot;top-left&quot;
                      </td>
                      <td className="p-3.5 font-mono">&quot;bottom-right&quot;</td>
                      <td className="p-3.5 text-[var(--muted)]">
                        Initial anchor corner. User can freely drag via pointer or Arrow keys.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-mono font-semibold">theme</td>
                      <td className="p-3.5 font-mono text-[var(--accent)]">
                        &quot;auto&quot; | &quot;light&quot; | &quot;dark&quot; | &quot;contrast&quot;
                      </td>
                      <td className="p-3.5 font-mono">&quot;auto&quot;</td>
                      <td className="p-3.5 text-[var(--muted)]">
                        Synchronizes with the host page&apos;s `data-theme` attribute via MutationObserver.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* SECTION 04: ALL 13 SIMULATION MODES */}
            <section id="simulation-catalog" className="space-y-4 scroll-mt-24 border-t pt-12">
              <div
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs uppercase tracking-widest text-[var(--accent)]"
              >
                04 / CLINICAL &amp; OPTICAL MODELS
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em]">
                13 Simulation Modes. Zero Guesswork.
              </h2>
              <p className="text-sm sm:text-base text-[var(--muted)]">
                Pass any of these mode IDs into `Lens.simulate(id)` or `data-lens="..."`:
              </p>

              <div className="overflow-x-auto rounded-xl border bg-[var(--surface)]">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="border-b bg-[var(--bg)] text-xs uppercase text-[var(--muted)]"
                  >
                    <tr>
                      <th className="p-3.5">Mode ID</th>
                      <th className="p-3.5">Engine</th>
                      <th className="p-3.5">Optical Specification</th>
                      <th className="p-3.5">What It Exposes in Your UI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {SIM_REFERENCE.map((item) => (
                      <tr key={item.id}>
                        <td className="p-3.5 font-mono font-bold text-[var(--accent)]">
                          {item.id}
                        </td>
                        <td className="p-3.5 font-mono text-xs">{item.category}</td>
                        <td className="p-3.5 font-mono text-xs text-[var(--muted)]">
                          {item.opticalSpec}
                        </td>
                        <td className="p-3.5 text-[var(--muted)]">{item.vibe}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* SECTION 05: AUDITOR ENGINE & MATH */}
            <section id="auditor-engine" className="space-y-4 scroll-mt-24 border-t pt-12">
              <div
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs uppercase tracking-widest text-[var(--accent)]"
              >
                05 / AUTOMATED WCAG 2.1 AUDITOR
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em]">
                Real Luminance Math. Not Regex Approximations.
              </h2>
              <p className="text-sm sm:text-base text-[var(--muted)]">
                When you call `Lens.audit()`, Aperture walks the live DOM,
                resolves `getComputedStyle()` colors across semi-transparent
                parent surfaces using alpha compositing, linearizes sRGB
                channels, and evaluates the W3C relative luminance equation:
              </p>

              <div
                style={{ fontFamily: "var(--font-mono)" }}
                className="rounded-xl border bg-[var(--surface)] p-4 text-xs sm:text-sm text-[var(--accent)]"
              >
                L = 0.2126 × R_lin + 0.7152 × G_lin + 0.0722 × B_lin &nbsp;//&nbsp;
                Contrast Ratio = (L_brightest + 0.05) / (L_darkest + 0.05)
              </div>

              <div className="overflow-x-auto rounded-xl border bg-[var(--surface)]">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="border-b bg-[var(--bg)] text-xs uppercase text-[var(--muted)]"
                  >
                    <tr>
                      <th className="p-3.5">Rule ID</th>
                      <th className="p-3.5">Weight</th>
                      <th className="p-3.5">WCAG Target</th>
                      <th className="p-3.5">How Aperture Verifies It</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {AUDIT_RULES.map((r) => (
                      <tr key={r.rule}>
                        <td className="p-3.5 font-mono font-bold text-[var(--accent)]">
                          {r.rule}
                        </td>
                        <td className="p-3.5 font-mono text-xs">{r.severity}</td>
                        <td className="p-3.5 font-mono text-xs">{r.threshold}</td>
                        <td className="p-3.5 text-[var(--muted)]">{r.explanation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* SECTION 06: DOM TELEMETRY EVENTS */}
            <section id="telemetry-events" className="space-y-4 scroll-mt-24 border-t pt-12">
              <div
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs uppercase tracking-widest text-[var(--accent)]"
              >
                06 / EVENT TELEMETRY
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em]">
                Subscribe to Live HUD State
              </h2>
              <CodeBlock
                filename="telemetry-listeners.ts"
                code={`// Fires whenever the active simulation or intensity slider changes
window.addEventListener("lens:change", (event: Event) => {
  const { simulation, intensity } = (event as CustomEvent).detail;
  console.log(\`[Aperture] Mode: \${simulation} @ \${intensity}%\`);
});

// Fires whenever Lens.audit() completes a scan
window.addEventListener("lens:audit", (event: Event) => {
  const report = (event as CustomEvent).detail;
  console.table(report.issues.map((i: any) => ({
    rule: i.ruleId,
    title: i.title,
    selector: i.selector,
  })));
});`}
              />
            </section>

            {/* SECTION 07: CI/CD QUALITY GATE */}
            <section id="ci-gate" className="space-y-4 scroll-mt-24 border-t pt-12">
              <div
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs uppercase tracking-widest text-[var(--accent)]"
              >
                07 / AUTOMATED CI GATE
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em]">
                Block Inaccessible PRs in GitHub Actions
              </h2>
              <p className="text-sm sm:text-base text-[var(--muted)]">
                Aperture dogfoods its own contrast and DOM auditor in CI. Import
                the pure math and scanner helpers directly inside Vitest or
                Playwright to guarantee your design tokens never regress below
                WCAG AA/AAA:
              </p>

              <CodeBlock
                filename="test/a11y-gate.test.ts"
                code={`import { describe, expect, it } from "vitest";
import { getContrastRatio, parseColor, runDomAudit } from "lens-a11y";

describe("Design System Accessibility Gate", () => {
  it("enforces >= 4.5:1 WCAG AA contrast on all theme tokens", () => {
    const surface = parseColor("#121217")!;
    const primaryText = parseColor("#f2f2f5")!;
    const mutedText = parseColor("#a0a0ad")!;

    expect(getContrastRatio(primaryText, surface)).toBeGreaterThanOrEqual(7.0); // AAA
    expect(getContrastRatio(mutedText, surface)).toBeGreaterThanOrEqual(4.5);   // AA
  });

  it("requires a 100/100 DOM audit score on core templates", () => {
    const report = runDomAudit(document);
    expect(report.issues).toEqual([]);
    expect(report.score).toBe(100);
  });
});`}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}