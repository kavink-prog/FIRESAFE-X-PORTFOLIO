'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ProductGallery({ media, priority = false }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = media[activeIndex];
  const hasMultiple = media.length > 1;

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + media.length) % media.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % media.length);
  };

  return (
    <div className="product-gallery" aria-label="FireSafeX product gallery">
      <figure className="product-gallery__stage">
        <div className="product-gallery__artwork" key={activeItem.src}>
          <Image
            src={activeItem.src}
            alt={activeItem.alt}
            fill
            priority={priority}
            sizes="(max-width: 900px) 100vw, 62vw"
          />

          {activeItem.displayStatus ? (
            <span className="product-display-status" aria-hidden="true">
              <span className="product-display-status__state product-display-status__state--on">
                <b>FireSafeX</b>
                <small>Turn On</small>
              </span>
              <span className="product-display-status__state product-display-status__state--off">
                <b>FireSafeX</b>
                <small>Turn Off</small>
              </span>
            </span>
          ) : null}
        </div>
      </figure>

      {hasMultiple ? (
        <div className="product-gallery__controls">
          <button type="button" onClick={showPrevious} aria-label="Show previous product view">
            <span aria-hidden="true">‹</span>
          </button>
          <div className="product-gallery__dots" aria-label="Choose product view">
            {media.map((item, index) => (
              <button
                type="button"
                key={item.src}
                className={index === activeIndex ? 'is-active' : ''}
                aria-label={`Show product view ${index + 1}`}
                aria-pressed={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
          <button type="button" onClick={showNext} aria-label="Show next product view">
            <span aria-hidden="true">›</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
