import { AuditIssue, AuditReport } from "../types";
import {
  getContrastRatio,
  getEffectiveBackgroundColor,
  parseColor,
} from "./contrast";

function escapeCss(value: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return value.replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}

function isIgnored(el: Element): boolean {
  return Boolean(
    el.closest("#lens-a11y-host") || el.closest("[data-lens-ignore]")
  );
}

function buildSelector(el: Element, indexFallback: number): string {
  if (el.id) return `#${escapeCss(el.id)}`;

  const dataAuditId = el.getAttribute("data-lens-audit-id");
  if (dataAuditId) return `[data-lens-audit-id="${dataAuditId}"]`;

  const uniqueAttr = `lens-issue-${indexFallback}`;
  el.setAttribute("data-lens-audit-id", uniqueAttr);
  return `[data-lens-audit-id="${uniqueAttr}"]`;
}

function hasAccessibleName(el: HTMLElement): boolean {
  const text = (el.textContent || "").trim();
  if (text.length > 0) return true;
  if (el.getAttribute("aria-label")?.trim()) return true;
  const labelledBy = el.getAttribute("aria-labelledby");
  if (labelledBy && document.getElementById(labelledBy)?.textContent?.trim()) {
    return true;
  }
  const title = el.getAttribute("title")?.trim();
  if (title) return true;
  const imgAlt = el.querySelector("img[alt]")?.getAttribute("alt")?.trim();
  if (imgAlt) return true;
  return false;
}

