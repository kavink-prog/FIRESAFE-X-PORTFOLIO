import { SITE_CONTENT } from '@/data/site-content';

export default function Package() {
  const packageContent = SITE_CONTENT.package;
  return (
    <section id="package" className="package-section">
      <div className="package-section__inner">
        <header className="document-section-head document-section-head--center reveal">
          <p className="eyebrow">07</p>
          <h2 className="title">{packageContent.title}</h2>
          <p className="big center">{packageContent.subtitle}</p>
        </header>
        <div className="package-section__grid">
          {packageContent.items.map((item, index) => (
            <article className="package-card reveal" key={item.title}>
              <div className="package-card__visual" aria-hidden="true">
                <span>{index === 0 ? 'MR' : 'BT'}</span><i></i><i></i>
              </div>
              <span className="package-card__num">7.{index + 1}</span>
              <h3>{item.title}</h3>
              <h4>{item.subtitle}</h4>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

