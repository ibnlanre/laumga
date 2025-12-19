import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { resolve } from "node:path";
import { nitro } from "nitro/vite";

import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

const html2canvas = resolve(__dirname, "node_modules/html2canvas-pro");

const config = defineConfig({
  plugins: [
    devtools(),
    nitro(),
    viteTsConfigPaths(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  resolve: {
    alias: {
      html2canvas,
    },
  },
});

export default config;
