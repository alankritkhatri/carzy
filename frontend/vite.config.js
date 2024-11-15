import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://carzy-314787054684.asia-south2.run.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
