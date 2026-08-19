export default function Finale() {
  return (
    <div className="finale">
      <canvas id="finaleCanvas" className="finale__canvas" aria-hidden="true"></canvas>
      <section id="cta" className="cta cta--finale">
        <div className="cta__inner">
          <p className="eyebrow reveal">Build practical fire safety readiness</p>
          <h2 className="cta__title reveal">Train the response. Measure the skill. Build readiness.</h2>
          <p className="cta__sub reveal">Explore how FireSafeX can bring together practical equipment, mixed reality training, intelligent guidance, assessment, and enterprise program visibility for your organization.</p>
          <div className="cta__buttons reveal">
            <a href="#cta" className="btn btn--blue" data-book-demo>Book a FireSafeX demo</a>
            <a href="mailto:hello@firesafex.ai" className="link">Talk to our team <span aria-hidden="true">›</span></a>
          </div>
        </div>
      </section>

      <footer className="footer footer--dark">
        <div className="footer__cols">
          <div>
            <h6>Product</h6>
            <a href="#product">Smart extinguisher</a>
            <a href="#overview">Mixed reality</a>
            <a href="#overview">AI safety expert</a>
            <a href="#assessment">Assessment</a>
          </div>
          <div>
            <h6>Solutions</h6>
            <a href="#workflow">How it works</a>
            <a href="#platform">Enterprise platform</a>
            <a href="#global-readiness">Global readiness</a>
            <a href="#industries">Industries</a>
            <a href="#cta" data-book-demo>Book a demo</a>
          </div>
          <div>
            <h6>Ecosystem</h6>
            <a href="#ecosystem">Connected system</a>
            <a href="#platform">Dashboard and analytics</a>
            <a href="#platform">Certification records</a>
          </div>
          <div>
            <h6>Company</h6>
            <a href="#about">About FireSafeX</a>
            <a href="mailto:hello@firesafex.ai">Contact</a>
            <a href="#cta" data-book-demo>Book a demo</a>
          </div>
        </div>
        <div className="footer__bottom">
          <small>© 2026 FireSafeX. AI-powered fire safety training ecosystem.</small>
        </div>
      </footer>
    </div>
  );
}
