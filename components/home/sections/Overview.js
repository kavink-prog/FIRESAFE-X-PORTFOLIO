'use client';

import { useEffect, useRef, useState } from 'react';
import useAutoRotatingTabs from '@/components/hooks/useAutoRotatingTabs';
import VIDEO_URLS from '@/data/video-urls.json';

const v = (path) => VIDEO_URLS[path] || path;

const TABS = [
  {
    id: 'smart-hardware',
    label: 'Smart Extinguisher',
    eyebrow: 'Connected physical training',
    title: (
      <>
        Smart extinguisher.
        <br />
        <span className="grad">Built for practical drills.</span>
      </>
    ),
    copy:
      'Use a connected physical extinguisher training device to practise handling and capture key response actions during guided sessions.',
    accent: 'cyan',
    mediaType: 'video',
    mediaSrc: v('/assets/videos/overview/smart-hardware.mp4'),
    hud: ['Connected device', 'Action capture', 'Practical handling'],
    details: [
      { label: 'Interaction', value: 'Physical extinguisher handling' },
      { label: 'Tracking', value: 'Key response actions' },
      { label: 'Output', value: 'Performance feedback' },
    ],
  },
  {
    id: 'mixed-reality',
    label: 'Mixed Reality',
    eyebrow: 'Immersive practical scenarios',
    title: (
      <>
        Practical MR training.
        <br />
        <span className="grad">In the real environment.</span>
      </>
    ),
    copy:
      'Mixed reality simulations place fire response scenarios in the trainee’s surrounding environment, enabling repeatable practical sessions without staging a live fire.',
    accent: 'blue',
    mediaType: 'video',
    mediaSrc: v('/assets/videos/overview/mixed-reality.mp4'),
    hud: ['Mixed reality', 'Scenario practice', 'Guided response'],
    details: [
      { label: 'Use', value: 'Workplace training scenarios' },
      { label: 'Mode', value: 'Mixed reality practice' },
      { label: 'Outcome', value: 'Repeatable practical training' },
    ],
  },
  {
    id: 'ai-expert',
    label: 'AI Expert',
    eyebrow: 'Intelligent safety guidance',
    title: (
      <>
        AI safety expert.
        <br />
        <span className="grad">Guidance in the flow of learning.</span>
      </>
    ),
    copy:
      'Support theory learning, trainee questions, and guided sessions with an AI safety expert designed for clear, accessible fire safety training.',
    accent: 'cyan',
    mediaType: 'video',
    mediaSrc: v('/assets/videos/overview/ai-instructor.mp4'),
    hud: ['Theory support', 'Interactive guidance', 'Multilingual learning'],
    details: [
      { label: 'Experience', value: 'Interactive safety guidance' },
      { label: 'Guidance', value: 'Interactive AI safety support' },
      { label: 'Learning', value: 'Theory plus practical coaching' },
    ],
  },
  {
    id: 'pass-tracked',
    label: 'P.A.S.S. Tracked',
    eyebrow: 'Practical performance assessment',
    title: (
      <>
        Assess and score.
        <br />
        <span className="grad">Measured in real time.</span>
      </>
    ),
    copy:
      'Track key practical actions during a session to provide feedback, performance scoring, and structured training records for assessment and certification workflows.',
    accent: 'cyan',
    mediaType: 'video',
    mediaSrc: v('/assets/videos/overview/pass-tracked.mp4'),
    hud: ['Action review', 'Performance analysis', 'Real-time feedback'],
    details: [
      { label: 'Actions', value: 'Pull, aim, squeeze, and sweep' },
      { label: 'Method', value: 'Practical sequence assessment' },
      { label: 'Output', value: 'Assessment-ready performance data' },
    ],
  },
];

