/* ============================================================
   FireSafeX — Premium Cinematic Motion
   Lenis (smooth inertia scroll) + GSAP + ScrollTrigger
   Modular, GPU-accelerated, luxury-paced.
   ============================================================ */

(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // ─────────────────────────────────────────────
  // Easing presets — Casquette / Apple cinematic feel
  // ─────────────────────────────────────────────
  const EASE       = 'expo.out';
  const EASE_SOFT  = 'power2.out';
  const EASE_INOUT = 'power3.inOut';
  const EASE_SLOW  = 'power4.out';
  const CLEAR_TEXT_SECTIONS = '#problem, #features, #overview, #training, #workflow, #industries, #about, #cta';

  // Detect environment
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile     = window.matchMedia('(max-width: 720px)').matches;
  const isTouch      = window.matchMedia('(hover: none)').matches;

  // ─────────────────────────────────────────────
  // 1) LENIS — smooth inertia scroll synced to GSAP ticker
  // ─────────────────────────────────────────────
  let lenis = null;
  if (typeof Lenis !== 'undefined' && !reduceMotion) {
    lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 1.5,
      lerp: 0.1,
    });

    // Bridge Lenis → ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    window.__fireSafeXLenis = lenis;
  }

  // Anchor links honor Lenis for buttery scroll-to
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(target, {
              offset: -70,
              duration: 1.6,
              easing: (t) => 1 - Math.pow(1 - t, 3),
            });
          } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    });
  });

  // ─────────────────────────────────────────────
  // 2) GLOBAL DEFAULTS
  // ─────────────────────────────────────────────
  gsap.defaults({ ease: EASE, duration: 1.4 });
  ScrollTrigger.config({ ignoreMobileResize: true });

  // ─────────────────────────────────────────────
  // 3) SCROLL PROGRESS BAR — slim cinematic line at top
  // ─────────────────────────────────────────────
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);
  gsap.to(progress, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.documentElement,
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      scrub: 0.3,
    },
  });

  // ─────────────────────────────────────────────
  // 4) NAV — fade-in shadow on scroll, no layout shift
  // ─────────────────────────────────────────────
  const nav = document.querySelector('.nav');
  if (nav) {
    gsap.fromTo(nav,
      { boxShadow: '0 0 0 rgba(0,0,0,0)', backdropFilter: 'blur(0px)' },
      {
        boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
        backdropFilter: 'blur(18px)',
        ease: 'none',
        scrollTrigger: {
          trigger: 'body',
          start: 60,
          end: 120,
          scrub: true,
        },
      }
    );
  }

  // ─────────────────────────────────────────────
  // 5) HERO — orchestrated entrance
  // Every step is a fromTo so initial states are written atomically (no race
  // between gsap.set and the static CSS hidden state).
  // ─────────────────────────────────────────────
  const legacyHero = document.querySelector('.hero');
  if (legacyHero) {
    const heroTl = gsap.timeline({ delay: 0.1, defaults: { ease: EASE, duration: 1.2 } });

    heroTl
      .fromTo('.hero__eyebrow',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.0 }
      )
      .fromTo('.hero__title .word__inner, .hero__title .word',
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.4, stagger: 0.06 },
        '-=0.7'
      )
      .fromTo('.hero__sub .word__inner, .hero__sub .word',
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.0, stagger: 0.04 },
        '-=1.0'
      )
      .fromTo('.hero__ctas > *',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 },
        '-=0.7'
      )
      .fromTo('.hero__product',
        { opacity: 0, scale: 1.06, y: 24 },
        { opacity: 1, scale: 1, y: 0, duration: 1.6, ease: EASE_SLOW },
        '-=1.3'
      )
      .fromTo('.hero__scroll',
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.3'
      );

    // Hero exit drift — translate-only, immediateRender:false so the scrubs do
    // NOT write at frame 0 (which was overpowering the entrance opacity/scale).
    gsap.to('.hero__product', {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
        immediateRender: false,
      },
    });
    gsap.to('.hero__content', {
      yPercent: -14,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
        immediateRender: false,
      },
    });
    gsap.to('.hero__product-glow', {
      scale: 1.25,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.8,
        immediateRender: false,
      },
    });
  }

  // ─────────────────────────────────────────────
  // 6) TITLE REVEALS — per-word cinematic rise
  // ─────────────────────────────────────────────
  gsap.utils.toArray('.bold-reveal').forEach((el) => {
    if (el.closest('.hero')) return; // hero handled above
    const words = el.querySelectorAll('.word__inner, .word');
    if (!words.length) return;

    gsap.fromTo(words,
      { yPercent: 110, opacity: 0, filter: 'blur(8px)' },
      {
        yPercent: 0, opacity: 1, filter: 'blur(0px)',
        duration: 1.4,
        stagger: 0.06,
        ease: EASE,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // ─────────────────────────────────────────────
  // 7) GENERIC SECTION REVEALS — fade + rise + blur
  // ─────────────────────────────────────────────
  gsap.utils.toArray('.reveal').forEach((el) => {
    if (el.classList.contains('bold-reveal')) return;
    if (el.closest('.hero')) return; // hero in heroTl

    const isClearTextReveal = Boolean(el.closest(CLEAR_TEXT_SECTIONS));

    gsap.fromTo(el,
      {
        opacity: 0,
        y: isClearTextReveal ? 24 : 60,
        filter: isClearTextReveal ? 'none' : 'blur(8px)',
      },
      {
        opacity: 1,
        y: 0,
        filter: 'none',
        duration: isClearTextReveal ? 0.68 : 1.6,
        ease: isClearTextReveal ? EASE_SOFT : EASE,
        scrollTrigger: {
          trigger: el,
          start: isClearTextReveal ? 'top 94%' : 'top 88%',
          toggleActions: isClearTextReveal ? 'play none none none' : 'play none none reverse',
        },
      }
    );
  });

  // ─────────────────────────────────────────────
  // 8) MEDIA REVEALS — settle-in scale + blur off
  // ─────────────────────────────────────────────
  gsap.utils.toArray('.reveal-img').forEach((el) => {
    if (el.closest('.hero')) return; // hero img in heroTl
    gsap.fromTo(el,
      { opacity: 0, scale: 1.1, filter: 'blur(12px)' },
      {
        opacity: 1, scale: 1, filter: 'blur(0px)',
        duration: 2.0,
        ease: EASE_SLOW,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // ─────────────────────────────────────────────
  // 9) STAGGERED GROUPS — tiles, steps, cards, etc.
  // ─────────────────────────────────────────────
  const staggerGroups = [
    // NOTE: '.tiles' is intentionally omitted — the overview tiles are
    // driven by the scroll-storytelling build in section 20.5 instead.
    { container: '.steps',           child: '.step' },
    { container: '.industries-section__grid', child: '.ind' },
    { container: '.stats__grid',     child: '.stats__feature-card' },
    { container: '.specs__grid',     child: '.spec-card' },
    { container: '.ai-expert__rail', child: ':scope > span' },
    { container: '.feature__specs',  child: ':scope > div' },
    { container: '.cta__buttons',    child: ':scope > *' },
    { container: '.footer__cols',    child: ':scope > div' },
  ];

  staggerGroups.forEach(({ container, child }) => {
    document.querySelectorAll(container).forEach((c) => {
      const children = c.querySelectorAll(child);
      if (!children.length) return;
      const isClosingGroup = Boolean(c.closest('.finale'));
      gsap.fromTo(children,
        {
          opacity: 0,
          y: isClosingGroup ? 24 : 60,
          filter: isClosingGroup ? 'none' : 'blur(8px)',
        },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: isClosingGroup ? 0.8 : 1.4,
          stagger: 0.1,
          ease: isClosingGroup ? EASE_SOFT : EASE,
          scrollTrigger: {
            trigger: c,
            start: isClosingGroup ? 'top 96%' : 'top 82%',
            toggleActions: isClosingGroup ? 'play none none none' : 'play none none reverse',
          },
        }
      );
    });
  });

  // ─────────────────────────────────────────────
  // 10) CINEMATIC PARALLAX — backgrounds and foreground
  // ─────────────────────────────────────────────
  // Feature media images drift + slow zoom while in view
  gsap.utils.toArray('.feature__media').forEach((media) => {
    const img = media.querySelector('img');
    if (img) {
      gsap.fromTo(img,
        { yPercent: 8, scale: 1.1 },
        {
          yPercent: -8, scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: media,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        }
      );
    }
  });

  // CTA background image — slow cinematic drift + scale
  const ctaBg = document.querySelector('.cta__bg img');
  if (ctaBg) {
    gsap.fromTo(ctaBg,
      { yPercent: 10, scale: 1.15 },
      {
        yPercent: -12, scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.cta',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      }
    );
  }

  // Section inner drift (very subtle, gives depth)
  ['.stats__inner', '.specs__inner'].forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      gsap.fromTo(el,
        { y: 36 },
        {
          y: -36,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.8,
          },
        }
      );
    });
  });

  // ─────────────────────────────────────────────
  // 11) FLOATING ORBITAL MOTION — product, glows
  // ─────────────────────────────────────────────
  gsap.utils.toArray('.tile__product img').forEach((img) => {
    gsap.to(img, {
      y: -18, rotation: -2,
      duration: 4.5, ease: 'sine.inOut',
      yoyo: true, repeat: -1,
    });
  });

  // Hero product subtle constant float (after entrance settles)
  const legacyHeroProductImage = document.querySelector('.hero__product img');
  if (legacyHeroProductImage) {
    gsap.to(legacyHeroProductImage, {
      y: -10,
      duration: 5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 2.5,
    });
  }

  // ─────────────────────────────────────────────
  // 12) STAT RINGS + COUNT-UP — fill the circle and count the number
  // the moment each stat scrolls into view. Driven by IntersectionObserver
  // so it is immune to ScrollTrigger position quirks under the pinned hero.
  // ─────────────────────────────────────────────
  const RING_C = 339.292; // 2π·54
  gsap.utils.toArray('.stat-big').forEach((stat) => {
    const circle = stat.querySelector('.stat-ring__fill[data-percent]');
    const num    = stat.querySelector('[data-target]');
    const pct    = circle ? (parseInt(circle.dataset.percent, 10) || 0) / 100 : 0;
    const target = num ? parseInt(num.dataset.target, 10) : NaN;
    const hasNum = num && Number.isFinite(target);
    const counter = { v: 0 };

    if (reduceMotion) {
      if (circle) gsap.set(circle, { strokeDashoffset: RING_C * (1 - pct), opacity: 1 });
      if (hasNum) num.textContent = target;
      return;
    }

    // Back to empty/0 — so the next time it scrolls in it animates again.
    const reset = () => {
      if (circle) { gsap.killTweensOf(circle); gsap.set(circle, { strokeDashoffset: RING_C, opacity: 0.5 }); }
      if (hasNum) { gsap.killTweensOf(counter); num.textContent = '0'; }
    };
    const play = () => {
      if (circle) gsap.to(circle, { strokeDashoffset: RING_C * (1 - pct), opacity: 1, duration: 1.6, ease: EASE_SLOW, overwrite: true });
      if (hasNum) {
        gsap.killTweensOf(counter); counter.v = 0;
        gsap.to(counter, { v: target, duration: 1.6, ease: EASE_SLOW, onUpdate: () => { num.textContent = Math.round(counter.v); } });
      }
    };
    reset();

    // Replay on every entry (and rewind on exit) — not once.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { e.isIntersecting ? play() : reset(); });
    }, { threshold: 0.4 });
    io.observe(stat);
  });

  // ─────────────────────────────────────────────
  // 14) HARDWARE ANNOTATIONS — choreographed entrance
  // ─────────────────────────────────────────────
  const annotMedia = document.querySelector('#hardware .feature__media');
  if (annotMedia) {
    const dots   = annotMedia.querySelectorAll('.annot__dot');
    const lines  = annotMedia.querySelectorAll('.annot__line');
    const labels = annotMedia.querySelectorAll('.annot__label');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: annotMedia,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
      defaults: { ease: EASE, duration: 1.0 },
    });

    if (dots.length)   tl.fromTo(dots,   { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.15 }, 0.2);
    if (lines.length)  tl.fromTo(lines,  { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, stagger: 0.15 }, '-=0.7');
    if (labels.length) tl.fromTo(labels, { opacity: 0, y: 10 },     { opacity: 1, y: 0, stagger: 0.15 },     '-=0.6');
  }

  // ─────────────────────────────────────────────
  // 15) ELEGANT HOVER MICROMOTIONS
  // ─────────────────────────────────────────────
  if (!isTouch) {
    const hoverTargets = document.querySelectorAll(
      '.step, .spec-card, .ind, .stats__feature-card'
    );
    hoverTargets.forEach((el) => {
      const enter = () => gsap.to(el, { y: -6, scale: 1.008, duration: 0.7, ease: EASE_SOFT, overwrite: 'auto' });
      const leave = () => gsap.to(el, { y: 0,  scale: 1,     duration: 0.9, ease: EASE_SOFT, overwrite: 'auto' });
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
    });

    // Magnetic buttons — slight pull toward cursor
    document.querySelectorAll('.btn').forEach((btn) => {
      const strength = 0.25;
      const move = (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * strength;
        const y = (e.clientY - (r.top + r.height / 2)) * strength;
        gsap.to(btn, { x, y, duration: 0.5, ease: EASE_SOFT, overwrite: 'auto' });
      };
      const reset = () => gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
      btn.addEventListener('mousemove', move);
      btn.addEventListener('mouseleave', reset);
    });

    // Nav links — subtle underline lift
    document.querySelectorAll('.nav__links a').forEach((a) => {
      const enter = () => gsap.to(a, { y: -1, opacity: 1, duration: 0.4, ease: EASE_SOFT, overwrite: 'auto' });
      const leave = () => gsap.to(a, { y: 0,  duration: 0.6, ease: EASE_SOFT, overwrite: 'auto' });
      a.addEventListener('mouseenter', enter);
      a.addEventListener('mouseleave', leave);
    });
  }

  // ─────────────────────────────────────────────
  // 16) PINNED HARDWARE SECTION — image holds while text scrolls past
  // ─────────────────────────────────────────────
  const sticky = document.querySelector('#hardware .feature__sticky');
  const media  = document.querySelector('#hardware .feature__media');
  if (sticky && media && window.matchMedia('(min-width: 920px)').matches) {
    ScrollTrigger.create({
      trigger: sticky,
      start: 'top center',
      end: 'bottom bottom',
      pin: media,
      pinSpacing: true,
    });

    // Subtle scale-down while pinned, for depth
    gsap.fromTo(media,
      { scale: 1.04 },
      {
        scale: 0.96,
        ease: 'none',
        scrollTrigger: {
          trigger: sticky,
          start: 'top center',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      }
    );
  }

  // ─────────────────────────────────────────────
  // 17) SECTION MASK — soft cinematic transition between dark/light feature sections
  // ─────────────────────────────────────────────
  gsap.utils.toArray('.feature, .stats, .specs, .cta').forEach((section) => {
    gsap.fromTo(section,
      { '--mask': '0%' },
      {
        '--mask': '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'top center',
          scrub: 1,
        },
      }
    );
  });

  // ─────────────────────────────────────────────
  // 18) HERO SCROLL CUE — fade out once the user starts scrolling
  // ─────────────────────────────────────────────
  if (legacyHero) {
    gsap.to('.hero__scroll', {
      opacity: 0,
      y: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '20% top',
        scrub: 0.5,
        immediateRender: false,
      },
    });
  }

  // ─────────────────────────────────────────────
  // 19) FOOTER — slow rise
  // ─────────────────────────────────────────────
  gsap.fromTo('.footer__bottom',
    { opacity: 0, y: 24 },
    {
      opacity: 1, y: 0,
      duration: 1.4,
      ease: EASE,
      scrollTrigger: {
        trigger: '.footer__bottom',
        // The footer bottom is flush with the end of the document. `top 95%`
        // placed the trigger below the maximum possible scroll position, so
        // the copyright line could remain permanently transparent.
        start: 'top bottom',
        toggleActions: 'play none none none',
      },
    }
  );

  // ─────────────────────────────────────────────
  // 20) EDITORIAL REVEALS — overview + problem
  // (ref: grigoriak.doctor) line-masked headings,
  // image clip-wipe + parallax, list line wipes
  // ─────────────────────────────────────────────
  if (!reduceMotion) {
    // (a) Line-by-line masked heading reveal. Splits on <br> so inner
    //     <span> accent colours are preserved within each line.
    const splitIntoLines = (el) =>
      (el.innerHTML = el.innerHTML
        .split(/<br\s*\/?>/i)
        .map((p) => `<span class="line-mask"><span class="line-inner">${p}</span></span>`)
        .join(''),
      el.querySelectorAll('.line-inner'));

    gsap.utils.toArray('[data-lines]').forEach((el) => {
      const lines = splitIntoLines(el);
      gsap.set(lines, { yPercent: 118 });
      // IntersectionObserver instead of ScrollTrigger — reliably reveals the
      // heading even where ScrollTrigger positions get thrown off by pins.
      const play  = () => gsap.to(lines, { yPercent: 0, duration: 1.2, stagger: 0.12, ease: EASE, overwrite: true });
      const reset = () => { gsap.killTweensOf(lines); gsap.set(lines, { yPercent: 118 }); };
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { e.isIntersecting ? play() : reset(); });
      }, { threshold: 0.15 });
      io.observe(el);
    });

    // (b) Overview product image — clip-path wipe up, then a gentle
    //     scrubbed parallax. Applied to the container (the <img> itself
    //     already runs an infinite float in section 11).
    const prod = document.querySelector('#overview .tile__product');
    if (prod) {
      gsap.fromTo(prod,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.6,
          ease: EASE_SLOW,
          // Clear once revealed so the image's infinite float (section 11)
          // isn't clipped by a static container mask.
          onComplete() { gsap.set(prod, { clearProps: 'clipPath' }); },
          scrollTrigger: {
            trigger: prod,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      );
      gsap.fromTo(prod,
        { yPercent: 8 },
        {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: prod,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );
    }

    // (c) Problem split lists — each line lifts in under its row.
    gsap.utils.toArray('#problem .split__list').forEach((list) => {
      gsap.fromTo(list.querySelectorAll('li'),
        { opacity: 0, y: 22 },
        {
          opacity: 1, y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: EASE_SOFT,
          scrollTrigger: {
            trigger: list,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // (d) OVERVIEW STORYTELLING — each feature tile *builds* as it scrolls
    //     into view (scrubbed), then its contents reveal in sequence so the
    //     feature explains itself. (ref: grigoriak scroll storytelling)
    gsap.utils.toArray('#overview .tile--story').forEach((tile) => {
      // NB: .tile__product is owned by block (b) above (clip-wipe + parallax),
      // so it is excluded here to avoid two tweens fighting over its transform.
      const inner = tile.querySelectorAll(
        '.tile__label, .tile__title, .tile__copy, .tile__visual, .tile__metrics'
      );
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: tile,
          start: 'top 90%',
          end: 'top 42%',
          scrub: 1,
        },
      });
      // The shell rises + settles as you scroll past it.
      tl.fromTo(tile,
        { autoAlpha: 0, y: 90, scale: 0.92 },
        { autoAlpha: 1, y: 0, scale: 1, ease: 'none' }, 0);
      // Then the content explains itself, line by line.
      tl.fromTo(inner,
        { autoAlpha: 0, y: 26 },
        { autoAlpha: 1, y: 0, stagger: 0.12, ease: 'none' }, 0.25);
    });

    // (e) ANALYTICS & REPORTING — Off Menu-style smooth row transitions.
    //     Each report row draws its divider line left→right, then the
    //     label + description mask up. Scrubbed for a buttery, refined feel.
    gsap.utils.toArray('.metrics .metrics__list').forEach((list) => {
      gsap.utils.toArray(list.querySelectorAll('li')).forEach((row) => {
        // Inject a thin "drawing" rule that replaces the static top border.
        const rule = document.createElement('i');
        rule.className = 'metrics__rule';
        row.appendChild(rule);
        gsap.set(row, { borderTopColor: 'transparent' });

        const b = row.querySelector('b');
        const span = row.querySelector('span');
        gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 92%',
            end: 'top 64%',
            scrub: 1,
          },
        })
          .fromTo(rule, { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0)
          .fromTo([b, span],
            { autoAlpha: 0, yPercent: 70 },
            { autoAlpha: 1, yPercent: 0, stagger: 0.08, ease: 'none' }, 0.12);
      });
    });
  }

  // ─────────────────────────────────────────────
  // 20.1) LIVE ANALYTICS DASHBOARD — choreographed build
  // Chart draws, bars grow, gauge sweeps, counters tick, P.A.S.S.
  // steps pop and the verdict lights up — all scrubbed to scroll.
  // ─────────────────────────────────────────────
  const dash = document.querySelector('.dash');
  if (dash) {
    const nums = gsap.utils.toArray('[data-dash-num]', dash);
    const fmt = (el, v) =>
      v.toFixed(parseInt(el.dataset.dashDec || '0', 10)) + (el.dataset.dashSuf || '');

    if (reduceMotion) {
      // Static final values — no motion.
      nums.forEach((el) => { el.textContent = fmt(el, parseFloat(el.dataset.dashNum) || 0); });
    } else {
      const panel   = dash.querySelector('.dash__panel');
      const aura    = dash.querySelector('.dash__aura');
      const line    = dash.querySelector('.dash__line');
      const area    = dash.querySelector('.dash__area');
      const dot     = dash.querySelector('.dash__dot');
      const bars    = gsap.utils.toArray('.dash__bars i', dash);
      const gauge   = dash.querySelector('.dash__gauge-fill');
      const steps   = gsap.utils.toArray('.dash__step', dash);
      const verdict = dash.querySelector('.dash__verdict');
      const clock   = dash.querySelector('[data-dash-clock]');

      // Initial states
      gsap.set(panel, { autoAlpha: 0, y: 90, rotateX: 18, transformPerspective: 1600, transformOrigin: '50% 100%' });
      gsap.set(aura, { autoAlpha: 0, scale: 0.9 });
      gsap.set(steps, { y: 16 });
      gsap.set(verdict, { y: 8 });
      let len = 0;
      if (line) { len = line.getTotalLength(); gsap.set(line, { strokeDasharray: len, strokeDashoffset: len }); }

      const counters = nums.map((el) => ({ el, end: parseFloat(el.dataset.dashNum) || 0 }));
      const prox = { p: 0 };

      const tl = gsap.timeline({
        defaults: { ease: 'none', duration: 0.6 },
        scrollTrigger: { trigger: dash, start: 'top 80%', end: 'top 22%', scrub: 1 },
      });

      tl.to(aura,  { autoAlpha: 0.5, scale: 1 }, 0)
        .to(panel, { autoAlpha: 1, y: 0, rotateX: 0 }, 0)
        .to(bars,  { scaleY: 1, stagger: 0.04 }, 0.2)
        .to(line,  { strokeDashoffset: 0, duration: 0.7 }, 0.15)
        .to(area,  { autoAlpha: 1, duration: 0.4 }, 0.35)
        .to(dot,   { autoAlpha: 1, duration: 0.2 }, 0.6);
      if (gauge) tl.to(gauge, { strokeDashoffset: 314.16 * (1 - 0.98), duration: 0.7 }, 0.25);
      tl.to(steps,   { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.4 }, 0.5)
        .to(verdict, { autoAlpha: 1, y: 0, duration: 0.3,
          onStart: () => verdict && verdict.classList.add('is-on'),
          onReverseComplete: () => verdict && verdict.classList.remove('is-on'),
        }, 0.74);

      // Counters + running clock, driven by one proxy across the whole build.
      tl.to(prox, {
        p: 1, duration: 1.0,
        onUpdate() {
          const k = Math.min(1, prox.p / 0.85);
          counters.forEach((c) => { c.el.textContent = fmt(c.el, c.end * k); });
          if (clock) {
            const total = Math.round(k * 188);            // 00:00 → 03:08
            clock.textContent =
              String(Math.floor(total / 60)).padStart(2, '0') + ':' +
              String(total % 60).padStart(2, '0');
          }
        },
      }, 0);
    }
  }

  // ─────────────────────────────────────────────
  // 20.2) ANALYSIS BREAKDOWN — overall score + per-skill bars
  // Bars fill and numbers count up, scrubbed to scroll.
  // ─────────────────────────────────────────────
  const analysis = document.querySelector('.analysis');
  if (analysis) {
    const score = analysis.querySelector('.analysis__score');
    const bars  = gsap.utils.toArray('.abar', analysis);
    const setNum = (el, v) => { el.textContent = Math.round(v); };

    if (reduceMotion) {
      if (score) score.textContent = score.dataset.to;
      bars.forEach((bar) => {
        const fill = bar.querySelector('.abar__fill');
        const val  = bar.querySelector('.abar__val');
        if (fill) fill.style.transform = `scaleX(${(parseFloat(bar.dataset.score) || 0) / 100})`;
        if (val)  val.textContent = val.dataset.to;
      });
    } else {
      const scoreO = { v: 0 };
      const barOs  = bars.map(() => ({ v: 0 }));

      const reset = () => {
        if (score) { gsap.killTweensOf(scoreO); score.textContent = '0'; }
        bars.forEach((bar, i) => {
          const fill = bar.querySelector('.abar__fill');
          const val  = bar.querySelector('.abar__val');
          if (fill) { gsap.killTweensOf(fill); gsap.set(fill, { scaleX: 0 }); }
          if (val)  { gsap.killTweensOf(barOs[i]); val.textContent = '0'; }
        });
      };
      const play = () => {
        if (score) {
          gsap.killTweensOf(scoreO); scoreO.v = 0;
          gsap.to(scoreO, { v: parseFloat(score.dataset.to) || 0, duration: 1.6, ease: EASE_SLOW, onUpdate: () => setNum(score, scoreO.v) });
        }
        bars.forEach((bar, i) => {
          const fill = bar.querySelector('.abar__fill');
          const val  = bar.querySelector('.abar__val');
          const target = (parseFloat(bar.dataset.score) || 0) / 100;
          if (fill) gsap.to(fill, { scaleX: target, duration: 1.4, ease: EASE_SLOW, delay: i * 0.12, overwrite: true });
          if (val) {
            gsap.killTweensOf(barOs[i]); barOs[i].v = 0;
            gsap.to(barOs[i], { v: parseFloat(val.dataset.to) || 0, duration: 1.4, delay: i * 0.12, ease: EASE_SLOW, onUpdate: () => setNum(val, barOs[i].v) });
          }
        });
      };
      reset();

      // Replay every time the block enters view; rewind when it leaves.
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { e.isIntersecting ? play() : reset(); });
      }, { threshold: 0.25 });
      io.observe(analysis);
    }
  }

  // ─────────────────────────────────────────────
  // 21) Refresh ScrollTrigger after assets settle
  // ─────────────────────────────────────────────
  window.addEventListener('load', () => ScrollTrigger.refresh());
  // Refresh on font/image-driven layout shifts as well
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
})();
