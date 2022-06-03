import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5002,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000/',
        secure: false,
        changeOrigin: true
      }
    }
  }
})
