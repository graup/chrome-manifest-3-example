import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';

import manifest from './src/manifest.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), {
    name: 'manifest',
    generateBundle(outputOptions, bundle) {
      //console.log(bundle);
      //const entry = Object.values(bundle).find((chunk: any) => chunk.isEntry);
      this.emitFile({
        type: 'asset',
        fileName: 'manifest.json',
        source: JSON.stringify(manifest, null, 2)
      });
    }
  }],
  build: {
    target: "es2015",
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "assets/[name].[ext]"
      },
      input: {
        background: resolve(__dirname, "src/background/index.ts"),
        'content-script': resolve(__dirname, "src/content-script/index.ts"),
        popup: resolve(__dirname, "src/popup.html"),
      },
    },
  },
})
