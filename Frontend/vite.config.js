// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })



import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["@ffmpeg/ffmpeg", "@ffmpeg/core"], // make sure Vite pre-bundles these
  },
  build: {
    chunkSizeWarningLimit: 1600, // prevent warnings about large wasm
  },
  worker: {
    format: "es", // needed for some ffmpeg wasm builds
  },
});
