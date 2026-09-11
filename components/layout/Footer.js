import { CLIENT_VISITS } from '@/data/story-content';

export default function Footer() {
  return (
    <footer className="story-footer">
      <div className="story-footer__proof">
        <div className="story-footer__proof-heading">
          <span>FireSafeX in the Field</span>
          <p>Selected training visits and demonstrations.</p>
        </div>
        <div className="story-footer__proof-rail" aria-label="FireSafeX organization visits">
          {CLIENT_VISITS.map((visit) => (
            <article className="story-footer__proof-card" key={visit.name}>
              <img src={visit.image} alt={visit.alt} loading="lazy" decoding="async" />
              <span>{visit.name}</span>
            </article>
          ))}
        </div>
      </div>

      <div className="story-footer__inner">
        <a className="story-footer__brand" href="#nexgen" aria-label="Back to FireSafeX NexGen">
          <img src="/icons/apple-touch-icon.png" alt="" width="34" height="34" decoding="async" />
          <span>FireSafe<strong>X</strong><small>NexGen</small></span>
        </a>

        <nav className="story-footer__nav" aria-label="Footer navigation">
          <a href="#nexgen">Home</a>
          <a href="#solution-features">How It Works</a>
          <a href="#workplace">07 / 07 Ready to Train for Real?</a>
        </nav>

        <p>© 2026 FireSafeX</p>
      </div>
    </footer>
  );
}
