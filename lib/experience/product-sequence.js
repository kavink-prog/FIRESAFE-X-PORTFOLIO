/* ============================================================
   PRODUCT HARDWARE FRAME SEQUENCE
   Uses the approved 38-frame extinguisher render as a lightweight,
   scroll-controlled 3D-like product reveal. No GLB/WebGL model required.
   ============================================================ */
(function () {
  const section = document.getElementById('product');
  const canvas = document.getElementById('productSequenceCanvas');
  const poster = section?.querySelector('.model-showcase__poster');
  const progressBar = section?.querySelector('.model-showcase__progress span');
  const copyBlocks = Array.from(section?.querySelectorAll('[data-product-copy]') || []);
  const copyInners = copyBlocks.map((copy) => copy.querySelector('[data-product-copy-inner]'));
  const ScrollTrigger = window.ScrollTrigger;
  const gsap = window.gsap;

  if (!section || !canvas || !ScrollTrigger || !gsap) return;

  const FRAME_COUNT = 38;
  const FRAME_SRC = (index) =>
    `/assets/sequences/hardware/ezgif-frame-${String(index * 2 + 1).padStart(3, '0')}.jpg`;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });

  if (!ctx) {
    section.classList.add('sequence-fallback');
    return;
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const frames = new Array(FRAME_COUNT);
  const framePromises = new Array(FRAME_COUNT);
  const resizeObserver = new ResizeObserver(resizeCanvas);
  let destroyed = false;
  let scrollTrigger = null;
  let rafId = 0;
  let currentFrameFloat = 0;
  let targetFrame = 0;
  let renderedFrame = -1;
  let activeCopy = -1;

  function setActiveCopy(index, immediate = false) {
    if (activeCopy === index) return;
    activeCopy = index;

    copyBlocks.forEach((copy, copyIndex) => {
      const isActive = copyIndex === index;
      gsap.to(copy, {
        autoAlpha: isActive ? 1 : 0,
        duration: immediate ? 0 : 0.42,
        overwrite: true,
      });
      gsap.to(copyInners[copyIndex], {
        y: isActive ? 0 : copyIndex < index ? -36 : 36,
        duration: immediate ? 0 : 0.42,
        overwrite: true,
      });
    });
  }

  function resizeCanvas() {
    if (destroyed) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    if (renderedFrame >= 0) drawFrame(renderedFrame);
  }

  function nearestLoadedFrame(index) {
    if (frames[index]?.complete) return index;

    for (let distance = 1; distance < FRAME_COUNT; distance += 1) {
      const before = index - distance;
      const after = index + distance;
      if (before >= 0 && frames[before]?.complete) return before;
      if (after < FRAME_COUNT && frames[after]?.complete) return after;
    }

    return -1;
  }

  function drawFrame(index) {
    const resolvedIndex = nearestLoadedFrame(index);
    if (destroyed || resolvedIndex < 0) return;

    const image = frames[resolvedIndex];
    const width = canvas.width;
    const height = canvas.height;
    const mobile = window.innerWidth < 720;
    const maxWidth = width * (mobile ? 0.92 : 0.52);
    const maxHeight = height * (mobile ? 0.62 : 0.86);
    const scale = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    const centerX = width * (mobile ? 0.5 : 0.69);
    const centerY = height * (mobile ? 0.34 : 0.5);
    const drawX = centerX - drawWidth * 0.5;
    const drawY = centerY - drawHeight * 0.5;

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    renderedFrame = resolvedIndex;

    if (!canvas.classList.contains('sequence-ready')) {
      canvas.classList.add('sequence-ready');
      if (poster) {
        poster.style.opacity = '0';
        poster.style.visibility = 'hidden';
      }
    }
  }

  function loadFrame(index, priority = 'auto') {
    if (framePromises[index]) return framePromises[index];

    framePromises[index] = new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = 'async';
      if ('fetchPriority' in image) image.fetchPriority = priority;

      image.onload = async () => {
        try {
          if (image.decode) await image.decode();
        } catch (_) {
          // A decoded image is still drawable when decode() is interrupted.
        }
        frames[index] = image;
        if (Math.abs(index - Math.round(targetFrame)) <= 1) scheduleFrame(targetFrame);
        resolve(image);
      };

      image.onerror = () => reject(new Error(`Failed to load product frame ${index + 1}`));
      image.src = FRAME_SRC(index);
    });

    return framePromises[index];
  }

  function scheduleFrame(index) {
    targetFrame = Math.max(0, Math.min(FRAME_COUNT - 1, index));
    if (rafId) return;

    const advance = () => {
      if (destroyed) {
        rafId = 0;
        return;
      }

      const delta = targetFrame - currentFrameFloat;
      currentFrameFloat = Math.abs(delta) > 0.02 ? currentFrameFloat + delta * 0.24 : targetFrame;
      drawFrame(Math.round(currentFrameFloat));

      if (Math.abs(targetFrame - currentFrameFloat) > 0.02) {
        rafId = window.requestAnimationFrame(advance);
      } else {
        rafId = 0;
      }
    };

    rafId = window.requestAnimationFrame(advance);
  }

  function preloadFrames() {
    let cursor = 1;
    const loadChunk = () => {
      if (destroyed || cursor >= FRAME_COUNT) return;
      const end = Math.min(cursor + 10, FRAME_COUNT);

      for (let index = cursor; index < end; index += 1) {
        loadFrame(index, index < 12 ? 'high' : 'low').catch(() => {
          section.classList.add('sequence-partial');
        });
      }

      cursor = end;
      const scheduleNext = window.requestIdleCallback || ((callback) => window.setTimeout(callback, 45));
      scheduleNext(loadChunk);
    };

    loadChunk();
  }

  function buildScrollTrigger() {
    if (reduceMotion) return;

    scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.65,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const copyIndex = Math.min(copyBlocks.length - 1, Math.floor(progress * copyBlocks.length));
        scheduleFrame(progress * (FRAME_COUNT - 1));
        setActiveCopy(copyIndex);
        if (progressBar) gsap.set(progressBar, { scaleX: progress });
      },
    });
  }

  function destroy() {
    destroyed = true;
    scrollTrigger?.kill();
    resizeObserver.disconnect();
    window.cancelAnimationFrame(rafId);
    frames.forEach((image, index) => {
      if (!image) return;
      image.onload = null;
      image.onerror = null;
      frames[index] = null;
    });
  }

  gsap.set(copyBlocks, { autoAlpha: 0 });
  gsap.set(copyInners, { y: 36 });
  setActiveCopy(0, true);
  resizeCanvas();
  resizeObserver.observe(canvas);

  loadFrame(0, 'high')
    .then(() => {
      drawFrame(0);
      if (reduceMotion) section.classList.add('sequence-reduced');
      else buildScrollTrigger();
      preloadFrames();
    })
    .catch(() => {
      section.classList.add('sequence-fallback');
      if (poster) {
        poster.style.opacity = '1';
        poster.style.visibility = 'visible';
      }
    });

  window.addEventListener('pagehide', destroy, { once: true });
})();
