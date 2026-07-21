import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.VITE_WEBSITE_BASE ?? "/",
  build: {
    target: "es2022",
    sourcemap: false,
  },
  server: {
    host: "127.0.0.1",
    port: 4180,
  },
  preview: {
    host: "127.0.0.1",
    port: 4181,
  },
});
