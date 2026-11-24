import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [],
      manifest: {
        name: 'Courier Life Simulator 3D',
        short_name: 'Courier Life',
        description: 'A small mobile-first 3D courier delivery game.',
        theme_color: '#111827',
        background_color: '#111827',
        display: 'standalone',
        orientation: 'landscape',
        start_url: '/',
        icons: []
      }
    })
  ],
  build: { target: 'es2020', sourcemap: true }
});
