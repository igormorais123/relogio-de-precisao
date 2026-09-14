import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: true,
    fs: { allow: [resolve(root, '..'), resolve(root, '../..')] },
  },
  preview: { host: '127.0.0.1', port: 5194, strictPort: true },
})
