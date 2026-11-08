const MOTOR_OVERLAY_ID = "lens-a11y-motor-overlay";

export class MotorMode {
  private overlayEl: HTMLElement | null = null;
  private tremorPointerEl: HTMLElement | null = null;
  private moveHandler: ((e: PointerEvent) => void) | null = null;

  public start(): void {
    if (typeof document === "undefined" || this.overlayEl) return;

    this.overlayEl = document.createElement("div");
    this.overlayEl.id = MOTOR_OVERLAY_ID;
    this.overlayEl.setAttribute("data-lens-ignore", "true");
    this.overlayEl.setAttribute("aria-hidden", "true");
    this.overlayEl.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:2147483641;overflow:hidden;";

    this.tremorPointerEl = document.createElement("div");
    this.tremorPointerEl.style.cssText = `
      position:fixed;
      width:28px;
      height:28px;
      border:2px solid #ff3b30;
      border-radius:999px;
      background:rgba(255,59,48,0.14);
      pointer-events:none;
      transform:translate(-50%,-50%);
      left:-100px;
      top:-100px;
    `;
    this.overlayEl.appendChild(this.tremorPointerEl);
    document.body.appendChild(this.overlayEl);

    this.renderTargetBoxes();
    this.bindTremor();
  }

  public stop(): void {
    if (this.moveHandler) {
      window.removeEventListener("pointermove", this.moveHandler);
      this.moveHandler = null;
    }
    this.overlayEl?.remove();
    this.overlayEl = null;
    this.tremorPointerEl = null;
  }

  private renderTargetBoxes(): void {
    if (!this.overlayEl) return;

    const interactives = document.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, [role="button"], [role="radio"], [role="tab"]'
    );

    interactives.forEach((el) => {
      if (el.closest("#lens-a11y-host") || el.closest("[data-lens-ignore]")) {
        return;
      }
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      const isUndersized = w < 44 || h < 44;

      const badge = document.createElement("div");
      badge.style.cssText = `
        position:fixed;
        left:${rect.left}px;
        top:${rect.top}px;
        width:${rect.width}px;
        height:${rect.height}px;
        border:1.5px ${isUndersized ? "dashed #ff3b30" : "solid rgba(47,60,255,0.45)"};
        background:${isUndersized ? "rgba(255,59,48,0.10)" : "transparent"};
        border-radius:6px;
        box-sizing:border-box;
      `;

      const tag = document.createElement("span");
      tag.textContent = isUndersized ? `⚠ ${w}×${h}px (<44)` : `✓ ${w}×${h}px`;
      tag.style.cssText = `
        position:absolute;
        top:-18px;
        left:0;
        font-family:ui-monospace,monospace;
        font-size:10px;
        font-weight:600;
        padding:1px 4px;
        border-radius:3px;
        white-space:nowrap;
        background:${isUndersized ? "#ff3b30" : "#2f3cff"};
        color:#ffffff;
      `;

      badge.appendChild(tag);
      this.overlayEl?.appendChild(badge);
    });
  }

  private bindTremor(): void {
    this.moveHandler = (e: PointerEvent) => {
      if (!this.tremorPointerEl) return;
      const reduced =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.documentElement.getAttribute("data-reduce-motion") === "true";

      const jitterX = reduced ? 0 : (Math.random() - 0.5) * 26;
      const jitterY = reduced ? 0 : (Math.random() - 0.5) * 26;
      this.tremorPointerEl.style.left = `${e.clientX + jitterX}px`;
      this.tremorPointerEl.style.top = `${e.clientY + jitterY}px`;
    };

    window.addEventListener("pointermove", this.moveHandler, { passive: true });
  }
}