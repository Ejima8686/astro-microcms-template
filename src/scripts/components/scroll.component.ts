import Alpine from 'alpinejs';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

Alpine.data('scroll', () => {
  gsap.registerPlugin(ScrollTrigger);
  let requestId: number | null = null;

  return {
    scrollDirection: true,

    easeOutQuart(x: number): number {
      return 1 - Math.pow(1 - x, 4);
    },

    easeInOutCubic(x: number): number {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    },

    init() {
      if (import.meta.env.DEV) {
        console.log('scroll: init');
      }
      const lenis = new Lenis({
        duration: 1,
        easing: this.easeOutQuart,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.8,
        infinite: false,
        anchors: {
          duration: 3,
          easing: this.easeInOutCubic,
          onComplete: () => {
            document.documentElement.classList.remove('is-anchor-scrolling');
          },
          lock: true,
        },
        autoResize: true,
      });

      function raf(time: number) {
        lenis.raf(time);

        if (requestId) cancelAnimationFrame(requestId);
        requestId = requestAnimationFrame(raf);
      }

      requestId = requestAnimationFrame(raf);

      this.$store.lenis.instance = lenis as Lenis;
    },

    handleClick() {
      document.documentElement.classList.add('is-anchor-scrolling');
    },
  };
});
