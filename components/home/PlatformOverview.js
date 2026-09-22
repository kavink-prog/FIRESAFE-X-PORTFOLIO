import ResponsiveImage from './ResponsiveImage';
const root = '/assets/images/firesafe-x_eco-system/';
const features = [
  {
    id: 'hardware',
    label: 'Connected equipment',
    title: 'Real equipment.\nA more natural response.',
    copy: 'Practise with a zero-pressure smart extinguisher and a Meta XR headset. Physical actions connect directly with the immersive training experience.',
    image: '/assets/images/brochure-web/equipment.webp',
    alt: 'FireSafeX smart extinguisher and Meta Quest headset',
    points: [
      'Trigger sensing and gesture tracking',
      'Wireless Bluetooth connection',
      'Portable, with up to two weeks of battery use',
    ],
    hardware: true,
  },
  {
    id: 'guidance',
    label: 'Multilingual training + AI guidance',
    title: 'Learn in the language\nyou know best.',
    copy: 'Ask questions and receive guidance from the AI safety assistant. Both the app and assistant support the same five languages.',
    image: root + 'firesafex-08-ask-the-expert-intro.webp',
    alt: 'Ask the Expert entry screen in the FireSafeX application',
    languages: true,
    caption: 'Access expert guidance inside FireSafeX',
  },
  {
    id: 'simulation',
    label: 'Immersive practice',
    title: 'See the situation.\nPractise your response.',
    copy: 'Train in realistic 3D environments with multiple fire classes and guided, step-by-step learning. Build familiarity without staging a live-fire event.',
    image: '/assets/images/responsive/event-19-720.webp',
    alt: 'Instructor presenting a FireSafeX training scenario to a classroom',
    points: [
      'Factory and warehouse scenarios',
      'Office and oil & gas environments',
      'Guided learning in familiar languages',
    ],
    caption: 'A training scenario shared with a classroom',
  },
  {
    id: 'results',
    label: 'Measurable readiness',
    title: 'Make every session\na step forward.',
    copy: 'Manage users and teams, assess competency and maintain organised records across sites. See what went well and where more practice is needed.',
    image: root + 'firesafex-06-training-performance-results.webp',
    alt: 'Example performance report from a FireSafeX training session',
    points: [
      'Smart assessments and digital certification',
      'Participation and completion tracking',
      'Structured, audit-ready records and multi-site management',
    ],
    caption: 'Example session results—not an organisation-wide score',
  },
];
export default function PlatformOverview() {
  return (
    <div className="lab-features">
      {features.map((item) => (
        <article
          key={item.id}
          className={`lab-feature ${item.hardware ? 'lab-feature-hardware' : ''}`}
        >
          <figure className="lab-feature-visual">
            <ResponsiveImage
              src={item.image}
              alt={item.alt}
              width={item.hardware ? 700 : 1600}
              height={item.hardware ? 830 : 900}
              loading="lazy"
            />
            {item.caption ? <figcaption>{item.caption}</figcaption> : null}
          </figure>
          <div className="lab-feature-copy">
            <span className="fx-kicker">{item.label}</span>
            <h3>
              {item.title.split('\n').map((line, i) => (
                <span key={line}>
                  {i ? <br /> : null}
                  {line}
                </span>
              ))}
            </h3>
            <p>{item.copy}</p>
            {item.points ? (
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            ) : null}
            {item.languages ? (
              <div className="lab-language-list">
                <span lang="en">English</span>
                <span lang="hi">हिन्दी</span>
                <span lang="ta">தமிழ்</span>
                <span lang="te">తెలుగు</span>
                <span lang="kn">ಕನ್ನಡ</span>
              </div>
            ) : null}
            {item.hardware ? (
              <details className="lab-equipment-detail">
                <summary>See how the equipment connects</summary>
                <p>
                  Position the equipment, pair it with the mobile app, and begin
                  training. The comfortable Meta XR headset supports
                  interactive, multilingual learning. Move the kit between
                  departments and sites.
                </p>
                <ResponsiveImage
                  src={root + 'firesafex-02-device-connected.webp'}
                  alt="FireSafeX screen confirming a successful device connection"
                  width="1600"
                  height="900"
                  loading="lazy"
                />
              </details>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
