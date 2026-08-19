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
          <span className="cine__rail-label" data-rail="0">FireSafeX</span>
          <span className="cine__rail-label" data-rail="1">Connected training</span>
          <span className="cine__rail-label" data-rail="2">Measured skill</span>
          <span className="cine__rail-label" data-rail="3">Enterprise readiness</span>
          <span className="cine__rail-mark cine__rail-mark--end"></span>
        </aside>

        <div className="cine__marquee cine__marquee--top" aria-hidden="true">
          <div className="cine__marquee-track">
            <span>REAL EQUIPMENT · MIXED REALITY · INTELLIGENT GUIDANCE · MEASURABLE PERFORMANCE · </span>
            <span>REAL EQUIPMENT · MIXED REALITY · INTELLIGENT GUIDANCE · MEASURABLE PERFORMANCE · </span>
            <span>REAL EQUIPMENT · MIXED REALITY · INTELLIGENT GUIDANCE · MEASURABLE PERFORMANCE · </span>
          </div>
        </div>
        <div className="cine__marquee cine__marquee--bottom" aria-hidden="true">
          <div className="cine__marquee-track">
            <span>TRAIN · PRACTICE · ASSESS · CERTIFY · FIRE SAFETY READINESS · </span>
            <span>TRAIN · PRACTICE · ASSESS · CERTIFY · FIRE SAFETY READINESS · </span>
            <span>TRAIN · PRACTICE · ASSESS · CERTIFY · FIRE SAFETY READINESS · </span>
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
            <img
              src="/assets/sequences/hero/desktop/0001.webp"
              srcSet="/assets/sequences/hero/mobile/0001.webp 540w, /assets/sequences/hero/desktop/0001.webp 900w"
              sizes="(max-width: 720px) 540px, 900px"
              alt="FireSafeX smart fire extinguisher training device"
              className="cine__poster"
            />
            <div id="heroLoader" className="cine__loader" aria-hidden="true"><span></span></div>
          </div>

          <div className="cine__shadow" aria-hidden="true"></div>
        </div>

        <div className="cine__title-wrap" aria-hidden="true">
          <div className="cine__title">FIRE<span className="cine__title-x">SAFE</span>X</div>
          <p className="cine__subtitle">NEXGEN</p>
        </div>

        <div className="cine__acts">
          <article className="cine__act cine__act--1" data-act="0">
            <p className="cine__act-eyebrow">FireSafeX NexGen</p>
            <h1 className="cine__act-title">AI-powered fire safety training.<br/><em>Train the response. Measure the skill.</em></h1>
            <p className="cine__act-copy">FireSafeX combines real extinguisher equipment, mixed reality practice, intelligent guidance, and measurable assessment for organizations that need scalable fire safety training.</p>
            <div className="cine__act-ctas">
              <a href="#cta" className="btn btn--blue" data-book-demo>Book a demo</a>
              <a href="#product" className="link">Explore the product <span aria-hidden="true">›</span></a>
            </div>
          </article>

          <article className="cine__act cine__act--2" data-act="1">
            <h2 className="cine__act-headline">PRACTICAL<br/>TRAINING NEEDS<br/><em>MORE THAN THEORY.</em></h2>
            <p className="cine__act-body">FireSafeX connects physical extinguisher handling with repeatable mixed reality scenarios, helping trainees turn safety knowledge into observable response skills.</p>
          </article>

          <article className="cine__act cine__act--3" data-act="2">
            <h2 className="cine__act-headline cine__act-headline--right">GUIDANCE.<br/>ACTION.<br/>MEASUREMENT.</h2>
            <p className="cine__act-body cine__act-body--right">The smart device, MR experience, AI safety expert, assessment tools, and cloud platform work as one connected training ecosystem.</p>
          </article>

          <article className="cine__act cine__act--4" data-act="3">
            <h2 className="cine__act-headline cine__act-headline--center">TRAIN. PRACTICE.<br/>ASSESS.<br/>CERTIFY.</h2>
            <p className="cine__act-body cine__act-body--center">Move from guided learning to practical response, performance assessment, and structured digital training records in one clear workflow.</p>
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
