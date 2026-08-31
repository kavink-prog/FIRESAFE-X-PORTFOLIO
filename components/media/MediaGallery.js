'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const PLACEHOLDER_LABELS = {
  product: ['Product walkthrough', 'Product image'],
  enterprise: ['Enterprise walkthrough', 'Platform image'],
  industry: ['Industry walkthrough', 'Industry image'],
  event: ['Event video', 'Event image'],
};

export default function MediaGallery({
  items = [],
  variant = 'product',
  label = 'Media gallery',
  placeholderCount = 3,
  autoPlay = true,
  interval = 5200,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  const [isPointerPaused, setIsPointerPaused] = useState(false);
  const [isFocusPaused, setIsFocusPaused] = useState(false);
  const containerRef = useRef(null);
  const railRef = useRef(null);
  const videoRef = useRef(null);
  const activeItem = items[activeIndex];
  const placeholderLabels = PLACEHOLDER_LABELS[variant] || PLACEHOLDER_LABELS.product;

  useEffect(() => {
    setActiveIndex(0);
  }, [items]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReduceMotion(mediaQuery.matches);
    updatePreference();
    setMotionReady(true);
    mediaQuery.addEventListener?.('change', updatePreference);
    return () => mediaQuery.removeEventListener?.('change', updatePreference);
  }, []);

  useEffect(() => {
    setIsPlaying(autoPlay && !reduceMotion);
  }, [autoPlay, reduceMotion]);

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
      ([entry]) => setIsInView(entry.isIntersecting && entry.intersectionRatio >= 0.2),
      { threshold: [0, 0.2, 0.5] }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const isTemporarilyPaused = isPointerPaused || isFocusPaused || !isInView || !isDocumentVisible;

  useEffect(() => {
    if (!motionReady || reduceMotion || !isPlaying || isTemporarilyPaused || items.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [interval, isPlaying, isTemporarilyPaused, items.length, motionReady, reduceMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !motionReady) return;
    if (isPlaying && !reduceMotion && isInView && isDocumentVisible) {
      video.play().catch(() => null);
    } else {
      video.pause();
    }
  }, [activeIndex, isDocumentVisible, isInView, isPlaying, motionReady, reduceMotion]);

  useEffect(() => {
    const rail = railRef.current;
    const activeThumb = rail?.querySelector('[aria-pressed="true"]');
    if (!rail || !activeThumb) return;
    const targetLeft = activeThumb.offsetLeft - (rail.clientWidth - activeThumb.offsetWidth) / 2;
    rail.scrollTo({
      behavior: 'smooth',
      left: Math.max(0, targetLeft),
    });
  }, [activeIndex]);

  const select = (index) => setActiveIndex((index + items.length) % items.length);
  const previous = () => select(activeIndex - 1);
  const next = () => select(activeIndex + 1);

  return (
    <div
      className={`media-gallery media-gallery--${variant}`}
      aria-label={label}
      ref={containerRef}
      onMouseEnter={() => setIsPointerPaused(true)}
      onMouseLeave={() => setIsPointerPaused(false)}
      onFocusCapture={() => setIsFocusPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsFocusPaused(false);
      }}
    >
      <div className="media-gallery__stage">
        {activeItem ? (
          activeItem.type === 'video' ? (
            <video
              key={activeItem.id}
              ref={videoRef}
              className="media-gallery__asset media-gallery__asset--active"
              src={activeItem.src}
              poster={activeItem.poster}
              controls
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={activeItem.alt}
            />
          ) : (
            <Image
              key={activeItem.id}
              className="media-gallery__asset media-gallery__asset--active"
              src={activeItem.src}
              alt={activeItem.alt}
              fill
              sizes="(max-width: 900px) 92vw, 54vw"
              priority={variant === 'event' && activeIndex === 0}
            />
          )
        ) : (
          <div className="media-gallery__placeholder" aria-label={`${placeholderLabels[0]} placeholder`}>
            <span className="media-gallery__placeholder-icon" aria-hidden="true">
              <i></i><i></i><i></i>
            </span>
            <strong>{placeholderLabels[0]}</strong>
            <small>Media coming soon</small>
          </div>
        )}
        {activeItem?.caption ? <p className="media-gallery__caption">{activeItem.caption}</p> : null}
        {activeItem ? <p className="media-gallery__active-name">{activeItem.alt}</p> : null}
        {items.length > 1 ? (
          <span
            key={`${activeIndex}-${isPlaying}`}
            className={`media-gallery__progress ${!isPlaying || isTemporarilyPaused ? 'is-paused' : ''}`}
            style={{ '--media-cycle-duration': `${interval}ms` }}
            aria-hidden="true"
          ></span>
        ) : null}
        {items.length > 1 ? (
          <div className="media-gallery__controls">
            <button type="button" onClick={previous} aria-label={`Show previous ${label} item`}>←</button>
            <span aria-live="polite">{String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
            <button
              type="button"
              className="media-gallery__play"
              onClick={() => setIsPlaying((current) => !current)}
              aria-label={isPlaying ? `Pause ${label}` : `Play ${label}`}
              aria-pressed={!isPlaying}
            >
              {isPlaying ? 'Ⅱ' : '▶'}
            </button>
            <button type="button" onClick={next} aria-label={`Show next ${label} item`}>→</button>
          </div>
        ) : null}
      </div>

      <div className="media-gallery__rail" aria-label={`${label} items`} ref={railRef}>
        {items.length
          ? items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`media-gallery__thumb ${activeIndex === index ? 'is-active' : ''}`}
                aria-label={`Show ${item.alt || item.caption || `${label} item ${index + 1}`}`}
                aria-pressed={activeIndex === index}
                onClick={() => select(index)}
              >
                {item.type === 'image' ? (
                  <Image src={item.src} alt="" fill sizes="160px" />
                ) : item.poster ? (
                  <Image src={item.poster} alt="" fill sizes="160px" />
                ) : (
                  <span aria-hidden="true">▶</span>
                )}
              </button>
            ))
          : Array.from({ length: placeholderCount }, (_, index) => (
              <div className="media-gallery__thumb media-gallery__thumb--placeholder" key={index} aria-hidden="true">
                <span>{index === 0 ? '▶' : '◇'}</span>
                <small>{index === 0 ? placeholderLabels[0] : placeholderLabels[1]}</small>
              </div>
            ))}
      </div>
    </div>
  );
}
