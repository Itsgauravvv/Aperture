"use client";

import React, { useState } from "react";

export function CodeBlock({
  filename,
  code,
}: {
  filename: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard permission denied
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-[var(--surface)]">
      <div
        style={{ fontFamily: "var(--font-mono)" }}
        className="flex items-center justify-between border-b bg-[var(--bg)] px-4 py-1.5 text-xs"
      >
        <span className="text-[var(--muted)]">{filename}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-live="polite"
          className="min-h-[44px] min-w-[76px] cursor-pointer rounded-md border bg-[var(--surface)] px-3 text-xs font-medium uppercase tracking-wider transition-colors hover:border-[var(--accent)]"
        >
          {copied ? "COPIED ✓" : "COPY"}
        </button>
      </div>
      <pre
        style={{ fontFamily: "var(--font-mono)" }}
        className="overflow-x-auto p-4 text-xs sm:text-sm leading-relaxed"
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}