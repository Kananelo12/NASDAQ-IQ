import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // In dev, /api calls go to the NestJS server so no CORS setup is needed.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
