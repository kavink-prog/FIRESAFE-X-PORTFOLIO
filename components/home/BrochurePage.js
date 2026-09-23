import ResponsiveImage from './ResponsiveImage';
import TrainingExplorer from './TrainingExplorer';
import HeroExperience from './HeroExperience';
import PlatformOverview from './PlatformOverview';

const trainingMethods = [
  {
    title: 'Traditional Training Method',
    image: '/assets/images/enhanced-real/traditional.webp',
    alt: 'AI-enhanced event photograph of an instructor and employees in a classroom session',
  },
  {
    title: 'VR Fire Safety Training',
    image: '/assets/images/stock/vr-headset-controllers.webp',
    alt: 'Person wearing a VR headset and holding two motion controllers in a workspace',
  },
  {
    title: 'Our Solution: FireSafeX',
    image: '/assets/images/firesafe-x_outerpov/firesafex-outdoor-mixed-reality-training.webp',
    alt: 'FireSafeX outdoor practice with a physical extinguisher and mixed reality headset',
  },
];
const setupSteps = [
  ['Deploy', 'Position your FireSafeX equipment.', '/assets/images/enhanced-real/deploy-equipment.webp', 'AI-enhanced product photo of the FireSafeX smart extinguisher and larger training shell on a tabletop'],
  ['Connect', 'Pair the kit with the mobile app.', '/assets/images/firesafe-x_eco-system/firesafex-01-device-connection.webp', 'FireSafeX device connection screen'],
  ['Configure', 'Add teams, languages and settings.', '/assets/images/enhanced-real/configure.webp', 'AI-enhanced event photograph of a team with a laptop, headset and training equipment'],
  ['Go live', 'Begin employee training.', '/assets/images/events/event-10.webp', 'Employee wearing a headset as an instructor introduces training to a workplace team'],
];

