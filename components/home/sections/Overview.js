'use client';

import { useEffect } from 'react';
import MediaGallery from '@/components/media/MediaGallery';
import GuidedConsole from '@/components/ui/GuidedConsole';
import useAutoRotatingTabs from '@/components/hooks/useAutoRotatingTabs';
import { SITE_CONTENT } from '@/data/site-content';

function PointList({ points }) {
  if (!points?.length) return null;
  return (
    <ul className="walkthrough__points">
      {points.map((point) => {
        const [title, copy] = Array.isArray(point) ? point : [point, null];
        return <li key={title}>{copy ? <><strong>{title} — </strong>{copy}</> : title}</li>;
      })}
    </ul>
  );
}
function Group({ group }) {
  return (
    <details className="console-details product-console__group">
      <summary>
        <span>{group.title}</span>
        {group.subtitle ? <small>{group.subtitle}</small> : null}
      </summary>
      <div className="console-details__body">
        {group.flow ? <p className="walkthrough__flow">{group.flow}</p> : null}
        {group.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <PointList points={group.points} />
      </div>
    </details>
  );
}

export default function Overview() {
  const overview = SITE_CONTENT.productOverview;
  const rotation = useAutoRotatingTabs({ count: overview.items.length, intervalMs: 8000 });
  const { activeIndex } = rotation;

  useEffect(() => {
    const syncToHash = () => {
      const hash = window.location.hash.replace('#overview-', '');
      const index = overview.items.findIndex((item) => item.id === hash);
      if (index < 0) return;
      rotation.selectIndex(index);
      requestAnimationFrame(() => document.getElementById(`overview-${hash}`)?.scrollIntoView({ block: 'start' }));
    };
    syncToHash();
    window.addEventListener('hashchange', syncToHash);
    return () => window.removeEventListener('hashchange', syncToHash);
  }, [overview.items, rotation.selectIndex]);

  const select = (index) => {
    rotation.selectIndex(index);
    window.history.replaceState(null, '', `#overview-${overview.items[index].id}`);
  };

  return (
    <section id="overview" className="product-walkthrough guided-section product-console">
      <div className="product-walkthrough__inner">
        <header className="document-section-head document-section-head--center">
          <p className="eyebrow">{overview.title}</p>
          <h2 className="title">{overview.subtitle}</h2>
          <p className="big center">{overview.intro}</p>
        </header>
        <GuidedConsole
          idPrefix="overview-console"
          ariaLabel="Product Overview chapters"
          items={overview.items}
          activeIndex={activeIndex}
          onChange={select}
          className="guided-console--product"
          containerRef={rotation.containerRef}
          interactionProps={rotation.interactionProps}
          autoAdvance={{
            intervalMs: 8000,
            isPaused: rotation.isPaused,
            isUserPaused: rotation.isUserPaused,
            onToggle: rotation.toggleUserPause,
            progressKey: rotation.progressKey,
          }}
          renderTab={(item, index) => (
            <><small>6.{index + 1}</small><span>{item.title}</span></>
          )}
          renderPanel={(item, index, isActive) => {
            const closing = [
              ...(item.groups?.flatMap((group) => group.closing || []) || []),
              ...(item.closing ? [item.closing] : []),
            ];
            return (
              <article id={`overview-${item.id}`} className="product-console__stage">
                <div className="product-console__copy">
                  <span className="walkthrough__num">6.{index + 1}</span>
                  <h3>{item.title}</h3>
                  <h4>{item.subtitle}</h4>
                  {item.paragraphs?.[0] ? <p className="product-console__lead">{item.paragraphs[0]}</p> : null}
                  {item.paragraphs?.length > 1 ? (
                    <details className="console-details">
                      <summary>Product details</summary>
                      <div className="console-details__body">
                        {item.paragraphs.slice(1).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                      </div>
                    </details>
                  ) : null}
                  {item.groups?.map((group) => <Group group={group} key={group.title} />)}
                  {item.capabilities ? (
                    <details className="console-details product-console__group">
                      <summary>Capabilities</summary>
                      <div className="console-details__body walkthrough__capabilities">
                        {item.capabilities.map(([title, copy]) => (
                          <div key={title}><h4>{title}</h4><p>{copy}</p></div>
                        ))}
                      </div>
                    </details>
                  ) : null}
                  {closing.length ? (
                    <div className="product-console__closing">
                      {closing.map((paragraph) => <p className="walkthrough__closing" key={paragraph}>{paragraph}</p>)}
                    </div>
                  ) : null}
                </div>
                <MediaGallery
                  items={[]}
                  variant="product"
                  label={`${item.title} media`}
                  placeholderCount={3}
                  autoPlay={isActive}
                />
              </article>
            );
          }}
        />
      </div>
    </section>
  );
}
