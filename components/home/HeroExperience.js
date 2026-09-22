import ResponsiveImage from './ResponsiveImage';
export default function HeroExperience() {
  return (
    <figure className="fx-hero-scene">
      <ResponsiveImage
        src="/assets/images/hero/firesafex-industrial-training.webp"
        alt="FireSafeX industrial fire safety training with a mixed reality headset, extinguisher and instructor on a factory floor"
        width="1536"
        height="1024"
        sizes="(max-width: 760px) 100vw, 975px"
        fetchPriority="high"
      />
    </figure>
  );
}
