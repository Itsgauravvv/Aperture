import React from "react";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
      <div className="border-x border-b py-14 px-6 sm:px-12 space-y-12">
        <div>
          <div
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]"
          >
            DOCUMENTATION // API REFERENCE v0.1
          </div>
          <h1 className="mt-2 text-3xl sm:text-5xl font-bold tracking-[-0.04em]">
            Programmatic{" "}
            <span
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--accent)",
              }}
              className="font-normal italic tracking-normal"
            >
              instrument
            </span>{" "}
            control
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-[var(--muted)]">
            Control simulations, adjust diopter intensity, run live DOM audits,
            and subscribe to telemetry events from vanilla JavaScript or any
            framework.
          </p>
        </div>

        {/* Public API Methods */}
        <section aria-labelledby="api-methods-heading" className="space-y-4">
          <h2 id="api-methods-heading" className="text-xl font-bold">
            1. Core API Methods
          </h2>
          <CodeBlock
            filename="api-overview.ts"
            code={`import { Lens } from "lens-a11y";

// 1. Mount the accessible Shadow-DOM floating HUD
Lens.mount({
  initialSimulation: "none",
  initialIntensity: 65,
  position: "bottom-right",
  theme: "auto", // "auto" | "light" | "dark" | "contrast"
});

// 2. Activate any vision, cognitive, motor, or keyboard mode
Lens.simulate("deuteranopia");
Lens.simulate("cataracts", 80); // Optional intensity (0..100)

// 3. Run live WCAG 2.1 DOM audit and receive structured report
const report = Lens.audit();
console.log(report.score, report.issues);

// 4. Cleanly restore DOM and unmount HUD
Lens.off();`}
          />
        </section>

        {/* Options Reference Table */}
        <section aria-labelledby="options-heading" className="space-y-4">
          <h2 id="options-heading" className="text-xl font-bold">
            2. Lens.mount(options) Configuration
          </h2>
          <div className="overflow-x-auto rounded-xl border bg-[var(--surface)]">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead
                style={{ fontFamily: "var(--font-mono)" }}
                className="border-b bg-[var(--bg)] text-xs uppercase text-[var(--muted)]"
              >
                <tr>
                  <th className="p-3.5">Option</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Default</th>
                  <th className="p-3.5">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-3.5 font-mono">initialSimulation</td>
                  <td className="p-3.5 font-mono">SimulationType</td>
                  <td className="p-3.5 font-mono">&quot;none&quot;</td>
                  <td className="p-3.5 text-[var(--muted)]">
                    Simulation activated immediately on mount.
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-mono">initialIntensity</td>
                  <td className="p-3.5 font-mono">number (0–100)</td>
                  <td className="p-3.5 font-mono">65</td>
                  <td className="p-3.5 text-[var(--muted)]">
                    Diopter intensity for low-vision and cataracts filters.
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-mono">position</td>
                  <td className="p-3.5 font-mono">CornerPosition</td>
                  <td className="p-3.5 font-mono">&quot;bottom-right&quot;</td>
                  <td className="p-3.5 text-[var(--muted)]">
                    Starting viewport corner for the draggable HUD.
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-mono">theme</td>
                  <td className="p-3.5 font-mono">LensTheme</td>
                  <td className="p-3.5 font-mono">&quot;auto&quot;</td>
                  <td className="p-3.5 text-[var(--muted)]">
                    Follows host page data-theme or OS color scheme.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Custom DOM Events */}
        <section aria-labelledby="events-heading" className="space-y-4">
          <h2 id="events-heading" className="text-xl font-bold">
            3. DOM Telemetry Events (lens:change &amp; lens:audit)
          </h2>
          <CodeBlock
            filename="events.ts"
            code={`window.addEventListener("lens:change", (e: CustomEvent) => {
  console.log("Active simulation:", e.detail.simulation, "Intensity:", e.detail.intensity);
});

window.addEventListener("lens:audit", (e: CustomEvent) => {
  console.log("WCAG Score:", e.detail.score, "Issues found:", e.detail.issues.length);
});`}
          />
        </section>
      </div>
    </div>
  );
}