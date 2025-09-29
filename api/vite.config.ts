// vite.config.ts
import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";
import clearConsole from "vite-plugin-clear-console";
import ViteRestart from "vite-plugin-restart";
import { env } from "process";

export default defineConfig({
  plugins: [
    clearConsole(),
    ViteRestart({
      restart: ["src/**/*"],
    }),
    {
      name: "log-restart",
      handleHotUpdate({ file }) {
        console.log(`File changed: ${file}`);
        console.log("Server restarted successfully!");
      },
    },
    ...VitePluginNode({
      adapter: "express", // If using Express; other frameworks are also supported
      appPath: "./src/index.ts", // Path to your main server file
      exportName: "viteNodeApp", // Exported name for the app (match this in `src/index.ts`)
      tsCompiler: "esbuild", // Faster compilation with esbuild
    }),
  ],
  server: {
    watch: {
      usePolling: true, // Optional: ensure this if using Windows or a VM
    },
    port: +(env.PORT ?? 3000),
    host: "0.0.0.0",
  },
});