const comparisons = [
  ['Classroom / theoretical learning', 'Immersive, interactive experience'],
  ['Limited practical exposure', 'Hands-on smart equipment'],
  ['Language-limited delivery', 'Multilingual app and AI assistant'],
  ['Periodic, fixed sessions', 'Portable, repeatable training on demand'],
  ['Manual evaluation', 'Smart assessments with measurable results'],
  ['Scattered paperwork', 'Structured digital records'],
  ['Attendance tracking', 'Employee-level competency tracking'],
  ['Basic compliance', 'Audit-ready reports and continuous improvement'],
];
function Brand() {
  return (
    <a className="fx-brand" href="#home" aria-label="FireSafeX home">
      <ResponsiveImage src="/icons/FiresafeX%20logo%20Corporate.webp" width="2172" height="724" alt="FireSafeX" />
    </a>
  );
}
function BenefitIcon({ type }) {
  const paths = {
    immersive: <><path d="M4 8h16v9h-5l-3-3-3 3H4z" /><path d="M8 11h1m6 0h1M2 10v5m20-5v5" /></>,
    languages: <><path d="M3 5h11M8 3v2M5 5c0 5 4 8 8 9M12 5c0 5-4 8-9 10M14 21l4-11 4 11M16 17h4" /></>,
    portable: <><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V4h8v3M3 12h18M10 12v3h4v-3" /></>,
    battery: <><rect x="2" y="6" width="18" height="12" rx="2" /><path d="M22 10v4M6 9v6m4-6v6m4-6v6" /></>,
  };
  return <svg className="fx-benefit-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>;
}
function DemoButton({ children = 'Book a live demo', light = false }) {
  return (
    <button
      className={`fx-button ${light ? 'fx-button-light' : ''}`}
      type="button"
      data-book-demo
    >
      {children}
    </button>
  );
}
export default function BrochurePage() {
  return (
    <div className="fx-site">
      <a href="#main" className="fx-skip">
        Skip to content
      </a>
      <header className="fx-nav">
        <Brand />
        <nav aria-label="Main navigation">
          <a href="#experience">The experience</a>
          <a href="#platform">The platform</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#workplaces">For your team</a>
        </nav>
        <DemoButton />
      </header>
      <main id="main" tabIndex={-1}>
        <section className="fx-hero" id="home" aria-labelledby="hero-title">
          <div className="fx-hero-copy">
            <p className="fx-hero-purpose">PRACTISE · PREPARE · STAY READY 
            </p>
            <h1 id="hero-title">AI Powered Immersive Smart Fire Safety Training.</h1>
            <div className="fx-hero-introduction">
              <p>Give your team the confidence to respond. Practise with real equipment, immersive scenarios and AI guidance—before an emergency happens.</p>
              <div className="fx-actions">
                <DemoButton />
                <a className="fx-text-link" href="#experience">See how training works <span aria-hidden="true">↓</span></a>
              </div>
            </div>

          </div>
          <HeroExperience />
            <a className="fx-hero-languages" href="#multilingual">
              <span className="fx-language-mark" aria-hidden="true">Aa<span lang="ta">அ</span></span>
              <span><strong> IMMERSIVE · ITELLIGENT · MEASURABLE </strong><small>Multilingual learning, with AI guidance.</small></span>
            </a>
          <div className="fx-benefits">
            <div>
              <BenefitIcon type="immersive" />
              <p>
                <strong>Set up in one day</strong>
                <span>We complete setup at your workplace within one day.</span>
              </p>
            </div>
            <div>
              <BenefitIcon type="languages" />
              <p>
                <strong>Multilingual training</strong>
                <span>5 languages. App + AI.</span>
              </p>
            </div>
            <div>
              <BenefitIcon type="portable" />
              <p>
                <strong>Ready to go anywhere</strong>
                <span>Portable. Bluetooth connected.</span>
              </p>
            </div>
            <div>
              <BenefitIcon type="battery" />
              <p>
                <strong>Up to 2 weeks</strong>
                <span>Of use on a single charge.</span>
              </p>
            </div>
          </div>
        </section>
        <section className="fx-experience fx-wrap" id="experience">
          <div className="fx-section-heading">
            <h2>
              Confidence comes
              <br />
              from experience.
            </h2>
            <p>
              Real emergencies demand more than theory. Turn learning into a
              practical, measurable journey—from understanding the risk to
              knowing how to respond.
            </p>
          </div>
          <TrainingExplorer />
        </section>
        <section className="fx-platform" id="platform">
          <div className="fx-wrap">
            <div className="fx-section-heading">
              <h2>
                One kit.
                <br />A connected world of training.
              </h2>
              <p>
                Hardware, immersive content and intelligent software work
                together. Everything your organisation needs to build and
                measure fire safety readiness.
              </p>
            </div>
            <aside className="fx-multilingual" id="multilingual" aria-labelledby="multilingual-title">
              <div>
                <h3 id="multilingual-title">Many languages.<br />One confident team.</h3>
                <p>Multilingual training across the app and AI assistant. Learn, practise and ask questions in the language you know best. Five languages available today.</p>
              </div>
              <ul aria-label="Available languages and future additions">
                <li><span lang="en">English</span><small>English</small></li>
                <li><span lang="hi">हिन्दी</span><small>Hindi</small></li>
                <li><span lang="ta">தமிழ்</span><small>Tamil</small></li>
                <li><span lang="te">తెలుగు</span><small>Telugu</small></li>
                <li><span lang="kn">ಕನ್ನಡ</span><small>Kannada</small></li>
                <li className="fx-language-planned"><span>More languages</span><small>Planned for the future</small></li>
              </ul>
            </aside>
            <div className="fx-platform-setup">
              <div className="fx-setup-intro">
                <h3>From kit to training in four steps.</h3>
                <p>Typically set up within one working day.</p>
              </div>
              <ol className="fx-setup" aria-label="Set up FireSafeX in four steps">
                {setupSteps.map(([title, copy, image, alt], index) => (
                  <li key={title} className={`fx-setup-step fx-setup-step-${index + 1}`}>
                    <ResponsiveImage src={image} alt={alt} width="480" height="320" loading="lazy" decoding="async" />
                    <span>{index + 1}</span>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </li>
                ))}
              </ol>
              <p className="fx-support">
                Organisation-wide setup, typically within one working day. Guided
                onboarding, product support and feature updates through the FireSafeX mobile app.
              </p>
            </div>
            <section className="fx-training-comparison" aria-labelledby="training-comparison-title">
              <h2 id="training-comparison-title">Why organisations choose FireSafeX</h2>
              <div className="fx-methods">
                {trainingMethods.map((method, index) => (
                  <figure key={method.title} className="fx-method">
                    <ResponsiveImage src={method.image} alt={method.alt} width="720" height="480" loading="lazy" decoding="async" />
                    <figcaption>
                      <h3>{method.title}</h3>
                      <p>{[
                        'Instructor-led learning and classroom demonstrations.',
                        'Virtual scenarios experienced through a headset and controllers.',
                        'Physical smart equipment, immersive practice and measurable results.',
                      ][index]}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            <div className="fx-table-wrap">
              <table aria-labelledby="training-comparison-title">
                <thead>
                  <tr>
                    <th scope="col">Traditional training</th>
                    <th scope="col">With FireSafeX</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map(([a, b]) => (
                    <tr key={a}>
                      <td>{a}</td>
                      <td>
                        <span aria-hidden="true">↗</span>
                        {b}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </section>
          </div>
        </section>
        <section className="fx-platform fx-capabilities" id="capabilities" aria-labelledby="capabilities-title">
          <div className="fx-wrap">
            <div className="fx-section-heading">
              <h2 id="capabilities-title">Everything connected.<br />Every session counts.</h2>
              <p>From physical equipment to practical insights, discover the technology behind your team’s training.</p>
            </div>
            <PlatformOverview />
          </div>
        </section>
        <section className="fx-workplaces fx-wrap" id="workplaces">
          <div className="fx-section-heading">
            <h2>
              A stronger culture
              <br />
              of safety starts here.
            </h2>
            <p>
              Safer workplaces. Confident employees. Measurable readiness. Move
              beyond one-time training to continuous fire safety competency.
            </p>
          </div>
          <div className="fx-work-grid">
            <div>
              <h3>
                Built for the places
                <br />
                where readiness matters.
              </h3>
              <p>
                For EHS / HSE teams and organisations working in high-risk and
                high-responsibility environments.
              </p>
              <div className="fx-industries">
                {[
                  'Manufacturing',
                  'Oil & gas',
                  'Warehousing & logistics',
                  'Healthcare',
                  'Hospitality',
                  'Education',
                  'Infrastructure',
                  'Commercial facilities',
                ].map((x) => (
                  <span key={x}>{x}</span>
                ))}
              </div>
              <figure className="fx-workplace-visual">
                <ResponsiveImage
                  src="/assets/images/brochure-web/workplaces.webp"
                  width="1200"
                  height="800"
                  loading="lazy"
                  alt="Illustration of office, factory and warehouse teams connected through a training platform"
                />
                <figcaption>
                  Connected training across workplaces · Illustration
                </figcaption>
              </figure>
              <blockquote>
                “Practical. Engaging. Effective.”
                <p>“Our teams felt more confident after the FireSafeX demo.”</p>
                <cite>
                  Industrial Safety Leader, CII Puducherry Event
                  <br />
                  As featured in the FireSafeX brochure
                </cite>
              </blockquote>
            </div>

          </div>
        </section>
        <section className="fx-start" id="contact">
          <div className="fx-wrap">
            <div className="fx-cta">
              <div>
                <h2>
                  Let’s build safer
                  <br />
                  workplaces together.
                </h2>
                <p>
                  Experience FireSafeX with a live demo. Talk to us about a
                  pilot or partnership.
                </p>
                <DemoButton light />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="fx-footer fx-wrap">
        <div className="fx-footer-top">
          <div className="fx-footer-company">
            <a className="fx-footer-product-logo" href="#home" aria-label="FireSafeX home">
              <ResponsiveImage src="/icons/FiresafeX%20logo%20Corporate.webp" alt="FireSafeX" width="2172" height="724" loading="lazy" />
            </a>
            <p>
              FireSafeX is a product of ImmersiveX Technologies Pvt Ltd.,
              a subsidiary of Mako IT Lab Pvt Limited.
            </p>
            <div className="fx-footer-company-logos" aria-label="Our companies">
              <ResponsiveImage src="/icons/ImmseriveX%20logo%205.webp" alt="ImmersiveX" width="2172" height="724" loading="lazy" />
              <ResponsiveImage src="/icons/makor%20logo%20new.webp" alt="Mako IT Lab" width="930" height="193" loading="lazy" />
            </div>
            <span className="fx-footer-signoff">
              Engineering intelligence.
              <br />
              Designing a safer tomorrow.
            </span>
          </div>
          <div>
            <h3>Let’s talk</h3>
            <p>Mahendra Vadivelu · Director</p>
            <a href="mailto:mahendra@firesafex.ai">mahendra@firesafex.ai</a>
            <a href="tel:+919884422175">+91 98844 22175</a>
            <p>Karthik KPN · Director</p>
            <a href="mailto:karthik.kpn@firesafex.ai">
              karthik.kpn@firesafex.ai
            </a>
            <a href="tel:+919600019678">+91 9600019678</a>
          </div>
          <div>
            <h3>Find us</h3>
            <address>
              8th Floor, Phase II, Ticel Bio Park,
              <br />
              CSIR Road, Tharamani,
              <br />
              Chennai 600113, India
            </address>
            <a href="/downloads/FireSafeX-Brochure-2026.pdf" download>
              Download the brochure <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <div className="fx-footer-bottom">
          <span>© 2026 FireSafeX. All rights reserved.</span>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
    </div>
  );
}
