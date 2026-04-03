// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import AstroPWA from '@vite-pwa/astro';

export default defineConfig({
  output: 'static',
  site: 'https://francescoalbanese.dev',
  integrations: [
    react(),
    sitemap(),
    AstroPWA({
      registerType: 'autoUpdate',
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{html,css,js,svg,png,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /\.html$/,
            handler: 'NetworkFirst',
          },
          {
            urlPattern: /\.(?:css|js|svg|png|woff2)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets',
              expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      },
      manifest: {
        name: 'Francesco Albanese — Lead AI Engineer',
        short_name: 'francescoalbanese.dev',
        description: 'Lead AI Engineer & Senior Staff Engineer based in London.',
        theme_color: '#1a1b26',
        background_color: '#1a1b26',
        display: 'standalone',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
