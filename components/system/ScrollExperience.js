'use client';

import { useEffect } from 'react';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function ScrollExperience() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sections = [...document.querySelectorAll('[data-story-section]')];
    const hero = document.querySelector('#nexgen');
    const heroProduct = hero?.querySelector('.story-intro__product');
    let sectionMetrics = [];
    let frame = 0;
    let isDisposed = false;
    let animateSections = false;

    const clearSectionMotion = () => {
      sections.forEach((section) => {
        section.style.removeProperty('--section-progress');
        section.style.removeProperty('--section-travel');
        section.style.removeProperty('--section-focus');
        ['x', 'y', 'rotation', 'opacity'].forEach((property) => {
          section.style.removeProperty(`--chapter-arc-${property}`);
        });
        section.style.removeProperty('--hero-center-progress');
        section.style.removeProperty('--hero-exit-progress');
      });
    };

    const refreshMetrics = () => {
      animateSections = !reducedMotion.matches && window.innerWidth > 900;
      root.classList.toggle('story-motion', animateSections);

      if (!animateSections) {
        sectionMetrics = [];
        clearSectionMotion();
        return;
      }

      const scrollY = window.scrollY;
      sectionMetrics = sections.map((section) => {
        const bounds = section.getBoundingClientRect();
        return {
          element: section,
          top: bounds.top + scrollY,
          height: bounds.height,
        };
      });
    };

    const update = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const scrollRange = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
      const scrollY = window.scrollY;
      const pageProgress = clamp(scrollY / scrollRange, 0, 1);

      root.style.setProperty('--page-progress', pageProgress.toFixed(4));

      if (!animateSections) {
        if (!reducedMotion.matches && hero && heroProduct) {
          const bounds = heroProduct.getBoundingClientRect();
          const exitProgress = clamp(-bounds.top / Math.max(bounds.height * 0.3, 1), 0, 1);
          hero.style.setProperty('--hero-exit-progress', exitProgress.toFixed(4));
        }
        return;
      }

      sectionMetrics.forEach(({ element, top, height }) => {
        const relativeTop = top - scrollY;
        const travel = height + viewportHeight;
        const viewportProgress = clamp((viewportHeight - relativeTop) / travel, 0, 1);
        const localScrollRange = Math.max(height - viewportHeight, 1);
        const localProgress = clamp(-relativeTop / localScrollRange, 0, 1);
        const centeredProgress = viewportProgress * 2 - 1;
        const focus = clamp(1 - Math.abs(centeredProgress) * 1.35, 0, 1);

        element.style.setProperty('--section-progress', centeredProgress.toFixed(4));
        element.style.setProperty('--section-travel', localProgress.toFixed(4));
        element.style.setProperty('--section-focus', focus.toFixed(4));

        if (element.classList.contains('journey-chapter')) {
          // Sweep around the outside of the image, resting beside it for reading.
          const distance = Math.max(Math.abs(centeredProgress) - 0.16, 0) / 0.84;
          const angle = Math.sign(centeredProgress) * distance * Math.PI / 2;
          const radius = Math.min(window.innerWidth * 0.24, 360);
          element.style.setProperty('--chapter-arc-x', `${((1 - Math.cos(angle)) * radius).toFixed(2)}px`);
          element.style.setProperty('--chapter-arc-y', `${(-Math.sin(angle) * radius).toFixed(2)}px`);
          element.style.setProperty('--chapter-arc-rotation', `${(angle * 18 / (Math.PI / 2)).toFixed(2)}deg`);
          element.style.setProperty('--chapter-arc-opacity', (1 - distance * 0.8).toFixed(3));
        }

        if (element.id === 'nexgen') {
          const centerProgress = clamp(localProgress / 0.48, 0, 1);
          // Keep the product visible throughout the pinned scene; fade only
          // once the hero is leaving and the comparison section is entering.
          const exitDistance = scrollY - (top + height - viewportHeight);
          const exitProgress = clamp(exitDistance / (viewportHeight * 0.65), 0, 1);

          element.style.setProperty('--hero-center-progress', centerProgress.toFixed(4));
          element.style.setProperty('--hero-exit-progress', exitProgress.toFixed(4));
        }
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const handleScroll = () => {
      requestUpdate();
    };

    const handleResize = () => {
      refreshMetrics();
      requestUpdate();
    };

    refreshMetrics();
    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('load', handleResize, { once: true });
    reducedMotion.addEventListener?.('change', handleResize);
    document.fonts?.ready.then(() => {
      if (!isDisposed) handleResize();
    });

    return () => {
      isDisposed = true;
      root.classList.remove('story-motion');
      root.style.removeProperty('--page-progress');
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', handleResize);
      reducedMotion.removeEventListener?.('change', handleResize);
      if (frame) window.cancelAnimationFrame(frame);
      clearSectionMotion();
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
