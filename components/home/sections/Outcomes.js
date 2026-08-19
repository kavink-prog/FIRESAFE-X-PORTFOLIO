const OUTCOMES = [
  ['Practical fire safety training', 'Connect theory with repeatable response practice using a physical training device and mixed reality scenarios.'],
  ['Fire extinguisher training', 'Help trainees practise key extinguisher actions within a guided digital session.'],
  ['Performance assessment', 'Give instructors and safety teams clearer evidence of how practical actions were performed.'],
  ['Certification workflows', 'Connect training completion, performance results, digital records, and certification activity.'],
  ['Enterprise safety training', 'Coordinate users, roles, content, assessment, and training visibility through one platform.'],
  ['Multi-location delivery', 'Support consistent programs across locations while adapting supported content by language, region, and role.'],
];

export default function Outcomes() {
  return (
    <section id="solutions" className="outcomes-story">
      <div className="outcomes-story__inner">
        <div className="outcomes-story__head">
          <p className="eyebrow reveal">Solutions and business outcomes</p>
          <h2 className="title reveal">Make practical training<br/><span className="grad">repeatable, visible, and scalable.</span></h2>
          <p className="big reveal">FireSafeX helps organizations connect individual training sessions with the wider goals of competency development, records management, and enterprise readiness.</p>
        </div>
        <div className="outcomes-story__grid">
          {OUTCOMES.map(([title, copy], index) => (
            <article className="reveal" key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
              <a href="#cta" data-book-demo>Discuss this solution <i aria-hidden="true">›</i></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
