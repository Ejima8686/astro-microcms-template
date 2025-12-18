import intersect from '@alpinejs/intersect';
import persist from '@alpinejs/persist';
import Alpine from 'alpinejs';
import { loadComponents } from './components';
import { loadStores } from './stores';

// https://vitejs.dev/guide/env-and-mode.html#env-variables
if (import.meta.env.DEV) {
  console.log({
    MODE: import.meta.env.MODE,
    BASE_URL: import.meta.env.BASE_URL,
    PROD: import.meta.env.PROD,
    DEV: import.meta.env.DEV,
  });
}

(async () => {
  Alpine.plugin(intersect);
  Alpine.plugin(persist);
  await Promise.all([loadComponents(), loadStores()]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).Alpine = Alpine;
  Alpine.start();
})();
