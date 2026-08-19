import VIDEO_URLS from '@/data/video-urls.json';

// Resolve a local /videos/* path to its Convex storage URL, falling back to the
// local file until scripts/media/upload-videos-convex.mjs has populated the manifest.
const v = (path) => VIDEO_URLS[path] || path;

export default function Problem() {
  return (
    <section id="problem" className="problem">
      <div className="problem__bg" aria-hidden="true">
        <span className="problem__orb problem__orb--1"></span>
        <span className="problem__orb problem__orb--2"></span>
        <span className="problem__grid"></span>
      </div>

      <div className="problem__inner">
        <p className="eyebrow reveal">The problem</p>
        <h2 className="title" data-lines>Fire training is<br/><span className="red">caught between two extremes.</span></h2>
        <p className="big center reveal">Live-fire drills can be difficult to repeat at scale. Classroom-only learning may not show practical response skill, while controller-based simulations can remove the physical interaction trainees need to practise.</p>

        <div className="split reveal-img" id="splitCompare">

          <article className="split__side split__side--old" data-side="old">
            <div className="split__media" data-montage>
              <video className="split__clip is-active" muted loop playsInline preload="metadata" src={v('/assets/videos/problem/legacy/old-2-live-drill.mp4')}></video>
              <video className="split__clip" muted loop playsInline preload="none" data-src={v('/assets/videos/problem/legacy/old-1-dust.mp4')}></video>
              <video className="split__clip" muted loop playsInline preload="none" data-src={v('/assets/videos/problem/legacy/old-4-empty-air.mp4')}></video>
              <video className="split__clip" muted loop playsInline preload="none" data-src={v('/assets/videos/problem/legacy/old-3-holding.mp4')}></video>
              <video className="split__clip" muted loop playsInline preload="none" data-src={v('/assets/videos/problem/legacy/old-5-headset.mp4')}></video>
              <span className="split__scan" aria-hidden="true"></span>
              <span className="split__noise" aria-hidden="true"></span>
              <span className="split__veil split__veil--old" aria-hidden="true"></span>
            </div>
            <div className="split__content">
              <span className="split__tag split__tag--bad">Today · Broken</span>
              <h3 className="split__title">The old way.</h3>
              <ul className="split__list split__list--cross">
                <li><span>Annual or infrequent sessions</span></li>
                <li><span>Operational planning for live-fire exercises</span></li>
                <li><span>Manual records and limited assessment</span></li>
                <li><span>Classroom-only theory without practical realism</span></li>
                <li><span>Limited opportunities for repeat practice</span></li>
              </ul>
            </div>
          </article>

          <div className="split__seam" aria-hidden="true">
            <span className="split__seam-line"></span>
          </div>

          <article className="split__side split__side--new" data-side="new">
            <div className="split__media">
              <video className="split__clip is-active" muted loop autoPlay playsInline preload="metadata" src={v('/assets/videos/problem/firesafex/new-firefly-loop.mp4')}></video>
              <span className="split__veil split__veil--new" aria-hidden="true"></span>
              <span className="split__shine" aria-hidden="true"></span>
            </div>
            <div className="split__content">
              <span className="split__tag split__tag--good">With FireSafeX</span>
              <h3 className="split__title split__title--grad">The new way.</h3>
              <ul className="split__list split__list--check">
                <li><span>On-demand, reusable training</span></li>
                <li><span>Simulation without staging a live fire</span></li>
                <li><span>Real physical extinguisher handling</span></li>
                <li><span>AI assessment and digital records</span></li>
                <li><span>Theory plus practical competency building</span></li>
              </ul>
            </div>
          </article>
        </div>

        <p className="problem__solved reveal"><span className="grad">A connected alternative.</span></p>
      </div>
    </section>
  );
}
