const screen = (file, title, alt) => ({
  src: `/assets/images/firesafe-x_eco-system/${file}.webp`,
  original: `/assets/images/firesafe-x_eco-system/${file}.png`,
  title,
  alt,
});

const photo = (file, title, alt) => ({
  src: `/assets/images/firesafe-x_outerpov/${file}.webp`,
  original: `/assets/images/firesafe-x_outerpov/${file}.png`,
  title,
  alt,
  kind: 'photo',
});

// Curated section visuals based on the supplied product and application references.
// Empty sections deliberately render a placeholder instead of unrelated media.
export const ECOSYSTEM_SCREENS = {
  'solution-features': [
    photo('firesafex-hands-on-extinguisher-practice', 'Hands-on practice', 'Participant wearing a mixed-reality headset and practicing with the physical FireSafeX extinguisher'),
  ],
  product: [
    screen('firesafex-01-device-connection', 'Connect the device', 'FireSafeX headset and extinguisher Bluetooth connection screen'),
  ],
  'training-journey': [{
    src: '/assets/images/generated/smart-training-reference-v3.png',
    original: '/assets/images/generated/smart-training-reference-v3.png',
    title: 'Mixed-reality fire practice',
    alt: 'AI-enhanced recreation of the FireSafeX in-headset barrel-fire simulation with training indicators',
    kind: 'generated-screen',
  }],
  'proven-everywhere': [{
    src: '/assets/images/generated/enterprise-training-v1.png',
    original: '/assets/images/generated/enterprise-training-v1.png',
    title: 'Connected teams. Consistent training.',
    alt: 'Illustration of office, factory and warehouse teams connected to centralized training records',
    kind: 'illustration',
  }],
};
