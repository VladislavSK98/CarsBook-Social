import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Адресът на твоето REST API (бекенд)
        changeOrigin: true,
        secure: false, // Това е за да работи, ако бекендът използва HTTP вместо HTTPS
      },
    },
  },
});
