export default function Workflow() {
  return (
    <section id="workflow" className="feature feature--light">
      <div className="feature__inner">
        <p className="eyebrow reveal">How it works</p>
        <h2 className="title reveal">Train. Practice.<br/><span className="red">Assess. Certify.</span></h2>

        <div className="steps steps--four">
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
            <p>Build foundational knowledge through theory learning, onboarding, and AI-supported safety guidance.</p>
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
            <p>Respond to mixed reality fire scenarios with a physical extinguisher training device and repeat key actions.</p>
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
            <h4>Assess</h4>
            <p>Review captured actions, session feedback, and performance results to understand practical competency.</p>
          </div>
          <div className="step reveal">
            <div className="step__visual">
              <svg className="step__icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 10h28v44H18z"/><path d="M25 28l5 5 10-11"/><path d="M25 42h14"/>
              </svg>
              <span className="step__pulse step__pulse--success"></span>
            </div>
            <div className="step__num">4</div>
            <h4>Certify</h4>
            <p>Maintain digital completion records and support structured certification workflows across the training program.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
