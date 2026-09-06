import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/articles': 'http://localhost:3000',
      '/article': 'http://localhost:3000',
      '/login': 'http://localhost:3000',
      '/send-email': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000',
      '/about': 'http://localhost:3000',
      '/contact': 'http://localhost:3000',
      '/extras': 'http://localhost:3000',
      '/extra': 'http://localhost:3000',
      '/stats': 'http://localhost:3000',
      '/theme': 'http://localhost:3000',
      '/hero-slides': 'http://localhost:3000',
      '/change-password': 'http://localhost:3000',
    }
  }
})
