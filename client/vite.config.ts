import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Load .env from the repo root so a single .env file serves both client and server.
  envDir: '..',
  server: {
    port: 3000,
  },
})
