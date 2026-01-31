import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { webcrypto } from "node:crypto";

// Polyfill crypto for Node.js environments
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as any;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
