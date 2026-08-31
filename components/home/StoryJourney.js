'use client';

import { useEffect, useRef, useState } from 'react';

function MediaSet({ media, mobile = false }) {
  const kind = media[0]?.kind ?? 'event';

  return (
    <div
      className={`${mobile ? 'journey-mobile-media' : 'journey-visual__layer'} journey-media--${media.length} journey-media--${kind}`}
    >
      {media.map((item) => (
        <figure className={`journey-media journey-media--${item.kind}`} key={item.src}>
          {item.type === 'video' ? (
            <video
              className="journey-media__video"
              controls
              playsInline
              preload="none"
              poster={mobile && item.mobilePoster ? item.mobilePoster : item.poster}
              aria-label={item.alt}
            >
              <source src={item.src} type="video/mp4" />
              Your browser does not support this FireSafeX demonstration video.
            </video>
          ) : (
            <picture className="journey-media__picture">
              {item.mobileSrc ? (
                <source media="(max-width: 900px)" srcSet={item.mobileSrc} />
              ) : null}
              <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
            </picture>
          )}
        </figure>
      ))}
    </div>
  );
}

function WhyShowcase({ section }) {
  const viewportRef = useRef(null);
  const [activeCard, setActiveCard] = useState(0);

  const scrollToCard = (index) => {
    const viewport = viewportRef.current;
    const card = viewport?.children[index];
    if (!viewport || !card) return;

    viewport.scrollTo({
      left: card.offsetLeft - (viewport.clientWidth - card.clientWidth) / 2,
      behavior: 'smooth',
    });
  };

  const updateActiveCard = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;
    const cards = Array.from(viewport.children);
    const nearest = cards.reduce((closest, card, index) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(viewportCenter - cardCenter);
      return distance < closest.distance ? { index, distance } : closest;
    }, { index: 0, distance: Number.POSITIVE_INFINITY });

    setActiveCard(nearest.index);
  };

  return (
    <section id={section.id} className="why-showcase" data-story-section>
      <div className="why-showcase__header">
        <span className="story-section__number" aria-hidden="true">02 / 07</span>
        <div>
          <h2>{section.title}</h2>
          <p className="story-section__subtitle">{section.subtitle}</p>
        </div>
      </div>

      <div
        className="why-showcase__viewport"
        ref={viewportRef}
        onScroll={updateActiveCard}
        aria-label="Why FireSafeX comparison"
      >
        {section.cards.map((card) => (
          <article className="why-showcase__card" key={card.title}>
            <h3>{card.title}</h3>
          </article>
        ))}
      </div>

      <div className="why-showcase__controls" aria-label="Comparison controls">
        <button
          type="button"
          onClick={() => scrollToCard(Math.max(activeCard - 1, 0))}
          disabled={activeCard === 0}
          aria-label="Previous comparison"
        >
          ←
        </button>
        <div className="why-showcase__dots">
          {section.cards.map((card, index) => (
            <button
              type="button"
              className={index === activeCard ? 'is-active' : ''}
              onClick={() => scrollToCard(index)}
              aria-label={`Show ${card.title}`}
              aria-current={index === activeCard ? 'true' : undefined}
              key={card.title}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => scrollToCard(Math.min(activeCard + 1, section.cards.length - 1))}
          disabled={activeCard === section.cards.length - 1}
          aria-label="Next comparison"
        >
          →
        </button>
      </div>
    </section>
  );
}

export default function StoryJourney({ sections, mediaBySection }) {
  const whySection = sections[0];
  const journeySections = sections.slice(1);
  const [activeId, setActiveId] = useState(journeySections[0].id);
  const activeIndex = Math.max(
    journeySections.findIndex((section) => section.id === activeId),
    0,
  );

  useEffect(() => {
    const chapters = journeySections
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (active) setActiveId(active.target.id);
      },
      { rootMargin: '-28% 0px -42% 0px', threshold: [0, 0.15, 0.35, 0.6] },
    );

    chapters.forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="story-journey">
      <WhyShowcase section={whySection} />

      <div className="story-journey__inner">
        <aside className="journey-visual" aria-label="FireSafeX story visuals">
          <div className="journey-visual__frame">
            <div className="journey-visual__hud" aria-hidden="true">
              <span><i /> Live system view</span>
              <span>{String(activeIndex + 3).padStart(2, '0')} / 07</span>
            </div>

            {journeySections.map((section) => (
              <div
                className={`journey-visual__scene ${section.id === activeId ? 'is-active' : ''}`}
                aria-hidden={section.id !== activeId}
                key={section.id}
              >
                <MediaSet media={mediaBySection[section.id]} />
              </div>
            ))}

            <nav className="journey-visual__index" aria-label="Story chapters">
              {journeySections.map((section, index) => (
                <a
                  href={`#${section.id}`}
                  className={section.id === activeId ? 'is-active' : ''}
                  aria-label={`Go to ${section.title}`}
                  key={section.id}
                >
                  <span>{String(index + 3).padStart(2, '0')}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="story-journey__chapters">
          {journeySections.map((section, index) => (
            <section
              id={section.id}
              className={`journey-chapter ${section.id === activeId ? 'is-current' : ''}`}
              data-story-section
              key={section.id}
            >
              <div className="journey-chapter__copy">
                <span className="story-section__number" aria-hidden="true">
                  {String(index + 3).padStart(2, '0')} / 07
                </span>
                <h2>{section.title}</h2>
                <p className="story-section__subtitle">{section.subtitle}</p>
                <p className="story-section__body">{section.body}</p>
                {section.sellingPoints?.length ? (
                  <div className="story-section__points" aria-label={`${section.title} highlights`}>
                    {section.sellingPoints.map((point) => (
                      <article key={point.value}>
                        <strong>{point.value}</strong>
                        {point.label ? <span>{point.label}</span> : null}
                      </article>
                    ))}
                  </div>
                ) : null}
              </div>
              <MediaSet media={mediaBySection[section.id]} mobile />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
