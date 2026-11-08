"use client";

import React, { useEffect, useState } from "react";

export function ScrollRuler() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sectionIdx, setSectionIdx] = useState("01");

  useEffect(() => {
    const onScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.round((window.scrollY / docHeight) * 100)) : 0;
      setScrollProgress(pct);

      const idx = Math.min(5, Math.floor(pct / 20) + 1);
      setSectionIdx(`0${idx}`);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <aside
      aria-hidden="true"
      className="pointer-events-none fixed top-16 bottom-0 left-0 z-30 hidden w-10 flex-col items-center justify-between border-r py-6 xl:flex"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      <span className="text-xs font-medium text-[var(--accent)]">
        {sectionIdx}
      </span>

      {/* Ruler Ticks */}
      <div className="flex flex-1 flex-col justify-between py-6 w-full items-start">
        {Array.from({ length: 21 }).map((_, i) => {
          const isMajor = i % 5 === 0;
          return (
            <div
              key={i}
              className="border-t"
              style={{
                width: isMajor ? "16px" : "8px",
                borderColor: "var(--line)",
              }}
            />
          );
        })}
      </div>

      <span className="text-xs text-[var(--muted)]">{scrollProgress}%</span>
    </aside>
  );
}