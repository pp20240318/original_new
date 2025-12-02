import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import tailwindcss from "tailwindcss";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 8800,
    proxy: {
      "/api/ZGGWIN": {
        // target: "https://api.pxxwin.com",
        target: "https://zggwin.com/api",
        // target: "https://vvpclub.com/api",
        changeOrigin: true,
        rewrite: (path) => path.replace("/api/ZGGWIN", ""),
      },
      "/api/VVPCLUB": {
        // target: "https://api.pxxwin.com",
        // target: "https://zggwin.com/api",
        target: "https://vvpclub.com/api",
        changeOrigin: true,
        rewrite: (path) => path.replace("/api/VVPCLUB", ""),
      },
      "/a6": {
        target: "https://a6.xoxbrwin.com/api",
        changeOrigin: true,
        rewrite: (path) => path.replace("/a6", ""),
      },
      "/config": {
        target: "https://zggwin.net/assets/config",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/config/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
