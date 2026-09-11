'use client';

import { useState } from 'react';

export default function EcosystemScreens({ screens, sectionId, placeholderLabel }) {
  const [active, setActive] = useState(0);
  const current = screens[active];
  const panelId = `${sectionId}-screen-preview`;

  if (!current) {
    return (
      <div className="ecosystem-screens ecosystem-screens--placeholder">
        <div className="ecosystem-screens__placeholder" role="img" aria-label={`${placeholderLabel} image placeholder`}>
          <span aria-hidden="true">◇</span>
          <strong>{placeholderLabel}</strong>
          <p>Image coming soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ecosystem-screens" aria-label="Explore FireSafeX training and application visuals">
      {screens.length > 1 ? <div className="ecosystem-screens__choices" aria-label="Choose a training image or application screen">
        {screens.map((screen, index) => (
          <button
            key={screen.src}
            type="button"
            aria-pressed={index === active}
            aria-controls={panelId}
            onClick={() => setActive(index)}
          >
            {screen.title}
          </button>
        ))}
      </div> : null}
      <figure id={panelId}>
        <a href={current.original} target="_blank" rel="noopener noreferrer" aria-label={`Open full image: ${current.title} (new tab)`}>
          <img src={current.src} alt={current.alt} loading="lazy" decoding="async" />
        </a>

      </figure>
    </div>
  );
}
