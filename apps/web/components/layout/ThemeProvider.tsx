"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "system" | "light" | "dark" | "contrast";

interface PreferencesContextValue {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark" | "contrast";
  setTheme: (theme: ThemeMode) => void;
  reduceMotion: boolean;
  setReduceMotion: (reduce: boolean) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(
  undefined
);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<
    "light" | "dark" | "contrast"
  >("light");
  const [reduceMotion, setReduceMotionState] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = (localStorage.getItem("aperture-theme") as ThemeMode) || "system";
    const savedMotion = localStorage.getItem("aperture-reduce-motion");
    const mediaReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setThemeState(savedTheme);
    const shouldReduce = savedMotion !== null ? savedMotion === "true" : mediaReducedMotion;
    setReduceMotionState(shouldReduce);
    document.documentElement.setAttribute("data-reduce-motion", String(shouldReduce));
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (mode: ThemeMode) => {
      let target: "light" | "dark" | "contrast";
      if (mode === "system") {
        target = mediaQuery.matches ? "dark" : "light";
      } else {
        target = mode;
      }
      setResolvedTheme(target);
      document.documentElement.setAttribute("data-theme", target);
    };

    applyTheme(theme);

    const listener = () => {
      if (theme === "system") applyTheme("system");
    };
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem("aperture-theme", newTheme);
  };

  const setReduceMotion = (reduce: boolean) => {
    setReduceMotionState(reduce);
    localStorage.setItem("aperture-reduce-motion", String(reduce));
    document.documentElement.setAttribute("data-reduce-motion", String(reduce));
  };

  return (
    <PreferencesContext.Provider
      value={{ theme, resolvedTheme, setTheme, reduceMotion, setReduceMotion }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences must be used within a ThemeProvider");
  }
  return ctx;
}

/**
 * Injected in <head> to prevent Flash of Unstyled Content (FOUC) before React hydrates.
 */
export function ThemeInitScript() {
  const script = `
    (function() {
      try {
        var mode = localStorage.getItem('aperture-theme') || 'system';
        var resolved = mode;
        if (mode === 'system') {
          resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', resolved);

        var savedMotion = localStorage.getItem('aperture-reduce-motion');
        var sysMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var reduce = savedMotion !== null ? savedMotion === 'true' : sysMotion;
        document.documentElement.setAttribute('data-reduce-motion', String(reduce));
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}