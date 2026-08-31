'use client';

import GuidedConsole from '@/components/ui/GuidedConsole';
import useAutoRotatingTabs from '@/components/hooks/useAutoRotatingTabs';
import { SITE_CONTENT } from '@/data/site-content';

export default function SolutionFeatures() {
  const features = SITE_CONTENT.solutionFeatures;
  const rotation = useAutoRotatingTabs({ count: features.items.length, intervalMs: 6000 });
  const { activeIndex } = rotation;
  return (
    <section id="features" className="document-features guided-section features-console">
      <div className="document-features__inner">
        <header className="document-section-head">
          <p className="eyebrow">05</p>
          <h2 className="title">{features.title}</h2>
        </header>
        <GuidedConsole
          idPrefix="feature"
          ariaLabel={features.title}
          items={features.items}
          activeIndex={activeIndex}
          onChange={rotation.selectIndex}
          className="guided-console--features"
          containerRef={rotation.containerRef}
          interactionProps={rotation.interactionProps}
          autoAdvance={{
            intervalMs: 6000,
            isPaused: rotation.isPaused,
            isUserPaused: rotation.isUserPaused,
            onToggle: rotation.toggleUserPause,
            progressKey: rotation.progressKey,
          }}
          renderTab={(feature, index) => (
            <><small>5.{index + 1}</small><span>{feature.title}</span></>
          )}
          renderPanel={(feature, index) => (
            <article className="features-console__stage">
              <div className="features-console__copy">
                <span>5.{index + 1}</span>
                <h3>{feature.title}</h3>
                <h4>{feature.subtitle}</h4>
                {feature.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <div className="features-console__signal" aria-hidden="true">
                <div className="features-console__core">5.{index + 1}</div>
                {features.items.map((item, nodeIndex) => (
                  <i className={nodeIndex === index ? 'is-active' : ''} key={item.title}></i>
                ))}
                <span></span>
              </div>
            </article>
          )}
        />
      </div>
    </section>
  );
}
