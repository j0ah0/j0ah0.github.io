import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'log-app.js',
        chunkFileNames: 'log-app-[name].js',
        assetFileNames: 'log-app.[ext]',
      },
    },
  },
})
