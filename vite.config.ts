import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

// Two entry points -> two independent bundles (dist/slow.html, dist/fast.html),
// so each can be measured on its own. ANALYZE=true also emits treemaps.
export default defineConfig({
  plugins: [
    react(),
    process.env.ANALYZE === "true" &&
      visualizer({
        filename: "benchmarks/bundle-report.html",
        template: "treemap",
        gzipSize: true,
      }),
  ],
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        slow: resolve(__dirname, "slow.html"),
        fast: resolve(__dirname, "fast.html"),
      },
    },
  },
});
