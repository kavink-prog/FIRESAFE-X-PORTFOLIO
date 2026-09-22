import { Barlow_Condensed, Source_Sans_3 } from 'next/font/google';
import './base.css';
import './brochure.css';
import './training-lab.css';
import './content-layout.css';
import './booking-form.css';
import './hero.css';

const displayFont = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-display',
});
const bodyFont = Source_Sans_3({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata = {
  metadataBase: new URL('https://firesafex.ai'),
  title: 'FireSafeX | Immersive Fire Safety Training',
  description:
    'Build fire safety readiness with FireSafeX smart equipment, immersive scenarios, multilingual AI guidance and measurable training.',
  keywords: [
    'FireSafeX',
    'fire safety training',
    'mixed reality',
    'AI safety assistant',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://firesafex.ai/',
    siteName: 'FireSafeX',
    images: [{ url: '/assets/images/hero/firesafex-industrial-training.webp', width: 1536, height: 1024, alt: 'FireSafeX industrial fire safety training' }],
    title: 'FireSafeX | Immersive Fire Safety Training',
    description:
      'Build fire safety readiness with FireSafeX smart equipment, immersive scenarios, multilingual AI guidance and measurable training.',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/assets/images/hero/firesafex-industrial-training.webp'],
    title: 'FireSafeX | Immersive Fire Safety Training',
    description:
      'Build fire safety readiness with FireSafeX smart equipment, immersive scenarios, multilingual AI guidance and measurable training.',
  },
  icons: {
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: {
      url: '/icons/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
    },
    other: [{ rel: 'manifest', url: '/icons/site.webmanifest' }],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