export function runDomAudit(root: Document | HTMLElement = document): AuditReport {
  const issues: AuditIssue[] = [];
  let issueCount = 0;

  const isFullDocument = root === document;
  const scopeEl = isFullDocument ? document.body : (root as HTMLElement);

  // 1. Check <html lang> (only when scanning full document)
  if (isFullDocument) {
    const htmlEl = document.documentElement;
    const lang = htmlEl.getAttribute("lang")?.trim();
    if (!lang) {
      issueCount++;
      issues.push({
        id: `issue-${issueCount}`,
        ruleId: "html-lang",
        severity: "error",
        title: "Document missing lang attribute",
        message: "<html> element does not have a valid lang attribute.",
        whyItMatters:
          "Screen readers need the page language to use the correct pronunciation and voice synthesis rules.",
        fixSuggestion: 'Add lang="en" (or your locale code) to the <html> tag.',
        selector: "html",
        element: htmlEl,
      });
    }

    // 2. Check <main> landmark
    const mainEl = document.querySelector('main, [role="main"]');
    if (!mainEl) {
      issueCount++;
      issues.push({
        id: `issue-${issueCount}`,
        ruleId: "landmarks",
        severity: "warning",
        title: "Missing <main> landmark region",
        message: "Page has no <main> or [role='main'] landmark.",
        whyItMatters:
          "Assistive technology users rely on landmarks to jump directly to the primary content.",
        fixSuggestion: "Wrap primary page content inside a <main> element.",
        selector: "body",
        element: document.body,
      });
    }
  }

  // 3. Check <img> missing alt attribute
  scopeEl.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
    if (isIgnored(img)) return;
    if (!img.hasAttribute("alt")) {
      issueCount++;
      issues.push({
        id: `issue-${issueCount}`,
        ruleId: "img-alt",
        severity: "error",
        title: "Image missing alt text",
        message: `<img> (${img.getAttribute("src") || "inline"}) has no alt attribute.`,
        whyItMatters:
          "Blind and low-vision screen reader users hear the raw filename or nothing at all when alt text is omitted.",
        fixSuggestion:
          'Add descriptive alt="..." text, or alt="" + aria-hidden="true" if purely decorative.',
        selector: buildSelector(img, issueCount),
        element: img,
      });
    }
  });

  // 4. Check unlabeled <button> elements
  scopeEl
    .querySelectorAll<HTMLElement>('button, [role="button"]')
    .forEach((btn) => {
      if (isIgnored(btn)) return;
      if (!hasAccessibleName(btn)) {
        issueCount++;
        issues.push({
          id: `issue-${issueCount}`,
          ruleId: "button-name",
          severity: "error",
          title: "Unlabeled button control",
          message: "Interactive button has no discernible text or aria-label.",
          whyItMatters:
            "Screen readers announce an unlabeled button simply as 'button', leaving users guessing its action.",
          fixSuggestion:
            'Add visible text inside the button or provide an explicit aria-label="Action name".',
          selector: buildSelector(btn, issueCount),
          element: btn,
        });
      }
    });

  // 5. Check unlabeled <input>, <select>, <textarea>
  scopeEl
    .querySelectorAll<HTMLElement>(
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea'
    )
    .forEach((input) => {
      if (isIgnored(input)) return;
      const id = input.id;
      const hasForLabel = id
        ? Boolean(scopeEl.querySelector(`label[for="${escapeCss(id)}"]`))
        : false;
      const hasWrappingLabel = Boolean(input.closest("label"));
      const hasAria =
        Boolean(input.getAttribute("aria-label")?.trim()) ||
        Boolean(input.getAttribute("aria-labelledby")?.trim());

      if (!hasForLabel && !hasWrappingLabel && !hasAria) {
        issueCount++;
        issues.push({
          id: `issue-${issueCount}`,
          ruleId: "input-label",
          severity: "error",
          title: "Form input missing associated label",
          message: `<${input.tagName.toLowerCase()}> has no associated <label> or aria-label.`,
          whyItMatters:
            "Placeholders disappear when typing and are not reliable accessible labels for voice-control or screen-reader users.",
          fixSuggestion:
            'Link a <label for="id"> to the input id, or add aria-label="...".',
          selector: buildSelector(input, issueCount),
          element: input,
        });
      }
    });

  // 6. Check Heading Level Skips (h1 -> h3 without h2)
  let prevHeadingLevel = 0;
  scopeEl
    .querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6")
    .forEach((heading) => {
      if (isIgnored(heading)) return;
      const level = Number(heading.tagName.slice(1));
      if (prevHeadingLevel > 0 && level > prevHeadingLevel + 1) {
        issueCount++;
        issues.push({
          id: `issue-${issueCount}`,
          ruleId: "heading-order",
          severity: "warning",
          title: `Heading level skipped (<h${prevHeadingLevel}> to <h${level}>)`,
          message: `Heading jumps from <h${prevHeadingLevel}> directly to <h${level}>.`,
          whyItMatters:
            "Screen reader users navigate pages via a hierarchical heading outline; skipping levels breaks document structure.",
          fixSuggestion: `Change this <h${level}> to <h${prevHeadingLevel + 1}> and style its visual size with CSS.`,
          selector: buildSelector(heading, issueCount),
          element: heading,
        });
      }
      prevHeadingLevel = level;
    });

  // 7. Check Low Color Contrast & 8. Tiny Tap Targets
  const allElements = scopeEl.querySelectorAll<HTMLElement>("*");
  allElements.forEach((el) => {
    if (isIgnored(el)) return;
    if (["SCRIPT", "STYLE", "SVG", "PATH", "NOSCRIPT"].includes(el.tagName)) {
      return;
    }

    const style = window.getComputedStyle(el);
    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      style.opacity === "0"
    ) {
      return;
    }

    // Check direct text node contrast
    const hasDirectText = Array.from(el.childNodes).some(
      (n) => n.nodeType === Node.TEXT_NODE && (n.nodeValue || "").trim().length > 0
    );

    if (hasDirectText) {
      const fg = parseColor(style.color);
      const bg = getEffectiveBackgroundColor(el);
      if (fg) {
        const ratio = getContrastRatio(fg, bg);
        const fontSizePx = parseFloat(style.fontSize) || 16;
        const fontWeight = Number(style.fontWeight) || 400;
        const isLargeText =
          fontSizePx >= 24 || (fontSizePx >= 18.66 && fontWeight >= 700);
        const minRequired = isLargeText ? 3.0 : 4.5;

        if (ratio < minRequired) {
          issueCount++;
          issues.push({
            id: `issue-${issueCount}`,
            ruleId: "color-contrast",
            severity: "error",
            title: `Low text contrast (${ratio}:1 < ${minRequired}:1)`,
            message: `Element text has a contrast ratio of ${ratio}:1 (WCAG AA requires ${minRequired}:1).`,
            whyItMatters:
              "Users with low vision, cataracts, or bright sunlight glare cannot read low-contrast grey-on-grey text.",
            fixSuggestion: `Darken the text color or lighten the background surface to reach at least ${minRequired}:1.`,
            selector: buildSelector(el, issueCount),
            element: el,
          });
        }
      }
    }

    // Check interactive tap target size (< 44x44px)
    const isInteractive = el.matches(
      'button, input:not([type="hidden"]), select, textarea, [role="button"], [role="radio"], [role="tab"]'
    );
    if (isInteractive) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const w = Math.round(rect.width);
        const h = Math.round(rect.height);
        if (w < 44 || h < 44) {
          issueCount++;
          issues.push({
            id: `issue-${issueCount}`,
            ruleId: "target-size",
            severity: "warning",
            title: `Undersized tap target (${w}×${h}px)`,
            message: `Interactive control measures ${w}×${h}px (recommended minimum is 44×44px).`,
            whyItMatters:
              "Users with hand tremors, limited fine motor control, or mobile thumbs struggle to activate small targets accurately.",
            fixSuggestion:
              "Add min-height: 44px; min-width: 44px; or increase padding on the interactive element.",
            selector: buildSelector(el, issueCount),
            element: el,
          });
        }
      }
    }
  });

  const penalty = issues.reduce(
    (acc, item) => acc + (item.severity === "error" ? 9 : 5),
    0
  );
  const score = Math.max(0, 100 - penalty);

  return {
    score,
    timestamp: Date.now(),
    totalChecked: allElements.length,
    issues,
  };
}