export type SimulationType =
  | "none"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "achromatopsia"
  | "low-vision"
  | "cataracts"
  | "glaucoma"
  | "macular"
  | "glare"
  | "low-contrast"
  | "dyslexia"
  | "tremor"
  | "keyboard-path";

export type LensTheme = "auto" | "light" | "dark" | "contrast";

export interface LensMountOptions {
  /** Initial simulation to activate on mount */
  initialSimulation?: SimulationType;
  /** Intensity slider value (0 to 100) for adjustable filters like low-vision */
  initialIntensity?: number;
  /** Initial corner position for the floating HUD */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  /** Theme override for the HUD ("auto" follows host page data-theme or OS scheme) */
  theme?: LensTheme;
  /** Start with the HUD minimized into a compact pill */
  startMinimized?: boolean;
}

export interface AuditIssue {
  id: string;
  ruleId:
    | "img-alt"
    | "button-name"
    | "input-label"
    | "html-lang"
    | "heading-order"
    | "color-contrast"
    | "target-size"
    | "landmarks";
  severity: "error" | "warning";
  title: string;
  message: string;
  whyItMatters: string;
  fixSuggestion: string;
  selector: string;
  element?: HTMLElement;
}

export interface AuditReport {
  score: number;
  timestamp: number;
  totalChecked: number;
  issues: AuditIssue[];
}

export interface LensState {
  mounted: boolean;
  activeSimulation: SimulationType;
  intensity: number;
  hudMinimized: boolean;
  lastAudit: AuditReport | null;
}

export interface SimulationMeta {
  id: SimulationType;
  label: string;
  category: "vision" | "cognitive" | "motor" | "navigation";
  isoReadout: string;
  hasIntensity?: boolean;
}

export const SIMULATION_CATALOG: SimulationMeta[] = [
  { id: "none", label: "Normal Vision", category: "vision", isoReadout: "NORMAL / ISO 100 / f 1.4" },
  { id: "deuteranopia", label: "Deuteranopia (Green-Blind)", category: "vision", isoReadout: "DEUTERANOPIA / 6% MALES" },
  { id: "protanopia", label: "Protanopia (Red-Blind)", category: "vision", isoReadout: "PROTANOPIA / 1% MALES" },
  { id: "tritanopia", label: "Tritanopia (Blue-Blind)", category: "vision", isoReadout: "TRITANOPIA / RARE S-CONE" },
  { id: "achromatopsia", label: "Achromatopsia (Monochrome)", category: "vision", isoReadout: "ACHROMATOPSIA / MONO" },
  { id: "low-vision", label: "Low Vision (Acuity Blur)", category: "vision", isoReadout: "LOW VISION / LOGMAR 0.6", hasIntensity: true },
  { id: "cataracts", label: "Cataracts (Clouded Lens)", category: "vision", isoReadout: "CATARACTS / WARM HAZE", hasIntensity: true },
  { id: "glaucoma", label: "Glaucoma (Tunnel Vision)", category: "vision", isoReadout: "GLAUCOMA / PERIPHERAL LOSS" },
  { id: "macular", label: "Macular Degeneration", category: "vision", isoReadout: "MACULAR / CENTRAL SCOTOMA" },
  { id: "glare", label: "Glare / Photophobia", category: "vision", isoReadout: "PHOTOPHOBIA / HALATION" },
  { id: "low-contrast", label: "Low Contrast Sensitivity", category: "vision", isoReadout: "CONTRAST LOSS / -45%" },
  { id: "dyslexia", label: "Dyslexia (Crowding Jitter)", category: "cognitive", isoReadout: "DYSLEXIA / ORTHOGRAPHIC" },
  { id: "tremor", label: "Motor Tremor + Tap Targets", category: "motor", isoReadout: "MOTOR TREMOR / <44PX TARGETS" },
  { id: "keyboard-path", label: "Keyboard Tab-Order Path", category: "navigation", isoReadout: "TAB TOPOLOGY / FOCUS RING" },
];