import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",   // 👈 important
      formats: ["es"],
      fileName: () => "ha-cards.js"
    },
    rollupOptions: {
      external: []
    }
  }
});