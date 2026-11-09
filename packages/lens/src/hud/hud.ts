import {
  AuditReport,
  LensMountOptions,
  LensState,
  SIMULATION_CATALOG,
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
      // Fallback if policy already exists or is restricted
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

export class LensHUD {
  private hostEl: HTMLElement | null = null;
  private shadow: ShadowRoot | null = null;
  private callbacks: HudCallbacks;
  private options: LensMountOptions;
  private pos = { x: 24, y: 24 };
  private isDragging = false;
  private dragStart = { x: 0, y: 0 };
  private themeObserver: MutationObserver | null = null;
  private auditDialogOpen = false;

  constructor(options: LensMountOptions, callbacks: HudCallbacks) {
    this.options = options;
    this.callbacks = callbacks;
  }

  public mount(state: LensState): void {
    if (typeof document === "undefined" || this.hostEl) return;

    this.hostEl = document.createElement("div");
    this.hostEl.id = "lens-a11y-host";
    this.hostEl.setAttribute("data-lens-ignore", "true");
    this.shadow = this.hostEl.attachShadow({ mode: "open" });

    // Set initial corner position
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const corner = this.options.position || "bottom-right";
    this.pos = {
      x: corner.includes("left") ? 20 : Math.max(20, vw - 344),
      y: corner.includes("top") ? 80 : Math.max(80, vh - 420),
    };

    this.render(state);
    document.body.appendChild(this.hostEl);
    this.observeHostTheme();
  }

  public update(state: LensState): void {
    if (!this.shadow) return;
    this.render(state);
  }

  public unmount(): void {
    this.themeObserver?.disconnect();
    this.hostEl?.remove();
    this.hostEl = null;
    this.shadow = null;
  }

  private resolveTheme(): "light" | "dark" | "contrast" {
    if (this.options.theme && this.options.theme !== "auto") {
      return this.options.theme;
    }
    const hostTheme = document.documentElement.getAttribute("data-theme");
    if (hostTheme === "light" || hostTheme === "dark" || hostTheme === "contrast") {
      return hostTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  private observeHostTheme(): void {
    this.themeObserver = new MutationObserver(() => {
      const container = this.shadow?.querySelector(".hud-root");
      if (container) {
        container.setAttribute("data-theme", this.resolveTheme());
      }
    });
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
  }

  private render(state: LensState): void {
    if (!this.shadow) return;
    const currentMeta =
      SIMULATION_CATALOG.find((s) => s.id === state.activeSimulation) ??
      SIMULATION_CATALOG[0]!;
    const theme = this.resolveTheme();

    setSafeHtml(this.shadow, `
      <style>
        :host {
          all: initial;
          position: fixed;
          z-index: 2147483646;
          left: ${this.pos.x}px;
          top: ${this.pos.y}px;
          font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
        }
        .hud-root {
          --bg: #f5f5f2;
          --surface: #ffffff;
          --ink: #0e0e10;
          --muted: #5b5b66;
          --line: rgba(14, 14, 16, 0.16);
          --accent: #2f3cff;
          --accent-ink: #ffffff;
          --bw: 1px;
          width: 320px;
          background: var(--surface);
          color: var(--ink);
          border: var(--bw) solid var(--line);
          border-radius: 12px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
          overflow: hidden;
          font-size: 13px;
          line-height: 1.4;
        }
        .hud-root[data-theme="dark"] {
          --bg: #0b0b0e;
          --surface: #121217;
          --ink: #f2f2f5;
          --muted: #a0a0ad;
          --line: rgba(255, 255, 255, 0.16);
          --accent: #9aa5ff;
          --accent-ink: #0b0b0e;
        }
        .hud-root[data-theme="contrast"] {
          --bg: #000000;
          --surface: #000000;
          --ink: #ffffff;
          --muted: #ffffff;
          --line: #ffffff;
          --accent: #ffd400;
          --accent-ink: #000000;
          --bw: 2px;
          box-shadow: none;
        }
        button, select, input {
          font: inherit;
          color: inherit;
        }
        :focus-visible {
          outline: 2px solid var(--accent) !important;
          outline-offset: 2px !important;
        }
        .hud-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          background: var(--bg);
          border-bottom: var(--bw) solid var(--line);
          cursor: grab;
          user-select: none;
        }
        .hud-header:active {
          cursor: grabbing;
        }
        .hud-brand {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .hud-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--accent);
        }
        .hud-body {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .readout {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 11px;
          padding: 6px 8px;
          border-radius: 6px;
          background: var(--bg);
          border: var(--bw) solid var(--line);
          color: var(--muted);
          display: flex;
          justify-content: space-between;
        }
        label {
          display: block;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--muted);
          margin-bottom: 4px;
        }
        select {
          width: 100%;
          min-height: 44px;
          padding: 0 10px;
          border-radius: 8px;
          border: var(--bw) solid var(--line);
          background: var(--bg);
          cursor: pointer;
        }
        .slider-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        input[type="range"] {
          width: 100%;
          min-height: 32px;
          accent-color: var(--accent);
        }
        .actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .btn {
          min-height: 44px;
          padding: 0 10px;
          border-radius: 8px;
          border: var(--bw) solid var(--line);
          background: var(--bg);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .btn-primary {
          background: var(--accent);
          color: var(--accent-ink);
          border-color: var(--accent);
        }
        .icon-btn {
          min-width: 36px;
          min-height: 36px;
          border-radius: 6px;
          border: var(--bw) solid transparent;
          background: transparent;
          cursor: pointer;
          font-family: ui-monospace, monospace;
          font-size: 12px;
        }
        .icon-btn:hover {
          border-color: var(--line);
        }
        .audit-panel {
          border-top: var(--bw) solid var(--line);
          padding-top: 10px;
          max-height: 170px;
          overflow-y: auto;
        }
        .audit-score {
          font-family: ui-monospace, monospace;
          font-weight: 700;
          font-size: 14px;
          color: var(--accent);
        }
        .issue-btn {
          width: 100%;
          text-align: left;
          padding: 6px 8px;
          margin-top: 4px;
          border-radius: 6px;
          border: var(--bw) solid var(--line);
          background: var(--bg);
          font-size: 11px;
          cursor: pointer;
        }
      </style>

      <section
        class="hud-root"
        data-theme="${theme}"
        role="region"
        aria-label="Aperture Accessibility Instrument HUD"
      >
        <div
          class="hud-header"
          id="hud-drag-handle"
          tabindex="0"
          role="toolbar"
          aria-label="Draggable HUD bar. Use arrow keys to reposition."
        >
          <div class="hud-brand">
            <span class="hud-dot" aria-hidden="true"></span>
            <span>APERTURE // LENS</span>
          </div>
          <div>
            <button
              type="button"
              class="icon-btn"
              id="hud-close-btn"
              aria-label="Reset and close Aperture HUD"
              title="Close HUD"
            >
              ✕
            </button>
          </div>
        </div>

        <div class="hud-body">
          <div class="readout" aria-live="polite">
            <span>${currentMeta.isoReadout}</span>
          </div>

          <div>
            <label for="lens-sim-select">OPTICAL / MOTOR MODE</label>
            <select id="lens-sim-select" aria-label="Select impairment simulation">
              ${SIMULATION_CATALOG.map(
                (item) => `
                  <option value="${item.id}" ${
                  item.id === state.activeSimulation ? "selected" : ""
                }>
                    ${item.label}
                  </option>
                `
              ).join("")}
            </select>
          </div>

          ${
            currentMeta.hasIntensity
              ? `
            <div class="slider-row">
              <label for="lens-intensity">DIOPTER / INTENSITY (${state.intensity}%)</label>
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

          <div class="actions">
            <button type="button" class="btn btn-primary" id="hud-audit-btn">
              Run Audit
            </button>
            <button type="button" class="btn" id="hud-reset-btn">
              Reset Lens
            </button>
          </div>

          ${
            state.lastAudit
              ? `
            <div class="audit-panel" role="dialog" aria-label="Accessibility Audit Results">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span>WCAG SCORE</span>
                <span class="audit-score">${state.lastAudit.score} / 100</span>
              </div>
              <div style="font-size:11px;color:var(--muted);margin-top:2px;">
                ${
                  state.lastAudit.issues.length === 0
                    ? "0 issues detected across DOM."
                    : `${state.lastAudit.issues.length} issue(s) — click to highlight:`
                }
              </div>
              ${state.lastAudit.issues
                .map(
                  (issue) => `
                <button type="button" class="issue-btn" data-selector="${issue.selector}">
                  <strong>[${issue.ruleId}]</strong> ${issue.title}
                </button>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }
        </div>
      </section>
    `);

    this.bindEvents();
  }

  private bindEvents(): void {
    if (!this.shadow || !this.hostEl) return;

    const selectEl = this.shadow.getElementById(
      "lens-sim-select"
    ) as HTMLSelectElement | null;
    selectEl?.addEventListener("change", (e) => {
      const val = (e.target as HTMLSelectElement).value as SimulationType;
      this.callbacks.onSelectSimulation(val);
    });

    const rangeEl = this.shadow.getElementById(
      "lens-intensity"
    ) as HTMLInputElement | null;
    rangeEl?.addEventListener("input", (e) => {
      const val = Number((e.target as HTMLInputElement).value);
      this.callbacks.onIntensityChange(val);
    });

    const auditBtn = this.shadow.getElementById("hud-audit-btn");
    auditBtn?.addEventListener("click", () => {
      this.auditDialogOpen = true;
      this.callbacks.onRunAudit();
    });

    const resetBtn = this.shadow.getElementById("hud-reset-btn");
    resetBtn?.addEventListener("click", () => {
      this.callbacks.onSelectSimulation("none");
    });

    const closeBtn = this.shadow.getElementById("hud-close-btn");
    closeBtn?.addEventListener("click", () => {
      this.callbacks.onClose();
    });

    // Click-to-highlight audit issues
    this.shadow.querySelectorAll(".issue-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const selector = btn.getAttribute("data-selector");
        if (selector) this.callbacks.onHighlightIssue(selector);
      });
    });

    // Pointer + Keyboard Dragging on the header bar
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
      this.pos = {
        x: Math.max(8, Math.min(window.innerWidth - 330, e.clientX - this.dragStart.x)),
        y: Math.max(8, Math.min(window.innerHeight - 120, e.clientY - this.dragStart.y)),
      };
      this.hostEl.style.left = `${this.pos.x}px`;
      this.hostEl.style.top = `${this.pos.y}px`;
    });

    handle?.addEventListener("pointerup", () => {
      this.isDragging = false;
    });

    // Keyboard operability: Arrow keys move the floating HUD by 20px
    handle?.addEventListener("keydown", (e: KeyboardEvent) => {
      if (!this.hostEl) return;
      const step = 20;
      if (e.key === "ArrowLeft") this.pos.x = Math.max(8, this.pos.x - step);
      else if (e.key === "ArrowRight")
        this.pos.x = Math.min(window.innerWidth - 330, this.pos.x + step);
      else if (e.key === "ArrowUp") this.pos.y = Math.max(8, this.pos.y - step);
      else if (e.key === "ArrowDown")
        this.pos.y = Math.min(window.innerHeight - 120, this.pos.y + step);
      else return;

      e.preventDefault();
      this.hostEl.style.left = `${this.pos.x}px`;
      this.hostEl.style.top = `${this.pos.y}px`;
    });
  }
}