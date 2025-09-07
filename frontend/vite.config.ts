import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: ["yw8g0o4oksscgswgs4848c4o.193.46.198.43.sslip.io", "n0ksgoooc40sckswwk8cgkso.193.46.198.43.sslip.io"]
  },
})
