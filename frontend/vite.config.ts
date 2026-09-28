import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Dev-only proxy: the browser calls /api/* on the Vite server, which forwards
// to FastAPI. The frontend and API then share one origin, so no CORS is needed.
// In production nginx does the same forwarding (see nginx.conf).
// API_PROXY_TARGET is http://backend:8000 under docker compose.
const apiTarget = process.env.API_PROXY_TARGET ?? 'http://localhost:8000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: apiTarget, changeOrigin: true },
    },
  },
})
