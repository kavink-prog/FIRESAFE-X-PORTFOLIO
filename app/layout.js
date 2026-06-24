import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata = {
  title: 'FireSafeX | AI-Powered Fire Safety Training Ecosystem',
  description:
    'FireSafeX is the next-generation AI-powered fire safety training ecosystem for train, practice, assess, and certify workflows across industries, languages, regions, and enterprise environments.',
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
