'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function ScrollExperience() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (reducedMotion.matches) return undefined;

    const sections = [...document.querySelectorAll('[data-story-section]')];
    let frame = 0;
    let lenisFrame = 0;
    let velocityTimer = 0;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.88,
      touchMultiplier: 1.1,
    });

    root.classList.add('story-motion');

    const update = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const scrollRange = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
      const pageProgress = clamp(window.scrollY / scrollRange, 0, 1);

      root.style.setProperty('--page-progress', pageProgress.toFixed(4));

      sections.forEach((section) => {
        const bounds = section.getBoundingClientRect();
        const travel = bounds.height + viewportHeight;
        const viewportProgress = clamp((viewportHeight - bounds.top) / travel, 0, 1);
        const localScrollRange = Math.max(bounds.height - viewportHeight, 1);
        const localProgress = clamp(-bounds.top / localScrollRange, 0, 1);
        const centeredProgress = viewportProgress * 2 - 1;
        const focus = clamp(1 - Math.abs(centeredProgress) * 1.35, 0, 1);

        section.style.setProperty('--section-progress', centeredProgress.toFixed(4));
        section.style.setProperty('--section-travel', localProgress.toFixed(4));
        section.style.setProperty('--section-focus', focus.toFixed(4));

        if (section.id === 'nexgen') {
          const centerProgress = clamp(localProgress / 0.48, 0, 1);
          const exitProgress = clamp((localProgress - 0.64) / 0.27, 0, 1);

          section.style.setProperty('--hero-center-progress', centerProgress.toFixed(4));
          section.style.setProperty('--hero-exit-progress', exitProgress.toFixed(4));
        }
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    const runLenis = (time) => {
      lenis.raf(time);
      lenisFrame = window.requestAnimationFrame(runLenis);
    };

    const handleLenisScroll = ({ velocity = 0 }) => {
      const velocityStrength = clamp(velocity / 24, -1, 1);
      root.style.setProperty('--scroll-tilt', `${(velocityStrength * 0.75).toFixed(3)}deg`);
      root.style.setProperty('--scroll-energy', Math.abs(velocityStrength).toFixed(3));
      requestUpdate();

      window.clearTimeout(velocityTimer);
      velocityTimer = window.setTimeout(() => {
        root.style.setProperty('--scroll-tilt', '0deg');
        root.style.setProperty('--scroll-energy', '0');
      }, 120);
    };

    lenis.on('scroll', handleLenisScroll);
    lenisFrame = window.requestAnimationFrame(runLenis);
    window.addEventListener('resize', requestUpdate);

    const handleAnchorClick = (event) => {
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;

      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target, { offset: -60, duration: 1.2 });
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      lenis.destroy();
      root.classList.remove('story-motion');
      root.style.removeProperty('--page-progress');
      root.style.removeProperty('--scroll-tilt');
      root.style.removeProperty('--scroll-energy');
      window.removeEventListener('resize', requestUpdate);
      document.removeEventListener('click', handleAnchorClick);
      window.clearTimeout(velocityTimer);
      if (frame) window.cancelAnimationFrame(frame);
      if (lenisFrame) window.cancelAnimationFrame(lenisFrame);
      sections.forEach((section) => {
        section.style.removeProperty('--section-progress');
        section.style.removeProperty('--section-travel');
        section.style.removeProperty('--section-focus');
        section.style.removeProperty('--hero-center-progress');
        section.style.removeProperty('--hero-exit-progress');
      });
    };
  }, []);

  return (
    <>
      <div className="story-atmosphere" aria-hidden="true">
        <span className="story-atmosphere__glow" />
        <span className="story-atmosphere__grain" />
      </div>
      <div className="story-scroll-meter" aria-hidden="true">
        <span className="story-scroll-meter__value" />
      </div>
    </>
  );
}
