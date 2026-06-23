import Nav from '@/components/layout/Nav';
import BookDemoModal from '@/components/modals/BookDemoModal';
import Hero from '@/components/home/sections/Hero';
import Overview from '@/components/home/sections/Overview';
import Problem from '@/components/home/sections/Problem';
import Hardware from '@/components/home/sections/Hardware';
import AIExpert from '@/components/home/sections/AIExpert';
import Workflow from '@/components/home/sections/Workflow';
import Stats from '@/components/home/sections/Stats';
import Industries from '@/components/home/sections/Industries';
import Specs from '@/components/home/sections/Specs';
import Finale from '@/components/home/sections/Finale';
import Boot from '@/components/system/Boot';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Overview />
      <Problem />
      <Hardware />
      <AIExpert />
      <Workflow />
      <Stats />
      <Industries />
      <Specs />
      <Finale />
      <BookDemoModal />

      {/* Client-only: boots Lenis + GSAP + Three.js scenes after mount */}
      <Boot />
    </>
  );
}
