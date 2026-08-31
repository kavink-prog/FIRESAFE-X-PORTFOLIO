import { SITE_CONTENT } from '@/data/site-content';

export default function Workflow() {
  const workflow = SITE_CONTENT.workflow;
  return (
    <section id="workflow" className="workflow-section">
      <div className="workflow-section__inner">
        <header className="document-section-head document-section-head--center reveal">
          <p className="eyebrow">{workflow.title}</p>
          <h2 className="title">{workflow.subtitle}</h2>
          <p className="big center">{workflow.intro}</p>
        </header>
        <div className="workflow-section__steps">
          {workflow.items.map((item, index) => (
            <article className="workflow-step reveal" key={item.title}>
              <div className="workflow-step__top">
                <span className="workflow-step__num">9.{index + 1}</span>
                <div className="workflow-step__marker" aria-hidden="true"><i></i></div>
              </div>
              <h3>{item.title}</h3>
              <h4>{item.subtitle}</h4>
              {item.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <span className="workflow-step__index" aria-hidden="true">0{index + 1}</span>
            </article>
          ))}
        </div>
        <p className="workflow-section__flow reveal">{workflow.flow}</p>
      </div>
    </section>
  );
}
