"use client";

import React, { useEffect, useState } from "react";
import { usePreferences } from "@/components/layout/ThemeProvider";

export default function RouteTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { reduceMotion } = usePreferences();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setEntered(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      style={{
        opacity: reduceMotion || entered ? 1 : 0,
        transform:
          reduceMotion || entered ? "translateY(0px)" : "translateY(8px)",
        filter: reduceMotion || entered ? "blur(0px)" : "blur(6px)",
        transition: reduceMotion
          ? "none"
          : "opacity 320ms cubic-bezier(0.22, 1, 0.36, 1), transform 320ms cubic-bezier(0.22, 1, 0.36, 1), filter 320ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {children}
    </div>
  );
}