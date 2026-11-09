"use client";

import React from "react";
import { Lens } from "lens-a11y";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function InstallPage() {
  const bookmarkletHref = Lens.createBookmarklet();

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
      <div className="border-x border-b py-14 px-6 sm:px-12 space-y-12">
        <div>
          <div
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]"
          >
            INSTALLATION // CDN, NPM &amp; BOOKMARKLET
          </div>
          <h1 className="mt-2 text-3xl sm:text-5xl font-bold tracking-[-0.04em]">
            Run Aperture on{" "}
            <span
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--accent)",
              }}
              className="font-normal italic tracking-normal"
            >
              any
            </span>{" "}
            website
          </h1>
        </div>

        {/* Bookmarklet Drag Card */}
        <section
          aria-labelledby="bookmarklet-heading"
          className="optical-card p-6 sm:p-8"
        >
          <h2 id="bookmarklet-heading" className="text-xl font-bold">
            1. Universal Browser Bookmarklet
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
            Drag the button below into your browser&apos;s Bookmarks Bar (or
            click it right now to test). When browsing any website, click the
            bookmark to mount the Aperture Floating HUD on the spot.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <a
              href={bookmarkletHref}
              onClick={(e) => {
                e.preventDefault();
                Lens.mount({ position: "bottom-right" });
              }}
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--accent-ink)",
                fontFamily: "var(--font-mono)",
              }}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-[10px] px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              <span>⊕ Aperture Lens HUD</span>
            </a>
            <span className="text-xs font-mono text-[var(--muted)]">
              ← Drag to your Bookmarks Bar (or click to launch here)
            </span>
          </div>
        </section>

        {/* jsDelivr One-Line Script */}
        <section aria-labelledby="cdn-heading" className="space-y-4">
          <h2 id="cdn-heading" className="text-xl font-bold">
            2. One-Line CDN Script Tag (jsDelivr)
          </h2>
          <CodeBlock
            filename="index.html"
            code={`<!-- Mounts Floating HUD automatically -->
<script src="https://cdn.jsdelivr.net/npm/lens-a11y@0.1/dist/lens.min.js" data-lens="auto"></script>

<!-- Or boot directly into a specific simulation -->
<script src="https://cdn.jsdelivr.net/npm/lens-a11y@0.1/dist/lens.min.js" data-lens="protanopia"></script>`}
          />
        </section>
      </div>
    </div>
  );
}