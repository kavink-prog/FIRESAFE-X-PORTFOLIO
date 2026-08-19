import Image from 'next/image';
import assessmentImage from '@/public/assets/images/Event/live-practical-assessment.webp';

const METRICS = [
  ['Response sequence', 'Review completion of pull, aim, squeeze, and sweep actions.'],
  ['Action timing', 'Understand how the trainee progresses through the practical response.'],
  ['Aim and movement', 'Capture movement data that supports practical technique review.'],
  ['Session result', 'Bring feedback, scoring, and completion status into one training record.'],
];

export default function Assessment() {
  return (
    <section id="assessment" className="assessment-story">
      <div className="assessment-story__inner">
        <div className="assessment-story__copy">
          <p className="eyebrow reveal">Practical assessment</p>
          <h2 className="title reveal">Measure more than<br/><span className="grad">course completion.</span></h2>
          <p className="big reveal">FireSafeX connects observed response actions with session feedback and structured records, giving instructors and safety teams clearer evidence of practical performance.</p>
          <a className="link reveal" href="#platform">See the enterprise platform <span aria-hidden="true">›</span></a>
        </div>

        <div className="assessment-story__panel reveal" aria-label="Example FireSafeX assessment view">
          <div className="assessment-story__panel-head">
            <span><i></i> Live practical session</span>
            <small>INSTRUCTOR VIEW</small>
          </div>
          <div className="assessment-story__media">
            <Image
              src={assessmentImage}
              alt="Trainee using FireSafeX headset and smart extinguisher during an instructor-led assessment"
              className="assessment-story__image"
              sizes="(max-width: 980px) 90vw, 58vw"
              loading="lazy"
            />
            <div className="assessment-story__media-overlay">
              <strong>Training in action</strong>
              <div>
                <span>Physical handling</span>
                <span>Observed actions</span>
                <span>Instructor review</span>
              </div>
            </div>
          </div>
          <div className="assessment-story__flow" aria-label="Assessment workflow">
            <span>Observed action</span><i aria-hidden="true">→</i>
            <span>Live feedback</span><i aria-hidden="true">→</i>
            <span>Training record</span>
          </div>
          <div className="assessment-story__metrics">
            {METRICS.map(([title, copy], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{title}</h3><p>{copy}</p></div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
