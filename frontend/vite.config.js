import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://65.1.110.113:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
