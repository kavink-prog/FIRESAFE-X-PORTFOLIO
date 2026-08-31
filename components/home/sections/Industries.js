'use client';

import MediaGallery from '@/components/media/MediaGallery';
import GuidedConsole from '@/components/ui/GuidedConsole';
import useAutoRotatingTabs from '@/components/hooks/useAutoRotatingTabs';
import { INDUSTRY_MEDIA } from '@/data/media-content';
import { SITE_CONTENT } from '@/data/site-content';

export default function Industries() {
  const industries = SITE_CONTENT.industries;
  const rotation = useAutoRotatingTabs({ count: industries.items.length, intervalMs: 9000 });
  const { activeIndex } = rotation;

  return (
    <section id="industries" className="industries-document guided-section industries-console">
      <div className="industries-document__inner">
        <header className="document-section-head document-section-head--center">
          <p className="eyebrow">12</p>
          <h2 className="title">{industries.title}</h2>
          <h3>{industries.subtitle}</h3>
          <p className="big center">{industries.intro}</p>
        </header>
        <GuidedConsole
          idPrefix="industry"
          ariaLabel={industries.title}
          items={industries.items.map(([title, copy]) => ({ id: title, title, copy }))}
          activeIndex={activeIndex}
          onChange={rotation.selectIndex}
          className="guided-console--industries"
          containerRef={rotation.containerRef}
          interactionProps={rotation.interactionProps}
          autoAdvance={{
            intervalMs: 9000,
            isPaused: rotation.isPaused,
            isUserPaused: rotation.isUserPaused,
            onToggle: rotation.toggleUserPause,
            progressKey: rotation.progressKey,
          }}
          getTabAriaLabel={(item) => item.title}
          renderTab={(item, index) => (
            <><small>12.{index + 1}</small><span>{item.title.split(' — ')[0]}</span></>
          )}
          renderPanel={(item, index, isActive) => (
            <article className="industries-console__stage">
              <div className="industries-document__copy">
                <span>12.{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
              <MediaGallery
                items={INDUSTRY_MEDIA[index]}
                variant="industry"
                label={`${item.title} media`}
                autoPlay={isActive}
              />
            </article>
          )}
        />
      </div>
    </section>
  );
}
