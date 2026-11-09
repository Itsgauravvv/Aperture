import {
  AuditReport,
  LensMountOptions,
  LensState,
  SIMULATION_CATALOG,
  SimulationMeta,
  SimulationType,
} from "../types";

function setSafeHtml(el: Element | ShadowRoot, html: string): void {
  const win = window as unknown as {
    trustedTypes?: {
      createPolicy: (
        name: string,
        rules: { createHTML: (s: string) => string }
      ) => { createHTML: (s: string) => string };
    };
  };
  if (win.trustedTypes?.createPolicy) {
    try {
      const policy = win.trustedTypes.createPolicy("aperture-lens-policy", {
        createHTML: (s) => s,
      });
      el.innerHTML = policy.createHTML(html) as unknown as string;
      return;
    } catch {
      // Fallback
    }
  }
  el.innerHTML = html;
}

export interface HudCallbacks {
  onSelectSimulation: (sim: SimulationType) => void;
  onIntensityChange: (intensity: number) => void;
  onRunAudit: () => AuditReport;
  onHighlightIssue: (selector: string) => void;
  onClose: () => void;
}

type CategoryTab = "all" | "vision" | "cognitive-motor";

export class LensHUD {
  private hostEl: HTMLElement | null = null;
  private shadow: ShadowRoot | null = null;
  private callbacks: HudCallbacks;
  private options: LensMountOptions;
  private pos = { x: 20, y: 20 };
  private isDragging = false;
  private dragStart = { x: 0, y: 0 };
  private minimized = false;
  private activeTab: CategoryTab = "all";
  private lastState: LensState | null = null;
  private themeObserver: MutationObserver | null = null;
  private resizeHandler: (() => void) | null = null;

  constructor(options: LensMountOptions, callbacks: HudCallbacks) {
    this.options = options;
    this.callbacks = callbacks;
    this.minimized = Boolean(options.startMinimized);
  }

  public mount(state: LensState): void {
    if (typeof document === "undefined" || this.hostEl) return;
    this.lastState = state;

    this.hostEl = document.createElement("div");
    this.hostEl.id = "lens-a11y-host";
    this.hostEl.setAttribute("data-lens-ignore", "true");
    this.shadow = this.hostEl.attachShadow({ mode: "open" });

    this.setInitialPosition();
    this.render(state);
    document.body.appendChild(this.hostEl);
    this.observeHostTheme();

    this.resizeHandler = () => this.clampPositionToViewport();
    window.addEventListener("resize", this.resizeHandler, { passive: true });
  }

  public update(state: LensState): void {
    const prevState = this.lastState;
    this.lastState = state;
    if (!this.shadow) return;

    

    // If only intensity changed while dragging the slider, update the text in-place
    // so we NEVER destroy the <input type="range"> DOM node mid-drag!
    if (
      prevState &&
      prevState.activeSimulation === state.activeSimulation &&
      prevState.lastAudit === state.lastAudit &&
      prevState.intensity !== state.intensity
    ) {
      const valSpan = this.shadow.getElementById("lens-intensity-val");
      if (valSpan) {
        valSpan.textContent = `${state.intensity}%`;
        return;
      }
    }

    this.render(state);
  }

  public updateIntensityOnly(intensity: number): void {
    if (this.lastState) {
      this.lastState.intensity = intensity;
    }
    const valSpan = this.shadow?.getElementById("lens-intensity-val");
    if (valSpan) {
      valSpan.textContent = `${intensity}%`;
    }
  }

