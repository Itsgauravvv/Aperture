import { LensHUD } from "./hud/hud";
import {
  AuditReport,
  LensMountOptions,
  LensState,
  SIMULATION_CATALOG,
  SimulationMeta,
  SimulationType,
} from "./types";

export * from "./types";
export const VERSION = "0.1.0";

class LensController {
  private state: LensState = {
    mounted: false,
    activeSimulation: "none",
    intensity: 65,
    hudMinimized: false,
    lastAudit: null,
  };

  private hud: LensHUD | null = null;

  /**
   * Mounts the floating optical HUD onto the current page.
   */
  public mount(options: LensMountOptions = {}): void {
    if (typeof window === "undefined") return;

    if (options.initialIntensity !== undefined) {
      this.state.intensity = options.initialIntensity;
    }

    if (!this.hud) {
      this.hud = new LensHUD(options, {
        onSelectSimulation: (sim) => this.simulate(sim),
        onIntensityChange: (val) => this.setIntensity(val),
        onRunAudit: () => this.audit(),
        onHighlightIssue: (selector) => this.highlightSelector(selector),
        onClose: () => this.off(),
      });
    }

    this.state.mounted = true;
    this.hud.mount(this.state);

    if (options.initialSimulation && options.initialSimulation !== "none") {
      this.simulate(options.initialSimulation);
    }
  }

  /**
   * Activates a visual, cognitive, motor, or keyboard simulation mode.
   */
  public simulate(
    simulation: SimulationType,
    intensity?: number
  ): SimulationType {
    if (typeof document === "undefined") return simulation;

    if (intensity !== undefined) {
      this.state.intensity = Math.max(0, Math.min(100, intensity));
    }

    this.state.activeSimulation = simulation;

    // Set data attribute on <html> so Stage 3 SVG/CSS filters and modes react immediately
    if (simulation === "none") {
      document.documentElement.removeAttribute("data-lens-sim");
    } else {
      document.documentElement.setAttribute("data-lens-sim", simulation);
    }
    document.documentElement.style.setProperty(
      "--lens-intensity",
      String(this.state.intensity / 100)
    );

    this.hud?.update(this.state);
    this.emit("lens:change", {
      simulation: this.state.activeSimulation,
      intensity: this.state.intensity,
    });

    return this.state.activeSimulation;
  }

  /**
   * Updates intensity for adjustable filters (low-vision, cataracts).
   */
  public setIntensity(intensity: number): void {
    this.state.intensity = Math.max(0, Math.min(100, intensity));
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty(
        "--lens-intensity",
        String(this.state.intensity / 100)
      );
    }
    this.hud?.update(this.state);
    this.emit("lens:change", {
      simulation: this.state.activeSimulation,
      intensity: this.state.intensity,
    });
  }

  /**
   * Scans the live DOM and returns an accessibility score out of 100.
   * (Full WCAG contrast + 8-rule scanner engine is expanded in Stage 4).
   */
  public audit(): AuditReport {
    const report: AuditReport = {
      score: 100,
      timestamp: Date.now(),
      totalChecked:
        typeof document !== "undefined"
          ? document.querySelectorAll("*").length
          : 0,
      issues: [],
    };

    this.state.lastAudit = report;
    this.hud?.update(this.state);
    this.emit("lens:audit", report);
    return report;
  }

  /**
   * Turns off all active simulations and unmounts the floating HUD.
   */
  public off(): void {
    if (typeof document !== "undefined") {
      document.documentElement.removeAttribute("data-lens-sim");
      document.documentElement.style.removeProperty("--lens-intensity");
    }
    this.state.activeSimulation = "none";
    this.state.lastAudit = null;
    this.state.mounted = false;
    this.hud?.unmount();
    this.hud = null;
    this.emit("lens:change", { simulation: "none", intensity: this.state.intensity });
  }

  /**
   * Returns current Lens state.
   */
  public getState(): Readonly<LensState> {
    return { ...this.state };
  }

  /**
   * Returns metadata for all supported simulations.
   */
  public getCatalog(): SimulationMeta[] {
    return SIMULATION_CATALOG;
  }

  /**
   * Generates a one-line javascript: bookmarklet URL so users can run Lens on any site.
   */
  public createBookmarklet(
    cdnUrl = "https://cdn.jsdelivr.net/npm/lens-a11y@0.1/dist/lens.min.js"
  ): string {
    const code = `(function(){if(window.Lens){window.Lens.mount();return;}var s=document.createElement('script');s.src='${cdnUrl}';s.onload=function(){window.Lens&&window.Lens.mount();};document.head.appendChild(s);})();`;
    return `javascript:${encodeURIComponent(code)}`;
  }

  private highlightSelector(selector: string): void {
    if (typeof document === "undefined") return;
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    const prevOutline = el.style.outline;
    el.style.outline = "3px solid #2f3cff";
    setTimeout(() => {
      el.style.outline = prevOutline;
    }, 2200);
  }

  private emit<T>(eventName: "lens:change" | "lens:audit", detail: T): void {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
}

export const Lens = new LensController();

// Auto-boot declarative mode: <script src="..." data-lens="protanopia"></script>
if (typeof window !== "undefined" && typeof document !== "undefined") {
  const bootDeclarative = () => {
    const scriptEl = document.querySelector(
      "script[data-lens]"
    ) as HTMLScriptElement | null;
    if (!scriptEl) return;
    const attr = (scriptEl.getAttribute("data-lens") || "none") as SimulationType;
    Lens.mount({
      initialSimulation: attr === ("auto" as unknown) ? "none" : attr,
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootDeclarative, { once: true });
  } else {
    bootDeclarative();
  }
}