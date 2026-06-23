/* ============================================
   FireSafeX — Finale Scene
   The page's closing animation: a warm ember + fog field rendered behind
   both the CTA and footer as one continuous canvas. Scroll drives the glow
   intensity upward while the scene remains lazy-initialised and paused
   whenever it is off-screen.
   ============================================ */

import * as THREE from 'three';

const canvas  = document.getElementById('finaleCanvas');
const finale  = document.querySelector('.finale');
if (canvas && finale) initWhenVisible();

function initWhenVisible() {
  let started = false;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting && !started) {
        started = true;
        io.disconnect();
        try { start(); } catch (err) { console.warn('Finale scene unavailable:', err); }
      }
    }
  }, { rootMargin: '300px 0px' });
  io.observe(finale);
}

function start() {
  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: true, powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const FOG = new THREE.Color(0x120402);
  // Lighter fog so the lower body of the product no longer melts into black.
  const FOG_DENSITY = 0.04;
  scene.fog = new THREE.FogExp2(FOG, FOG_DENSITY);

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0, 8);
  camera.lookAt(0, 0, 0);

  // ── Lights (warm, product-hero key + ember rim) ─────────────
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(3, 5, 4); scene.add(key);
  const fill = new THREE.DirectionalLight(0xfff0e0, 0.72);
  fill.position.set(-4, 2, -2); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xff5a1a, 0.9);
  rim.position.set(-2, 1, 5); scene.add(rim);
  // Warm up-light so the base/lower half stays readable against the dark.
  const under = new THREE.DirectionalLight(0xff8a3a, 0.5);
  under.position.set(0, -4, 3); scene.add(under);
  // Warm point glow that swells on scroll, lighting the ember field.
  const glow = new THREE.PointLight(0xff7a1a, 0.0, 18, 2);
  glow.position.set(0, -3, 2); scene.add(glow);

  // ── Embers (additive GPU points) ────────────────────────────
  const N = 600;
  const pos = new Float32Array(N * 3);
  const seed = new Float32Array(N);
  const rand = (i, s) => ((Math.sin((i + 1) * s) * 43758.5453) % 1 + 1) % 1;
  const SPAN = 14;
  for (let i = 0; i < N; i++) {
    pos[i * 3]     = (rand(i, 12.9898) - 0.5) * SPAN;
    pos[i * 3 + 1] = (rand(i, 78.233) - 0.5) * SPAN;
    pos[i * 3 + 2] = (rand(i, 39.425) - 0.5) * SPAN * 0.6;
    seed[i] = rand(i, 7.131);
  }
  const emGeo = new THREE.BufferGeometry();
  emGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  emGeo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const emberMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: true,
    uniforms: {
      uTime:  { value: 0 },
      uSpan:  { value: SPAN },
      uFire2: { value: new THREE.Color(0xff7a1a) },
      uFire3: { value: new THREE.Color(0xffb547) },
      fogColor:   { value: FOG },
      fogDensity: { value: FOG_DENSITY },
    },
    vertexShader: /* glsl */`
      uniform float uTime, uSpan;
      attribute float aSeed;
      varying float vLife;
      varying float vFogDepth;
      void main(){
        vec3 p = position;
        float rise = mod(uTime * (0.5 + aSeed * 1.2) + aSeed * uSpan, uSpan);
        p.y += rise - uSpan * 0.5;
        p.x += sin(uTime * 0.5 + aSeed * 30.0) * 0.9;
        vLife = 1.0 - rise / uSpan;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vFogDepth = -mv.z;
        gl_PointSize = (26.0 + aSeed * 34.0) / max(-mv.z, 1.0);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */`
      precision highp float;
      uniform vec3 uFire2, uFire3, fogColor;
      uniform float fogDensity;
      varying float vLife;
      varying float vFogDepth;
      void main(){
        vec2 d = gl_PointCoord - 0.5;
        float r = length(d);
        if (r > 0.5) discard;
        float glow = smoothstep(0.5, 0.0, r);
        float fogF = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
        vec3 col = mix(uFire2, uFire3, vLife);
        gl_FragColor = vec4(col, glow * vLife * 0.85 * (1.0 - fogF));
      }
    `,
  });
  const embers = new THREE.Points(emGeo, emberMat);
  scene.add(embers);

  // ── Resize ───────────────────────────────────────────────────
  function resize() {
    const w = finale.clientWidth, h = finale.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(finale);

  // ── Scroll: product rises + glow swells from CTA into footer ─
  let prog = 0;
  if (window.gsap && window.ScrollTrigger) {
    window.ScrollTrigger.create({
      trigger: finale,
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 1.2,
      onUpdate: (st) => { prog = st.progress; },
    });
  }

  // ── Render loop (paused while off-screen) ───────────────────
  let visible = true;
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; },
    { rootMargin: '150px 0px' }).observe(finale);

  let raf = 0;
  let glowLive = 0;
  (function loop(now) {
    raf = requestAnimationFrame(loop);
    if (!visible) return;
    const t = now * 0.001;

    // Warm glow swells as you scroll from the CTA into the footer.
    const glowTarget = 0.6 + prog * 2.0;
    glowLive += (glowTarget - glowLive) * 0.06;
    glow.intensity = glowLive;

    emberMat.uniforms.uTime.value = t;
    renderer.render(scene, camera);
  })(performance.now());

  window.addEventListener('beforeunload', () => cancelAnimationFrame(raf));
}