  public unmount(): void {
    this.themeObserver?.disconnect();
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
      this.resizeHandler = null;
    }
    this.hostEl?.remove();
    this.hostEl = null;
    this.shadow = null;
  }

  private setInitialPosition(): void {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const hudWidth = Math.min(384, vw - 24);
    const corner = this.options.position || "bottom-right";

    this.pos = {
      x: corner.includes("left") ? 14 : Math.max(14, vw - hudWidth - 18),
      y: corner.includes("top") ? 76 : Math.max(76, vh - 540),
    };
  }

  private clampPositionToViewport(): void {
    if (!this.hostEl) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const hudWidth = Math.min(this.minimized ? 290 : 384, vw - 24);
    this.pos = {
      x: Math.max(10, Math.min(vw - hudWidth - 10, this.pos.x)),
      y: Math.max(10, Math.min(vh - 68, this.pos.y)),
    };
    this.hostEl.style.left = `${this.pos.x}px`;
    this.hostEl.style.top = `${this.pos.y}px`;
  }

  private resolveTheme(): "light" | "dark" | "contrast" {
    if (this.options.theme && this.options.theme !== "auto") {
      return this.options.theme;
    }
    const hostTheme = document.documentElement.getAttribute("data-theme");
    if (
      hostTheme === "light" ||
      hostTheme === "dark" ||
      hostTheme === "contrast"
    ) {
      return hostTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  private observeHostTheme(): void {
    this.themeObserver = new MutationObserver(() => {
      const container = this.shadow?.querySelector(".hud-chassis");
      if (container) {
        container.setAttribute("data-theme", this.resolveTheme());
      }
    });
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
  }

  private getFilteredCatalog(): SimulationMeta[] {
    if (this.activeTab === "vision") {
      return SIMULATION_CATALOG.filter((s) => s.category === "vision");
    }
    if (this.activeTab === "cognitive-motor") {
      return SIMULATION_CATALOG.filter((s) => s.category !== "vision");
    }
    return SIMULATION_CATALOG;
  }

  private render(state: LensState): void {
    if (!this.shadow) return;
    const currentMeta =
      SIMULATION_CATALOG.find((s) => s.id === state.activeSimulation) ??
      SIMULATION_CATALOG[0]!;
    const theme = this.resolveTheme();
    const filteredModes = this.getFilteredCatalog();
    const isSimActive = state.activeSimulation !== "none";
    const score = state.lastAudit ? state.lastAudit.score : 100;
    const circumference = 2 * Math.PI * 18;
    const dashOffset = circumference - (score / 100) * circumference;

    setSafeHtml(
      this.shadow,
      `
      <style>
        :host {
          all: initial;
          position: fixed;
          z-index: 2147483646;
          left: ${this.pos.x}px;
          top: ${this.pos.y}px;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }
        * {
          box-sizing: border-box;
        }
        /* Sleek Custom Scrollbars (No chunky white Windows scrollbars!) */
        ::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(154, 165, 255, 0.28);
          border-radius: 999px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: var(--accent);
        }
        .hud-chassis {
          --bg: #f4f4f0;
          --panel: rgba(255, 255, 255, 0.94);
          --oled: #0b0b0f;
          --oled-ink: #f4f4f8;
          --oled-muted: #8e8ea0;
          --ink: #0e0e12;
          --muted: #5a5a66;
          --line: rgba(14, 14, 18, 0.12);
          --accent: #2f3cff;
          --accent-ink: #ffffff;
          --bw: 1px;
          width: min(384px, calc(100vw - 24px));
          background: var(--panel);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          color: var(--ink);
          border: var(--bw) solid var(--line);
          border-radius: 18px;
          box-shadow:
            0 28px 64px -12px rgba(0, 0, 0, 0.45),
            0 0 0 1px rgba(255, 255, 255, 0.10) inset,
            0 1px 0 0 rgba(255, 255, 255, 0.25) inset;
          overflow: hidden;
          font-size: 12px;
          line-height: 1.4;
        }
        .hud-chassis.is-minimized {
          width: min(304px, calc(100vw - 24px));
          border-radius: 999px;
        }
        .hud-chassis[data-theme="dark"] {
          --bg: #14141b;
          --panel: rgba(14, 14, 19, 0.92);
          --oled: #07070a;
          --oled-ink: #f4f4f8;
          --oled-muted: #8a8a9e;
          --ink: #f2f2f7;
          --muted: #9898a8;
          --line: rgba(255, 255, 255, 0.11);
          --accent: #9aa5ff;
          --accent-ink: #09090d;
        }
        .hud-chassis[data-theme="contrast"] {
          --bg: #000000;
          --panel: #000000;
          --oled: #000000;
          --oled-ink: #ffffff;
          --oled-muted: #ffffff;
          --ink: #ffffff;
          --muted: #ffffff;
          --line: #ffffff;
          --accent: #ffd400;
          --accent-ink: #000000;
          --bw: 2px;
          box-shadow: none;
        }
        :focus-visible {
          outline: 2px solid var(--accent) !important;
          outline-offset: 2px !important;
        }
        button, input {
          font: inherit;
          color: inherit;
        }
        .bezel-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 14px;
          background: var(--bg);
          border-bottom: var(--bw) solid var(--line);
          cursor: grab;
          user-select: none;
        }
        .hud-chassis.is-minimized .bezel-bar {
          border-bottom: none;
          padding: 7px 14px;
        }
        .bezel-bar:active {
          cursor: grabbing;
        }
        .bezel-left {
          display: flex;
          align-items: center;
          gap: 9px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .laser-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: ${isSimActive ? "#10b981" : "var(--accent)"};
          box-shadow: 0 0 10px ${isSimActive ? "#10b981" : "var(--accent)"};
        }
        .grip-dots {
          display: flex;
          gap: 3px;
          opacity: 0.35;
        }
        .grip-dots span {
          width: 3px;
          height: 3px;
          border-radius: 999px;
          background: currentColor;
        }
        .bezel-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .win-btn {
          min-width: 30px;
          min-height: 30px;
          border-radius: 999px;
          border: var(--bw) solid var(--line);
          background: var(--panel);
          cursor: pointer;
          font-family: ui-monospace, monospace;
          font-size: 11px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .win-btn:hover {
          border-color: var(--accent);
        }
        .deck-body {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: min(80vh, 580px);
          overflow-y: auto;
          overflow-x: hidden;
        }
        /* flex-shrink: 0 prevents Flexbox from ever squishing the OLED screen! */
        .oled-screen {
          flex-shrink: 0;
          position: relative;
          background: var(--oled);
          color: var(--oled-ink);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 12px;
          padding: 12px 14px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          box-shadow: inset 0 2px 12px rgba(0, 0, 0, 0.65);
        }
        .oled-screen::before {
          content: "";
          position: absolute;
          top: 0;
          left: 10px;
          right: 10px;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899, #f59e0b);
        }
        .oled-grid {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .oled-meta {
          font-size: 9.5px;
          letter-spacing: 0.12em;
          color: var(--oled-muted);
          text-transform: uppercase;
        }
        .oled-title {
          margin-top: 4px;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
        }
        .oled-sub {
          margin-top: 6px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          padding: 3px 8px;
          border-radius: 5px;
          background: rgba(154, 165, 255, 0.16);
          color: #9aa5ff;
          border: 1px solid rgba(154, 165, 255, 0.3);
        }
        .gauge-wrap {
          position: relative;
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gauge-num {
          position: absolute;
          font-size: 11px;
          font-weight: 800;
          color: #ffffff;
        }
        .seg-bar {
          flex-shrink: 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          background: var(--bg);
          padding: 3.5px;
          border-radius: 10px;
          border: var(--bw) solid var(--line);
        }
        .seg-btn {
          min-height: 30px;
          border: none;
          border-radius: 7px;
          background: transparent;
          font-family: ui-monospace, monospace;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--muted);
          cursor: pointer;
        }
        .seg-btn[aria-selected="true"] {
          background: var(--panel);
          color: var(--ink);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
        }
        .matrix-grid {
          flex-shrink: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          max-height: 172px;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 4px;
        }
        .matrix-key {
          position: relative;
          min-height: 44px;
          padding: 7px 10px;
          border-radius: 10px;
          border: var(--bw) solid var(--line);
          background: var(--bg);
          text-align: left;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: center;
          transition: border-color 140ms ease, background 140ms ease;
        }
        .matrix-key:hover {
          border-color: var(--accent);
        }
        .matrix-key[aria-pressed="true"] {
          background: var(--accent);
          color: var(--accent-ink);
          border-color: var(--accent);
          box-shadow: 0 6px 16px -4px rgba(47, 60, 255, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
        .key-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4px;
        }
        .key-name {
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .key-dot {
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: currentColor;
          opacity: 0.4;
          flex-shrink: 0;
        }
        .matrix-key[aria-pressed="true"] .key-dot {
          opacity: 1;
          box-shadow: 0 0 6px currentColor;
        }
        .key-cat {
          font-family: ui-monospace, monospace;
          font-size: 9px;
          opacity: 0.72;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-top: 1px;
        }
        .diopter-card {
          flex-shrink: 0;
          background: var(--bg);
          border: var(--bw) solid var(--line);
          border-radius: 10px;
          padding: 8px 11px;
        }
        .diopter-head {
          display: flex;
          justify-content: space-between;
          font-family: ui-monospace, monospace;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 4px;
        }
        input[type="range"] {
          width: 100%;
          accent-color: var(--accent);
          cursor: pointer;
        }
        .cmd-row {
          flex-shrink: 0;
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 8px;
        }
        .cmd-btn {
          min-height: 42px;
          padding: 0 12px;
          border-radius: 10px;
          border: var(--bw) solid var(--line);
          background: var(--bg);
          font-family: ui-monospace, monospace;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .cmd-btn:hover {
          border-color: var(--accent);
        }
        .cmd-primary {
          background: var(--ink);
          color: var(--bg);
          border-color: var(--ink);
        }
        .audit-tray {
          flex-shrink: 0;
          border-top: var(--bw) solid var(--line);
          padding-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .audit-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: ui-monospace, monospace;
          font-size: 10.5px;
          padding: 6px 10px;
          border-radius: 8px;
          background: var(--bg);
          border: var(--bw) solid var(--line);
        }
        .issue-scroll {
          max-height: 116px;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-right: 4px;
        }
        .issue-row {
          width: 100%;
          text-align: left;
          padding: 6px 8px;
          border-radius: 8px;
          border: var(--bw) solid var(--line);
          background: var(--bg);
          font-size: 11px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .issue-row:hover {
          border-color: var(--accent);
        }
        .rule-pill {
          font-family: ui-monospace, monospace;
          font-size: 9px;
          font-weight: 700;
          padding: 1.5px 5px;
          border-radius: 4px;
          background: #e11d48;
          color: #ffffff;
          text-transform: uppercase;
          flex-shrink: 0;
        }
      </style>

      <section
        class="hud-chassis ${this.minimized ? "is-minimized" : ""}"
        data-theme="${theme}"
        role="region"
        aria-label="Aperture Optical Accessibility HUD"
      >
        <!-- Top Machined Bezel Header -->
        <div
          class="bezel-bar"
          id="hud-drag-handle"
          tabindex="0"
          role="toolbar"
          aria-label="Draggable HUD bar. Use arrow keys to reposition."
        >
          <div class="bezel-left">
            <span class="laser-dot" aria-hidden="true"></span>
            <span>${
              this.minimized
                ? `APERTURE // ${currentMeta.id.toUpperCase()}`
                : "APERTURE // OPTIC-OS"
            }</span>
          </div>

          <div class="grip-dots" aria-hidden="true">
            <span></span><span></span><span></span><span></span>
          </div>

          <div class="bezel-actions">
            <button
              type="button"
              class="win-btn"
              id="hud-min-btn"
              aria-label="${this.minimized ? "Expand HUD" : "Minimize HUD to pill"}"
              title="${this.minimized ? "Expand" : "Minimize"}"
            >
              ${this.minimized ? "＋" : "—"}
            </button>
            <button
              type="button"
              class="win-btn"
              id="hud-close-btn"
              aria-label="Reset simulations and close HUD"
              title="Close HUD"
            >
              ✕
            </button>
          </div>
        </div>

        ${
          this.minimized
            ? ""
            : `
        <div class="deck-body">
          <!-- Pitch-Black Inset OLED Telemetry Screen -->
          <div class="oled-screen" aria-live="polite">
            <div class="oled-grid">
              <div>
                <div class="oled-meta">┌ OPTICAL VIEWFINDER TELEMETRY ┐</div>
                <div class="oled-title">${currentMeta.label}</div>
                <div class="oled-sub">
                  <span>● ${currentMeta.isoReadout}</span>
                </div>
              </div>

              <!-- Circular SVG WCAG Score Gauge -->
              <div class="gauge-wrap" title="WCAG 2.1 Audit Score: ${score}/100">
                <svg width="48" height="48" viewBox="0 0 44 44" aria-hidden="true">
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    stroke-width="3.5"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    fill="none"
                    stroke="${score >= 90 ? "#10b981" : "#f59e0b"}"
                    stroke-width="3.5"
                    stroke-linecap="round"
                    stroke-dasharray="${circumference.toFixed(1)}"
                    stroke-dashoffset="${dashOffset.toFixed(1)}"
                    transform="rotate(-90 22 22)"
                  />
                </svg>
                <span class="gauge-num">${score}</span>
              </div>
            </div>
          </div>

          <!-- Segmented Category Bar -->
          <div class="seg-bar" role="tablist" aria-label="Simulation categories">
            <button
              type="button"
              role="tab"
              class="seg-btn"
              data-tab="all"
              aria-selected="${this.activeTab === "all"}"
            >
              All (14)
            </button>
            <button
              type="button"
              role="tab"
              class="seg-btn"
              data-tab="vision"
              aria-selected="${this.activeTab === "vision"}"
            >
              Optics (11)
            </button>
            <button
              type="button"
              role="tab"
              class="seg-btn"
              data-tab="cognitive-motor"
              aria-selected="${this.activeTab === "cognitive-motor"}"
            >
              Motor / Tab
            </button>
          </div>

          <!-- 2-Column Tactile Hardware Matrix -->
          <div class="matrix-grid" role="group" aria-label="Select simulation mode">
            ${filteredModes
              .map((item) => {
                const active = item.id === state.activeSimulation;
                const shortName = item.label.split(" (")[0];
                return `
                  <button
                    type="button"
                    class="matrix-key"
                    data-sim="${item.id}"
                    aria-pressed="${active}"
                  >
                    <div class="key-top">
                      <span class="key-name">${shortName}</span>
                      <span class="key-dot"></span>
                    </div>
                    <span class="key-cat">${item.category}</span>
                  </button>
                `;
              })
              .join("")}
          </div>

          <!-- Diopter Slider (Shown for Low Vision & Cataracts) -->
          ${
            currentMeta.hasIntensity
              ? `
            <div class="diopter-card">
              <div class="diopter-head">
                <label for="lens-intensity">DIOPTER / OPACITY</label>
                <span id="lens-intensity-val">${state.intensity}%</span>
                
              </div>
              <input
                id="lens-intensity"
                type="range"
                min="10"
                max="100"
                value="${state.intensity}"
                aria-label="Simulation intensity percentage"
              />
            </div>
          `
              : ""
          }

          <!-- Bottom Command Row -->
          <div class="cmd-row">
            <button type="button" class="cmd-btn cmd-primary" id="hud-audit-btn">
              <span>Scan DOM</span>
            </button>
            <button type="button" class="cmd-btn" id="hud-reset-btn">
              <span>Reset [0]</span>
            </button>
          </div>

          <!-- Live Audit Results Tray -->
          ${
            state.lastAudit
              ? `
            <div class="audit-tray" role="region" aria-label="WCAG Audit Results">
              <div class="audit-summary">
                <span>${
                  state.lastAudit.issues.length === 0
                    ? "✓ 100% WCAG COMPLIANT"
                    : `⚠ ${state.lastAudit.issues.length} ISSUE(S) DETECTED`
                }</span>
                <span style="color:var(--muted);">${state.lastAudit.totalChecked} NODES</span>
              </div>

              ${
                state.lastAudit.issues.length > 0
                  ? `
                <div class="issue-scroll">
                  ${state.lastAudit.issues
                    .map(
                      (issue) => `
                    <button type="button" class="issue-row" data-selector="${issue.selector}">
                      <span class="rule-pill">${issue.ruleId}</span>
                      <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                        ${issue.title}
                      </span>
                    </button>
                  `
                    )
                    .join("")}
                </div>
              `
                  : ""
              }
            </div>
          `
              : ""
          }
        </div>
        `
        }
      </section>
    `
    );

    this.bindEvents();
  }

  private bindEvents(): void {
    if (!this.shadow || !this.hostEl) return;

    this.shadow.querySelectorAll(".seg-btn").forEach((tabBtn) => {
      tabBtn.addEventListener("click", () => {
        const tab = tabBtn.getAttribute("data-tab") as CategoryTab;
        if (tab && this.lastState) {
          this.activeTab = tab;
          this.render(this.lastState);
        }
      });
    });

    this.shadow.querySelectorAll(".matrix-key").forEach((chip) => {
      chip.addEventListener("click", () => {
        const sim = chip.getAttribute("data-sim") as SimulationType;
        if (sim) this.callbacks.onSelectSimulation(sim);
      });
    });

    const rangeEl = this.shadow.getElementById(
      "lens-intensity"
    ) as HTMLInputElement | null;
    rangeEl?.addEventListener("input", (e) => {
      e.stopPropagation();
      const val = Number((e.target as HTMLInputElement).value);
      this.updateIntensityOnly(val);
      this.callbacks.onIntensityChange(val);
    });

    this.shadow.getElementById("hud-audit-btn")?.addEventListener("click", () => {
      this.callbacks.onRunAudit();
    });

    this.shadow.getElementById("hud-reset-btn")?.addEventListener("click", () => {
      this.callbacks.onSelectSimulation("none");
    });

    this.shadow.getElementById("hud-min-btn")?.addEventListener("click", () => {
      this.minimized = !this.minimized;
      if (this.lastState) this.render(this.lastState);
      this.clampPositionToViewport();
    });

    this.shadow.getElementById("hud-close-btn")?.addEventListener("click", () => {
      this.callbacks.onClose();
    });

    this.shadow.querySelectorAll(".issue-row").forEach((btn) => {
      btn.addEventListener("click", () => {
        const selector = btn.getAttribute("data-selector");
        if (selector) this.callbacks.onHighlightIssue(selector);
      });
    });

    const handle = this.shadow.getElementById("hud-drag-handle");
    handle?.addEventListener("pointerdown", (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      this.isDragging = true;
      this.dragStart = {
        x: e.clientX - this.pos.x,
        y: e.clientY - this.pos.y,
      };
      handle.setPointerCapture(e.pointerId);
    });

    handle?.addEventListener("pointermove", (e: PointerEvent) => {
      if (!this.isDragging || !this.hostEl) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const hudWidth = Math.min(this.minimized ? 304 : 384, vw - 24);
      this.pos = {
        x: Math.max(8, Math.min(vw - hudWidth - 8, e.clientX - this.dragStart.x)),
        y: Math.max(8, Math.min(vh - 68, e.clientY - this.dragStart.y)),
      };
      this.hostEl.style.left = `${this.pos.x}px`;
      this.hostEl.style.top = `${this.pos.y}px`;
    });

    handle?.addEventListener("pointerup", () => {
      this.isDragging = false;
    });

    handle?.addEventListener("keydown", (e: KeyboardEvent) => {
      if (!this.hostEl) return;
      const step = 20;
      if (e.key === "ArrowLeft") this.pos.x -= step;
      else if (e.key === "ArrowRight") this.pos.x += step;
      else if (e.key === "ArrowUp") this.pos.y -= step;
      else if (e.key === "ArrowDown") this.pos.y += step;
      else return;

      e.preventDefault();
      this.clampPositionToViewport();
    });
  }
}