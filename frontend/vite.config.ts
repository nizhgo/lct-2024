import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import { writeFileSync } from "node:fs"
import tsconfigPaths from 'vite-tsconfig-paths';

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
    }
  ],
});
