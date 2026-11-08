export class DyslexiaMode {
  private originalTextMap = new Map<Text, string>();
  private intervalId: number | null = null;

  public start(): void {
    if (typeof document === "undefined" || this.intervalId !== null) return;

    this.collectTextNodes();
    this.tick();

    const reducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.getAttribute("data-reduce-motion") === "true";

    if (!reducedMotion) {
      this.intervalId = window.setInterval(() => this.tick(), 420);
    }
  }

  public stop(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    // Restore every single DOM text node back to its exact original string
    for (const [node, original] of this.originalTextMap.entries()) {
      node.nodeValue = original;
    }
    this.originalTextMap.clear();
  }

  private collectTextNodes(): void {
    this.originalTextMap.clear();
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (
            parent.closest("#lens-a11y-host") ||
            parent.closest("[data-lens-ignore]") ||
            ["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "SVG"].includes(
              parent.tagName
            )
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          if (!node.nodeValue || node.nodeValue.trim().length < 4) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    let current: Node | null;
    while ((current = walker.nextNode())) {
      const textNode = current as Text;
      this.originalTextMap.set(textNode, textNode.nodeValue || "");
    }
  }

  private tick(): void {
    for (const [node, original] of this.originalTextMap.entries()) {
      node.nodeValue = original.replace(/\b([A-Za-z]{4,})\b/g, (word) => {
        if (Math.random() > 0.45) return word;
        const chars = word.split("");
        const idx = 1 + Math.floor(Math.random() * (chars.length - 3));
        const tmp = chars[idx]!;
        chars[idx] = chars[idx + 1]!;
        chars[idx + 1] = tmp;
        return chars.join("");
      });
    }
  }
}