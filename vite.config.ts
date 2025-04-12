import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";

// Conditionally load Replit plugins based on environment
const isReplit = typeof process !== 'undefined' && process.env.REPL_ID !== undefined;
const isDev = typeof process !== 'undefined' && process.env.NODE_ENV !== "production";

// Helper function to handle dynamic imports conditionally
const getCartographerPlugin = async () => {
  if (isReplit && isDev) {
    try {
      const module = await import("@replit/vite-plugin-cartographer");
      return module.cartographer();
    } catch (e) {
      console.warn("Could not load cartographer plugin", e);
      return null;
    }
  }
  return null;
};

export default defineConfig(async () => {
  // Get plugins that might fail to load
  const cartographerPlugin = await getCartographerPlugin();
  
  return {
    plugins: [
      react(),
      // Always include theme plugin for proper styling
      themePlugin(),
      // Only use Replit-specific plugins in Replit environment
      ...(isReplit ? [
        isDev && runtimeErrorOverlay(),
        cartographerPlugin,
      ] : []).filter(Boolean),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "client", "src"),
        "@shared": path.resolve(process.cwd(), "shared"),
        "@assets": path.resolve(process.cwd(), "attached_assets"),
      },
    },
    root: path.resolve(process.cwd(), "client"),
    build: {
      outDir: path.resolve(process.cwd(), "dist/public"),
      emptyOutDir: true,
    },
  };
});
