import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Inventaire246',
        short_name: 'Inventaire246',
        description: 'Gestion des inventaires scouts',
        theme_color: '#007AFF',
        background_color: '#F2F2F7',
        display: 'standalone',
        start_url: '.',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{css,html,ico,png,svg}', 'assets/index-*.js'],
        globIgnores: ['**/index.esm-*.js', '**/xlsx-*.js'],
        runtimeCaching: [
          {
            urlPattern: /assets\/(index\.esm|xlsx)-.*\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'lazy-chunks',
              expiration: { maxEntries: 10, maxAgeSeconds: 86400 * 30 },
            },
          },
        ],
      },
    }),
  ],
})
