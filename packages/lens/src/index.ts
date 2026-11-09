import { runDomAudit } from "./auditor/auditor";
import {
  blendColors,
  getContrastRatio,
  getRelativeLuminance,
  parseColor,
} from "./auditor/contrast";
import { VisionEngine } from "./filters/vision";
import { LensHUD } from "./hud/hud";
import { DyslexiaMode } from "./modes/dyslexia";
import { KeyboardPathMode } from "./modes/keyboard";
import { MotorMode } from "./modes/motor";
import {
  AuditReport,
  LensMountOptions,
  LensState,
  SIMULATION_CATALOG,
  SimulationMeta,
  SimulationType,
} from "./types";

export * from "./types";
export {
  parseColor,
  blendColors,
  getRelativeLuminance,
  getContrastRatio,
  runDomAudit,
};
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
  private vision = new VisionEngine();
  private dyslexia = new DyslexiaMode();
  private motor = new MotorMode();
  private keyboardPath = new KeyboardPathMode();

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

  public simulate(
    simulation: SimulationType,
    intensity?: number
  ): SimulationType {
    if (typeof document === "undefined") return simulation;

    if (intensity !== undefined) {
      this.state.intensity = Math.max(0, Math.min(100, intensity));
    }

    this.state.activeSimulation = simulation;

    this.dyslexia.stop();
    this.motor.stop();
    this.keyboardPath.stop();
    this.vision.clear();

    if (simulation === "dyslexia") {
      this.dyslexia.start();
    } else if (simulation === "tremor") {
      this.motor.start();
    } else if (simulation === "keyboard-path") {
      this.keyboardPath.start();
    } else if (simulation !== "none") {
      this.vision.apply(simulation, this.state.intensity);
    }

    if (simulation === "none") {
      document.documentElement.removeAttribute("data-lens-sim");
    } else {
      document.documentElement.setAttribute("data-lens-sim", simulation);
    }

    this.hud?.update(this.state);
    this.emit("lens:change", {
      simulation: this.state.activeSimulation,
      intensity: this.state.intensity,
    });

    return this.state.activeSimulation;
  }

  public setIntensity(intensity: number): void {
    this.state.intensity = Math.max(0, Math.min(100, intensity));
    if (
      this.state.activeSimulation === "low-vision" ||
      this.state.activeSimulation === "cataracts"
    ) {
      this.vision.apply(this.state.activeSimulation, this.state.intensity);
    }
    this.hud?.updateIntensityOnly(this.state.intensity);
    this.emit("lens:change", {
      simulation: this.state.activeSimulation,
      intensity: this.state.intensity,
    });
  }

  /**
   * Scans the live DOM (or a scoped container) for WCAG issues and returns a score out of 100.
   */
  public audit(root: Document | HTMLElement = document): AuditReport {
    const report = runDomAudit(root);
    this.state.lastAudit = report;
    this.hud?.update(this.state);
    this.emit("lens:audit", report);
    return report;
  }

  public off(): void {
    this.dyslexia.stop();
    this.motor.stop();
    this.keyboardPath.stop();
    this.vision.clear();

    if (typeof document !== "undefined") {
      document.documentElement.removeAttribute("data-lens-sim");
    }
    this.state.activeSimulation = "none";
    this.state.lastAudit = null;
    this.state.mounted = false;
    this.hud?.unmount();
    this.hud = null;
    this.emit("lens:change", {
      simulation: "none",
      intensity: this.state.intensity,
    });
  }

  public getState(): Readonly<LensState> {
    return { ...this.state };
  }

  public getCatalog(): SimulationMeta[] {
    return SIMULATION_CATALOG;
  }

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