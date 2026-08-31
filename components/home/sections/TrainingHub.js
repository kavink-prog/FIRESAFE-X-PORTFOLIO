'use client';

import { useEffect } from 'react';
import GuidedConsole from '@/components/ui/GuidedConsole';
import MediaGallery from '@/components/media/MediaGallery';
import useAutoRotatingTabs from '@/components/hooks/useAutoRotatingTabs';
import { SITE_CONTENT } from '@/data/site-content';

const HASH_TO_INDEX = {
  '#training': 0,
  '#platform': 0,
  '#learning': 1,
  '#outcomes': 2,
};

const INDEX_TO_HASH = ['#platform', '#learning', '#outcomes'];

function CompactDetails({ number, title, copy, flow }) {
  return (
    <details className="training-hub__detail console-details">
      <summary>
        <small>{number}</small>
        <span>{title}</span>
      </summary>
      <div className="console-details__body">
        <p>{copy}</p>
        {flow ? <strong>{flow}</strong> : null}
      </div>
    </details>
  );
}

export default function TrainingHub() {
  const { enterprise, learning, outcomes } = SITE_CONTENT;
  const views = [
    { id: 'enterprise', number: '08', ...enterprise },
    { id: 'learning', number: '10', ...learning },
    { id: 'outcomes', number: '11', ...outcomes },
  ];
  const rotation = useAutoRotatingTabs({ count: views.length, intervalMs: 8000 });
  const { activeIndex } = rotation;

  useEffect(() => {
    const syncToHash = () => {
      const index = HASH_TO_INDEX[window.location.hash];
      if (typeof index === 'number') rotation.selectIndex(index);
    };
    syncToHash();
    window.addEventListener('hashchange', syncToHash);
    return () => window.removeEventListener('hashchange', syncToHash);
  }, [rotation.selectIndex]);

  const select = (index) => {
    rotation.selectIndex(index);
    window.history.replaceState(null, '', INDEX_TO_HASH[index]);
  };

  return (
    <section id="training" className="training-hub guided-section">
      <span id="platform" className="training-hub__anchor" aria-hidden="true"></span>
      <span id="learning" className="training-hub__anchor" aria-hidden="true"></span>
      <span id="outcomes" className="training-hub__anchor" aria-hidden="true"></span>
      <div className="training-hub__inner">
        <header className="document-section-head">
          <p className="eyebrow">08 — 11</p>
          <h2 className="title">Training &amp; Outcomes</h2>
          <p className="big">Enterprise Training · What You Will Learn · Outcomes</p>
        </header>

        <GuidedConsole
          idPrefix="training-view"
          ariaLabel="Training and outcomes"
          items={views}
          activeIndex={activeIndex}
          onChange={select}
          className="guided-console--training"
          containerRef={rotation.containerRef}
          interactionProps={rotation.interactionProps}
          autoAdvance={{
            intervalMs: 8000,
            isPaused: rotation.isPaused,
            isUserPaused: rotation.isUserPaused,
            onToggle: rotation.toggleUserPause,
            progressKey: rotation.progressKey,
          }}
          renderTab={(view) => (
            <><small>{view.number}</small><span>{view.title}</span></>
          )}
          renderPanel={(view, index, isActive) => (
            <article className="training-hub__stage">
              <header className="training-hub__stage-head">
                <span>{view.number}</span>
                <h3>{view.title}</h3>
                <h4>{view.subtitle}</h4>
                <p>{view.intro}</p>
              </header>

              {index === 0 ? (
                <div className="training-hub__enterprise">
                  <MediaGallery
                    items={[]}
                    variant="enterprise"
                    label="Enterprise Training media"
                    placeholderCount={4}
                    autoPlay={isActive}
                  />
                  <div className="training-hub__enterprise-copy">
                    <div className="training-hub__availability">
                      <h4>{enterprise.availability}</h4>
                      <p>{enterprise.availabilityCopy}</p>
                    </div>
                    <div className="training-hub__details-grid">
                      {enterprise.points.map(([title, copy], pointIndex) => (
                        <CompactDetails
                          key={title}
                          number={String(pointIndex + 1).padStart(2, '0')}
                          title={title}
                          copy={copy}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`training-hub__details-grid training-hub__details-grid--${view.id}`}>
                  {view.items.map(([title, copy, flow], itemIndex) => (
                    <CompactDetails
                      key={title}
                      number={String(itemIndex + 1).padStart(2, '0')}
                      title={title}
                      copy={copy}
                      flow={flow}
                    />
                  ))}
                </div>
              )}
            </article>
          )}
        />
      </div>
    </section>
  );
}
