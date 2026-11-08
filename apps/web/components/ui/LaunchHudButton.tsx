"use client";

import React, { useEffect, useState } from "react";
import { Lens } from "lens-a11y";

export function LaunchHudButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onLensChange = () => {
      setMounted(Lens.getState().mounted);
    };
    window.addEventListener("lens:change", onLensChange);
    return () => window.removeEventListener("lens:change", onLensChange);
  }, []);

  const handleToggle = () => {
    if (Lens.getState().mounted) {
      Lens.off();
      setMounted(false);
    } else {
      Lens.mount({ position: "bottom-right" });
      setMounted(true);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      style={{
        backgroundColor: "var(--accent)",
        color: "var(--accent-ink)",
      }}
      className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-[10px] px-5 py-2.5 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-opacity hover:opacity-90"
    >
      {mounted ? "Close Floating HUD" : "Launch Floating HUD"}
    </button>
  );
}