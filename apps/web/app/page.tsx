import React from "react";
import { LaunchHudButton } from "@/components/ui/LaunchHudButton";
import { FocusPull } from "@/components/ui/FocusPull";
import { HeroLens } from "@/components/sections/HeroLens";
import { SimulationGrid } from "@/components/sections/SimulationGrid";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
      {/* 00 / HERO SECTION WITH INTERACTIVE OPTICAL LENS */}
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

        {/* Interactive Hero Viewfinder Lens */}
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

      {/* 01 / 8-CARD LIVE SIMULATION GRID */}
      <section
        id="simulations"
        aria-labelledby="sim-heading"
        className="relative border-x border-b py-16 px-6 sm:px-12"
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

        <FocusPull>
          <SimulationGrid />
        </FocusPull>
      </section>
    </div>
  );
}