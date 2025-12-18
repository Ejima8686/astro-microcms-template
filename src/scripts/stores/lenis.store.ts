import Alpine from 'alpinejs';
import type Lenis from 'lenis';

const name = 'lenis';

const store = {
  instance: null as Lenis | null,
};

Alpine.store(name, store);

declare module 'alpinejs' {
  interface Stores {
    [name]: typeof store;
  }
}
