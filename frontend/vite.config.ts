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
    allowedHosts: ["ys0k0wsw0cc0840o4g88kc8w.193.46.198.43.sslip.io", "fswkskwc4sk40s8ok4c8s4sg.193.46.198.43.sslip.io"]
  },
})
