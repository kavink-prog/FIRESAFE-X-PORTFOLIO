'use client';

import { useEffect } from 'react';

/**
 * Boots the original FireSafeX front-end scripts after the markup has mounted.
 *
 * The legacy scripts read `gsap`, `ScrollTrigger` and `Lenis` as globals (they
 * were loaded from a CDN in the old static site). We now bundle them from npm
 * and expose them on `window` before the scripts run, then import the scripts
 * in their original order so their DOM-driven side effects fire once.
 */
export default function Boot() {
  useEffect(() => {
    let cancelled = false;
    const cleanups = [];

    (async () => {
      const importWhenNear = (selector, importer, rootMargin = '400px 0px') => {
        const el = document.querySelector(selector);
        if (!el) return;

        let loaded = false;
        const load = async () => {
          if (loaded || cancelled) return;
          loaded = true;
          try {
            await importer();
          } catch (error) {
            el.classList.add('sequence-fallback');
            console.error(`Unable to load the experience for ${selector}.`, error);
          }
        };

        const observer = new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              observer.disconnect();
              load();
            }
          },
          { rootMargin }
        );

        observer.observe(el);
        cleanups.push(() => observer.disconnect());
      };

      // 1) Expose the motion libs as globals the legacy scripts expect.
      const gsapMod = await import('gsap');
      const stMod = await import('gsap/ScrollTrigger');
      const lenisMod = await import('lenis');

      window.gsap = gsapMod.gsap || gsapMod.default;
      window.ScrollTrigger = stMod.ScrollTrigger || stMod.default;
      window.Lenis = lenisMod.default || lenisMod.Lenis;

      if (cancelled) return;

      // 2) Run the scripts in the same order as the original index.html.
      //    Order matters: script.js splits headings into words BEFORE
      //    animations.js animates them.
      await import('@/lib/boot/script.js');
      await import('@/lib/boot/animations.js');

      // 3) Above-the-fold interactive visuals.
      await import('@/lib/experience/hero-sequence.js');

      // 4) Below-the-fold visuals load only when the related section is near.
      importWhenNear('#problem', () => import('@/lib/experience/problem-video.js'), '350px 0px');
      importWhenNear('#product', () => import('@/lib/experience/product-sequence.js'), '700px 0px');
      importWhenNear('.finale', () => import('@/lib/experience/finale-scene.js'), '700px 0px');
    })();

    return () => {
      cancelled = true;
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
