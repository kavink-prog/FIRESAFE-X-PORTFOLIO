/** @type {import('next').NextConfig} */
const nextConfig = {
  // The page renders static marketing markup and boots imperative GSAP/Three.js
  // scripts once after mount. StrictMode's double-invoke would re-run that
  // imperative setup against a remounted DOM, so we keep dev === prod behaviour.
  reactStrictMode: false,
};

module.exports = nextConfig;
