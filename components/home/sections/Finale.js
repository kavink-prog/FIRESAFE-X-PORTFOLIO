export default function Finale() {
  return (
    <div className="finale">
      <canvas id="finaleCanvas" className="finale__canvas" aria-hidden="true"></canvas>
      <section id="cta" className="cta cta--finale">
        <div className="cta__inner">
          <h2 className="cta__title reveal">Book a live FireSafeX demonstration.</h2>
          <p className="cta__sub reveal">Bring AI-powered fire safety training to your workplace with real equipment, mixed reality practice, real-time assessment, and enterprise-ready deployment.</p>
          <div className="cta__buttons reveal">
            <a href="#cta" className="btn btn--blue" data-book-demo>Book a demo</a>
          </div>
        </div>
      </section>

      <footer className="footer footer--dark">
        <div className="footer__cols">
          <div>
            <h6>Product</h6>
            <a href="#overview">Overview</a>
            <a href="#hardware">Hardware</a>
            <a href="#ai">AI Expert</a>
            <a href="#specs">Platform</a>
          </div>
          <div>
            <h6>Solutions</h6>
            <a href="#workflow">How it works</a>
            <a href="#analytics">Global deployment</a>
            <a href="#industries">Industries</a>
            <a href="#cta" data-book-demo>Book a demo</a>
          </div>
          <div>
            <h6>Support</h6>
            <a href="#">Contact</a>
            <a href="#">Documentation</a>
            <a href="#">Admin portal</a>
          </div>
          <div>
            <h6>Company</h6>
            <a href="#">About</a>
            <a href="#">Press</a>
            <a href="#">Careers</a>
          </div>
        </div>
        <div className="footer__bottom">
          <small>© 2026 FireSafeX NexGen. AI-powered fire safety training ecosystem.</small>
        </div>
      </footer>
    </div>
  );
}
