import { SITE_CONTENT } from '@/data/site-content';

export default function Hero() {
  const { hero } = SITE_CONTENT;
  const acts = [
    { title: hero.category, copy: hero.description, statement: hero.statement, isIntro: true },
    ...hero.chapters,
  ];

  return (
    <section id="top" className="cine" aria-label={hero.brand}>
      <div className="cine__sticky">
        <div className="cine__sky" aria-hidden="true"></div>
        <div className="cine__beam cine__beam--1" aria-hidden="true"></div>
        <div className="cine__beam cine__beam--2" aria-hidden="true"></div>
        <div className="cine__grain" aria-hidden="true"></div>

        <aside className="cine__rail" aria-label="FireSafeX introduction progress">
          <span className="cine__rail-mark" aria-hidden="true"></span>
          {acts.map((act, index) => (
            <span className="cine__rail-label" data-rail={index} key={act.title}>
              {index === 0 ? hero.brand : act.title}
            </span>
          ))}
          <span className="cine__rail-mark cine__rail-mark--end" aria-hidden="true"></span>
        </aside>

        <div className="cine__marquee cine__marquee--top" aria-hidden="true">
          <div className="cine__marquee-track">
            {Array.from({ length: 3 }, (_, index) => <span key={index}>{hero.statement} · </span>)}
          </div>
        </div>
        <div className="cine__marquee cine__marquee--bottom" aria-hidden="true">
          <div className="cine__marquee-track">
            {Array.from({ length: 3 }, (_, index) => <span key={index}>Train. Practice. Recognize. Certify. · </span>)}
          </div>
        </div>

        <div className="cine__stage" id="heroStage">
          <div className="cine__podium" aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => (
              <span className={`cine__plate cine__plate--${index + 1}`} key={index}></span>
            ))}
          </div>
          <div className="cine__product">
            <canvas id="heroCanvas" className="cine__canvas" aria-hidden="true"></canvas>
            <img
              src="/assets/sequences/hero/desktop/0001.webp"
              srcSet="/assets/sequences/hero/mobile/0001.webp 540w, /assets/sequences/hero/desktop/0001.webp 900w"
              sizes="(max-width: 720px) 540px, 900px"
              alt="FireSafeX smart fire extinguisher training device"
              className="cine__poster"
            />
            <div
              id="heroLoader"
              className="cine__loader"
              role="status"
              aria-live="polite"
              aria-label="Loading the FireSafeX product experience"
            >
              <div className="cine__loader-panel">
                <span className="cine__loader-ring" aria-hidden="true"></span>
                <span className="cine__loader-copy">
                  <strong>Preparing FireSafeX</strong>
                  <small>Loading immersive product experience</small>
                </span>
              </div>
            </div>
          </div>
          <div className="cine__shadow" aria-hidden="true"></div>
        </div>

        <div className="cine__title-wrap" aria-hidden="true">
          <div className="cine__title">FIRE<span className="cine__title-x">SAFE</span>X</div>
          <p className="cine__subtitle">NEXGEN</p>
        </div>

        <div className="cine__acts">
          {acts.map((act, index) => (
            <article
              className={`cine__act cine__act--${index + 1} ${index ? 'cine__act--chapter' : 'cine__act--intro'}`}
              data-act={index}
              key={act.title}
            >
              <p className="cine__act-eyebrow">{index === 0 ? hero.brand : String(index).padStart(2, '0')}</p>
              {index === 0 ? (
                <h1 className="cine__act-title">{act.title}<br/><em>{hero.headline}</em></h1>
              ) : (
                <h2 className="cine__act-headline">{act.title}</h2>
              )}
              <p className="cine__act-body">{act.copy}</p>
              {index === 0 ? <p className="cine__act-statement">{act.statement}</p> : null}
              {index === 0 ? (
                <div className="cine__act-ctas">
                  <a href="#cta" className="btn btn--blue" data-book-demo>{hero.primaryCta}</a>
                  <a href="#workflow" className="link">{hero.secondaryCta} <span aria-hidden="true">›</span></a>
                </div>
              ) : null}
            </article>
          ))}
        </div>

        <div className="cine__scroll" aria-hidden="true">
          <span className="cine__scroll-label">Scroll to discover</span>
          <span className="cine__scroll-line"></span>
        </div>
      </div>
      <div className="cine__scroller" aria-hidden="true"></div>
    </section>
  );
}
