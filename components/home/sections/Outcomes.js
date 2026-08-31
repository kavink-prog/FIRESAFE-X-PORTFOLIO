import { SITE_CONTENT } from '@/data/site-content';

export default function Outcomes() {
  const outcomes = SITE_CONTENT.outcomes;
  return (
    <section id="outcomes" className="outcomes-document">
      <div className="outcomes-document__inner">
        <header className="document-section-head document-section-head--center reveal">
          <p className="eyebrow">11</p>
          <h2 className="title">{outcomes.title}</h2>
          <h3>{outcomes.subtitle}</h3>
          <p className="big center">{outcomes.intro}</p>
        </header>
        <div className="outcomes-document__grid">
          {outcomes.items.map(([title, copy], index) => (
            <article className="reveal" key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

