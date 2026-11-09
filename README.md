# ⊕ Aperture (`lens-a11y`)

> **"See your website the way everyone else does."**
> Free, open-source, zero-dependency TypeScript library (`<15 KB` gzip) that simulates visual, cognitive, and motor impairments on any live DOM and includes an automated WCAG 2.1 accessibility auditor.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Bundle Size](https://img.shields.io/badge/Bundle-%3C15KB_gzip-success)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-9aa5ff)
![WCAG 2.1](https://img.shields.io/badge/WCAG_2.1-100%2F100_Verified-ffd400)

---

## ✨ Key Engineering Highlights

1. **Clinically Grounded Vision Simulations (`SVG feColorMatrix` + CSS Optics):**
   - **Color Vision Deficiency:** Machado et al. (2009) sRGB color matrices for **Protanopia**, **Deuteranopia**, **Tritanopia**, and **Achromatopsia**.
   - **Ocular & Retinal Conditions:** Adjustable diopter blur for **Low Visual Acuity**, warm lens clouding for **Cataracts**, pointer-tracking radial masks for **Glaucoma** (tunnel vision) and **Macular Degeneration** (central scotoma), **Photophobia / Glare**, and **Low Contrast**.
2. **Reversible Dyslexia & Motor Simulations:**
   - **Dyslexia Crowding:** TreeWalker text-node engine that swaps internal characters while caching original `Map<Text, string>` nodes for 100% lossless DOM restoration on exit.
   - **Motor Tremor & `<44×44px` Target Scanner:** Visualizes hand tremor displacement alongside live bounding-box badges flagging undersized interactive targets.
   - **Keyboard Tab-Order Topology:** Computes live focus order and renders an SVG vector path (`1 → 2 → 3...`) connecting every focusable stop.
3. **Live 8-Rule WCAG 2.1 Auditor (`runDomAudit`):**
   - Computes real alpha-blended relative luminance ($L = 0.2126R + 0.7152G + 0.0722B$) and contrast ratios across ancestor DOM layers.
   - Checks `html-lang`, `landmarks`, `img-alt`, `button-name`, `input-label`, `heading-order`, `color-contrast`, and `target-size`.
4. **Shadow-DOM HUD + Manifest V3 Browser Extension:**
   - The draggable floating HUD mounts inside an isolated **Shadow DOM** (`#lens-a11y-host`) with Trusted Types support so host styles never leak in and vision filters never blur the HUD itself.
   - Includes a **Manifest V3 Chrome/Brave Extension** (`packages/extension`) to inspect external production sites (like Google, Wikipedia, and GitHub) whose `Content-Security-Policy` headers block traditional bookmarklets.

---

## 🚀 Monorepo Architecture

```text
aperture/
├── apps/
│   └── web/               # Next.js 15 (App Router) + Tailwind v4 "Optical / Swiss-Technical" Showcase
├── packages/
│   ├── lens/              # Zero-dependency TypeScript library bundled via tsup (ESM + CJS + IIFE)
│   └── extension/         # Manifest V3 Chrome/Brave Extension for CSP-restricted websites
└── .github/workflows/     # Automated CI for Vitest WCAG checks & monorepo builds


## 📦 Quick Usage

### 1. One-Line CDN Script Tag

```html
<script src="https://cdn.jsdelivr.net/npm/lens-a11y@0.1/dist/lens.min.js" data-lens="deuteranopia"></script>
```

### 2. Programmatic ESM / TypeScript API

```typescript
import { Lens } from "lens-a11y";

// Mount the accessible Shadow-DOM floating HUD
Lens.mount({ position: "bottom-right", theme: "auto" });

// Trigger any visual, cognitive, motor, or keyboard simulation
Lens.simulate("cataracts", 75);

// Run a live WCAG 2.1 DOM audit
const report = Lens.audit();
console.log(`Score: ${report.score}/100`, report.issues);

// Restore DOM and unmount
Lens.off();
```

## 🛠️ Local Development

```bash
# 1. Install workspace dependencies
pnpm install

# 2. Run Vitest unit tests (WCAG contrast math + DOM auditor rules)
pnpm --filter lens-a11y test

# 3. Build library + browser extension bundle
pnpm --filter lens-a11y build

# 4. Start the Next.js 15 showcase site
pnpm dev
```

The showcase site will be available at [http://localhost:3000](http://localhost:3000).

## 📄 License

MIT © Gaurav Joshi
