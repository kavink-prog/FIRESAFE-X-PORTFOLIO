'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import useAutoRotatingTabs from '@/components/hooks/useAutoRotatingTabs';

const FEATURES = [
  {
    title: 'Multi-Language AI Instructor',
    shortLabel: 'Language',
    kicker: 'Accessible AI guidance',
    description:
      'Train users in their preferred language through AI-powered theory lessons, voice interactions, and expert guidance. Create a more accessible and engaging learning experience for global teams.',
    icon: 'globe',
    highlights: ['Preferred language', 'Voice guidance', 'Accessible instruction'],
  },
  {
    title: 'Regional Training Content',
    shortLabel: 'Region',
    kicker: 'Context-aware delivery',
    description:
      'Organize training experiences for different regions, operating contexts, and organizational requirements.',
    icon: 'map',
    highlights: ['Regional scenarios', 'Local context', 'Consistent delivery'],
  },
  {
    title: 'Role-Based Training',
    shortLabel: 'Roles',
    kicker: 'The right experience for each user',
    description:
      'Deliver customized learning experiences for employees, safety officers, supervisors, instructors, and administrators with configurable access and training paths.',
    icon: 'roles',
    highlights: ['Employees', 'Instructors', 'Administrators'],
  },
  {
    title: 'Centralized Administration',
    shortLabel: 'Administration',
    kicker: 'One management layer',
    description:
      'Coordinate users, training access, records, and program settings through a central management layer.',
    icon: 'control',
    highlights: ['Users', 'Records', 'Program settings'],
  },
  {
    title: 'Configurable Training Workflows',
    shortLabel: 'Workflows',
    kicker: 'Programs shaped around operations',
    description:
      'Configure supported sessions, assessments, permissions, and content visibility around program needs.',
    icon: 'control',
    highlights: ['Sessions', 'Assessments', 'Permissions'],
  },
  {
    title: 'Enterprise Customization',
    shortLabel: 'Customization',
    kicker: 'Deployment fit without fragmentation',
    description:
      "Adapt supported branding, workflows, and training objectives to match the organization's deployment needs.",
    icon: 'modular',
    highlights: ['Branding', 'Objectives', 'Deployment fit'],
  },
];

const COORDINATES = [
  'NA 37.7749 / -122.4194',
  'EU 48.8566 / 2.3522',
  'MEA 25.2048 / 55.2708',
  'APAC 1.3521 / 103.8198',
];

function Icon({ type }) {
  switch (type) {
    case 'globe':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="21" />
          <path d="M12 32h40M32 11c6 6 10 13 10 21S38 47 32 53M32 11c-6 6-10 13-10 21s4 15 10 21M18 19c4 3 9 5 14 5s10-2 14-5M18 45c4-3 9-5 14-5s10 2 14 5" />
        </svg>
      );
    case 'map':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M10 16l14-5 16 6 14-5v36l-14 5-16-6-14 5z" />
          <path d="M24 11v36M40 17v36" />
          <circle cx="44" cy="24" r="4" />
        </svg>
      );
    case 'roles':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="20" cy="23" r="7" />
          <circle cx="44" cy="20" r="6" />
          <circle cx="38" cy="42" r="8" />
          <path d="M10 46c2-7 8-11 15-11s13 4 15 11M35 30c2-4 6-6 11-6 5 0 9 2 11 6M24 29c3 4 7 7 12 8" />
        </svg>
      );
    case 'personas':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M18 45c0-8 6-14 14-14s14 6 14 14" />
          <circle cx="32" cy="22" r="8" />
          <path d="M12 15l8 4M52 15l-8 4M14 51l9-4M50 51l-9-4" />
          <circle cx="12" cy="15" r="3" />
          <circle cx="52" cy="15" r="3" />
          <circle cx="14" cy="51" r="3" />
          <circle cx="50" cy="51" r="3" />
        </svg>
      );
    case 'control':
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <rect x="12" y="12" width="40" height="40" rx="10" />
          <path d="M22 24h20M22 32h10M22 40h16" />
          <circle cx="43" cy="32" r="4" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M12 20h40v24H12z" />
          <path d="M20 20V12h24v8M24 32h16M32 24v16" />
        </svg>
      );
  }
}

