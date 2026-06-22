import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// `base` controls the public path the app is served from. When deploying
// behind an IIS virtual path (e.g. https://host/clock/), set VITE_BASE to
// that path (e.g. "/clock/"). Defaults to "/" for root-site deployments.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  build: {
    // Static build output consumed by the IIS staging site.
    outDir: 'dist',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
