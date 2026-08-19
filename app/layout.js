import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata = {
  metadataBase: new URL('https://firesafex.ai'),
  title: 'AI-Powered Fire Safety Training | FireSafeX',
  description:
    'FireSafeX combines a smart extinguisher, mixed reality practice, AI safety guidance, practical assessment, digital records, and enterprise fire safety training management.',
  keywords: [
    'AI-powered fire safety training',
    'mixed reality fire safety training',
    'fire extinguisher training system',
    'practical fire safety assessment',
    'enterprise fire safety training',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://firesafex.ai/',
    siteName: 'FireSafeX',
    title: 'AI-Powered Fire Safety Training | FireSafeX',
    description: 'Real equipment, mixed reality practice, intelligent guidance, and measurable fire safety training performance in one connected ecosystem.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Powered Fire Safety Training | FireSafeX',
    description: 'Train the response. Measure the skill. Build readiness with FireSafeX.',
  },
  icons: {
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    other: [
      { rel: 'manifest', url: '/icons/site.webmanifest' },
    ],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  // `js-anim` mirrors the original inline <script> that flagged GSAP-driven
  // reveal mode so CSS keeps animated elements hidden until GSAP reveals them.
  return (
    <html lang="en" className={`js-anim ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
