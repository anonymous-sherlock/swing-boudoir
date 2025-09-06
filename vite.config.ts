import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { tanstackRouter } from '@tanstack/router-plugin/vite'


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    tanstackRouter({
      routesDirectory: './src/routes',
      target: 'react',
      autoCodeSplitting: false,
    }),
    react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
