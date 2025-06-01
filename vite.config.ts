import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { nodePolyfills } from 'vite-plugin-node-polyfills'
import topLevelAwait from 'vite-plugin-top-level-await'
import wasm from 'vite-plugin-wasm'

import replace from '@rollup/plugin-replace'
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  resolve: {
    alias: {
      'symbol-crypto-wasm-node': 'symbol-crypto-wasm-web/symbol_crypto_wasm.js',
    }
  },
  build: {
    chunkSizeWarningLimit: 4000,
  },
  plugins: [
    nodePolyfills({
      include: [
        // 'buffer',
        'crypto',
        // 'util'
      ],
      globals: {
        Buffer: true,
        // global: true,
        // process: true,
      },
    }),
    topLevelAwait(),
    wasm(),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
      preventAssignment: true
    }),
    VitePWA({
      devOptions: {
        enabled: true
      },
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 4000000,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1年
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1年
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Symbol DevToys',
        short_name: 'Symbol DevToys',
        description: 'Swiss Army knife for Symbol Blockchain Developers.',
        theme_color: '#5200C6',
        background_color: '#5200C6',
        display: 'standalone',
        orientation: 'landscape',
        scope: '/',
        start_url: '/',
        screenshots: [
          {
            src: "screenshot-wide.jpg",
            sizes: "1280x720",
            type: "image/jpeg",
            form_factor: "wide"
          }
        ],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
