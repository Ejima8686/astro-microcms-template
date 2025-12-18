import Alpine from 'alpinejs';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { throttle } from '../libs/_utils';

gsap.registerPlugin(ScrollTrigger);

const name = 'gsap';

const store = {
  lastWidth: window.innerWidth,

  init() {
    window.addEventListener(
      'resize',
      throttle(() => {
        const width = window.innerWidth;
        if (width === this.lastWidth) return;
        this.lastWidth = width;
        this.refresh();
      }, 1200),
    );
  },

  refresh() {
    ScrollTrigger.refresh();
    if (import.meta.env.DEV) {
      console.log('gsap refresh');
    }
  },
};

Alpine.store(name, store);

declare module 'alpinejs' {
  interface Stores {
    [name]: typeof store;
  }
}
