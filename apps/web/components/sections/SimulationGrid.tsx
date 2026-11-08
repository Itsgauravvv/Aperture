"use client";

import React, { useState } from "react";
import { Lens, SimulationType } from "lens-a11y";

interface SimCardSpec {
  id: SimulationType;
  code: string;
  name: string;
  prevalence: string;
  description: string;
  previewFilter: string;
  maskType?: "glaucoma" | "macular" | "dyslexia";
}

const SIM_CARDS: SimCardSpec[] = [
  {
    id: "deuteranopia",
    code: "01 // M-CONE",
    name: "Deuteranopia",
    prevalence: "~6% of males",
    description:
      "Absent green-sensitive M-cones cause red and green hues to collapse into muted olive-brown tones.",
    previewFilter: "url(#showcase-deuteranopia)",
  },
  {
    id: "protanopia",
    code: "02 // L-CONE",
    name: "Protanopia",
    prevalence: "~1% of males",
    description:
      "Absent red-sensitive L-cones dim red wavelengths significantly and confuse red, orange, and green UI alerts.",
    previewFilter: "url(#showcase-protanopia)",
  },
  {
    id: "tritanopia",
    code: "03 // S-CONE",
    name: "Tritanopia",
    prevalence: "~0.01% global",
    description:
      "Blue-yellow color blindness reduces sensitivity to short blue wavelengths, shifting blues toward teal and yellows toward pink.",
    previewFilter: "url(#showcase-tritanopia)",
  },
  {
    id: "cataracts",
    code: "04 // OPACITY",
    name: "Cataracts",
    prevalence: "~33% over age 65",
    description:
      "Clouding of the crystalline lens scatters incoming light, producing warm yellowing haze and reduced contrast.",
    previewFilter: "blur(2.2px) sepia(0.45) contrast(0.75)",
  },
  {
    id: "glaucoma",
    code: "05 // PERIPHERAL",
    name: "Glaucoma",
    prevalence: "~80M worldwide",
    description:
      "Optic nerve damage constricts the visual field from the outside in, hiding off-center toasts and edge navigation.",
    previewFilter: "none",
    maskType: "glaucoma",
  },
  {
    id: "macular",
    code: "06 // CENTRAL",
    name: "Macular Degeneration",
    prevalence: "~196M worldwide",
    description:
      "Central retinal degradation creates a dark scotoma right where the eye fixates, forcing reliance on peripheral vision.",
    previewFilter: "none",
    maskType: "macular",
  },
  {
    id: "low-vision",
    code: "07 // ACUITY",
    name: "Low Visual Acuity",
    prevalence: "~2.2B worldwide",
    description:
      "Unresolved refractive error blurs fine 12px labels and hairline borders that lack adequate stroke weight.",
    previewFilter: "blur(2.8px)",
  },
  {
    id: "dyslexia",
    code: "08 // COGNITIVE",
    name: "Dyslexia Crowding",
    prevalence: "~10–15% global",
    description:
      "Dense, tightly tracked paragraphs trigger orthographic letter swapping and visual crowding fatigue.",
    previewFilter: "none",
    maskType: "dyslexia",
  },
];

export function SimulationGrid() {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [previewAll, setPreviewAll] = useState(false);

  const handleLaunchFullPage = (sim: SimulationType) => {
    Lens.mount({ position: "bottom-right" });
    Lens.simulate(sim);
  };

  return (
    <div>
      {/* Header Row with Preview-All Toggle */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div
            style={{ fontFamily: "var(--font-mono)" }}
            className="mb-3 text-xs uppercase tracking-[0.14em] text-[var(--muted)]"
          >
            01 / SIMULATIONS
          </div>
          <h2
            id="sim-heading"
            className="text-2xl sm:text-4xl font-bold tracking-[-0.04em]"
          >
            Eight clinical models of{" "}
            <span
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--accent)",
              }}
              className="font-normal italic tracking-normal"
            >
              perception
            </span>
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setPreviewAll(!previewAll)}
          aria-pressed={previewAll}
          style={{ fontFamily: "var(--font-mono)" }}
          className="min-h-[44px] cursor-pointer rounded-lg border px-3.5 text-xs uppercase tracking-wider transition-colors hover:border-[var(--accent)]"
        >
          {previewAll ? "Showing Filtered Previews" : "Hover Cards or Click to Filter All"}
        </button>
      </div>

      {/* 8-Card 12-Column Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
        {SIM_CARDS.map((card) => {
          const isFiltered = previewAll || activeCard === card.id;

          return (
            <article
              key={card.id}
              onMouseEnter={() => setActiveCard(card.id)}
              onMouseLeave={() => setActiveCard(null)}
              onFocus={() => setActiveCard(card.id)}
              onBlur={() => setActiveCard(null)}
              className="optical-card lg:col-span-3 flex flex-col justify-between p-5"
            >
              <div>
                {/* Top Metadata Row */}
                <div
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="flex items-center justify-between text-xs text-[var(--muted)]"
                >
                  <span>{card.code}</span>
                  <span className="rounded border px-1.5 py-0.5">
                    {card.prevalence}
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em]">
                  {card.name}
                </h3>

                {/* Live Mini-Demo UI Box */}
                <div
                  aria-hidden="true"
                  style={{
                    filter: isFiltered ? card.previewFilter : "none",
                    transition: "filter 200ms ease",
                  }}
                  className="relative mt-3 overflow-hidden rounded-lg border bg-[var(--bg)] p-3 text-xs"
                >
                  <div className="flex items-center justify-between font-medium">
                    <span>
                      {isFiltered && card.maskType === "dyslexia"
                        ? "Paymnet Declnied"
                        : "Payment Declined"}
                    </span>
                    <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[11px] text-white">
                      Error
                    </span>
                  </div>
                  <div className="mt-2 flex gap-1.5">
                    <span className="h-2.5 flex-1 rounded-sm bg-emerald-500" />
                    <span className="h-2.5 flex-1 rounded-sm bg-amber-500" />
                    <span className="h-2.5 flex-1 rounded-sm bg-sky-500" />
                  </div>

                  {/* Glaucoma Tunnel Overlay inside Mini-Demo */}
                  {isFiltered && card.maskType === "glaucoma" && (
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(circle 34px at 50% 50%, transparent 0%, rgba(5,5,8,0.92) 85%)",
                      }}
                    />
                  )}

                  {/* Macular Scotoma Overlay inside Mini-Demo */}
                  {isFiltered && card.maskType === "macular" && (
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(circle 28px at 50% 50%, rgba(8,8,12,0.96) 0%, rgba(8,8,12,0.85) 55%, transparent 100%)",
                      }}
                    />
                  )}
                </div>

                <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
                  {card.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleLaunchFullPage(card.id)}
                style={{ fontFamily: "var(--font-mono)" }}
                className="mt-4 flex min-h-[44px] w-full cursor-pointer items-center justify-between rounded-lg border px-3 text-xs uppercase tracking-wider transition-colors hover:border-[var(--accent)]"
              >
                <span>Simulate on Page</span>
                <span aria-hidden="true">→</span>
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}