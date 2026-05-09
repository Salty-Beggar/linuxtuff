import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://api:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Use this if your backend routes don't have '/api'
      }
    },
    // headers: {
    //   "Content-Type": 'application/json'
    // }
    // headers: {
    //   "Access-Control-Allow-Origin": 'http://localhost:5000'
    // }
  }
})
