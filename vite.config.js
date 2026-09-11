import { defineConfig } from 'vite'

export default defineConfig({
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
          if (id.includes('node_modules/postprocessing')) return 'post'
          if (id.includes('node_modules/troika')) return 'text'
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'motion'
        },
      },
    },
  },
})
