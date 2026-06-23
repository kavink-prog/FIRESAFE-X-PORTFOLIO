/* ============================================================
   HARDWARE FRAME SEQUENCE
   Replaces the hardware 3D model with a scroll-scrubbed image sequence.
   Frames are preloaded, mapped to scroll progress, and drawn into a single
   canvas so only one frame is visible at a time.
   ============================================================ */
(function () {
  const section = document.getElementById('hardware');
  const stage = document.getElementById('hardwareStage');
  const canvas = document.getElementById('hardwareCanvas');
  const poster = stage?.querySelector('.hardware-experience__poster');
  const ScrollTrigger = window.ScrollTrigger;

  if (!section || !stage || !canvas || !ScrollTrigger) return;

  let started = false;
  const bootObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting) && !started) {
        started = true;
        bootObserver.disconnect();
        start();
      }
    },
    { rootMargin: '450px 0px' }
  );

  bootObserver.observe(section);

  function start() {

  const FRAME_COUNT = 38;
  // The extinguisher's perceived center sits above its geometric midpoint:
  // the nozzle/handle assembly carries more visual weight than the lower
  // cylinder. Using a slightly elevated focal point keeps the transition
  // centered in the viewport instead of sagging toward the bottom.
  const VISUAL_CENTER_X = 0.5;
  const VISUAL_CENTER_Y = 0.36;
  const VIEWPORT_Y_BIAS = -0.02;
  const VIEWPORT_PADDING_X = 0.05;
  const VIEWPORT_PADDING_Y = 0.055;
  const FRAME_SRC = (index) =>
    `/assets/sequences/hardware/ezgif-frame-${String(index * 2 + 1).padStart(3, '0')}.jpg`;

  const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
  if (!ctx) return;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const frames = new Array(FRAME_COUNT);
  const framePromises = new Array(FRAME_COUNT);
  const frameBounds = new Array(FRAME_COUNT);
  const breakpoint = window.matchMedia('(min-width: 920px)');
  const resizeObserver = new ResizeObserver(resizeCanvas);

  let destroyed = false;
  let scrollTrigger = null;
  let rafId = 0;
  let targetFrame = 0;
  let currentFrameFloat = 0;
  let renderedFrame = -1;
  let currentFrame = -1;
  let sharedBounds = null;
  let referenceBounds = null;

  function resizeCanvas() {
    if (destroyed) return;
    const rect = stage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const nextWidth = Math.max(1, Math.round(rect.width * dpr));
    const nextHeight = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
    }

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    if (renderedFrame >= 0) drawFrame(renderedFrame);
  }

  function drawFrame(index) {
    const image = frames[index];
    if (destroyed || !image || !image.complete) return;

    currentFrame = index;

    const width = canvas.width;
    const height = canvas.height;
    const imageWidth = image.naturalWidth || image.width;
    const imageHeight = image.naturalHeight || image.height;
    const source = sharedBounds || { x: 0, y: 0, width: imageWidth, height: imageHeight };
    const insetX = width * VIEWPORT_PADDING_X;
    const insetY = height * VIEWPORT_PADDING_Y;
    const availableWidth = Math.max(1, width - insetX * 2);
    const availableHeight = Math.max(1, height - insetY * 2);
    const scale = Math.min(availableWidth / source.width, availableHeight / source.height);
    const drawWidth = source.width * scale;
    const drawHeight = source.height * scale;
    const centeredX = (width - drawWidth) * 0.5;
    const centeredY = (height - drawHeight) * 0.5 + height * VIEWPORT_Y_BIAS;
    const minX = insetX;
    const maxX = width - insetX - drawWidth;
    const minY = insetY;
    const maxY = height - insetY - drawHeight;
    const drawX = Math.min(Math.max(centeredX, minX), Math.max(minX, maxX));
    const drawY = Math.min(Math.max(centeredY, minY), Math.max(minY, maxY));

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

    if (!canvas.classList.contains('sequence-ready')) {
      canvas.classList.add('sequence-ready');
      if (poster) {
        poster.style.opacity = '0';
        poster.style.visibility = 'hidden';
        poster.style.pointerEvents = 'none';
      }
    }
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
      if (Math.abs(delta) > 0.02) {
        currentFrameFloat += delta * 0.22;
      } else {
        currentFrameFloat = targetFrame;
      }

      const nextFrame = Math.round(currentFrameFloat);
      if (nextFrame !== renderedFrame) {
        if (frames[nextFrame]?.complete) {
          renderedFrame = nextFrame;
          drawFrame(nextFrame);
        } else {
          loadFrame(nextFrame, 'high').catch((error) => console.error(error));
        }
      }

      if (Math.abs(targetFrame - currentFrameFloat) > 0.02 || renderedFrame !== Math.round(targetFrame)) {
        rafId = window.requestAnimationFrame(advance);
      } else {
        rafId = 0;
      }
    };

    rafId = window.requestAnimationFrame(advance);
  }

  function detectFrameBounds(image) {
    // The sequence uses a near-black background, so we can detect the actual
    // extinguisher silhouette by scanning for non-dark pixels on a downscaled
    // buffer. This gives us a stable content box independent of each frame's
    // internal offset.
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

        if (brightness > 14) {
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
    const paddingX = 18 * scaleX;
    const paddingY = 22 * scaleY;

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

    const image = frames.find(Boolean);
    if (!image) return;
    referenceBounds ||= frameBounds[0] || boundsList[0];

    const referenceCenterX = referenceBounds.x + referenceBounds.width * VISUAL_CENTER_X;
    const referenceCenterY = referenceBounds.y + referenceBounds.height * VISUAL_CENTER_Y;

    let maxHalfWidth = referenceBounds.width * 0.5;
    let maxHalfHeight = referenceBounds.height * 0.5;

    boundsList.forEach((bounds) => {
      const centerX = bounds.x + bounds.width * 0.5;
      const centerY = bounds.y + bounds.height * 0.5;

      maxHalfWidth = Math.max(
        maxHalfWidth,
        Math.abs(centerX - referenceCenterX) + bounds.width * 0.5
      );
      maxHalfHeight = Math.max(
        maxHalfHeight,
        Math.abs(centerY - referenceCenterY) + bounds.height * 0.5
      );
    });

    const paddingX = image.naturalWidth * 0.02;
    const paddingY = image.naturalHeight * 0.02;
    const x = Math.max(0, Math.floor(referenceCenterX - maxHalfWidth - paddingX));
    const y = Math.max(0, Math.floor(referenceCenterY - maxHalfHeight - paddingY));
    const right = Math.min(image.naturalWidth, Math.ceil(referenceCenterX + maxHalfWidth + paddingX));
    const bottom = Math.min(image.naturalHeight, Math.ceil(referenceCenterY + maxHalfHeight + paddingY));

    sharedBounds = {
      x,
      y,
      width: Math.max(1, right - x),
      height: Math.max(1, bottom - y),
    };

    if (renderedFrame >= 0) drawFrame(renderedFrame);
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
          // drawImage still works if decode() is unsupported or interrupted
        }
        frames[index] = image;
        frameBounds[index] = detectFrameBounds(image);
        updateSharedBounds();
        if (index === Math.round(targetFrame) || currentFrame === -1) scheduleFrame(targetFrame);
        resolve(image);
      };

      image.onerror = () => reject(new Error(`Failed to load hardware frame ${index + 1}`));
      image.src = FRAME_SRC(index);
    });

    return framePromises[index];
  }

  function buildScrollTrigger() {
    scrollTrigger?.kill();

    const desktop = breakpoint.matches;

    scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: desktop ? 'top top+=72' : 'top bottom',
      end: desktop ? 'bottom bottom' : 'bottom top',
      scrub: 0.8,
      invalidateOnRefresh: true,
      onUpdate: (st) => {
        const frame = st.progress * (FRAME_COUNT - 1);
        scheduleFrame(frame);
      },
    });
  }

  function destroy() {
    destroyed = true;
    scrollTrigger?.kill();
    resizeObserver.disconnect();
    if (breakpoint.removeEventListener) breakpoint.removeEventListener('change', buildScrollTrigger);
    else if (breakpoint.removeListener) breakpoint.removeListener(buildScrollTrigger);
    window.cancelAnimationFrame(rafId);

    frames.forEach((image, index) => {
      if (!image) return;
      image.onload = null;
      image.onerror = null;
      frames[index] = null;
      framePromises[index] = null;
    });
  }

    resizeCanvas();
    resizeObserver.observe(stage);
    buildScrollTrigger();
    if (breakpoint.addEventListener) breakpoint.addEventListener('change', buildScrollTrigger);
    else if (breakpoint.addListener) breakpoint.addListener(buildScrollTrigger);
    window.addEventListener('pagehide', destroy, { once: true });

    // Load the first frame immediately so the section paints quickly, then
    // warm the remaining sequence in idle chunks to avoid a large network and
    // decode spike the moment the app boots.
    loadFrame(0, 'high')
      .then(() => {
        targetFrame = 0;
        currentFrameFloat = 0;
        renderedFrame = 0;
        drawFrame(0);
      })
      .catch((error) => console.error(error));

    let cursor = 1;
    const preloadChunk = () => {
      if (destroyed || cursor >= FRAME_COUNT) return;
      const end = Math.min(cursor + 16, FRAME_COUNT);

      for (let index = cursor; index < end; index += 1) {
        loadFrame(index, index < 24 ? 'high' : 'low').catch((error) => console.error(error));
      }

      cursor = end;
      const scheduleNext =
        window.requestIdleCallback ||
        ((callback) => window.setTimeout(callback, 40));
      scheduleNext(preloadChunk);
    };

    preloadChunk();
  }
})();
