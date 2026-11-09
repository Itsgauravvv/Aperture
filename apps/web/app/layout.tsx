import type { Metadata } from "next";
import { KonamiEasterEgg } from "@/components/ui/KonamiEasterEgg";
import {
  Inter_Tight,
  JetBrains_Mono,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import {
  ThemeInitScript,
  ThemeProvider,
} from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollRuler } from "@/components/layout/ScrollRuler";
import { OpticalDefs } from "@/components/ui/OpticalDefs";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aperture - See your website the way everyone else does",
  description:
    "Free, open-source, zero-dependency JavaScript library that simulates visual and motor impairments and audits accessibility in real time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${interTight.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <ThemeInitScript />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col">
        <OpticalDefs />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-[var(--accent)] focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-[var(--accent-ink)]"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <Navbar />
          <ScrollRuler />
          <KonamiEasterEgg />
          <main id="main-content" className="flex-1 xl:pl-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}