export default function Stats() {
  const tabListRef = useRef(null);
  const {
    activeIndex,
    selectIndex,
    containerRef,
    interactionProps,
    isPaused,
    isUserPaused,
    prefersReducedMotion,
    toggleUserPause,
    progressKey,
  } = useAutoRotatingTabs({ count: FEATURES.length, intervalMs: 5000 });
  const active = FEATURES[activeIndex];

  useEffect(() => {
    if (window.innerWidth > 640) return;
    const list = tabListRef.current;
    const tab = list?.querySelectorAll('[role="tab"]')[activeIndex];
    if (!list || !tab) return;
    list.scrollTo({
      left: Math.max(0, tab.offsetLeft - (list.clientWidth - tab.clientWidth) / 2),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [activeIndex, prefersReducedMotion]);

  const handleTabKeyDown = (event, index) => {
    const keyTargets = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: FEATURES.length - 1,
    };
    if (!(event.key in keyTargets)) return;
    event.preventDefault();
    const nextIndex = ((keyTargets[event.key] % FEATURES.length) + FEATURES.length) % FEATURES.length;
    selectIndex(nextIndex);
    window.requestAnimationFrame(() => {
      tabListRef.current?.querySelectorAll('[role="tab"]')[nextIndex]?.focus();
    });
  };

  return (
    <section id="global-readiness" className="stats stats--global">
      <div className="stats__bg" aria-hidden="true">
        <div className="stats__gridlines"></div>
        <div className="stats__scanlines"></div>
        <div className="stats__rays"></div>
        <div className="stats__paths">
          <span className="stats__path stats__path--one"></span>
          <span className="stats__path stats__path--two"></span>
          <span className="stats__path stats__path--three"></span>
        </div>
        <div className="stats__coordinates">
          {COORDINATES.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="stats__particles">
          {Array.from({ length: 18 }, (_, index) => (
            <span key={index} style={{ '--i': index }}></span>
          ))}
        </div>
      </div>

      <div className="stats__inner stats__inner--global">
        <motion.div
          className="stats__hero stats__hero--global"
          initial={{ opacity: 0, y: 40, filter: 'blur(14px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="stats__eyebrow-pill">Enterprise and global readiness</span>
          <h2 className="stats__title-global">
            One training ecosystem.
            <br />
            Adapted by language, region, and role.
          </h2>
          <p className="stats__lede stats__lede--global">
            FireSafeX supports organizations operating across teams, locations, languages, and industries. Coordinate
            multilingual guidance, regional content, role-based training, and centralized program administration.
          </p>
        </motion.div>

        <div
          ref={containerRef}
          className="stats__experience"
          data-rotation-paused={isPaused}
          {...interactionProps}
        >
          <div className="stats__capability-nav">
            <div ref={tabListRef} className="stats__capability-tabs" role="tablist" aria-label="Global readiness capabilities">
              {FEATURES.map((feature, index) => (
                <button
                  key={feature.title}
                  type="button"
                  role="tab"
                  tabIndex={activeIndex === index ? 0 : -1}
                  id={`global-tab-${index}`}
                  aria-controls="global-panel"
                  aria-selected={activeIndex === index}
                  className={`stats__capability-tab ${activeIndex === index ? 'is-active' : ''}`}
                  onClick={() => selectIndex(index)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{feature.shortLabel}</strong>
                  {activeIndex === index ? <i key={progressKey} aria-hidden="true"></i> : null}
                </button>
              ))}
            </div>
            {!prefersReducedMotion ? (
              <button
                type="button"
                className="stats__rotation-toggle"
                aria-label={isUserPaused ? 'Resume automatic global readiness tabs' : 'Pause automatic global readiness tabs'}
                aria-pressed={isUserPaused}
                onClick={toggleUserPause}
              >
                <span aria-hidden="true">{isUserPaused ? '▶' : 'Ⅱ'}</span>
              </button>
            ) : null}
          </div>

          <motion.article
            key={active.title}
            id="global-panel"
            role="tabpanel"
            tabIndex={0}
            aria-labelledby={`global-tab-${activeIndex}`}
            className="stats__capability-panel"
            initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="stats__capability-media">
              <video
                className="stats__stage-video"
                src="/assets/videos/global/firesafex-product-video-training.mp4"
                autoPlay={!prefersReducedMotion}
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
              <div className="stats__capability-media-overlay" aria-hidden="true">
                <span><i></i> Global training network</span>
                <strong>{active.shortLabel}</strong>
              </div>
            </div>

            <div className="stats__capability-copy">
              <div className="stats__capability-icon"><Icon type={active.icon} /></div>
              <span className="stats__capability-kicker">{active.kicker}</span>
              <h3>{active.title}</h3>
              <p>{active.description}</p>
              <div className="stats__capability-highlights">
                {active.highlights.map((highlight) => <span key={highlight}>{highlight}</span>)}
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
