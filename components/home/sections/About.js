import MediaGallery from '@/components/media/MediaGallery';
import { EVENT_MEDIA } from '@/data/media-content';
import { SITE_CONTENT } from '@/data/site-content';

export default function About() {
  const about = SITE_CONTENT.about;
  return (
    <section id="about" className="about-document">
      <div className="about-document__inner">
        <div className="about-document__copy reveal">
          <p className="eyebrow">{about.label}</p>
          <h2 className="title">{about.title}</h2>
          {about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <MediaGallery
          items={EVENT_MEDIA}
          variant="event"
          label="FireSafeX event media"
        />
      </div>
    </section>
  );
}
