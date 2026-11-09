import React from "react";
import { HeroOpticalDial } from "@/components/sections/HeroOpticalDial";
import { LaunchHudButton } from "@/components/ui/LaunchHudButton";
import { FocusPull } from "@/components/ui/FocusPull";
import { HeroLens } from "@/components/sections/HeroLens";
import { SimulationGrid } from "@/components/sections/SimulationGrid";
import { SplitPlayground } from "@/components/sections/SplitPlayground";
import { AuditDemo } from "@/components/sections/AuditDemo";
import { KeyboardPathDemo } from "@/components/sections/KeyboardPathDemo";
import { InstallAndFaq } from "@/components/sections/InstallAndFaq";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
      {/* 00 / HERO SECTION */}
      <section
        aria-labelledby="hero-heading"
        className="relative border-x border-b py-14 sm:py-20 px-6 sm:px-12"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-2.5 -left-2 text-sm text-[var(--muted)] select-none"
        >
          +
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-2.5 -right-2 text-sm text-[var(--muted)] select-none"
        >
          +
        </span>

        <div
          style={{ fontFamily: "var(--font-mono)" }}
          className="mb-6 flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.14em] text-[var(--muted)]"
        >
          <span>00 / OPTICAL ACCESSIBILITY INSTRUMENT</span>
          <span>LENS-A11Y // ZERO-DEPENDENCY // &lt;15KB GZIP</span>
        </div>

        <FocusPull>
          <h1
            id="hero-heading"
            className="max-w-4xl text-4xl font-bold tracking-[-0.04em] sm:text-6xl lg:text-7xl leading-[1.04]"
          >
            See your website the way{" "}
            <span
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--accent)",
              }}
              className="font-normal italic tracking-normal px-1"
            >
              everyone
            </span>{" "}
            else does.
          </h1>
        </FocusPull>

        <p className="mt-6 max-w-2xl text-base sm:text-lg text-[var(--muted)] leading-relaxed">
          Most interfaces are calibrated for a single pair of eyes on a $2,000
          studio display. <strong>Aperture</strong> (`lens-a11y`) is a precision
          optical instrument that simulates color blindness, cataracts,
          glaucoma, dyslexia, and motor tremors directly on your live DOM—and
          audits WCAG 2.1 compliance in real time.
        </p>

        {/* Key Telemetry Metrics Bar */}
        <div
          style={{ fontFamily: "var(--font-mono)" }}
          className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-3xl"
        >
          {[
            { metric: "13 MODES", sub: "OPTICAL / COGNITIVE / MOTOR" },
            { metric: "< 15 KB", sub: "ZERO-DEPENDENCY GZIP" },
            { metric: "8 RULES", sub: "LIVE WCAG 2.1 DOM SCANNER" },
            { metric: "SHIFT + P", sub: "DARKROOM EMPATHY CHALLENGE" },
          ].map((m) => (
            <div
              key={m.metric}
              className="rounded-lg border bg-[var(--surface)] p-3"
            >
              <div className="text-base sm:text-lg font-bold text-[var(--ink)]">
                {m.metric}
              </div>
              <div className="text-[10px] tracking-wider text-[var(--muted)]">
                {m.sub}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <LaunchHudButton />
          <a
            href="/playground"
            className="inline-flex min-h-[44px] items-center justify-center rounded-[10px] border px-5 py-2.5 text-sm font-medium transition-colors hover:border-[var(--accent)]"
          >
            Open Interactive Sandbox
          </a>
          <a
            href="/docs"
            className="inline-flex min-h-[44px] items-center justify-center rounded-[10px] border px-5 py-2.5 text-sm font-medium transition-colors hover:border-[var(--accent)]"
          >
            Read Field Manual
          </a>
        </div>
        
        <div className="lg:col-span-5 w-full">
            <HeroOpticalDial />
        </div>

        <HeroLens />
      </section>

      {/* CONDITION TELEMETRY STRIP */}
      <div
        aria-hidden="true"
        style={{ fontFamily: "var(--font-mono)" }}
        className="border-x border-b py-3 px-6 text-xs uppercase tracking-[0.18em] text-[var(--muted)] overflow-x-auto whitespace-nowrap"
      >
        PROTANOPIA &bull; DEUTERANOPIA &bull; TRITANOPIA &bull; ACHROMATOPSIA
        &bull; CATARACTS &bull; GLAUCOMA &bull; MACULAR DEGENERATION &bull;
        PHOTOPHOBIA &bull; DYSLEXIA &bull; MOTOR TREMOR &bull; TAB TOPOLOGY
      </div>

      {/* 01 / SIMULATIONS GRID */}
      <section
        id="simulations"
        aria-labelledby="sim-heading"
        className="relative border-x border-b py-16 px-6 sm:px-12"
      >
        <FocusPull>
          <SimulationGrid />
        </FocusPull>
      </section>

      {/* 02 / SPLIT BEFORE-AFTER PLAYGROUND */}
      <section
        aria-labelledby="playground-heading"
        className="relative border-x border-b py-16 px-6 sm:px-12"
      >
        <FocusPull>
          <SplitPlayground />
        </FocusPull>
      </section>

      {/* 03 / AUTOMATED AUDITOR DEMO */}
      <section
        aria-labelledby="audit-demo-heading"
        className="relative border-x border-b py-16 px-6 sm:px-12"
      >
        <FocusPull>
          <AuditDemo />
        </FocusPull>
      </section>

      {/* 04 / KEYBOARD TAB-PATH DEMO */}
      <section
        aria-labelledby="keyboard-demo-heading"
        className="relative border-x border-b py-16 px-6 sm:px-12"
      >
        <FocusPull>
          <KeyboardPathDemo />
        </FocusPull>
      </section>

      {/* NEW: UNDER THE HOOD / OPTICAL ARCHITECTURE DEEP-DIVE */}
      <section
        aria-labelledby="arch-heading"
        className="relative border-x border-b py-16 px-6 sm:px-12"
      >
        <FocusPull>
          <div
            style={{ fontFamily: "var(--font-mono)" }}
            className="mb-3 text-xs uppercase tracking-[0.14em] text-[var(--muted)]"
          >
            05 / UNDER THE HOOD // SYSTEM ARCHITECTURE
          </div>
          <h2
            id="arch-heading"
            className="max-w-3xl text-2xl sm:text-4xl font-bold tracking-[-0.04em]"
          >
            Engineered like a camera.{" "}
            <span
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--accent)",
              }}
              className="font-normal italic tracking-normal"
            >
              Zero
            </span>{" "}
            compromises on runtime weight.
          </h2>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-[var(--muted)]">
            Every design decision inside `lens-a11y` prioritizes clinical
            accuracy, complete DOM isolation, and instant teardown so you can
            run it safely on production apps.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                tag: "ARCH-01 // SHADOW DOM",
                title: "Hermetic CSS & Filter Isolation",
                body: "The floating HUD mounts inside an encapsulated Shadow Root (#lens-a11y-host) with Trusted Types support. Host stylesheets never bleed into the instrument, and SVG color matrices filter the host page without distorting the HUD.",
              },
              {
                tag: "ARCH-02 // MACHADO MATRICES",
                title: "Physiological sRGB Color Math",
                body: "Instead of naive hue shifts, Aperture injects hardware-accelerated <feColorMatrix> primitives calibrated to Machado, Oliveira & Fernandes (2009) cone-deficiency equations alongside alpha-blended WCAG 2.1 luminance checks.",
              },
              {
                tag: "ARCH-03 // LOSSLESS DOM",
                title: "100% Reversible TreeWalker State",
                body: "Cognitive and motor modes inspect text and interactive bounding boxes using native TreeWalker APIs, caching original TextNode references in a WeakMap/Map so calling Lens.off() restores the exact byte-for-byte DOM.",
              },
            ].map((item) => (
              <article key={item.tag} className="optical-card p-6">
                <div
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-xs text-[var(--accent)] font-semibold"
                >
                  {item.tag}
                </div>
                <h3 className="mt-2 text-lg font-bold tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--muted)]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </FocusPull>
      </section>

      {/* 06 / INSTALL TABS + FAQ */}
      <section
        aria-labelledby="install-heading"
        className="relative border-x border-b py-16 px-6 sm:px-12"
      >
        <FocusPull>
          <InstallAndFaq />
        </FocusPull>
      </section>

      {/* MONUMENTAL EDITORIAL FOOTER + GITHUB STAR CALLOUT */}
      <footer
        role="contentinfo"
        className="relative border-x py-16 sm:py-24 px-6 sm:px-12 overflow-hidden"
      >
        {/* Support / Star on GitHub Callout Banner */}
        <div className="optical-card mb-14 p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div
              style={{ fontFamily: "var(--font-mono)" }}
              className="text-xs uppercase tracking-widest text-[var(--accent)] font-semibold"
            >
              COMMUNITY &amp; OPEN-SOURCE CRAFT
            </div>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-[-0.03em]">
              Built for the web, free forever. Show your support by dropping a ★
              on GitHub.
            </h2>
            
          </div>

          <a
            href="https://github.com/Itsgauravvv/Aperture"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--accent-ink)",
              fontFamily: "var(--font-mono)",
            }}
            className="inline-flex min-h-[44px] items-center gap-2.5 rounded-[10px] px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-sm transition-opacity hover:opacity-90"
          >
            <span>★ Star Aperture on GitHub</span>
          </a>
        </div>

        {/* Big Signature Editorial Tagline */}
        <div className="border-t pt-12">
          <div
            style={{ fontFamily: "var(--font-mono)" }}
            className="mb-4 text-xs uppercase tracking-[0.16em] text-[var(--muted)]"
          >
            APERTURE MANIFESTO // LENS-A11Y
          </div>

          <p className="max-w-5xl text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[1.04]">
            Open source.{" "}
            <span
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--accent)",
              }}
              className="font-normal italic tracking-normal px-1"
            >
              Inclusive
            </span>{" "}
            by design.{" "}
            <span
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--accent)",
              }}
              className="font-normal italic tracking-normal px-1"
            >
              Accessible
            </span>{" "}
            by default.
          </p>
        </div>

        {/* Bottom Metadata Line */}
        <div
          style={{ fontFamily: "var(--font-mono)" }}
          className="mt-12 border-t pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--muted)]"
        >
          <div>
            APERTURE (LENS-A11Y v0.1) // MIT LICENSE // BUILT BY GAURAV JOSHI
          </div>
          <div className="flex items-center gap-4">
            <span>PRESS SHIFT + P FOR DARKROOM CHALLENGE</span>
            <span>&bull;</span>
            <span>100/100 WCAG DOGFOODED</span>
          </div>
        </div>
      </footer>
    </div>
  );
}