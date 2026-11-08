import { SimulationType } from "../types";

const SVG_CONTAINER_ID = "lens-a11y-svg-filters";
const STYLE_EL_ID = "lens-a11y-vision-styles";
const MASK_EL_ID = "lens-a11y-cursor-mask";

export class VisionEngine {
  private currentSim: SimulationType = "none";
  private intensity = 65;
  private cursor = { x: -9999, y: -9999 };
  private moveHandler: ((e: PointerEvent) => void) | null = null;
  private keyHandler: ((e: KeyboardEvent) => void) | null = null;

  public apply(sim: SimulationType, intensity: number): void {
    if (typeof document === "undefined") return;
    this.currentSim = sim;
    this.intensity = intensity;

    this.ensureSvgFilters();
    this.ensureStyles();
    this.updateDynamicFilterCss();
    this.updateCursorMask();
  }

  public clear(): void {
    if (typeof document === "undefined") return;
    this.currentSim = "none";
    document.getElementById(STYLE_EL_ID)?.remove();
    document.getElementById(MASK_EL_ID)?.remove();
    this.unbindCursorTracking();
  }

  private ensureSvgFilters(): void {
    if (document.getElementById(SVG_CONTAINER_ID)) return;

    const svgWrap = document.createElement("div");
    svgWrap.id = SVG_CONTAINER_ID;
    svgWrap.setAttribute("data-lens-ignore", "true");
    svgWrap.setAttribute("aria-hidden", "true");
    svgWrap.style.cssText =
      "position:fixed;width:0;height:0;overflow:hidden;pointer-events:none;z-index:-1;";

    svgWrap.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Protanopia (Red-Blind) Machado Matrix -->
          <filter id="lens-protanopia" color-interpolation-filters="sRGB">
            <feColorMatrix type="matrix" values="
              0.152286 1.052583 -0.204868 0 0
              0.114503 0.786281  0.099216 0 0
             -0.003882 -0.048116 1.051998 0 0
              0        0         0        1 0" />
          </filter>

          <!-- Deuteranopia (Green-Blind) Machado Matrix -->
          <filter id="lens-deuteranopia" color-interpolation-filters="sRGB">
            <feColorMatrix type="matrix" values="
              0.367322 0.860646 -0.227968 0 0
              0.280085 0.672501  0.047413 0 0
             -0.011820 0.042940  0.968881 0 0
              0        0         0        1 0" />
          </filter>

          <!-- Tritanopia (Blue-Blind) Machado Matrix -->
          <filter id="lens-tritanopia" color-interpolation-filters="sRGB">
            <feColorMatrix type="matrix" values="
              1.255528 -0.076749 -0.178779 0 0
             -0.078411  0.930809  0.147602 0 0
              0.004733  0.691367  0.303900 0 0
              0         0         0        1 0" />
          </filter>

          <!-- Achromatopsia (Rod Monochromacy) -->
          <filter id="lens-achromatopsia" color-interpolation-filters="sRGB">
            <feColorMatrix type="matrix" values="
              0.2126 0.7152 0.0722 0 0
              0.2126 0.7152 0.0722 0 0
              0.2126 0.7152 0.0722 0 0
              0      0      0      1 0" />
          </filter>
        </defs>
      </svg>
    `;

    document.body.appendChild(svgWrap);
  }

  private ensureStyles(): void {
    if (!document.getElementById(STYLE_EL_ID)) {
      const styleEl = document.createElement("style");
      styleEl.id = STYLE_EL_ID;
      styleEl.setAttribute("data-lens-ignore", "true");
      document.head.appendChild(styleEl);
    }
  }

  private updateDynamicFilterCss(): void {
    const styleEl = document.getElementById(STYLE_EL_ID);
    if (!styleEl) return;

    const ratio = this.intensity / 100;
    const lowVisionBlur = (1.5 + ratio * 6.5).toFixed(2);
    const cataractBlur = (1.0 + ratio * 3.8).toFixed(2);
    const cataractSepia = (0.25 + ratio * 0.45).toFixed(2);
    const cataractContrast = (0.88 - ratio * 0.25).toFixed(2);

    const targetSelector = `body > *:not(#lens-a11y-host):not(#${SVG_CONTAINER_ID}):not(#${MASK_EL_ID}):not([data-lens-ignore="true"])`;

    let filterRule = "none";
    switch (this.currentSim) {
      case "protanopia":
        filterRule = "url(#lens-protanopia)";
        break;
      case "deuteranopia":
        filterRule = "url(#lens-deuteranopia)";
        break;
      case "tritanopia":
        filterRule = "url(#lens-tritanopia)";
        break;
      case "achromatopsia":
        filterRule = "url(#lens-achromatopsia)";
        break;
      case "low-vision":
        filterRule = `blur(${lowVisionBlur}px)`;
        break;
      case "cataracts":
        filterRule = `blur(${cataractBlur}px) sepia(${cataractSepia}) contrast(${cataractContrast}) brightness(1.06)`;
        break;
      case "glare":
        filterRule = "brightness(1.38) contrast(0.72) saturate(0.85) blur(0.9px)";
        break;
      case "low-contrast":
        filterRule = "contrast(0.38) brightness(1.05)";
        break;
      default:
        filterRule = "none";
        break;
    }

    styleEl.textContent =
      filterRule === "none"
        ? ""
        : `${targetSelector} { filter: ${filterRule} !important; transition: filter 120ms ease; }`;
  }

  private updateCursorMask(): void {
    const needsMask =
      this.currentSim === "glaucoma" || this.currentSim === "macular";

    if (!needsMask) {
      document.getElementById(MASK_EL_ID)?.remove();
      this.unbindCursorTracking();
      return;
    }

    let maskEl = document.getElementById(MASK_EL_ID);
    if (!maskEl) {
      maskEl = document.createElement("div");
      maskEl.id = MASK_EL_ID;
      maskEl.setAttribute("data-lens-ignore", "true");
      maskEl.setAttribute("aria-hidden", "true");
      this.cursor = {
        x: Math.round(window.innerWidth / 2),
        y: Math.round(window.innerHeight / 2),
      };
      document.body.appendChild(maskEl);
      this.bindCursorTracking();
    }

    this.renderMaskGradient(maskEl);
  }

  private renderMaskGradient(maskEl: HTMLElement): void {
    const { x, y } = this.cursor;

    if (this.currentSim === "glaucoma") {
      // Glaucoma: Peripheral blackout (tunnel vision following cursor)
      maskEl.style.cssText = `
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 2147483640;
        background: radial-gradient(
          circle 150px at ${x}px ${y}px,
          rgba(0,0,0,0) 0%,
          rgba(0,0,0,0.45) 55%,
          rgba(5,5,8,0.96) 85%,
          rgba(2,2,4,0.99) 100%
        );
      `;
    } else if (this.currentSim === "macular") {
      // Macular Degeneration: Central scotoma (dark blurred spot in center of gaze)
      maskEl.style.cssText = `
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 2147483640;
        background: radial-gradient(
          circle 135px at ${x}px ${y}px,
          rgba(12,12,15,0.97) 0%,
          rgba(18,18,22,0.88) 48%,
          rgba(18,18,22,0.25) 75%,
          rgba(0,0,0,0) 100%
        );
      `;
    }
  }

  private bindCursorTracking(): void {
    if (this.moveHandler) return;

    this.moveHandler = (e: PointerEvent) => {
      this.cursor = { x: e.clientX, y: e.clientY };
      const maskEl = document.getElementById(MASK_EL_ID);
      if (maskEl) this.renderMaskGradient(maskEl);
    };

    // Keyboard users can move the Glaucoma/Macular gaze point with Shift + Arrow keys
    this.keyHandler = (e: KeyboardEvent) => {
      if (!e.shiftKey) return;
      const step = 25;
      if (e.key === "ArrowLeft") this.cursor.x -= step;
      else if (e.key === "ArrowRight") this.cursor.x += step;
      else if (e.key === "ArrowUp") this.cursor.y -= step;
      else if (e.key === "ArrowDown") this.cursor.y += step;
      else return;

      const maskEl = document.getElementById(MASK_EL_ID);
      if (maskEl) this.renderMaskGradient(maskEl);
    };

    window.addEventListener("pointermove", this.moveHandler, { passive: true });
    window.addEventListener("keydown", this.keyHandler);
  }

  private unbindCursorTracking(): void {
    if (this.moveHandler) {
      window.removeEventListener("pointermove", this.moveHandler);
      this.moveHandler = null;
    }
    if (this.keyHandler) {
      window.removeEventListener("keydown", this.keyHandler);
      this.keyHandler = null;
    }
  }
}