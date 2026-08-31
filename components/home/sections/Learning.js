import { SITE_CONTENT } from '@/data/site-content';

export default function Learning() {
  const learning = SITE_CONTENT.learning;
  return (
    <section id="learning" className="learning-section">
      <div className="learning-section__inner">
        <header className="document-section-head reveal">
          <p className="eyebrow">10</p>
          <h2 className="title">{learning.title}</h2>
          <h3>{learning.subtitle}</h3>
          <p className="big">{learning.intro}</p>
        </header>
        <div className="learning-section__grid">
          {learning.items.map(([title, copy, flow], index) => (
            <article className="learning-card reveal" key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              {flow ? <strong>{flow}</strong> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

