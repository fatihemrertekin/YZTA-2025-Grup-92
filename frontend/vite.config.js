import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build ayarları
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  
  // Development server ayarları
  server: {
    port: 5173,
    host: true,
  },
  
  // Preview ayarları
  preview: {
    port: 4173,
    host: true,
  },
})
