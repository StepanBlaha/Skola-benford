import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Skola-benford/",
  server: {
    port: 5181,
    strictPort: true
  }
})
