import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        // Inline CSS into JavaScript
        css: true
      },
      emitCss: false // Prevent generating external CSS files
    })
  ],
  build: {
    lib: {
      entry: './src/main.js',
      name: 'DripsenderOTP',
      fileName: 'dripsender-otp'
    },
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})
