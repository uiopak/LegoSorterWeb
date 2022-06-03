import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
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
