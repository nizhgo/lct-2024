import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import { writeFileSync } from "node:fs"
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    tsconfigPaths(),
    {
      name: "generate-version",
      generateBundle() {
        //YYYY.MM.DD.HH.MM
        const version = new Date().toISOString().replace(/[-:]/g, ".").replace("T", ".");
        writeFileSync("public/version.txt", version);
      }
    },
    VitePWA({ registerType: 'autoUpdate',
      manifest: {
      name: "M Project",
      short_name: "M Project",
        icons: [
          {
            src: "192logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "512logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        display: "standalone",
        theme_color: "#D9282F",
        description: "Сервис мониторинга и адаптивного распределения заявок на обслуживание от маломобильных пассажиров",
      },
    }),
  ],
});
