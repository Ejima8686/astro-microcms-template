import Alpine from 'alpinejs';

const name = 'example';

const store = {
  init() {
    if (import.meta.env.DEV) {
      console.log('example store: init');
    }
  },
};

Alpine.store(name, store);

declare module 'alpinejs' {
  interface Stores {
    [name]: typeof store;
  }
}
