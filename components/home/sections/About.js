export default function About() {
  return (
    <section id="about" className="about-story">
      <div className="about-story__inner">
        <p className="eyebrow reveal">About FireSafeX</p>
        <div className="about-story__grid">
          <h2 className="title reveal">Turning fire safety knowledge<br/><span className="grad">into practical readiness.</span></h2>
          <div className="about-story__copy reveal">
            <p>FireSafeX exists to close the gap between learning a fire response procedure and demonstrating it in practice.</p>
            <p>Our product approach connects physical interaction, immersive simulation, intelligent guidance, measurable assessment, and enterprise training management in one ecosystem.</p>
            <a className="link" href="#cta" data-book-demo>Discuss your training needs <span aria-hidden="true">›</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}
