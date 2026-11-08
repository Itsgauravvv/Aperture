// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import {
  getContrastRatio,
  parseColor,
  runDomAudit,
} from "../src/index";

describe("WCAG 2.1 Contrast Math & Theme Tokens", () => {
  it("computes 21:1 for pure black and white", () => {
    const black = parseColor("#000000")!;
    const white = parseColor("#ffffff")!;
    expect(getContrastRatio(black, white)).toBe(21);
  });

  it("verifies Light, Dark, and High-Contrast theme tokens pass WCAG AA (>= 4.5:1)", () => {
    // Light Theme
    const lightBg = parseColor("#f5f5f2")!;
    const lightInk = parseColor("#0e0e10")!;
    const lightMuted = parseColor("#5b5b66")!;
    expect(getContrastRatio(lightInk, lightBg)).toBeGreaterThanOrEqual(4.5);
    expect(getContrastRatio(lightMuted, lightBg)).toBeGreaterThanOrEqual(4.5);

    // Dark Theme
    const darkBg = parseColor("#0b0b0e")!;
    const darkInk = parseColor("#f2f2f5")!;
    const darkMuted = parseColor("#a0a0ad")!;
    expect(getContrastRatio(darkInk, darkBg)).toBeGreaterThanOrEqual(4.5);
    expect(getContrastRatio(darkMuted, darkBg)).toBeGreaterThanOrEqual(4.5);

    // High Contrast Theme
    const hcBg = parseColor("#000000")!;
    const hcAccent = parseColor("#ffd400")!;
    expect(getContrastRatio(hcAccent, hcBg)).toBeGreaterThanOrEqual(7.0);
  });
});

describe("DOM Accessibility Auditor Rules", () => {
  it("detects missing lang, missing main landmark, missing alt, unlabeled button, unlabeled input, and skipped headings", () => {
    document.documentElement.removeAttribute("lang");
    document.body.innerHTML = `
      <div>
        <h1>Main Title</h1>
        <h4>Skipped Heading Level</h4>
        <img src="/hero.png" />
        <button type="button"></button>
        <input type="email" placeholder="Enter email" />
        <p style="color: rgb(200, 200, 200); background-color: rgb(255, 255, 255);">
          Unreadable low contrast text
        </p>
      </div>
    `;

    const report = runDomAudit(document);
    const ruleIds = report.issues.map((i) => i.ruleId);

    expect(ruleIds).toContain("html-lang");
    expect(ruleIds).toContain("landmarks");
    expect(ruleIds).toContain("img-alt");
    expect(ruleIds).toContain("button-name");
    expect(ruleIds).toContain("input-label");
    expect(ruleIds).toContain("heading-order");
    expect(ruleIds).toContain("color-contrast");
    expect(report.score).toBeLessThan(100);
  });

  it("scores 100/100 on a compliant accessible document", () => {
    document.documentElement.setAttribute("lang", "en");
    document.body.style.backgroundColor = "rgb(255, 255, 255)";
    document.body.innerHTML = `
      <main>
        <h1 style="color: rgb(14, 14, 16);">Accessible Heading</h1>
        <h2 style="color: rgb(14, 14, 16);">Subheading</h2>
        <img src="/logo.svg" alt="Company Logo" />
        <label for="user-email" style="color: rgb(14, 14, 16);">Email</label>
        <input id="user-email" type="email" />
      </main>
    `;

    const report = runDomAudit(document);
    expect(report.issues.length).toBe(0);
    expect(report.score).toBe(100);
  });
});