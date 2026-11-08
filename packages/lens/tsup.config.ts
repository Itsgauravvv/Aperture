import { defineConfig } from "tsup";

export default defineConfig([
  // 1. ESM + CJS build for npm / Next.js / bundlers
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    minify: true,
    target: "es2020",
  },
  // 2. IIFE build for <script src=".../lens.min.js"> and Bookmarklets
  {
    entry: { "lens.min": "src/index.ts" },
    format: ["iife"],
    globalName: "LensGlobal",
    minify: true,
    target: "es2020",
    outExtension() {
      return { js: ".js" };
    },
    footer: {
      // Expose window.Lens directly for script-tag users
      js: "if(typeof window!=='undefined'&&window.LensGlobal&&window.LensGlobal.Lens){window.Lens=window.LensGlobal.Lens;}",
    },
  },
]);