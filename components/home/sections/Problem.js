'use client';

import { useEffect, useRef } from 'react';
import { SITE_CONTENT } from '@/data/site-content';

const VIDEO_PATH = '/assets/videos/problem/firesafex/new-firefly-loop.mp4';

function DetailList({ points }) {
  if (!points?.length) return null;
  return (
    <ul className="method-console__list">
      {points.map(([title, copy]) => (
        <li key={title}><strong>{title}:</strong> {copy}</li>
      ))}
    </ul>
  );
}

function MethodCard({ method, index, videoRef }) {
  const isFireSafeX = index === 2;

  return (
    <article className={`comparison-board__card comparison-board__card--${isFireSafeX ? 'firesafex' : 'baseline'}`}>
      <header className="comparison-board__head">
        <span>{String(index + 2).padStart(2, '0')}</span>
        <h3>{method.title}</h3>
        <p>{method.subtitle}</p>
      </header>

      {isFireSafeX ? (
        <div className="comparison-board__media">
          <video
            ref={videoRef}
            src={VIDEO_PATH}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="FireSafeX immersive fire safety training experience"
          />
          <span aria-hidden="true"></span>
        </div>
      ) : (
        <div className="comparison-board__graphic" aria-hidden="true">
          <span>{index === 0 ? 'P.A.S.S.' : 'VR'}</span>
          <i></i><i></i><i></i>
        </div>
      )}

      <div className="comparison-board__body">
        {method.paragraphs?.[0] ? <p className="comparison-board__lead">{method.paragraphs[0]}</p> : null}

        {isFireSafeX ? method.paragraphs?.slice(1).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        )) : null}

        {!isFireSafeX && (method.paragraphs?.length > 1 || method.points?.length) ? (
          <details className="console-details comparison-board__details">
            <summary>View complete method details</summary>
            <div className="console-details__body">
              {method.paragraphs?.slice(1).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <DetailList points={method.points} />
            </div>
          </details>
        ) : null}

        {method.conclusion ? <p className="comparison-board__conclusion">{method.conclusion}</p> : null}
      </div>
    </article>
  );
}

export default function Problem() {
  const methods = Object.values(SITE_CONTENT.comparison);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduceMotion) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.25 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="problem" className="methods-compare guided-section method-console">
      <div className="methods-compare__ambient" aria-hidden="true"></div>
      <div className="methods-compare__inner">
        <h2 className="guided-console__visually-hidden">Fire safety training methods</h2>
        <div className="comparison-board" aria-label="Fire safety training method comparison">
          {methods.map((method, index) => (
            <MethodCard
              key={method.title}
              method={method}
              index={index}
              videoRef={index === 2 ? videoRef : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
