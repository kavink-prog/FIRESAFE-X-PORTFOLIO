const LAYERS = [
  ['01', 'Smart hardware', 'Capture practical extinguisher actions through a connected physical training device.'],
  ['02', 'Mixed reality', 'Place repeatable fire response scenarios within the trainee’s surrounding environment.'],
  ['03', 'AI guidance', 'Support theory learning, questions, and guided practice with an AI safety expert.'],
  ['04', 'Assessment', 'Turn response actions into visible feedback, scoring, and training outcomes.'],
  ['05', 'Cloud platform', 'Manage users, records, certification workflows, and program visibility.'],
];

export default function Solution() {
  return (
    <section id="solution" className="solution-story">
      <div className="solution-story__inner">
        <div className="solution-story__intro">
          <p className="eyebrow reveal">The FireSafeX solution</p>
          <h2 className="title reveal">One connected fire safety<br/><span className="grad">training ecosystem.</span></h2>
          <p className="big reveal">FireSafeX links the equipment trainees hold, the scenario they see, the guidance they receive, and the performance organizations need to review.</p>
          <a className="link reveal" href="#product">Explore the product experience <span aria-hidden="true">›</span></a>
        </div>

        <div className="solution-story__layers" aria-label="FireSafeX connected solution layers">
          {LAYERS.map(([num, title, copy]) => (
            <article className="solution-story__layer reveal" key={num}>
              <span>{num}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
