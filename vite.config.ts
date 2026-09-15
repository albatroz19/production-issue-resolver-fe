import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/tracker-api': {
        target: 'http://localhost:8100',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:8099',
        changeOrigin: true,
      },
    },
  },
  preview: {
    proxy: {
      '/tracker-api': {
        target: 'http://localhost:8100',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:8099',
        changeOrigin: true,
      },
    },
  },
});
