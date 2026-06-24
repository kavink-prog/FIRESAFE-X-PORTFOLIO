/* ============================================================
   HERO FRAME SEQUENCE
   Replaces the hero GLTF with a scroll-scrubbed image sequence while
   preserving the existing act transitions, labels, and pinned layout.
   ============================================================ */
(function () {
  const cineSection = document.querySelector('.cine');
  const heroCanvas = document.getElementById('heroCanvas');
  const heroStage = document.getElementById('heroStage');
  const heroLoader = document.getElementById('heroLoader');
  const ScrollTrigger = window.ScrollTrigger;

  if (!cineSection || !heroCanvas || !heroStage || !ScrollTrigger) return;

  const heroProduct = heroCanvas.parentElement || heroStage;
  const poster = heroProduct.querySelector('.cine__poster');
  const acts = Array.from(document.querySelectorAll('.cine__act'));
  const railLabels = Array.from(document.querySelectorAll('.cine__rail-label'));

  const FRAME_COUNT = 180;
  const FRAME_SRC = (index) => `/assets/sequences/hero/${String(index * 2 + 1).padStart(4, '0')}.webp`;
  const ACT_BREAKS = [0.0, 0.26, 0.55, 0.8, 1.01];
  const VIEWPORT_PADDING_X = 0.045;
  const VIEWPORT_PADDING_Y = 0.04;
  const VISUAL_SCALE = 1.14;

  const ctx = heroCanvas.getContext('2d', { alpha: true, desynchronized: true });
  if (!ctx) return;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const frames = new Array(FRAME_COUNT);
  const framePromises = new Array(FRAME_COUNT);
  const frameBounds = new Array(FRAME_COUNT);
  const resizeObserver = new ResizeObserver(resizeCanvas);

  let destroyed = false;
  let currentFrame = -1;
  let pendingFrame = 0;
  let rafId = 0;
  let lastAct = -1;
  let sharedBounds = null;

  function activeActIndex(progress) {
    for (let i = 0; i < ACT_BREAKS.length - 1; i += 1) {
      if (progress >= ACT_BREAKS[i] && progress < ACT_BREAKS[i + 1]) return i;
    }
    return ACT_BREAKS.length - 2;
  }

  function setAct(index) {
    if (index === lastAct) return;
    lastAct = index;
    acts.forEach((el, idx) => el.classList.toggle('is-visible', idx === index));
    railLabels.forEach((el, idx) => el.classList.toggle('is-active', idx === index));
    cineSection.classList.toggle('is-podium-hidden', index >= 1);
    cineSection.classList.toggle('is-title-shrunk', index >= 1);
    cineSection.dataset.act = index;
  }

  function revealCanvas() {
    if (!heroCanvas.classList.contains('sequence-ready')) {
      heroCanvas.classList.add('sequence-ready');
    }
    if (heroLoader) {
      heroLoader.style.opacity = '0';
      window.setTimeout(() => {
        if (heroLoader) heroLoader.style.display = 'none';
      }, 400);
    }
    if (poster) {
      poster.style.opacity = '0';
      poster.style.visibility = 'hidden';
      poster.style.pointerEvents = 'none';
    }
  }

  function showPosterFallback() {
    if (heroLoader) heroLoader.style.display = 'none';
    if (poster) {
      poster.style.display = 'block';
      poster.style.opacity = '1';
      poster.style.visibility = 'visible';
      poster.style.pointerEvents = 'none';
    }
  }

  function detectFrameBounds(image) {
    const sampleWidth = 180;
    const sampleHeight = Math.max(1, Math.round((image.naturalHeight / image.naturalWidth) * sampleWidth));
    const probe = document.createElement('canvas');
    probe.width = sampleWidth;
    probe.height = sampleHeight;

    const probeCtx = probe.getContext('2d', { willReadFrequently: true });
    if (!probeCtx) {
      return { x: 0, y: 0, width: image.naturalWidth, height: image.naturalHeight };
    }

    probeCtx.drawImage(image, 0, 0, sampleWidth, sampleHeight);
    const { data } = probeCtx.getImageData(0, 0, sampleWidth, sampleHeight);

    let minX = sampleWidth;
    let minY = sampleHeight;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < sampleHeight; y += 1) {
      for (let x = 0; x < sampleWidth; x += 1) {
        const offset = (y * sampleWidth + x) * 4;
        const r = data[offset];
        const g = data[offset + 1];
        const b = data[offset + 2];
        const brightness = (r + g + b) / 3;

        if (brightness > 12) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (maxX < minX || maxY < minY) {
      return { x: 0, y: 0, width: image.naturalWidth, height: image.naturalHeight };
    }

    const scaleX = image.naturalWidth / sampleWidth;
    const scaleY = image.naturalHeight / sampleHeight;
    const paddingX = 36 * scaleX;
    const paddingY = 38 * scaleY;

    const x = Math.max(0, Math.floor(minX * scaleX - paddingX));
    const y = Math.max(0, Math.floor(minY * scaleY - paddingY));
    const right = Math.min(image.naturalWidth, Math.ceil((maxX + 1) * scaleX + paddingX));
    const bottom = Math.min(image.naturalHeight, Math.ceil((maxY + 1) * scaleY + paddingY));

    return {
      x,
      y,
      width: Math.max(1, right - x),
      height: Math.max(1, bottom - y),
    };
  }

  function updateSharedBounds() {
    const boundsList = frameBounds.filter(Boolean);
    if (!boundsList.length) return;

    const minX = Math.min(...boundsList.map((bounds) => bounds.x));
    const minY = Math.min(...boundsList.map((bounds) => bounds.y));
    const maxX = Math.max(...boundsList.map((bounds) => bounds.x + bounds.width));
    const maxY = Math.max(...boundsList.map((bounds) => bounds.y + bounds.height));

    sharedBounds = {
      x: minX,
      y: minY,
      width: Math.max(1, maxX - minX),
      height: Math.max(1, maxY - minY),
    };

    if (currentFrame >= 0) scheduleFrame(currentFrame);
  }

  function resizeCanvas() {
    if (destroyed) return;

    const rect = heroProduct.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const nextWidth = Math.max(1, Math.round(rect.width * dpr));
    const nextHeight = Math.max(1, Math.round(rect.height * dpr));

    if (heroCanvas.width !== nextWidth || heroCanvas.height !== nextHeight) {
      heroCanvas.width = nextWidth;
      heroCanvas.height = nextHeight;
    }

    heroCanvas.style.width = `${rect.width}px`;
    heroCanvas.style.height = `${rect.height}px`;

    if (currentFrame >= 0) drawFrame(currentFrame);
  }

  function drawFrame(index) {
    const image = frames[index];
    if (destroyed || !image || !image.complete) return;

    currentFrame = index;

    const source = sharedBounds || {
      x: 0,
      y: 0,
      width: image.naturalWidth || image.width,
      height: image.naturalHeight || image.height,
    };
    const width = heroCanvas.width;
    const height = heroCanvas.height;
    const insetX = width * VIEWPORT_PADDING_X;
    const insetY = height * VIEWPORT_PADDING_Y;
    const availableWidth = Math.max(1, (width - insetX * 2) * VISUAL_SCALE);
    const availableHeight = Math.max(1, (height - insetY * 2) * VISUAL_SCALE);
    const scale = Math.min(availableWidth / source.width, availableHeight / source.height);
    const drawWidth = source.width * scale;
    const drawHeight = source.height * scale;
    const drawX = (width - drawWidth) * 0.5;
    const drawY = (height - drawHeight) * 0.5;

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(
      image,
      source.x,
      source.y,
      source.width,
      source.height,
      drawX,
      drawY,
      drawWidth,
      drawHeight
    );

    revealCanvas();
  }

  function scheduleFrame(index) {
    pendingFrame = Math.max(0, Math.min(FRAME_COUNT - 1, index));
    if (rafId) return;

    rafId = window.requestAnimationFrame(() => {
      rafId = 0;
      drawFrame(pendingFrame);
    });
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
          // Rendering can continue even if decode is interrupted.
        }

        frames[index] = image;
        frameBounds[index] = detectFrameBounds(image);
        updateSharedBounds();
        if (currentFrame === -1 || pendingFrame === index) scheduleFrame(index);
        resolve(image);
      };

      image.onerror = () => reject(new Error(`Failed to load hero frame ${index + 1}`));
      image.src = FRAME_SRC(index);
    });

    return framePromises[index];
  }

  async function preloadFrames() {
    try {
      await loadFrame(0, 'high');
    } catch (error) {
      console.error(error);
      showPosterFallback();
      return;
    }

    // Load only the first 12 frames eagerly (covers the first act),
    // then fill the rest in background idle chunks to avoid a 27 MB
    // network spike at boot that was causing the 40-second load time.
    const eagerCount = Math.min(FRAME_COUNT, 12);
    await Promise.all(
      Array.from({ length: eagerCount - 1 }, (_, offset) => loadFrame(offset + 1, 'high').catch(() => null))
    );

    let cursor = eagerCount;
    const backgroundChunk = () => {
      if (destroyed || cursor >= FRAME_COUNT) return;
      const end = Math.min(cursor + 18, FRAME_COUNT);

      for (let index = cursor; index < end; index += 1) {
        loadFrame(index).catch(() => null);
      }

      cursor = end;
      const scheduleNext =
        window.requestIdleCallback ||
        ((callback) => window.setTimeout(callback, 60));
      scheduleNext(backgroundChunk);
    };

    backgroundChunk();
  }

  setAct(0);
  resizeObserver.observe(heroProduct);
  resizeCanvas();
  scheduleFrame(0);
  preloadFrames();

  ScrollTrigger.create({
    trigger: cineSection,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.1,
    onUpdate: (st) => {
      const progress = st.progress;
      const nextFrame = Math.round(progress * (FRAME_COUNT - 1));

      cineSection.classList.toggle('is-scrolled', progress > 0.03);
      setAct(activeActIndex(progress));

      if (frames[nextFrame]) {
        scheduleFrame(nextFrame);
      } else {
        loadFrame(nextFrame, 'high')
          .then(() => scheduleFrame(nextFrame))
          .catch(() => null);
      }
    },
  });

  window.addEventListener(
    'pagehide',
    () => {
      destroyed = true;
      resizeObserver.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
    },
    { once: true }
  );
})();
