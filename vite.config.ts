import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { nodePolyfills } from "vite-plugin-node-polyfills"
import topLevelAwait from "vite-plugin-top-level-await"
import wasm from "vite-plugin-wasm"

import replace from "@rollup/plugin-replace"
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  resolve: {
    alias: {
      "symbol-crypto-wasm-node": "symbol-crypto-wasm-web/symbol_crypto_wasm.js",
    }
  },
  build: {
    chunkSizeWarningLimit: 4096,
  },
  plugins: [
    nodePolyfills({
      include: [ "crypto" ],
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
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "development"),
      preventAssignment: true
    }),
    VitePWA({
      devOptions: {
        enabled: true
      },
      registerType: "autoUpdate",
      //includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      includeAssets: ["**/*"],
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 1024 * 1024 * 100,
        globPatterns: ["**/*.{html,js,css,ico,jpg,png,gif,svg,webp,mp4,mp3,webmanifest}"],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "pages-cache",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1週間
              },
            },
          },
          {
            urlPattern: /\.(?:js|css|woff2?|wasm)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "static-assets-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30日
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1年
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1年
              }
            }
          }
        ]
      },
      manifest: {
        name: "Symbol DevToys",
        short_name: "Symbol DevToys",
        description: "Swiss Army knife for Symbol Blockchain Developers.",
        theme_color: "#5200C6",
        background_color: "#5200C6",
        display: "standalone",
        orientation: "landscape",
        scope: "/",
        start_url: "/",
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
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    })
  ],
  server: {
    open: true,
  },
})
