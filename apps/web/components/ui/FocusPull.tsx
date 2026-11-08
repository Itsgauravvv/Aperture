"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePreferences } from "../layout/ThemeProvider";

export function FocusPull({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduceMotion } = usePreferences();
  const [inFocus, setInFocus] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setInFocus(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInFocus(true);
          }
        });
      },
      { threshold: 0.18 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <div
      ref={ref}
      style={{
        filter: reduceMotion || inFocus ? "blur(0px)" : "blur(7px)",
        opacity: reduceMotion || inFocus ? 1 : 0.45,
        transform:
          reduceMotion || inFocus ? "translateY(0px)" : "translateY(8px)",
        transition: reduceMotion
          ? "none"
          : "filter 620ms cubic-bezier(0.22, 1, 0.36, 1), opacity 520ms ease, transform 520ms ease",
      }}
      className={className}
    >
      {children}
    </div>
  );
}