import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://carzy-backend-gnuuvz357-brooks07s-projects.vercel.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
