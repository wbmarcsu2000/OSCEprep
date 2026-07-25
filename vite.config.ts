/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Relative base so the static build works at any path — GitHub Pages project
  // site (/OSCEprep/), Netlify/Vercel root, or opened from a file server.
  base: "./",
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    globals: true,
    // A git worktree under .claude/ would otherwise be discovered and its copy
    // of the whole suite run a second time (doubling wall-clock, and making a
    // failure in the copy look like a failure on this branch).
    exclude: ["**/node_modules/**", "**/dist/**", ".claude/**"],
    // The case-library tests load all 86 case files in one `it()`; 5s (the
    // default) is marginal on a cold or loaded machine and flaked in CI.
    testTimeout: 30_000,
  },
});
