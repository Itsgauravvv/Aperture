<div align="center">

[![npm version](https://img.shields.io/npm/v/lens-a11y.svg?style=flat-square&color=2f3cff)](https://www.npmjs.com/package/lens-a11y)
[![CI & WCAG Gate](https://github.com/Itsgauravvv/Aperture/actions/workflows/ci.yml/badge.svg)](https://github.com/Itsgauravvv/Aperture/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![CDN: jsDelivr](https://img.shields.io/badge/CDN-jsDelivr-brightgreen.svg?style=flat-square)](https://www.jsdelivr.com/package/npm/lens-a11y)

# APERTURE (`lens-a11y`)

### **See your website the way *everyone* else does.**

*A precision optical instrument for the modern web. Simulate 13 clinical vision, cognitive, and motor conditions directly on your live DOM—and audit WCAG 2.1 compliance in real time.*

[![License: MIT](https://img.shields.io/badge/License-MIT-0e0e10.svg?style=flat-square)](./LICENSE)
[![Bundle Size](https://img.shields.io/badge/Footprint-%3C15KB_Gzip-9aa5ff?style=flat-square)](#)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0_Runtime-10b981?style=flat-square)](#)
[![WCAG Dogfooded](https://img.shields.io/badge/WCAG_2.1_AA%2FAAA-100%2F100_Verified-ffd400?style=flat-square)](#)

[Explore Aperture](https://aperture-a11y.vercel.app/) · [Field Manual (`/docs`)](https://aperture-a11y.vercel.app/docs) · [Diagnostic Workbench (`/playground`)](https://aperture-a11y.vercel.app/playground) · [Install Guide (`/install`)](https://aperture-a11y.vercel.app/install)

</div>

---

## 00 // THE MANIFESTO

Most digital interfaces are calibrated for a single pair of eyes on a $2,000 studio display in a dark room. 

In reality, **2.2 billion people** navigate the web with vision impairments, color vision deficiency, crystalline lens clouding, orthographic crowding, or motor tremors. Yet most accessibility tooling still feels like a 2008 enterprise spreadsheet buried inside DevTools.

**Aperture (`lens-a11y`)** is built for design engineers who care about craft. Engineered like a Leica viewfinder and Teenage Engineering field instrument, it drops into any stack in seconds—with zero runtime dependencies, zero telemetry, and a hermetically sealed Shadow-DOM HUD.

> *"Open source. Inclusive by design. Accessible by default."*

---

## 📦 Installation

Install the core optical engine via your preferred package manager:

```bash
npm install lens-a11y
# or
pnpm add lens-a11y
# or
yarn add lens-a11y
```
---

## Global CDN (Zero Build Step)
Drop this script tag into the `<head>` of any plain HTML file, WordPress site, or static prototype:

```html
<script src="https://cdn.jsdelivr.net/npm/lens-a11y@0.1.0/dist/lens.min.js" data-lens="auto"></script>
```

> Looking for the Chrome/Brave extension? See [Go to Section 03](#03--usage--integration).

---

## 01 // OPTICAL & CLINICAL CAPABILITIES

### 1. Physiologically Grounded Vision Simulations (`SVG feColorMatrix` + CSS Optics)
Instead of naive hue shifts, Aperture injects hardware-accelerated `<feColorMatrix>` primitives calibrated to **Machado, Oliveira, and Fernandes (2009)** sRGB cone-deficiency matrices alongside real-time pointer masks:

| Mode ID | Category | Optical Specification | What It Exposes in Your UI |
| :--- | :--- | :--- | :--- |
| `deuteranopia` | M-Cone Matrix | Machado 5×4 Green-Deficient | Red and green status pills collapse into indistinguishable olive tones. |
| `protanopia` | L-Cone Matrix | Machado 5×4 Red-Deficient | Crimson error badges darken and lose visual urgency against dark surfaces. |
| `tritanopia` | S-Cone Matrix | Machado 5×4 Blue-Deficient | Sky blues shift teal; warm yellow warnings wash into pale pink. |
| `achromatopsia` | Rod Monochromacy | Rec.709 Pure Luminance | Complete absence of hue. Proves why color alone can never convey state. |
| `cataracts` | Ocular Haze | Adjustable Diopter Blur + Sepia | Simulates clouded crystalline lenses; washes out faint `1px` borders. |
| `low-vision` | Visual Acuity | Gaussian Diopter (`1.5px–8px`) | Tests whether visual hierarchy survives when `12px` micro-copy blurs out. |
| `glaucoma` | Retinal Field | `150px` Peripheral Tunnel Mask | Cuts off peripheral sight; shows why corner toast alerts go unnoticed. |
| `macular` | Central Vision | `135px` Central Scotoma Mask | Obscures the center of gaze, forcing reliance on peripheral layout cues. |
| `glare` | Photophobia | Halation Bloom (`+38%` Bright) | Simulates harsh sunlight washing out subtle light-mode surface tokens. |
| `low-contrast` | Sensitivity | Contrast Compression (`-62%`) | Exposes trendy grey-on-grey typography that fails in ambient light. |

### 2. Reversible Cognitive, Motor & Keyboard Topology Engines
* **`dyslexia` (Orthographic Crowding):** Walks visible text nodes via native `TreeWalker` APIs and swaps internal characters while caching original `Map<Text, string>` references—guaranteeing a **100% lossless byte-for-byte DOM restore** the millisecond you call `Lens.off()`.
* **`tremor` (Motor Displacement + `<44×44px` Target Scanner):** Applies sinusoidal pointer jitter while drawing live crimson bounding-box callouts over every interactive control that fails WCAG 2.5.5 (`44×44px` minimum tap target).
* **`keyboard-path` (Tab-Order Topology):** Computes the live focusable sequence across the DOM and draws an SVG vector polyline (`1 → 2 → 3 → 4...`) so focus traps have nowhere to hide.

### 3. Live 8-Rule WCAG 2.1 DOM Auditor (`runDomAudit`)
Walks the live DOM, alpha-blends semi-transparent ancestor backgrounds, linearizes sRGB channels, and evaluates the W3C relative luminance equation:

$$L = 0.2126 \times R_{\text{lin}} + 0.7152 \times G_{\text{lin}} + 0.0722 \times B_{\text{lin}}$$

$$\text{Contrast Ratio} = \frac{L_{\text{brightest}} + 0.05}{L_{\text{darkest}} + 0.05}$$

Verifies **`color-contrast`**, **`target-size`**, **`button-name`**, **`input-label`**, **`img-alt`**, **`heading-order`**, **`html-lang`**, and **`landmarks`**—returning a structured `AuditReport` with click-to-scroll element highlighting.

---

## 02 // MONOREPO ARCHITECTURE

```text
Aperture/
├── apps/
│   └── web/                  # Next.js 15 (App Router) + Tailwind v4 Optical Showcase & Workbench
│       ├── app/              # /, /playground, /docs, /install, dynamic OpenGraph & Favicon
│       └── components/       # HeroLens, Retinal Spectrometer, Darkroom Challenge, FloatingOptics
├── packages/
│   ├── lens/                 # Zero-dependency TypeScript core bundled via tsup (ESM + CJS + IIFE)
│   │   └── src/              # vision.ts, dyslexia.ts, motor.ts, keyboard.ts, auditor.ts, hud.ts
│   └── extension/            # Manifest V3 Chrome/Brave Extension (bypasses strict host CSPs)
└── .github/workflows/        # Automated GitHub Actions CI & Vitest WCAG Contrast Gate
```

---

## 03 // USAGE & INTEGRATION

Already installed via the [Installation](#-installation) section above? Here's how to put Aperture to work.

### Declarative — Script Tag
Boot straight into a specific clinical simulation using the `data-lens` attribute:

```html
<!-- Mounts the floating optical HUD automatically -->
<script src="https://cdn.jsdelivr.net/npm/lens-a11y@0.1.0/dist/lens.min.js" data-lens="auto"></script>

<!-- Or boot directly into a specific clinical simulation -->
<script src="https://cdn.jsdelivr.net/npm/lens-a11y@0.1.0/dist/lens.min.js" data-lens="deuteranopia"></script>
```

### Programmatic — Typed ESM API

```ts
import { Lens } from "lens-a11y";

// 1. Mount the isolated Shadow-DOM viewfinder HUD
Lens.mount({
  position: "bottom-right",
  theme: "auto", 
});

// 2. Activate any optical, cognitive, motor, or topology simulation
Lens.simulate("cataracts", 75);

// 3. Run the 8-rule WCAG 2.1 scanner on the live DOM
const report = Lens.audit();
console.log(`WCAG Score: ${report.score}/100`, report.issues);

// 4. Cleanly restore all DOM nodes and unmount
Lens.off();
```

### Manifest V3 Browser Extension (`packages/extension`)
Major production sites (Google Search, Wikipedia, GitHub) enforce strict `Content-Security-Policy: script-src 'self'` headers that block traditional `javascript:` bookmarklets. Our Manifest V3 extension injects `lens.min.js` inside an isolated content-script world so you can inspect any website on the internet:
1. Run `pnpm --filter lens-a11y build` to bundle `packages/extension/lens.min.js`.
2. Open `brave://extensions` or `chrome://extensions` and toggle **Developer mode**.
3. Click **Load unpacked** and select `packages/extension`.

---

## 04 // HIDDEN INTERACTIVE PROTOCOLS (EASTER EGGS)

* **`Shift + P` (or Konami Code `↑ ↑ ↓ ↓ ← → ← → B A`):** Triggers the **Darkroom Screen-Reader Empathy Challenge**. Slowly dissolves the visual webpage into pitch-black darkness and activates native Web Speech API (`window.speechSynthesis`) voice output—challenging you to locate and trigger a semantic target button using only your `Tab` key and audio cues.
* **`Shift + B`:** Replays the **Optical Shutter & Diopter Calibration Boot Sequence** (`f/16` → `f/1.4`) on demand.

---

## 05 // LOCAL DEVELOPMENT & CI QUALITY GATE

```bash
# 1. Install workspace dependencies
pnpm install

# 2. Build the core library (ESM + CJS + IIFE + Extension bundle)
pnpm --filter lens-a11y build

# 3. Run Vitest WCAG theme contrast & DOM auditor unit tests
pnpm --filter lens-a11y test

# 4. Launch the Next.js 15 showcase & workbench at http://localhost:3000
pnpm dev
```

---

## 06 // LICENSE & CRAFT

Crafted by **Gaurav Joshi**.

If Aperture helps you see the web with more empathy, **drop a ★ on the GitHub repository** to help more engineers discover accessible tooling.