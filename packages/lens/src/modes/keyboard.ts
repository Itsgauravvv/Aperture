const KEYBOARD_OVERLAY_ID = "lens-a11y-keyboard-overlay";

export class KeyboardPathMode {
  private overlayEl: HTMLElement | null = null;
  private resizeHandler: (() => void) | null = null;

  public start(): void {
    if (typeof document === "undefined" || this.overlayEl) return;

    this.overlayEl = document.createElement("div");
    this.overlayEl.id = KEYBOARD_OVERLAY_ID;
    this.overlayEl.setAttribute("data-lens-ignore", "true");
    this.overlayEl.setAttribute("aria-hidden", "true");
    this.overlayEl.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:2147483641;";

    document.body.appendChild(this.overlayEl);
    this.renderPath();

    this.resizeHandler = () => this.renderPath();
    window.addEventListener("scroll", this.resizeHandler, { passive: true });
    window.addEventListener("resize", this.resizeHandler, { passive: true });
  }

  public stop(): void {
    if (this.resizeHandler) {
      window.removeEventListener("scroll", this.resizeHandler);
      window.removeEventListener("resize", this.resizeHandler);
      this.resizeHandler = null;
    }
    this.overlayEl?.remove();
    this.overlayEl = null;
  }

  private renderPath(): void {
    if (!this.overlayEl) return;

    const focusables = Array.from(
      document.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => {
      if (el.closest("#lens-a11y-host") || el.closest("[data-lens-ignore]")) {
        return false;
      }
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });

    const points = focusables.map((el, idx) => {
      const r = el.getBoundingClientRect();
      return {
        idx: idx + 1,
        x: Math.round(r.left + 12),
        y: Math.round(r.top + 12),
      };
    });

    const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

    this.overlayEl.innerHTML = `
      <svg width="100%" height="100%" style="position:fixed;inset:0;overflow:visible;">
        <polyline
          fill="none"
          stroke="#2f3cff"
          stroke-width="2"
          stroke-dasharray="5 4"
          points="${polylinePoints}"
        />
      </svg>
      ${points
        .map(
          (p) => `
        <div style="
          position:fixed;
          left:${p.x - 11}px;
          top:${p.y - 11}px;
          width:22px;
          height:22px;
          border-radius:999px;
          background:#2f3cff;
          color:#ffffff;
          font-family:ui-monospace,monospace;
          font-size:11px;
          font-weight:700;
          display:flex;
          align-items:center;
          justify-content:center;
          box-shadow:0 2px 6px rgba(0,0,0,0.35);
        ">
          ${p.idx}
        </div>
      `
        )
        .join("")}
    `;
  }
}