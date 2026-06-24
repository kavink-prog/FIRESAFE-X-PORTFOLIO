// The page renders static marketing markup and boots imperative GSAP/Three.js
// scripts once after mount. StrictMode's double-invoke would re-run that
// imperative setup against a remounted DOM, so we keep dev === prod behaviour.
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // Long-lived immutable cache for all static sequence frames, videos, and
  // other versioned assets so returning visitors pay zero re-download cost.
  async headers() {
    return [
      {
        source: '/assets/sequences/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/assets/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
          // Allow partial content requests so video can stream without
          // downloading the entire file first.
          {
            key: 'Accept-Ranges',
            value: 'bytes',
          },
        ],
      },
      {
        source: '/assets/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
