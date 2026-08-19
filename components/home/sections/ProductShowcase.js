export default function ProductShowcase() {
  return (
    <section id="product" className="model-showcase">
      <div className="model-showcase__sticky">
        <div className="model-showcase__media">
          <canvas id="productSequenceCanvas" className="model-showcase__canvas" aria-hidden="true"></canvas>
          <img
            src="/assets/sequences/hardware/ezgif-frame-001.jpg"
            alt="FireSafeX smart fire extinguisher training device"
            className="model-showcase__poster"
          />
          <div className="model-showcase__shade" aria-hidden="true"></div>
        </div>

        <div className="model-showcase__copy model-showcase__copy--one" data-product-copy="0">
          <div className="model-showcase__copy-inner" data-product-copy-inner>
            <span>01 / Physical interaction</span>
            <h2>Meet the smart<br/>training extinguisher.</h2>
            <p>A physical training device designed to connect extinguisher handling with the digital learning experience.</p>
          </div>
        </div>
        <div className="model-showcase__copy model-showcase__copy--two" data-product-copy="1">
          <div className="model-showcase__copy-inner" data-product-copy-inner>
            <span>02 / Connected response</span>
            <h2>Actions become<br/>training data.</h2>
            <p>FireSafeX captures key response actions so trainees receive feedback and instructors gain clearer assessment evidence.</p>
          </div>
        </div>
        <div className="model-showcase__copy model-showcase__copy--three" data-product-copy="2">
          <div className="model-showcase__copy-inner" data-product-copy-inner>
            <span>03 / One ecosystem</span>
            <h2>Hardware meets<br/>mixed reality.</h2>
            <p>The device works with MR practice, AI guidance, assessment, and enterprise training management.</p>
            <a className="link" href="#overview">Explore all product capabilities <span aria-hidden="true">›</span></a>
          </div>
        </div>

        <div className="model-showcase__progress" aria-hidden="true"><span></span></div>
        <p className="model-showcase__hint" aria-hidden="true">Scroll to explore the product</p>
      </div>
    </section>
  );
}
