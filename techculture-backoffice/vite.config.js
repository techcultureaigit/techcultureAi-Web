import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function spaFallback() {
  return {
    name: "spa-fallback-404",
    closeBundle() {
      const indexHtml = resolve(__dirname, "dist/index.html");
      const notFoundHtml = resolve(__dirname, "dist/404.html");
      if (existsSync(indexHtml)) {
        copyFileSync(indexHtml, notFoundHtml);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), spaFallback()],
  appType: "spa",
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5050",
    },
  },
  preview: {
    port: 4173,
  },
});
