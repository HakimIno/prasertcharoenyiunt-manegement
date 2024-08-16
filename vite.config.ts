import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  base: './', // ตรวจสอบให้แน่ใจว่า base path ถูกต้อง
  build: {
    outDir: 'dist',
  },
})
