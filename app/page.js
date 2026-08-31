import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import StoryPage from '@/components/home/StoryPage';
import BookDemoModal from '@/components/modals/BookDemoModal';
import ScrollExperience from '@/components/system/ScrollExperience';
import { STORY_META } from '@/data/story-content';

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
        name: STORY_META.brand,
        description: STORY_META.description,
        publisher: { '@id': 'https://firesafex.ai/#organization' },
      },
      {
        '@type': 'Product',
        name: STORY_META.brand,
        category: 'Mixed reality fire safety training system',
        description: STORY_META.description,
        url: 'https://firesafex.ai/#product',
        brand: { '@id': 'https://firesafex.ai/#organization' },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Nav />
      <ScrollExperience />
      <StoryPage />
      <Footer />
      <BookDemoModal />
    </>
  );
}
