'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { STORY_META, STORY_NAV_LINKS, STORY_SECTIONS } from '@/data/story-content';

export default function Nav() {
  const [activeSection, setActiveSection] = useState(STORY_SECTIONS[0].id);

  useEffect(() => {
    const sections = [...document.querySelectorAll('[data-story-section]')];
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { rootMargin: '0px 0px -14% 0px', threshold: 0.14 },
    );
    const activeObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-28% 0px -48% 0px', threshold: [0, 0.2, 0.5, 0.8] },
    );

    sections.forEach((section, index) => {
      if (index === 0) section.classList.add('is-visible');
      revealObserver.observe(section);
      activeObserver.observe(section);
    });

    return () => {
      revealObserver.disconnect();
      activeObserver.disconnect();
    };
  }, []);

  return (
    <header className="story-nav">
      <div className="story-nav__inner">
        <a href="#nexgen" className="story-nav__brand" aria-label="FireSafeX home">
          <Image src="/icons/apple-touch-icon.png" alt="" width={34} height={34} priority unoptimized />
          <span>FireSafe<strong>X</strong><small>NexGen</small></span>
        </a>

        <nav className="story-nav__rail" aria-label="Page sections">
          {STORY_NAV_LINKS.map((link, index) => {
            const id = link.href.slice(1);
            const isActive = activeSection === id;
            return (
              <a
                href={link.href}
                className={isActive ? 'is-active' : ''}
                aria-current={isActive ? 'location' : undefined}
                key={link.href}
              >
                <span aria-hidden="true">{index + 1}</span>
                <b>{link.label}</b>
              </a>
            );
          })}
        </nav>

        <button type="button" className="story-nav__cta" data-book-demo>
          <i aria-hidden="true" />
          {STORY_META.cta.replace(' →', '')}
        </button>
      </div>
    </header>
  );
}
