import MediaGallery from '@/components/media/MediaGallery';
import { SITE_CONTENT } from '@/data/site-content';

export default function Platform() {
  const enterprise = SITE_CONTENT.enterprise;
  return (
    <section id="platform" className="enterprise-section">
      <div className="enterprise-section__inner">
        <header className="document-section-head document-section-head--center reveal">
          <p className="eyebrow">08</p>
          <h2 className="title">{enterprise.title}</h2>
          <h3>{enterprise.subtitle}</h3>
          <p className="big center">{enterprise.intro}</p>
        </header>

        <div className="enterprise-section__layout">
          <MediaGallery
            items={[]}
            variant="enterprise"
            label="Enterprise Training media"
            placeholderCount={4}
          />
          <div className="enterprise-section__content">
            <div className="enterprise-section__availability reveal">
              <h3>{enterprise.availability}</h3>
              <p>{enterprise.availabilityCopy}</p>
            </div>
            <div className="enterprise-section__points">
              {enterprise.points.map(([title, copy], index) => (
                <article className="reveal" key={title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div><h3>{title}</h3><p>{copy}</p></div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

