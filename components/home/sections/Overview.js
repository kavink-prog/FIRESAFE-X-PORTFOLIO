'use client';

import { useEffect, useRef, useState } from 'react';
import VIDEO_URLS from '@/data/video-urls.json';

const v = (path) => VIDEO_URLS[path] || path;

const TABS = [
  {
    id: 'smart-hardware',
    label: 'Smart Hardware',
    eyebrow: 'Real extinguisher shell',
    title: (
      <>
        Smart extinguisher.
        <br />
        <span className="grad">Built for practical drills.</span>
      </>
    ),
    copy:
      'Transform any fire extinguisher into a smart training device with embedded sensing, haptic feedback, and live telemetry that makes every response action realistic and measurable.',
    accent: 'cyan',
    mediaType: 'video',
    mediaSrc: v('/assets/videos/overview/smart-hardware.mp4'),
    hud: ['Live sensors', 'Force capture', 'Haptic feedback'],
    details: [
      { label: 'Shell', value: 'Real physical extinguisher body' },
      { label: 'Tracking', value: 'Pin, squeeze, angle, and motion' },
      { label: 'Capture', value: 'Real-time performance feedback' },
    ],
  },
  {
    id: 'mixed-reality',
    label: 'Mixed Reality',
    eyebrow: 'Passthrough scenario engine',
    title: (
      <>
        Practical MR training.
        <br />
        <span className="grad">In the real environment.</span>
      </>
    ),
    copy:
      'Immersive mixed reality simulations place physics-driven fire scenarios inside the user’s real environment, enabling repeatable response practice without live burn risk, waste, or cleanup.',
    accent: 'blue',
    mediaType: 'video',
    mediaSrc: v('/assets/videos/overview/mixed-reality.mp4'),
    hud: ['Meta Quest passthrough', 'Scenario depth map', 'Room-aware guidance'],
    details: [
      { label: 'Coverage', value: 'Office, plant, warehouse, field' },
      { label: 'Mode', value: 'Mixed reality passthrough' },
      { label: 'Outcome', value: 'Repeatable practical training' },
    ],
  },
  {
    id: 'ai-expert',
    label: 'AI Expert',
    eyebrow: 'AI instructor sequence',
    title: (
      <>
        AI safety expert.
        <br />
        <span className="grad">Always available to guide.</span>
      </>
    ),
    copy:
      'Ask questions, deliver theory learning, and guide trainees through every session with an AI-powered safety trainer built to make learning more accessible, responsive, and engaging.',
    accent: 'cyan',
    mediaType: 'video',
    mediaSrc: v('/assets/videos/overview/ai-instructor.mp4'),
    hud: ['Holographic presence', 'Context-aware coaching', 'Continuous instructor presence'],
    details: [
      { label: 'Experience', value: 'Cinematic holographic instructor' },
      { label: 'Guidance', value: 'Interactive AI safety support' },
      { label: 'Learning', value: 'Theory plus practical coaching' },
    ],
  },
  {
    id: 'pass-tracked',
    label: 'P.A.S.S. Tracked',
    eyebrow: 'Precision movement scoring',
    title: (
      <>
        Assess and score.
        <br />
        <span className="grad">Measured in real time.</span>
      </>
    ),
    copy:
      'Every pull, aim, squeeze, and sweep action is tracked in real time, giving instructors detailed feedback, competency scoring, and digital records that support assessment and certification.',
    accent: 'cyan',
    mediaType: 'video',
    mediaSrc: v('/assets/videos/overview/pass-tracked.mp4'),
    hud: ['Target lock', 'Motion analysis', 'Realtime scoring'],
    details: [
      { label: 'Aim', value: 'High-precision motion tracking' },
      { label: 'Method', value: 'P.A.S.S. sequence verified' },
      { label: 'Output', value: 'Assessment-ready performance data' },
    ],
  },
];

export default function Overview() {
  const mediaSurfaceRef = useRef(null);
  const activeVideoRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mediaState, setMediaState] = useState({ loading: true, error: false });

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
  }, [activeIndex]);

  useEffect(() => {
    TABS.forEach((tab) => {
      const video = document.createElement('video');
      configureVideo(video, 'auto');
      video.src = tab.mediaSrc;
      video.load();
    });
  }, []);

  const setOverviewTab = (index) => {
    setActiveIndex(index);
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

  const toggleVideoPlayback = () => {
    const video = activeVideoRef.current;
    if (!video) return;

    if (video.paused) {
      configureVideo(video, 'auto');
      const playPromise = video.play();
      if (playPromise?.catch) {
        playPromise.catch((error) => {
          if (error?.name === 'AbortError') return;
          updateMediaState({ loading: false, error: true });
        });
      }
      return;
    }

    video.pause();
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

      <div className="overview-story__experience">
        <div className="overview-story__shell">
          <div className="overview-story__content-column">
            <div className="overview-story__tab-list reveal" role="tablist" aria-label="Product Overview Tabs">
              {TABS.map((tab, index) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeIndex === index}
                  aria-controls={`overview-panel-${tab.id}`}
                  id={`overview-tab-${tab.id}`}
                  className={`overview-story__tab ${activeIndex === index ? 'is-active' : ''}`}
                  onClick={() => setOverviewTab(index)}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="overview-story__content-stack">
              {TABS.map((tab, index) => (
                <article
                  key={tab.id}
                  id={`overview-panel-${tab.id}`}
                  role="tabpanel"
                  aria-labelledby={`overview-tab-${tab.id}`}
                  aria-hidden={activeIndex !== index}
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
                <span className="overview-story__media-caption">Live product reveal</span>
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
                    onClick={toggleVideoPlayback}
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
                      <span>Video unavailable. Tap the tab again to retry.</span>
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
                          <b>94%</b>
                          <span>Training accuracy</span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="overview-story__media-footer">
                {TABS.map((tab, index) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`overview-story__footer-pill ${activeIndex === index ? 'is-active' : ''}`}
                    onClick={() => setOverviewTab(index)}
                    aria-label={`Show ${tab.label}`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
