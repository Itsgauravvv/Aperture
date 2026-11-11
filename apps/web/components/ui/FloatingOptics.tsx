"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePreferences } from "../layout/ThemeProvider";

interface OpticalParticle {
  id: number;
  baseX: number;
  baseY: number;
  glyph: string;
  size: string;
  speed: number;
  phase: number;
}

const PARTICLES: OpticalParticle[] = [
  { id: 1, baseX: 7, baseY: 16, glyph: "⊕ f/1.4", size: "11px", speed: 0.8, phase: 0.2 },
  { id: 2, baseX: 88, baseY: 14, glyph: "[ 44×44px ]", size: "10px", speed: 1.1, phase: 1.4 },
  { id: 3, baseX: 93, baseY: 32, glyph: "+", size: "16px", speed: 0.6, phase: 2.1 },
  { id: 4, baseX: 5, baseY: 44, glyph: "4.5:1 AA", size: "10px", speed: 0.9, phase: 3.0 },
  { id: 5, baseX: 91, baseY: 54, glyph: "◎ ISO 100", size: "11px", speed: 1.2, phase: 0.7 },
  { id: 6, baseX: 8, baseY: 68, glyph: "+", size: "16px", speed: 0.7, phase: 4.2 },
  { id: 7, baseX: 86, baseY: 74, glyph: "λ 560nm M-CONE", size: "10px", speed: 1.0, phase: 5.1 },
  { id: 8, baseX: 4, baseY: 86, glyph: "⌜ 7.0:1 AAA ⌝", size: "10px", speed: 0.85, phase: 2.8 },
  { id: 9, baseX: 92, baseY: 89, glyph: "⊕", size: "14px", speed: 0.95, phase: 1.9 },
  { id: 10, baseX: 48, baseY: 8, glyph: "┼", size: "13px", speed: 0.75, phase: 3.6 },
];

export function FloatingOptics() {
  const { reduceMotion, resolvedTheme } = usePreferences();
  const [mounted, setMounted] = useState(false);
  const pointerRef = useRef({ x: -9999, y: -9999 });
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let rafId: number;
    const start = performance.now();

    const tick = (now: number) => {
      const t = (now - start) * 0.001;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      PARTICLES.forEach((p, idx) => {
        const el = itemRefs.current[idx];
        if (!el) return;

        if (reduceMotion) {
          el.style.transform = "translate3d(0px, 0px, 0px)";
          return;
        }

        const floatX = Math.sin(t * p.speed + p.phase) * 14;
        const floatY = Math.cos(t * (p.speed * 0.85) + p.phase) * 14;

        const originPxX = (p.baseX / 100) * vw + floatX;
        const originPxY = (p.baseY / 100) * vh + floatY;
        const dx = originPxX - pointerRef.current.x;
        const dy = originPxY - pointerRef.current.y;
        const dist = Math.hypot(dx, dy);
        const repelRadius = 155;

        let repelX = 0;
        let repelY = 0;
        let scale = 1;

        if (dist < repelRadius && dist > 1) {
          const force = Math.pow((repelRadius - dist) / repelRadius, 1.6) * 68;
          repelX = (dx / dist) * force;
          repelY = (dy / dist) * force;
          scale = 1.18;
        }

        el.style.transform = `translate3d(${(floatX + repelX).toFixed(1)}px, ${(
          floatY + repelY
        ).toFixed(1)}px, 0px) scale(${scale})`;
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [mounted, reduceMotion]);

  if (!mounted) return null;

  const isHighContrast = resolvedTheme === "contrast";

  return (
    <div
      aria-hidden="true"
      data-lens-ignore="true"
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden select-none"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {PARTICLES.map((p, i) => (
        <div
          key={p.id}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          style={{
            left: `${p.baseX}%`,
            top: `${p.baseY}%`,
            fontSize: p.size,
            transition: reduceMotion ? "none" : "transform 90ms ease-out",
          }}
          className={`fixed rounded px-2 py-0.5 uppercase tracking-widest ${
            isHighContrast
              ? "border-2 border-[#ffd400] bg-black text-[#ffd400] opacity-95 font-bold"
              : "border border-[var(--line)] bg-[var(--surface)]/75 text-[var(--muted)] opacity-65 backdrop-blur-sm"
          }`}
        >
          {p.glyph}
        </div>
      ))}
    </div>
  );
}