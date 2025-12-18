import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';
import * as config from './config.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com/',
  base: config.pathPrefix,
  integrations: [icon(), sitemap()],
  vite: {
    define: {
      'import.meta.vitest': 'undefined',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins: [tailwindcss()] as any,
  },
  server: {
    host: true,
  },
  experimental: {
    preserveScriptOrder: true,
    headingIdCompat: true,
  },
});
