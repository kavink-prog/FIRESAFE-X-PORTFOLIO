import Nav from '@/components/layout/Nav';
import BookDemoModal from '@/components/modals/BookDemoModal';
import Hero from '@/components/home/sections/Hero';
import Problem from '@/components/home/sections/Problem';
import Solution from '@/components/home/sections/Solution';
import ProductShowcase from '@/components/home/sections/ProductShowcase';
import Overview from '@/components/home/sections/Overview';
import Workflow from '@/components/home/sections/Workflow';
import Assessment from '@/components/home/sections/Assessment';
import Platform from '@/components/home/sections/Platform';
import Outcomes from '@/components/home/sections/Outcomes';
import Stats from '@/components/home/sections/Stats';
import Industries from '@/components/home/sections/Industries';
import Specs from '@/components/home/sections/Specs';
import About from '@/components/home/sections/About';
import Finale from '@/components/home/sections/Finale';
import Boot from '@/components/system/Boot';

export default function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://firesafex.ai/#organization',
        name: 'FireSafeX',
        url: 'https://firesafex.ai/',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://firesafex.ai/#website',
        url: 'https://firesafex.ai/',
        name: 'FireSafeX',
        publisher: { '@id': 'https://firesafex.ai/#organization' },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'FireSafeX',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Connected FireSafeX ecosystem',
        description: 'Enterprise software for managing FireSafeX training, assessment, digital records, and certification workflows.',
        url: 'https://firesafex.ai/#platform',
        publisher: { '@id': 'https://firesafex.ai/#organization' },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Nav />
      <Hero />
      <Problem />
      <Solution />
      <ProductShowcase />
      <Overview />
      <Workflow />
      <Assessment />
      <Platform />
      <Outcomes />
      <Stats />
      <Industries />
      <Specs />
      <About />
      <Finale />
      <BookDemoModal />

      {/* Client-only: boots Lenis + GSAP + Three.js scenes after mount */}
      <Boot />
    </>
  );
}