export default function Overview() {
  const mediaSurfaceRef = useRef(null);
  const activeVideoRef = useRef(null);
  const tabListRef = useRef(null);
  const [mediaState, setMediaState] = useState({ loading: true, error: false });
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
  } = useAutoRotatingTabs({ count: TABS.length, intervalMs: 5000 });

  const activeTab = TABS[activeIndex];

  const updateMediaState = (patch) => setMediaState((current) => ({ ...current, ...patch }));

  const configureVideo = (video, preload = 'metadata') => {
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;
    video.autoplay = true;
    video.preload = preload;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', 'true');
  };

  const playActiveVideo = async () => {
    const video = activeVideoRef.current;
    if (!video) return;

    configureVideo(video, 'auto');
    updateMediaState({ loading: true, error: false });

    if (video.networkState === HTMLMediaElement.NETWORK_EMPTY || video.readyState === 0) {
      video.load();
    }

    if (prefersReducedMotion) {
      video.pause();
      updateMediaState({ loading: false, error: false });
      return;
    }

    if (!video || video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      try {
        const playPromise = video.play();
        if (playPromise?.then) await playPromise;
        updateMediaState({ loading: false, error: false });
      } catch (error) {
        if (error?.name !== 'AbortError') {
          updateMediaState({ loading: false, error: true });
        }
      }
      return;
    }

    await new Promise((resolve, reject) => {
      const onReady = () => {
        cleanup();
        resolve();
      };
      const onError = () => {
        cleanup();
        reject(new Error('VIDEO_LOAD_FAILED'));
      };
      const cleanup = () => {
        video.removeEventListener('loadeddata', onReady);
        video.removeEventListener('canplay', onReady);
        video.removeEventListener('error', onError);
      };

      video.addEventListener('loadeddata', onReady, { once: true });
      video.addEventListener('canplay', onReady, { once: true });
      video.addEventListener('error', onError, { once: true });
    });

    try {
      const playPromise = video.play();
      if (playPromise?.then) await playPromise;
      updateMediaState({ loading: false, error: false });
    } catch (error) {
      if (error?.name !== 'AbortError') {
        updateMediaState({ loading: false, error: true });
      }
    }
  };

  useEffect(() => {
    playActiveVideo();
  }, [activeIndex, prefersReducedMotion]);

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

  useEffect(() => {
    TABS.forEach((tab) => {
      const video = document.createElement('video');
      configureVideo(video, 'auto');
      video.src = tab.mediaSrc;
      video.load();
    });
  }, []);

  const setOverviewTab = (index) => {
    if (index === activeIndex && mediaState.error) playActiveVideo();
    selectIndex(index);
  };

  const handleTabKeyDown = (event, index) => {
    const keyTargets = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: TABS.length - 1,
    };
    if (!(event.key in keyTargets)) return;

    event.preventDefault();
    const nextIndex = ((keyTargets[event.key] % TABS.length) + TABS.length) % TABS.length;
    selectIndex(nextIndex);
    window.requestAnimationFrame(() => {
      tabListRef.current?.querySelectorAll('[role="tab"]')[nextIndex]?.focus();
    });
  };

  const handleMixedMove = (event) => {
    if (activeTab.id !== 'mixed-reality') return;

    const surface = mediaSurfaceRef.current;
    if (!surface) return;

    const bounds = surface.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 16;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 16;

    surface.style.setProperty('--overview-parallax-x', `${x}px`);
    surface.style.setProperty('--overview-parallax-y', `${y}px`);
  };

  const resetMixedMove = () => {
    const surface = mediaSurfaceRef.current;
    if (!surface) return;

    surface.style.setProperty('--overview-parallax-x', '0px');
    surface.style.setProperty('--overview-parallax-y', '0px');
  };

  return (
    <section id="overview" className="getknow overview-story">
      <div className="getknow__head overview-story__head">
        <p className="eyebrow reveal">Product Overview</p>
        <h2 className="title reveal" data-lines>
          The next-generation
          <br />
          <span className="muted">fire safety training ecosystem.</span>
        </h2>
        <p className="usp reveal">
          FireSafeX combines smart extinguisher hardware, mixed reality training, AI safety guidance, and real-time
          assessment into one connected platform built to train, practice, assess, and certify with confidence.
        </p>
      </div>

      <div
        ref={containerRef}
        className="overview-story__experience"
        data-rotation-paused={isPaused}
        {...interactionProps}
      >
        <div className="overview-story__navigation reveal">
          <div
            ref={tabListRef}
            className="overview-story__tab-list"
            role="tablist"
            aria-label="Product overview"
          >
            {TABS.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                tabIndex={activeIndex === index ? 0 : -1}
                aria-selected={activeIndex === index}
                aria-controls={`overview-panel-${tab.id}`}
                id={`overview-tab-${tab.id}`}
                className={`overview-story__tab ${activeIndex === index ? 'is-active' : ''}`}
                onClick={() => setOverviewTab(index)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                <small>{String(index + 1).padStart(2, '0')}</small>
                <span>{tab.label}</span>
                {activeIndex === index ? (
                  <i key={progressKey} className="overview-story__tab-progress" aria-hidden="true"></i>
                ) : null}
              </button>
            ))}
          </div>
          {!prefersReducedMotion ? (
            <button
              type="button"
              className="overview-story__rotation-toggle"
              aria-label={isUserPaused ? 'Resume automatic product tabs' : 'Pause automatic product tabs'}
              aria-pressed={isUserPaused}
              onClick={toggleUserPause}
            >
              <span aria-hidden="true">{isUserPaused ? '▶' : 'Ⅱ'}</span>
            </button>
          ) : null}
        </div>

        <div className="overview-story__shell">
          <div className="overview-story__content-column">
            <div className="overview-story__content-stack">
              {TABS.map((tab, index) => (
                <article
                  key={tab.id}
                  id={`overview-panel-${tab.id}`}
                  role="tabpanel"
                  aria-labelledby={`overview-tab-${tab.id}`}
                  aria-hidden={activeIndex !== index}
                  tabIndex={activeIndex === index ? 0 : -1}
                  className={`overview-story__content-panel ${activeIndex === index ? 'is-active' : ''}`}
                >
                  <p className="overview-story__content-eyebrow">{tab.eyebrow}</p>
                  <h3 className="overview-story__content-title">{tab.title}</h3>
                  <p className="overview-story__content-copy">{tab.copy}</p>

                  <div className="overview-story__detail-grid">
                    {tab.details.map((detail) => (
                      <div key={detail.label} className="overview-story__detail-card">
                        <span>{detail.label}</span>
                        <strong>{detail.value}</strong>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="overview-story__media-column reveal">
            <div
              ref={mediaSurfaceRef}
              className={`overview-story__media-surface overview-story__media-surface--${TABS[activeIndex].accent}`}
              onMouseMove={handleMixedMove}
              onMouseLeave={resetMixedMove}
            >
              <div className="overview-story__media-topbar">
                <span className="overview-story__media-status">
                  <i></i>
                  {activeTab.label}
                </span>
                <span className="overview-story__media-caption">Product experience</span>
              </div>

              <div className="overview-story__media-stack">
                <div
                  className={`overview-story__media-panel is-active ${
                    activeTab.id === 'mixed-reality' ? 'is-parallax' : ''
                  } ${activeTab.id === 'pass-tracked' ? 'is-tracked' : ''}`}
                >
                  <video
                    key={activeTab.id}
                    ref={activeVideoRef}
                    className="overview-story__video"
                    src={activeTab.mediaSrc}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="auto"
                    tabIndex={-1}
                    aria-hidden="true"
                    onLoadStart={() => updateMediaState({ loading: true, error: false })}
                    onLoadedMetadata={() => updateMediaState({ loading: false, error: false })}
                    onLoadedData={() => updateMediaState({ loading: false, error: false })}
                    onCanPlay={() => updateMediaState({ loading: false, error: false })}
                    onPlaying={() => updateMediaState({ loading: false, error: false })}
                    onWaiting={() => updateMediaState({ loading: true, error: false })}
                    onError={() => updateMediaState({ loading: false, error: true })}
                  />

                  {mediaState.loading ? (
                    <div className="overview-story__media-state" aria-live="polite">
                      <span>Loading video...</span>
                    </div>
                  ) : null}

                  {mediaState.error ? (
                    <div className="overview-story__media-state overview-story__media-state--error" aria-live="polite">
                      <span>Video unavailable.</span>
                      <button type="button" onClick={playActiveVideo}>Retry video</button>
                    </div>
                  ) : null}

                  <div className="overview-story__media-overlay" aria-hidden="true">
                    <div className="overview-story__hud-chip-row">
                      {activeTab.hud.map((item) => (
                        <span key={item} className="overview-story__hud-chip">
                          {item}
                        </span>
                      ))}
                    </div>

                    {activeTab.id === 'pass-tracked' ? (
                      <div className="overview-story__tracking-layer">
                        <span className="overview-story__tracking-reticle overview-story__tracking-reticle--one"></span>
                        <span className="overview-story__tracking-reticle overview-story__tracking-reticle--two"></span>
                        <span className="overview-story__tracking-line overview-story__tracking-line--x"></span>
                        <span className="overview-story__tracking-line overview-story__tracking-line--y"></span>
                        <div className="overview-story__tracking-metrics">
                          <b>LIVE</b>
                          <span>Session feedback</span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="overview-story__media-footer" aria-hidden="true">
                <span>{String(activeIndex + 1).padStart(2, '0')} / {String(TABS.length).padStart(2, '0')}</span>
                <div>
                  {TABS.map((tab, index) => (
                    <i key={tab.id} className={activeIndex === index ? 'is-active' : ''}></i>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
