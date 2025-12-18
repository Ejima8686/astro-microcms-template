import Alpine from 'alpinejs';
/**
 * キャッシュの状態管理ストア
 * @property {boolean} isFirstAccess - 初回アクセスかどうか
 */
Alpine.store('cache', {
  // @ts-ignore
  hasVisited: Alpine.$persist(false).using(sessionStorage),
  isFirstAccess: true,

  init() {
    if (this.hasVisited) {
      this.isFirstAccess = false;
    } else {
      this.hasVisited = true;
    }
    this.setupCacheHandler();
  },

  setupCacheHandler() {
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        this.isFirstAccess = false;
      }
    });
  },
});

declare module 'alpinejs' {
  interface Stores {
    ['cache']: {
      hasVisited: boolean;
      isFirstAccess: boolean;
      init(): void;
      setupCacheHandler(): void;
    };
  }
}
