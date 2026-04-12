import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/blockly': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/reset': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/run': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/static': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/challenges': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/score': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})
