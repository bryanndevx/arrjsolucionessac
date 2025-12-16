/* eslint-disable */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Disable Fast Refresh to avoid HMR "export is incompatible" warnings during development
  // Cast to `any` to avoid TypeScript complaining about unknown plugin option
  plugins: [react(({ fastRefresh: false } as any))],
  server: {
    host: true, // Expone el servidor en la red local
    port: 5173,
    proxy: {
      // Proxy API calls to backend (Nest) running on port 3000
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
})
