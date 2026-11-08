import React from "react";
import { LaunchHudButton } from "@/components/ui/LaunchHudButton";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
      {/* HERO SHELL */}
      <section
        aria-labelledby="hero-heading"
        className="relative border-x border-b py-16 sm:py-24 px-6 sm:px-12"
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

        <p className="mt-6 max-w-2xl text-base sm:text-lg text-[var(--muted)]">
          Drop a single script tag onto any site to simulate color blindness,
          cataracts, glaucoma, dyslexia, and motor tremors in real time—plus run
          an instant WCAG accessibility audit.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <LaunchHudButton />
          <a
            href="/docs"
            className="inline-flex min-h-[44px] items-center justify-center rounded-[10px] border px-5 py-2.5 text-sm font-medium transition-colors hover:border-[var(--accent)]"
          >
            Read API Documentation
          </a>
        </div>
      </section>

      {/* 01 / SIMULATIONS PREVIEW SHELL (12-Column Grid) */}
      <section
        id="simulations"
        aria-labelledby="sim-heading"
        className="relative border-x border-b py-16 px-6 sm:px-12"
      >
        <div
          style={{ fontFamily: "var(--font-mono)" }}
          className="mb-3 text-xs uppercase tracking-[0.14em] text-[var(--muted)]"
        >
          01 / SIMULATIONS
        </div>
        <h2
          id="sim-heading"
          className="text-2xl sm:text-3xl font-bold tracking-[-0.04em]"
        >
          Precision optical &amp; motor{" "}
          <span
            style={{ fontFamily: "var(--font-serif)", color: "var(--accent)" }}
            className="font-normal italic tracking-normal"
          >
            calibration
          </span>
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-12">
          {[
            {
              code: "SIM-01",
              title: "Vision Filters",
              desc: "Protanopia, deuteranopia, tritanopia, cataracts, glaucoma tunnel mask, and macular degeneration.",
            },
            {
              code: "SIM-02",
              title: "Cognitive & Motor",
              desc: "Reversible per-letter dyslexia jitter, cursor tremor simulation, and <44px tap-target overlays.",
            },
            {
              code: "SIM-03",
              title: "Live WCAG Auditor",
              desc: "Computes real contrast ratios, flags missing landmarks, and draws numbered callout paths on the DOM.",
            },
          ].map((card) => (
            <article
              key={card.code}
              tabIndex={0}
              className="optical-card md:col-span-4 p-6"
            >
              <div
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs text-[var(--muted)]"
              >
                {card.code}
              </div>
              <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em]">
                {card.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{card.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}