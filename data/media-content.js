const EVENT_IMAGE_COUNT = 20;

export const EVENT_MEDIA = [
  {
    id: 'firesafex-training-video',
    type: 'video',
    src: '/assets/videos/global/firesafex-product-video-training.mp4',
    poster: '/assets/images/events/event-01.webp',
    alt: 'FireSafeX practical training video',
  },
  ...Array.from({ length: EVENT_IMAGE_COUNT }, (_, index) => ({
    id: `firesafex-event-${index + 1}`,
    type: 'image',
    src: `/assets/images/events/event-${String(index + 1).padStart(2, '0')}.webp`,
    alt: `FireSafeX practical training event ${index + 1}`,
  })),
];

const INDUSTRY_VIDEOS = [
  {
    id: 'industry-connected-training',
    type: 'video',
    src: '/assets/videos/global/firesafex-product-video-training.mp4',
    poster: '/assets/images/events/event-01.webp',
    alt: 'FireSafeX connected workplace training',
  },
  {
    id: 'industry-smart-hardware',
    type: 'video',
    src: '/assets/videos/overview/smart-hardware.mp4',
    poster: '/assets/images/events/event-05.webp',
    alt: 'FireSafeX smart physical training hardware',
  },
  {
    id: 'industry-mixed-reality',
    type: 'video',
    src: '/assets/videos/overview/mixed-reality.mp4',
    poster: '/assets/images/events/event-09.webp',
    alt: 'FireSafeX mixed reality training',
  },
  {
    id: 'industry-response-tracking',
    type: 'video',
    src: '/assets/videos/overview/pass-tracked.mp4',
    poster: '/assets/images/events/event-12.webp',
    alt: 'FireSafeX practical response tracking',
  },
  {
    id: 'industry-fire-scenario',
    type: 'video',
    src: '/assets/videos/problem/firesafex/new-firefly-loop.mp4',
    poster: '/assets/images/events/event-15.webp',
    alt: 'FireSafeX immersive fire scenario',
  },
  {
    id: 'industry-ai-trainer',
    type: 'video',
    src: '/assets/videos/overview/ai-instructor.mp4',
    poster: '/assets/images/events/event-18.webp',
    alt: 'FireSafeX guided learning experience',
  },
];

const INDUSTRY_EVENT_RANGES = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11],
  [12, 13, 14],
  [15, 16, 17],
  [18, 19, 20],
];

const INDUSTRY_EXTRA_MEDIA = {
  5: [
    {
      id: 'industry-headset-experience',
      type: 'video',
      src: '/assets/videos/problem/firesafex/new-4-headset.mp4',
      poster: '/assets/images/events/event-19.webp',
      alt: 'FireSafeX immersive headset training experience',
    },
  ],
};

export const INDUSTRY_MEDIA = INDUSTRY_EVENT_RANGES.map((imageNumbers, industryIndex) => [
  INDUSTRY_VIDEOS[industryIndex],
  ...(INDUSTRY_EXTRA_MEDIA[industryIndex] || []),
  ...imageNumbers.map((imageNumber) => ({
    id: `industry-${industryIndex + 1}-event-${imageNumber}`,
    type: 'image',
    src: `/assets/images/events/event-${String(imageNumber).padStart(2, '0')}.webp`,
    alt: `FireSafeX practical training event ${imageNumber}`,
  })),
]);
