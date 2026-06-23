/* ============================================
   FireSafeX — Non-scroll utilities
   (Scroll/reveal/parallax now handled by animations.js via GSAP + Lenis)
   ============================================ */

// ---------- Split titles into words for GSAP stagger ----------
document.querySelectorAll(
  '.title, .hero__title, .hero__sub, .cta__title, .split__title, .tile__title'
).forEach((el) => {
  if (el.dataset.split) return;
  // [data-lines] headings (overview / problem) use the line-mask reveal in
  // animations.js, not the per-word reveal. Word-splitting them here adds the
  // `bold-reveal` class, which pins every word at opacity:0 via
  // `.js-anim .bold-reveal .word` — and the line-mask reveal only animates line
  // position, never word opacity, so the heading stays invisible. Skip them.
  if (el.hasAttribute('data-lines')) return;
  el.dataset.split = 'true';
  el.classList.add('bold-reveal');

  const wrapWords = (node) => {
    const children = [...node.childNodes];
    children.forEach((child) => {
      if (child.nodeType === 3) {
        const text = child.textContent;
        if (!text.trim()) return;
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach((part) => {
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
          } else if (part.length) {
            const span = document.createElement('span');
            span.className = 'word';
            // Wrap inner with another span so we can clip the parent (overflow:hidden)
            const inner = document.createElement('span');
            inner.className = 'word__inner';
            inner.textContent = part;
            span.appendChild(inner);
            frag.appendChild(span);
          }
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1 && child.tagName !== 'BR') {
        wrapWords(child);
      }
    });
  };
  wrapWords(el);
});
