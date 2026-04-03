// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  site: 'https://www.francescoalbanese.dev',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
