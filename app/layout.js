import { Montserrat } from 'next/font/google';
import './base.css';
import './story.css';
import { STORY_META, STORY_SECTIONS } from '@/data/story-content';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata = {
  metadataBase: new URL('https://firesafex.ai'),
  title: STORY_META.title,
  description: STORY_META.description,
  keywords: STORY_SECTIONS.map(({ title }) => title),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://firesafex.ai/',
    siteName: 'FireSafeX',
    title: STORY_META.title,
    description: STORY_META.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: STORY_META.title,
    description: STORY_META.description,
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
  return (
    <html lang="en" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
