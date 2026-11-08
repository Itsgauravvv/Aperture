"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePreferences } from "../layout/ThemeProvider";

export function ApertureLogo({ className = "w-7 h-7" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { reduceMotion } = usePreferences();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduceMotion) {
      setOffset({ x: 0, y: 0 });
      return;
    }

    const handlePointerMove = (e: MouseEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const angle = Math.atan2(dy, dx);
      const distance = Math.min(2.2, Math.hypot(dx, dy) / 120);

      setOffset({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("mousemove", handlePointerMove);
  }, [reduceMotion]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* Outer Precision Ring */}
      <circle
        cx="16"
        cy="16"
        r="14.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* 6 Aperture Blades */}
      <g stroke="currentColor" strokeWidth="1" opacity="0.55">
        <line x1="16" y1="1.5" x2="22" y2="11" />
        <line x1="28.5" y1="8.7" x2="22" y2="19" />
        <line x1="28.5" y1="23.2" x2="16" y2="23" />
        <line x1="16" y1="30.5" x2="10" y2="21" />
        <line x1="3.5" y1="23.2" x2="10" y2="13" />
        <line x1="3.5" y1="8.7" x2="16" y2="9" />
      </g>
      {/* Tracking Inner Lens Core */}
      <g
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transition: reduceMotion ? "none" : "transform 90ms ease-out",
        }}
      >
        <circle
          cx="16"
          cy="16"
          r="6.5"
          stroke="var(--accent)"
          strokeWidth="1.75"
        />
        <circle cx="16" cy="16" r="2" fill="var(--accent)" />
      </g>
    </svg>
  );
}