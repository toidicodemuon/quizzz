import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiBase = env.VITE_API_BASE_URL || "http://localhost:3000";
  return {
    plugins: [vue()],
    server: {
      port: 5173,
      strictPort: true,
      host: true,
      proxy: {
        "/uploads": {
          target: apiBase,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: "../api/public",
      emptyOutDir: true,
    },
  };
});
