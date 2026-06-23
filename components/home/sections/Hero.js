export default function Hero() {
  return (
    <section id="top" className="cine">
      <div className="cine__sticky">
        <div className="cine__sky" aria-hidden="true"></div>
        <div className="cine__beam cine__beam--1" aria-hidden="true"></div>
        <div className="cine__beam cine__beam--2" aria-hidden="true"></div>
        <div className="cine__grain" aria-hidden="true"></div>

        <aside className="cine__rail" aria-hidden="true">
          <span className="cine__rail-mark"></span>
          <span className="cine__rail-label" data-rail="0">Introduction</span>
          <span className="cine__rail-label" data-rail="1">FireSafe X</span>
          <span className="cine__rail-label" data-rail="2">Real feel</span>
          <span className="cine__rail-label" data-rail="3">Virtual fire</span>
          <span className="cine__rail-mark cine__rail-mark--end"></span>
        </aside>

        <div className="cine__marquee cine__marquee--top" aria-hidden="true">
          <div className="cine__marquee-track">
            <span>TRAIN LIKE IT'S REAL · REAL WEIGHT · VIRTUAL FIRE · ZERO WASTE · </span>
            <span>TRAIN LIKE IT'S REAL · REAL WEIGHT · VIRTUAL FIRE · ZERO WASTE · </span>
            <span>TRAIN LIKE IT'S REAL · REAL WEIGHT · VIRTUAL FIRE · ZERO WASTE · </span>
          </div>
        </div>
        <div className="cine__marquee cine__marquee--bottom" aria-hidden="true">
          <div className="cine__marquee-track">
            <span>FIRE SAFE X · NEXGEN · MIXED REALITY · METAQUEST 3 · IOT · </span>
            <span>FIRE SAFE X · NEXGEN · MIXED REALITY · METAQUEST 3 · IOT · </span>
            <span>FIRE SAFE X · NEXGEN · MIXED REALITY · METAQUEST 3 · IOT · </span>
          </div>
        </div>

        <div className="cine__stage" id="heroStage">
          <div className="cine__podium" aria-hidden="true">
            <span className="cine__plate cine__plate--1"></span>
            <span className="cine__plate cine__plate--2"></span>
            <span className="cine__plate cine__plate--3"></span>
            <span className="cine__plate cine__plate--4"></span>
            <span className="cine__plate cine__plate--5"></span>
            <span className="cine__plate cine__plate--6"></span>
          </div>

          <div className="cine__product">
            <canvas id="heroCanvas" className="cine__canvas" aria-hidden="true"></canvas>
            <img src="/assets/images/product/device-full.webp" alt="FireSafeX smart fire extinguisher" className="cine__poster" />
            <div id="heroLoader" className="cine__loader" aria-hidden="true"><span></span></div>
          </div>

          <div className="cine__shadow" aria-hidden="true"></div>
        </div>

        <div className="cine__title-wrap" aria-hidden="true">
          <h1 className="cine__title">FIRE<span className="cine__title-x">SAFE</span>X</h1>
          <p className="cine__subtitle">NEXGEN</p>
        </div>

        <div className="cine__acts">
          <article className="cine__act cine__act--1" data-act="0">
            <p className="cine__act-eyebrow">FireSafeX NexGen</p>
            <h2 className="cine__act-title">AI-powered fire safety training.<br/><em>Train like it's real.</em></h2>
            <p className="cine__act-copy">The next-generation fire safety training ecosystem built to help teams train, practice, assess, and certify with immersive mixed reality, AI guidance, and measurable performance.</p>
            <div className="cine__act-ctas">
              <a href="#cta" className="btn btn--blue" data-book-demo>Book a demo</a>
              <a href="#workflow" className="link">How it works <span aria-hidden="true">›</span></a>
            </div>
          </article>

          <article className="cine__act cine__act--2" data-act="1">
            <h2 className="cine__act-headline">INTELLIGENT<br/>TRAINING MEETS<br/><em>REAL-WORLD ACTION.</em></h2>
            <p className="cine__act-body">FireSafeX transforms a real fire extinguisher into a smart training platform powered by mixed reality, AI guidance, real-time assessment, and enterprise-ready program control.</p>
          </article>

          <article className="cine__act cine__act--3" data-act="2">
            <h2 className="cine__act-headline cine__act-headline--right">AI THAT<br/>GUIDES,<br/>TRACKS&nbsp;&amp;&nbsp;IMPROVES</h2>
            <p className="cine__act-body cine__act-body--right">From multilingual AI instruction to BLE-connected hardware, cloud sync, and live scoring, FireSafeX gives organizations one connected system for safer, smarter, and more measurable training.</p>
          </article>

          <article className="cine__act cine__act--4" data-act="3">
            <h2 className="cine__act-headline cine__act-headline--center">TRAIN. PRACTICE.<br/>ASSESS.<br/>CERTIFY.</h2>
            <p className="cine__act-body cine__act-body--center">Deploy FireSafeX across workplaces, campuses, plants, airports, and field operations with one scalable platform built for practical readiness and digital certification.</p>
            <a href="#cta" className="cine__act-cta" data-book-demo>Book a live demo <span aria-hidden="true">›</span></a>
          </article>
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
