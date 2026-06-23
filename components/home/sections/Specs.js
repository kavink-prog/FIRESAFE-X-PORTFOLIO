export default function Specs() {
  return (
    <section id="specs" className="specs">
      <div className="specs__inner">
        <p className="eyebrow reveal">What's inside</p>
        <h2 className="title reveal">A complete fire safety training platform,<br/><span className="grad">explained clearly.</span></h2>
        <p className="big reveal center specs__intro">FireSafeX combines theory learning, practical MR training, AI safety guidance, real-time assessment, certification records, and enterprise controls in one connected ecosystem.</p>

        <div className="specs__grid">
          <article className="spec-card reveal">
            <div className="spec-card__icon" aria-hidden="true">AI</div>
            <h5>AI guidance layer</h5>
            <p>The AI trainer explains safety steps, answers questions, and delivers accessible guidance that supports both theory learning and practical response.</p>
          </article>
          <article className="spec-card reveal">
            <div className="spec-card__icon" aria-hidden="true">BT</div>
            <h5>Bluetooth connectivity</h5>
            <p>The smart extinguisher pairs wirelessly with the headset and surrounding system, keeping deployment fast and movement cable-free.</p>
          </article>
          <article className="spec-card reveal">
            <div className="spec-card__icon" aria-hidden="true">SD</div>
            <h5>Smart extinguisher integration</h5>
            <p>The device senses pin pull, aim, squeeze, and sweep actions so practical training feels close to using a real extinguisher.</p>
          </article>
          <article className="spec-card reveal">
            <div className="spec-card__icon" aria-hidden="true">APP</div>
            <h5>Theory learning tools</h5>
            <p>Interactive modules, safety content, and guided learning workflows help trainees prepare before and during practical sessions.</p>
          </article>
          <article className="spec-card reveal">
            <div className="spec-card__icon" aria-hidden="true">EC</div>
            <h5>Connected ecosystem</h5>
            <p>Hardware, headset, AI assistant, admin controls, and digital records work together as one coordinated training platform.</p>
          </article>
          <article className="spec-card reveal">
            <div className="spec-card__icon" aria-hidden="true">CL</div>
            <h5>Cloud synchronization</h5>
            <p>Training history, settings, and records stay aligned across users and sessions so programs can scale with consistency.</p>
          </article>
          <article className="spec-card reveal">
            <div className="spec-card__icon" aria-hidden="true">RT</div>
            <h5>Real-time assessment</h5>
            <p>Every critical action is captured during training, enabling live feedback, measurable scoring, and stronger instructor visibility.</p>
          </article>
          <article className="spec-card reveal">
            <div className="spec-card__icon" aria-hidden="true">DX</div>
            <h5>Certification &amp; records</h5>
            <p>Competency-based digital certification and structured records support reviews, compliance workflows, and enterprise follow-up.</p>
          </article>
          <article className="spec-card reveal">
            <div className="spec-card__icon" aria-hidden="true">UX</div>
            <h5>Enterprise readiness</h5>
            <p>Offline operation, multilingual support, compliance-focused workflows, and admin controls make the platform ready for global organizations.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
