import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
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
});
