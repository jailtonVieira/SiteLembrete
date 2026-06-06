import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // Necessário para Service Worker funcionar em dev
      'Service-Worker-Allowed': '/',
    },
  },
})
