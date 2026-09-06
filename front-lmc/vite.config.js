import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/lmc': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000',
      '/login': 'http://localhost:3000',
      '/change-password': 'http://localhost:3000',
      '/lmc/hero-slides': 'http://localhost:3000'
    }
  }
})
