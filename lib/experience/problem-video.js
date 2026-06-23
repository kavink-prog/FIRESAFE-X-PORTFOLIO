/* ============================================================
   PROBLEM SECTION — split-screen video montage controller
   Cycles each side through its clips with a crossfade, lazy-
   loads sources, and only plays while the section is on-screen
   (autoplay-policy & performance friendly).
   ============================================================ */
(function () {
  const SECTION = document.getElementById('splitCompare');
  if (!SECTION) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CYCLE = 5200;   // ms each clip stays on screen
  const FADE  = 1300;   // ms crossfade (must match CSS transition)

  const controllers = [];

  SECTION.querySelectorAll('.split__media[data-montage]').forEach((media, mi) => {
    const clips = Array.from(media.querySelectorAll('.split__clip'));
    if (!clips.length) return;

    let index = 0;
    let timer = null;
    let inView = false;
    const offset = mi * 2200; // desync the two sides

    const load = (clip) => {
      if (!clip.getAttribute('src') && clip.dataset.src) clip.src = clip.dataset.src;
    };
    const play = (clip) => {
      load(clip);
      const p = clip.play();
      if (p && p.catch) p.catch(() => {});
    };

    const advance = () => {
      const current = clips[index];
      const next = clips[(index + 1) % clips.length];
      load(next);
      try { next.currentTime = 0; } catch (e) {}
      play(next);
      next.classList.add('is-active');
      current.classList.remove('is-active');
      setTimeout(() => {
        if (!current.classList.contains('is-active')) current.pause();
      }, FADE);
      index = (index + 1) % clips.length;
    };

    const start = () => {
      if (!inView) return;
      play(clips[index]);
      if (reduce || timer) return;
      timer = setInterval(advance, CYCLE);
    };
    const stop = () => {
      clearInterval(timer);
      timer = null;
      clips.forEach((c) => c.pause());
    };

    controllers.push({
      enter: () => { inView = true; setTimeout(start, offset); },
      leave: () => { inView = false; stop(); },
    });
  });

  if (!controllers.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) controllers.forEach((c) => c.enter());
      else controllers.forEach((c) => c.leave());
    });
  }, { threshold: 0.2 });

  io.observe(SECTION);
})();
