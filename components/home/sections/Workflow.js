export default function Workflow() {
  return (
    <section id="workflow" className="feature feature--light">
      <div className="feature__inner">
        <p className="eyebrow reveal">How it works</p>
        <h2 className="title reveal">Train. Practice.<br/><span className="red">Assess. Certify.</span></h2>

        <div className="steps">
          <div className="step reveal">
            <div className="step__visual">
              <svg className="step__icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 24l8-8 20 20-8 8z"/>
                <path d="M30 20l14 14"/>
                <path d="M48 16l-8 8M52 12l-4 4"/>
              </svg>
              <span className="step__pulse"></span>
            </div>
            <div className="step__num">1</div>
            <h4>Train</h4>
            <p>Start with theory learning, onboarding, and AI-led guidance. Meta Quest maps the room while the smart extinguisher pairs instantly for practical readiness.</p>
          </div>
          <div className="step reveal">
            <div className="step__visual">
              <svg className="step__icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M32 50c8-8 12-14 12-22a12 12 0 1 0-24 0c0 8 4 14 12 22z"/>
                <path d="M28 28c0-3 2-5 4-5"/>
              </svg>
              <span className="step__pulse step__pulse--fire"></span>
            </div>
            <div className="step__num">2</div>
            <h4>Practice</h4>
            <p>Users respond to mixed reality fire scenarios with a real extinguisher body, building muscle memory through pull, aim, squeeze, and sweep actions.</p>
          </div>
          <div className="step reveal">
            <div className="step__visual">
              <svg className="step__icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 50V14"/>
                <path d="M10 50h44"/>
                <path d="M16 42l10-10 8 6 12-14"/>
                <circle cx="46" cy="24" r="3"/>
              </svg>
              <span className="step__pulse step__pulse--success"></span>
            </div>
            <div className="step__num">3</div>
            <h4>Assess &amp; certify</h4>
            <p>FireSafeX scores technique, tracks completion, and generates digital records so organizations can assess competency and certify progress with clarity.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
