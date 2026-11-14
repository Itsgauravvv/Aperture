"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ApertureLogo } from "../ui/ApertureLogo";
import { ThemeMode, usePreferences } from "./ThemeProvider";

const THEME_OPTIONS: { id: ThemeMode; label: string }[] = [
  { id: "system", label: "SYS" },
  { id: "light", label: "LIGHT" },
  { id: "dark", label: "DARK" },
  { id: "contrast", label: "HIGH-C" },
];

// Compact icons used instead of text labels on mobile
function ThemeIcon({ id }: { id: ThemeMode }) {
  const common = {
    "aria-hidden": true,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-4 w-4",
  };

  if (id === "light") {
    // Sun
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    );
  }
  if (id === "dark") {
    // Moon
    return (
      <svg {...common}>
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    );
  }
  if (id === "contrast") {
    // Half-filled circle (high contrast)
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18a9 9 0 000-18z" fill="currentColor" />
      </svg>
    );
  }
  // System: monitor
  return (
    <svg {...common}>
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

const NAV_ITEMS = [
  { href: "/#simulations", label: "Simulations" },
  { href: "/playground", label: "Playground" },
  { href: "/docs", label: "Docs" },
  { href: "/install", label: "Install" },
];

export function Navbar() {
  const { theme, setTheme, reduceMotion, setReduceMotion } = usePreferences();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu with the Escape key
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 border-b bg-[var(--bg)]/90 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-8">
        {/* Left: Brand Identity + Primary Navigation */}
        <div className="flex items-center gap-2 lg:gap-5">
          {/* Mobile / tablet: menu toggle, left of the logo (hidden on desktop) */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="flex lg:hidden min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg border bg-[var(--surface)] transition-colors hover:border-[var(--accent)]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-5 w-5"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>

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

          <nav
            aria-label="Main navigation"
            className="hidden lg:flex items-center gap-1"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className="flex min-h-[44px] items-center rounded-lg px-3 text-sm text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Motion + 4-Way Theme Switcher (shifted left) + STAR ON GITHUB CTA */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={() => setReduceMotion(!reduceMotion)}
            aria-pressed={reduceMotion}
            title="Toggle vestibular-safe reduced motion mode"
            style={{ fontFamily: "var(--font-mono)" }}
            className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border bg-[var(--surface)] px-3 text-xs uppercase tracking-wider transition-colors hover:border-[var(--accent)]"
          >
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 rounded-full"
              style={{
                backgroundColor: reduceMotion ? "var(--accent)" : "#10b981",
              }}
            />
            <span>
              <span className="hidden sm:inline">Motion: </span>
              {reduceMotion ? "Reduced" : "Full"}
            </span>
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
                  aria-label={opt.label}
                  className="flex min-h-[40px] min-w-[38px] cursor-pointer items-center justify-center rounded-md px-1.5 text-xs font-medium uppercase tracking-wider transition-colors sm:min-w-[46px] sm:px-2"
                >
                  <span className="sm:hidden">
                    <ThemeIcon id={opt.id} />
                  </span>
                  <span className="hidden sm:inline">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Rightmost CTA: STAR ON GITHUB */}
          <a
            href="https://github.com/Itsgauravvv/Aperture"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Star Aperture on GitHub"
            style={{
              fontFamily: "var(--font-mono)",
              backgroundColor: "var(--ink)",
              color: "var(--bg)",
            }}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-lg px-0 text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-90 sm:px-3.5"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span className="hidden sm:inline">STAR ON GITHUB</span>
          </a>
        </div>
      </div>

      {/* Mobile / tablet dropdown menu (only rendered below the lg breakpoint) */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="absolute left-0 right-0 top-full border-b bg-[var(--bg)] lg:hidden"
        >
          <div className="mx-auto flex max-w-[1280px] flex-col px-4 py-2 sm:px-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[48px] items-center rounded-lg px-3 text-base text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}