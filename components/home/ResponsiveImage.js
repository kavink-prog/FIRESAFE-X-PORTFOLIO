import variants from '@/data/responsive-images.json';

// Static export has no image optimizer; variants are generated before deployment.
export default function ResponsiveImage({ src, sizes = '(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 60vw, 720px', ...props }) {
  const image = variants[src];
  return <img {...props} src={src} srcSet={image?.srcSet} sizes={image ? sizes : undefined} />;
}
