import ProductGallery from '@/components/home/ProductGallery';
import StoryJourney from '@/components/home/StoryJourney';
import { STORY_MEDIA, STORY_SECTIONS } from '@/data/story-content';

export default function StoryPage() {
  const intro = STORY_SECTIONS[0];
  const journey = STORY_SECTIONS.slice(1, 6);
  const finale = STORY_SECTIONS[6];
  const finaleMedia = STORY_MEDIA[finale.id][0];

  return (
    <main className="story-page">
      <section id={intro.id} className="story-intro" data-story-section>
        <div className="story-intro__sticky">
          <div className="story-intro__copy">
            <span className="story-section__number" aria-hidden="true">01 / 07</span>
            <p className="story-intro__brand">{intro.brand}</p>
            <h1>{intro.title}</h1>
            <p className="story-section__subtitle">{intro.subtitle}</p>
            <p className="story-section__body">{intro.body}</p>
            <div className="story-actions">
              <button type="button" className="story-button" data-book-demo>
                {intro.cta}
              </button>
              <a
                className="story-button story-button--secondary"
                href={intro.secondaryHref}
                download={intro.secondaryDownload}
              >
                {intro.secondaryCta}
              </a>
            </div>
          </div>

          <div className="story-intro__product">
            <ProductGallery media={STORY_MEDIA[intro.id]} priority />
          </div>

          <div className="story-intro__scroll-cue" aria-hidden="true">
            <span>Scroll to explore</span>
            <i />
          </div>
        </div>
      </section>

      <StoryJourney sections={journey} mediaBySection={STORY_MEDIA} />

      <section id={finale.id} className="story-finale" data-story-section>
        <picture className="story-finale__media">
          {finaleMedia.mobileSrc ? (
            <source media="(max-width: 900px)" srcSet={finaleMedia.mobileSrc} />
          ) : null}
          <img
            src={finaleMedia.src}
            alt={finaleMedia.alt}
            className="story-finale__image"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div className="story-finale__veil" aria-hidden="true" />
        <div className="story-finale__copy">
          <span className="story-section__number" aria-hidden="true">07 / 07</span>
          <h2>{finale.title}</h2>
          <p className="story-section__subtitle">{finale.subtitle}</p>
          <p className="story-section__body">{finale.body}</p>
          <div className="story-actions">
            <button type="button" className="story-button" data-book-demo>
              {finale.cta}
            </button>
            <a
              className="story-button story-button--secondary"
              href={finale.secondaryHref}
              download={finale.secondaryDownload}
            >
              {finale.secondaryCta}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
