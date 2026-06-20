/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  // Relative base so the static build works at any path — GitHub Pages project
  // site (/OSCEprep/), Netlify/Vercel root, or opened from a file server.
  base: "./",
  plugins: [react(), tailwindcss(), cloudflare()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    globals: true,
  },
});