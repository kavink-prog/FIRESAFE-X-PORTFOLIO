import { SITE_CONTENT } from '@/data/site-content';

export default function Solution() {
  const solution = SITE_CONTENT.connectedSolution;
  return (
    <section id="solution" className="connected-solution">
      <div className="connected-solution__inner">
        <div className="connected-solution__intro reveal">
          <p className="eyebrow">Our Solution: FireSafeX</p>
          <h2 className="title">{solution.title}</h2>
          <p className="connected-solution__flow">{solution.flow}</p>
          <p className="big">{solution.lead}</p>
        </div>
        <ol className="connected-solution__list">
          {solution.points.map((point, index) => (
            <li className="reveal" key={point}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{point}</strong>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

