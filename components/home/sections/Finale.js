import { SITE_CONTENT } from '@/data/site-content';

export default function Finale() {
  const { closing, hero } = SITE_CONTENT;
  return (
    <div className="finale">
      <canvas id="finaleCanvas" className="finale__canvas" aria-hidden="true"></canvas>
      <section id="cta" className="cta cta--finale">
        <div className="cta__inner">
          <p className="eyebrow reveal">{closing.title}</p>
          <h2 className="cta__title reveal">{closing.subtitle}</h2>
          <p className="cta__sub reveal">{hero.statement}</p>
          <div className="cta__buttons reveal">
            <a href="#cta" className="btn btn--blue" data-book-demo>{closing.cta}</a>
            <a href="mailto:hello@firesafex.ai" className="link">Contact <span aria-hidden="true">›</span></a>
          </div>
        </div>
      </section>

      <footer className="footer footer--dark">
        <div className="footer__cols">
          <div>
            <h6>{SITE_CONTENT.productOverview.title}</h6>
            {SITE_CONTENT.productOverview.items.map((item) => (
              <a href={`#overview-${item.id}`} key={item.id}>{item.title}</a>
            ))}
          </div>
          <div>
            <h6>{SITE_CONTENT.solutionFeatures.title}</h6>
            <a href="#solution">{SITE_CONTENT.connectedSolution.title}</a>
            <a href="#features">{SITE_CONTENT.solutionFeatures.title}</a>
            <a href="#package">{SITE_CONTENT.package.title}</a>
          </div>
          <div>
            <h6>{SITE_CONTENT.enterprise.title}</h6>
            <a href="#platform">{SITE_CONTENT.enterprise.title}</a>
            <a href="#workflow">{SITE_CONTENT.workflow.title}</a>
            <a href="#learning">{SITE_CONTENT.learning.title}</a>
            <a href="#outcomes">{SITE_CONTENT.outcomes.title}</a>
          </div>
          <div>
            <h6>{SITE_CONTENT.industries.title}</h6>
            <a href="#industries">{SITE_CONTENT.industries.subtitle}</a>
            <a href="#about">{SITE_CONTENT.about.label}</a>
            <a href="#cta" data-book-demo>{closing.cta}</a>
            <a href="mailto:hello@firesafex.ai">Contact</a>
          </div>
        </div>
        <div className="footer__bottom">
          <small>© 2026 FireSafeX. {hero.category}.</small>
        </div>
      </footer>
    </div>
  );
}
