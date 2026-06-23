const FEATURES = [
  {
    id: 'portable',
    className: 'hardware-experience__spec--one',
    title: 'Portable Design',
    copy:
      'Lightweight and easy to carry anywhere with an ergonomic fire extinguisher training device design.',
  },
  {
    id: 'bluetooth',
    className: 'hardware-experience__spec--two',
    title: 'Wireless Bluetooth Connection',
    copy:
      'Fast and reliable Bluetooth connectivity for seamless VR/mobile integration.',
  },
  {
    id: 'battery',
    className: 'hardware-experience__spec--three',
    title: 'Type-C Rechargeable Battery',
    copy:
      'Convenient USB Type-C charging with long-lasting battery support.',
  },
  {
    id: 'realistic',
    className: 'hardware-experience__spec--four',
    title: 'Realistic Fire Extinguisher Hardware',
    copy:
      'Extended hose design with realistic discharge interaction and smart IoT-enabled features.',
  },
  {
    id: 'feedback',
    className: 'hardware-experience__spec--five',
    title: 'Smart Training Feedback',
    copy:
      'Provides instant response and feedback during VR fire safety training sessions.',
  },
];

export default function Hardware() {
  return (
    <section id="hardware" className="hardware-experience">
      <div className="hardware-experience__bg" aria-hidden="true">
        <span className="hardware-experience__beam hardware-experience__beam--left"></span>
        <span className="hardware-experience__beam hardware-experience__beam--right"></span>
        <span className="hardware-experience__grid"></span>
      </div>

      <div className="hardware-experience__header">
        <p className="eyebrow reveal">Tactile hardware integration</p>
        <h2 className="title reveal">
          Real weight.
          <br />
          <span className="grad">Wireless intelligence.</span>
        </h2>
        <p className="big reveal">
          FireSafeX combines realistic extinguisher handling, seamless wireless connectivity, and smart feedback in one
          portable training device built for immersive fire safety practice.
        </p>
        <div className="hardware-experience__actions reveal">
          <button type="button" className="btn btn--blue" data-book-demo>
            Book Now
          </button>
        </div>
      </div>

      <div className="hardware-experience__scroller">
        <div className="hardware-experience__sticky">
          <div className="hardware-experience__layout">
            {FEATURES.slice(0, 2).map((feature) => (
              <article key={feature.id} className={`hardware-experience__spec ${feature.className} reveal`}>
                <b>{feature.title}</b>
                <span>{feature.copy}</span>
              </article>
            ))}

            <div className="hardware-experience__stage-wrap">
              <div className="hardware-experience__stage reveal-img" id="hardwareStage">
                <span className="hardware-experience__halo hardware-experience__halo--outer"></span>
                <span className="hardware-experience__halo hardware-experience__halo--inner"></span>
                <canvas id="hardwareCanvas" className="hardware-experience__canvas" aria-hidden="true"></canvas>
                <img
                  src="/assets/sequences/hardware/ezgif-frame-001.jpg"
                  alt="FireSafeX hardware with extended hose and IoT integration"
                  className="hardware-experience__poster"
                />
                <div className="hardware-experience__floor" aria-hidden="true"></div>
                <div className="hardware-experience__glow" aria-hidden="true"></div>
              </div>

              <article className="hardware-experience__spec hardware-experience__spec--five reveal">
                <b>{FEATURES[4].title}</b>
                <span>{FEATURES[4].copy}</span>
              </article>
            </div>

            {FEATURES.slice(2, 4).map((feature) => (
              <article key={feature.id} className={`hardware-experience__spec ${feature.className} reveal`}>
                <b>{feature.title}</b>
                <span>{feature.copy}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
