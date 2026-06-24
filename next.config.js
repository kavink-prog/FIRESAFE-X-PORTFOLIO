// The page renders static marketing markup and boots imperative GSAP/Three.js
// scripts once after mount. StrictMode's double-invoke would re-run that
// imperative setup against a remounted DOM, so we keep dev === prod behaviour.
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'export',
  trailingSlash: true,

  // Static export disables the built-in image optimization API.
  // Setting unoptimized:true makes next/image behave like a plain <img>
  // tag (serves the original file directly), which is required for
  // output:'export' to work without a custom loader.
  images: {
    unoptimized: true,
  },

  // NOTE: headers() is not supported with output:'export'.
  // Cache-Control headers must be configured at the CDN/hosting layer
  // (e.g. Bitbucket Pipelines → S3/CloudFront, or Vercel edge config).
};

export default nextConfig;
