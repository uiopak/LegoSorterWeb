import { defineConfig, normalizePath } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import path from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'
//import copy from 'rollup-plugin-copy'

export default defineConfig({
  //publicDir: "./src/parts",
    plugins: [
        solidPlugin(),
        viteStaticCopy({
            targets: [
                {
                    src: normalizePath(path.resolve(__dirname, './parts') + '/[!.]*'),
                    dest: 'parts'
                },
                //{
                //    src: normalizePath(path.resolve(__dirname, './p') + '/[!.]*'),
                //    dest: 'p'
                //},
            ],
        }),
        //copy({
        //    targets: [
        //        { src: 'parts/**/*', dest: 'dist/public/parts' },
        //        { src: 'p/**/*', dest: 'dist/public/p' }
        //    ]
        //})
    ],
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
        },
        '/hubs': {
            target: 'http://localhost:5000/',
            secure: false,
            changeOrigin: true,
            ws:true
        }
    }
  }
});
