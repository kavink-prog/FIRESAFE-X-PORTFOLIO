export default function AIExpert() {
  return (
    <section id="ai" className="feature feature--dark feature--center">
      <div className="feature__inner ai-expert">
        <div className="ai-expert__copy reveal">
          <p className="eyebrow">Intelligence Layer</p>
          <span className="ai-expert__kicker">Guides. Assesses. Explains.</span>
          <h2 className="title">AI Safety Trainer</h2>
          <p className="big">Deliver interactive theory learning, answer trainee questions, and turn live session data into clearer guidance, stronger understanding, and better decision-making.</p>
          <div className="ai-expert__rail" aria-label="AI expert capabilities">
            <span>Interactive theory learning</span>
            <span>Context-aware guidance</span>
            <span>Real-time assessment</span>
          </div>
        </div>

        <div className="ai-expert__stage reveal-img">
          <div className="ai-expert__panel">
            <div className="ai-expert__panel-copy">
              <span className="ai-expert__panel-label">Live training support</span>
              <p>See how FireSafeX supports users with AI-powered expert guidance, practical coaching, and accessible safety learning throughout every training session.</p>
            </div>
            <div className="ai-expert__panel-stats" aria-hidden="true">
              <div>
                <b>24/7</b>
                <span>AI-guided support</span>
              </div>
              <div>
                <b>ML</b>
                <span>Multilingual guidance</span>
              </div>
            </div>
          </div>
          <div className="ai-expert__video">
            <video
              src="/assets/videos/problem/firesafex/new-4-headset.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
