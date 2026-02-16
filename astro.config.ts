import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import * as config from './config.ts';

let site = 'https://example.com/';
const env = loadEnv(import.meta.env.MODE, process.cwd(), '');
const { SITE_URL } = env;
if (SITE_URL) {
  site = SITE_URL.endsWith('/') ? SITE_URL : `${SITE_URL}/`;
}

// https://astro.build/config
export default defineConfig({
  site: site,
  base: config.pathPrefix,
  integrations: [icon(), sitemap()],
  vite: {
    define: {
      'import.meta.vitest': 'undefined',
    },
    resolve: {
      alias: {
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      },
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
