const CAPABILITIES = [
  ['Dashboard', 'See training activity, progress, and program status in one management view.'],
  ['Training management', 'Organize users, sessions, learning paths, and assessment workflows.'],
  ['Analytics', 'Review performance information and identify where follow-up training is needed.'],
  ['Certification and records', 'Maintain completion history and structured digital certification records.'],
  ['Enterprise controls', 'Support role-based access, multilingual content, and centralized administration.'],
  ['Cloud synchronization', 'Keep supported training data and settings aligned across the connected ecosystem.'],
  ['User and organization management', 'Coordinate supported teams, locations, roles, and program access.'],
  ['Companion applications', 'Extend supported training and management tasks across the connected FireSafeX experience.'],
];

export default function Platform() {
  return (
    <section id="platform" className="platform-story">
      <div className="platform-story__inner">
        <div className="platform-story__head">
          <p className="eyebrow reveal">Enterprise training platform</p>
          <h2 className="title reveal">From one training session<br/><span className="muted">to organization-wide visibility.</span></h2>
          <p className="big center reveal">Manage fire safety training, assessment, records, and program access through a connected software layer built for safety teams, instructors, and enterprise administrators.</p>
        </div>

        <div className="platform-story__layout">
          <div className="platform-story__dashboard reveal" aria-label="FireSafeX platform dashboard illustration">
            <div className="platform-story__bar"><span>FireSafeX / Training overview</span><small>SYNCED</small></div>
            <div className="platform-story__dashboard-grid">
              <article className="platform-story__chart"><span>Training activity</span><div><i></i><i></i><i></i><i></i><i></i><i></i></div></article>
              <article><span>Assessment</span><strong>Review</strong><small>Session-level performance</small></article>
              <article><span>Records</span><strong>Track</strong><small>Completion and history</small></article>
              <article className="platform-story__wide"><span>Organization</span><strong>Teams · Roles · Locations</strong><small>Centralized training administration</small></article>
            </div>
          </div>

          <div className="platform-story__capabilities">
            {CAPABILITIES.map(([title, copy], index) => (
              <article className="reveal" key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{title}</h3><p>{copy}</p></div>
              </article>
            ))}
          </div>
        </div>
        <div className="platform-story__cta reveal">
          <p>See how FireSafeX can support your training program and deployment model.</p>
          <a className="btn btn--blue" href="#cta" data-book-demo>Book a platform demo</a>
        </div>
      </div>
    </section>
  );
}
