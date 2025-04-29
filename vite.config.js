import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import cssInjectedByJs from 'vite-plugin-css-injected-by-js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // 1) Compile Svelte dengan CSS di-inline
    svelte({
      compilerOptions: {
        // Inline CSS into JavaScript
        css: 'injected'
      },
      emitCss: false // Prevent generating external CSS files
    }),
    // 2) Setelah build, ambil semua CSS dan inject ke dalam JS
    cssInjectedByJs({
      // Improved options for CSS injection
      topExecutionPriority: true,
      injectCode: null, // Use the default injector for better compatibility
      styleId: 'dripsender-otp-styles', // Give the style element a specific ID
    })
  ],
  build: {
    cssCodeSplit: false,
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
