import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
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
