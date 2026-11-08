export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Parses hex (#rgb, #rrggbb) or rgb()/rgba() strings into an RGBA object.
 */
export function parseColor(input: string): RGBA | null {
  const str = input.trim().toLowerCase();
  if (str === "transparent") return { r: 0, g: 0, b: 0, a: 0 };

  // Hex #rgb or #rrggbb
  if (str.startsWith("#")) {
    const hex = str.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0]! + hex[0]!, 16);
      const g = parseInt(hex[1]! + hex[1]!, 16);
      const b = parseInt(hex[2]! + hex[2]!, 16);
      return { r, g, b, a: 1 };
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return { r, g, b, a: 1 };
    }
    return null;
  }

  // rgb(...) or rgba(...)
  const match = str.match(
    /^rgba?\(\s*(\d+)\s*[, ]\s*(\d+)\s*[, ]\s*(\d+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/
  );
  if (match) {
    return {
      r: Number(match[1]),
      g: Number(match[2]),
      b: Number(match[3]),
      a: match[4] !== undefined ? Number(match[4]) : 1,
    };
  }

  return null;
}

/**
 * Alpha-blends a semi-transparent foreground color over an opaque background color.
 */
export function blendColors(fg: RGBA, bg: RGBA): RGBA {
  const alpha = fg.a + bg.a * (1 - fg.a);
  if (alpha === 0) return { r: 255, g: 255, b: 255, a: 1 };
  return {
    r: Math.round((fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / alpha),
    g: Math.round((fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / alpha),
    b: Math.round((fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / alpha),
    a: alpha,
  };
}

/**
 * Computes WCAG 2.1 relative luminance (0.0 for pure black, 1.0 for pure white).
 */
export function getRelativeLuminance(color: RGBA): number {
  const transform = (channel: number): number => {
    const sRGB = channel / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  };

  const R = transform(color.r);
  const G = transform(color.g);
  const B = transform(color.b);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Computes the WCAG 2.1 contrast ratio between two colors (1.0 to 21.0).
 */
export function getContrastRatio(fg: RGBA, bg: RGBA): number {
  const compositeFg = fg.a < 1 ? blendColors(fg, bg) : fg;
  const lum1 = getRelativeLuminance(compositeFg);
  const lum2 = getRelativeLuminance(bg);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
}

/**
 * Walks up the DOM tree to find the effective opaque background color behind an element.
 */
export function getEffectiveBackgroundColor(el: HTMLElement): RGBA {
  let current: HTMLElement | null = el;
  const layers: RGBA[] = [];

  while (current && current !== document.documentElement) {
    const style = window.getComputedStyle(current);
    const parsed = parseColor(style.backgroundColor);
    if (parsed && parsed.a > 0) {
      layers.push(parsed);
      if (parsed.a === 1) break;
    }
    current = current.parentElement;
  }

  // Fallback to html or body background, or white if transparent
  if (layers.length === 0 || layers[layers.length - 1]!.a < 1) {
    const rootBg = parseColor(
      window.getComputedStyle(document.documentElement).backgroundColor
    );
    layers.push(rootBg && rootBg.a > 0 ? rootBg : { r: 255, g: 255, b: 255, a: 1 });
  }

  // Composite from bottom-most layer to top-most layer
  let composite = layers[layers.length - 1]!;
  for (let i = layers.length - 2; i >= 0; i--) {
    composite = blendColors(layers[i]!, composite);
  }
  return composite;
}