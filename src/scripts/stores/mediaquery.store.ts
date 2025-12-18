import Alpine from 'alpinejs';
const name = 'viewportSize';

const addMediaQueryChangeListener = (
  mq: MediaQueryList,
  listener: (event: MediaQueryListEvent) => void,
) => {
  if (typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', listener);
  } else {
    mq.onchange = listener;
  }
};

const store = {
  isPC: false,
  isTablet: false,
  isMobile: false,
  mediaQueries: null as {
    pc: MediaQueryList;
    mobile: MediaQueryList;
  } | null,

  init() {
    if (import.meta.env.MODE !== 'production') {
      console.log('viewport size store: init');
    }

    this.mediaQueries = {
      pc: window.matchMedia('(min-width: 1024px)'),
      mobile: window.matchMedia('(max-width: 768px)'),
    };

    this.updateViewportState();

    const handleChange = () => {
      this.updateViewportState();
    };

    const { pc, mobile } = this.mediaQueries;

    addMediaQueryChangeListener(pc, handleChange);
    addMediaQueryChangeListener(mobile, handleChange);
  },

  updateViewportState() {
    const { pc, mobile } = this.mediaQueries ?? {
      pc: { matches: window.innerWidth >= 1024 } as MediaQueryList,
      mobile: { matches: window.innerWidth <= 768 } as MediaQueryList,
    };

    this.isPC = pc.matches;
    this.isMobile = mobile.matches;
    this.isTablet = !this.isPC && !this.isMobile;

    if (import.meta.env.DEV) {
      console.log('viewport size: PC:', {
        isPC: this.isPC,
        isTablet: this.isTablet,
        isMobile: this.isMobile,
      });
    }
  },
};

Alpine.store(name, store);

declare module 'alpinejs' {
  interface Stores {
    [name]: typeof store;
  }
}
