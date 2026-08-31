import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost/Abbey_Cars',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost/Abbey_Cars',
        changeOrigin: true,
        secure: false,
      },
      '/Abbey_Cars/api': {
        target: 'http://localhost/Abbey_Cars',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/Abbey_Cars/, ''),
      },
    },
  },
})
