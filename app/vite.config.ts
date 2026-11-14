import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['icons/icon-192.png'],
    manifest: {
      name: 'AURUM Player Interface',
      short_name: 'AURUM',
      description: 'Демонстрационное игровое лобби и кабинет с функциями ответственной игры.',
      theme_color: '#101317',
      background_color: '#101317',
      display: 'standalone',
      start_url: './',
      scope: './',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,png,webp,ttf}'],
      navigateFallback: undefined,
      runtimeCaching: [{ urlPattern: ({ request }) => request.mode === 'navigate', handler: 'NetworkOnly' }],
    },
  })],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
