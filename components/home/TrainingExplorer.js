'use client';

import ResponsiveImage from './ResponsiveImage';


import { useEffect, useState } from 'react';

const root = '/assets/images/firesafe-x_eco-system/';
const steps = [
  {
    title: 'Learn',
    copy: 'Understand fire risks, equipment and response procedures. Build hazard awareness through interactive learning.',
    image: 'firesafex-09-training-module-menu',
    width: 1586,
    height: 992,
    caption: 'Choose theory, smart training, assessment or expert guidance.',
  },
  {
    title: 'Practise',
    copy: 'Enter realistic emergency scenarios. Handle smart physical equipment and get guidance from the AI assistant.',
    image: 'firesafex-04-training-instructions',
    width: 1619,
    height: 971,
    caption:
      'Review the on-screen instructions before beginning a practical assessment.',
  },
  {
    title: 'Assess',
    copy: 'Measure knowledge and practical performance with structured digital assessments.',
    image: 'firesafex-05-live-fire-simulation',
    width: 1586,
    height: 992,
    caption:
      'Simulated fire in a physical environment, viewed through the headset.',
  },
  {
    title: 'Certify',
    copy: 'Validate competency with digital certification connected to the training experience.',
    image: 'firesafex-07-achievement-certificate',
    width: 1672,
    height: 941,
    caption: 'A sample certificate from the FireSafeX training experience.',
  },
  {
    title: 'Track',
    copy: 'Monitor participation, completion and employee readiness in organised digital records.',
    image: '/assets/images/firesafe-x_eco-system/firesafex-13-track.png',
    width: 1586,
    height: 992,
    caption:
      'FireSafeX assessment history dashboard showing scores, attempt history and criteria results.',
  },
  {
    title: 'Improve',
    copy: 'Identify gaps and provide targeted refresher training. Make readiness a continuous journey.',
    image: 'firesafex-12-ai-expert-avatar',
    width: 1586,
    height: 992,
    caption: 'Return to expert guidance and targeted practice.',
  },
];
export default function TrainingExplorer() {
  const [active, setActive] = useState(1);
  const [loadedImage, setLoadedImage] = useState('');
  const step = steps[active];
  const isImageLoaded = loadedImage === step.image;
  useEffect(() => {
    function restoreStep() {
      const requested = new URLSearchParams(window.location.search).get('training');
      const index = steps.findIndex((item) => item.title.toLowerCase() === requested);
      setActive(index >= 0 ? index : 1);
    }
    restoreStep();
    window.addEventListener('popstate', restoreStep);
    return () => window.removeEventListener('popstate', restoreStep);
  }, []);
  function selectStep(index) {
    setActive(index);
    const url = new URL(window.location.href);
    url.searchParams.set('training', steps[index].title.toLowerCase());
    window.history.replaceState(window.history.state, '', url);
  }
  function onKeyDown(event, index) {
    const next =
      event.key === 'ArrowDown' || event.key === 'ArrowRight'
        ? (index + 1) % steps.length
        : event.key === 'ArrowUp' || event.key === 'ArrowLeft'
          ? (index + steps.length - 1) % steps.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? steps.length - 1
              : null;
    if (next === null) return;
    event.preventDefault();
    selectStep(next);
    document.getElementById(`training-tab-${next}`)?.focus();
  }
  return (
    <div className="fx-explorer">
      <div
        className="fx-explorer-tabs"
        role="tablist"
        aria-label="Explore the training journey"
        aria-orientation="horizontal"
      >
        {steps.map((item, index) => (
          <button
            key={item.title}
            type="button"
            role="tab"
            id={`training-tab-${index}`}
            aria-selected={active === index}
            aria-controls="training-panel"
            tabIndex={active === index ? 0 : -1}
            onClick={() => selectStep(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item.title}</strong>
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <div
        className="fx-explorer-panel"
        data-step={step.title.toLowerCase()}
        role="tabpanel"
        id="training-panel"
        aria-labelledby={`training-tab-${active}`}
        tabIndex={0}
      >
        <div className="fx-screen-bar">
          <span>Inside FireSafeX</span>
          <span>{step.title}</span>
        </div>
        <div
          className={`fx-screen-media ${isImageLoaded ? 'is-loaded' : 'is-loading'}`}
          style={{ aspectRatio: `${step.width} / ${step.height}` }}
        >
          <div className="fx-screen-placeholder" aria-hidden="true"></div>
          <ResponsiveImage
            key={step.image}
            src={step.image.startsWith('/') ? step.image : `${root}${step.image}.webp`}
            alt={step.caption}
            width={step.width}
            height={step.height}
            loading="lazy"
            onLoad={() => setLoadedImage(step.image)}
          />
          <span className="fx-screen-loading" role="status" aria-live="polite">
            {isImageLoaded ? '' : 'Loading training view…'}
          </span>
        </div>
        <div className="fx-screen-description" aria-live="polite">
          <h3>{step.title} with FireSafeX</h3>
          <p>{step.copy}</p>
          <small>{step.caption}</small>
        </div>
      </div>
      <section className="fx-video-demo" aria-labelledby="training-video-title">
        <h3 id="training-video-title">Watch FireSafeX on YouTube</h3>
        <div>
          <iframe
            className="fx-video-demo__player"
            width="560"
            height="315"
            src="https://www.youtube.com/embed/ZeR8jtiZg6I?si=9ZCvD0Y7PZjNVwiq&rel=0"
            title="FireSafeX video on YouTube"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            aria-describedby="training-video-description"
          />
          <p id="training-video-description">
            See how physical extinguisher handling connects with the immersive
            training experience. Use the player controls to play, pause or view
            full screen.
          </p>
        </div>
      </section>
    </div>
  );
}
