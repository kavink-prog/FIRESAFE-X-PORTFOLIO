'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export default function useAutoRotatingTabs({ count, intervalMs = 5000, initialIndex = 0 }) {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [cycle, setCycle] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  const [isPointerPaused, setIsPointerPaused] = useState(false);
  const [isFocusPaused, setIsFocusPaused] = useState(false);
  const [isDisclosurePaused, setIsDisclosurePaused] = useState(false);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setPrefersReducedMotion(media.matches);
    syncPreference();
    media.addEventListener?.('change', syncPreference);
    return () => media.removeEventListener?.('change', syncPreference);
  }, []);

  useEffect(() => {
    const handleVisibility = () => setIsDocumentVisible(!document.hidden);
    handleVisibility();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;
    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting && entry.intersectionRatio >= 0.28),
      { threshold: [0, 0.28, 0.5] }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const isPaused = useMemo(
    () =>
      prefersReducedMotion ||
      isUserPaused ||
      isPointerPaused ||
      isFocusPaused ||
      isDisclosurePaused ||
      !isInView ||
      !isDocumentVisible,
    [
      isDocumentVisible,
      isDisclosurePaused,
      isFocusPaused,
      isInView,
      isPointerPaused,
      isUserPaused,
      prefersReducedMotion,
    ]
  );

  useEffect(() => {
    if (isPaused || count < 2) return undefined;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % count);
      setCycle((current) => current + 1);
    }, intervalMs);

    return () => window.clearTimeout(timer);
  }, [activeIndex, count, cycle, intervalMs, isPaused]);

  const selectIndex = useCallback(
    (index) => {
      const normalized = ((index % count) + count) % count;
      setActiveIndex(normalized);
      setCycle((current) => current + 1);
    },
    [count]
  );

  const toggleUserPause = useCallback(() => {
    setIsUserPaused((paused) => !paused);
    setCycle((current) => current + 1);
  }, []);

  const interactionProps = {
    onMouseEnter: () => setIsPointerPaused(true),
    onMouseLeave: () => setIsPointerPaused(false),
    onFocusCapture: (event) => {
      try {
        setIsFocusPaused(event.target.matches?.(':focus-visible') ?? true);
      } catch (_) {
        setIsFocusPaused(true);
      }
    },
    onBlurCapture: (event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setIsFocusPaused(false);
    },
    onToggleCapture: () => {
      requestAnimationFrame(() => {
        setIsDisclosurePaused(Boolean(containerRef.current?.querySelector('details[open]')));
      });
    },
  };

  return {
    activeIndex,
    selectIndex,
    containerRef,
    interactionProps,
    isPaused,
    isUserPaused,
    prefersReducedMotion,
    toggleUserPause,
    progressKey: `${activeIndex}-${cycle}`,
  };
}
