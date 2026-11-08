"use client";

import React from "react";
import Link from "next/link";
import { ApertureLogo } from "../ui/ApertureLogo";
import { ThemeMode, usePreferences } from "./ThemeProvider";

const THEME_OPTIONS: { id: ThemeMode; label: string }[] = [
  { id: "system", label: "SYS" },
  { id: "light", label: "LIGHT" },
  { id: "dark", label: "DARK" },
  { id: "contrast", label: "HIGH-C" },
];

export function Navbar() {
  const { theme, setTheme, reduceMotion, setReduceMotion } = usePreferences();

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 border-b bg-[var(--bg)]/90 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-8">
        {/* Brand Identity */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex min-h-[44px] items-center gap-2.5 rounded-lg px-2 font-semibold tracking-[-0.03em]"
            aria-label="Aperture Home"
          >
            <ApertureLogo />
            <span className="text-lg">Aperture</span>
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="rounded border px-1.5 py-0.5 text-xs text-[var(--muted)]"
            >
              v0.1
            </span>
          </Link>

          {/* Primary Navigation Links */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
            {[
              { href: "/#simulations", label: "Simulations" },
              { href: "/playground", label: "Playground" },
              { href: "/docs", label: "Docs" },
              { href: "/install", label: "Install" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-[44px] items-center rounded-lg px-3 text-sm text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Accessibility Controls: Reduce Motion + 4-Way Theme Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setReduceMotion(!reduceMotion)}
            aria-pressed={reduceMotion}
            style={{ fontFamily: "var(--font-mono)" }}
            className="flex min-h-[44px] items-center gap-2 rounded-lg border px-3 text-xs uppercase tracking-wider transition-colors hover:border-[var(--accent)]"
          >
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 rounded-full"
              style={{
                backgroundColor: reduceMotion ? "var(--accent)" : "var(--muted)",
              }}
            />
            <span>Motion: {reduceMotion ? "Reduced" : "Full"}</span>
          </button>

          <div
            role="radiogroup"
            aria-label="Color theme selector"
            className="flex items-center rounded-lg border bg-[var(--surface)] p-0.5"
          >
            {THEME_OPTIONS.map((opt) => {
              const active = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setTheme(opt.id)}
                  style={{
                    fontFamily: "var(--font-mono)",
                    backgroundColor: active ? "var(--accent)" : "transparent",
                    color: active ? "var(--accent-ink)" : "var(--muted)",
                  }}
                  className="min-h-[44px] min-w-[48px] rounded-md px-2.5 text-xs font-medium uppercase tracking-wider transition-colors"
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}