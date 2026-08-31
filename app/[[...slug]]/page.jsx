import LegacyAppLoader from '../../src/next/LegacyAppLoader'

const pageMetadata = {
  '': {
    title: 'Taxi Service in Reading',
    description: 'Reliable taxi service in Reading, airport transfers and comfortable journeys across Berkshire.',
  },
  about: {
    title: 'About Abbey Cars',
    description: 'Learn about Abbey Cars and our trusted local taxi service in Reading and Berkshire.',
  },
  'about/privacy-policy': {
    title: 'Privacy Policy',
    description: 'Read how Abbey Cars collects, uses and protects information submitted through our booking and contact forms.',
  },
  'about/our-story': {
    title: 'Our Story',
    description: 'Discover the Abbey Cars story and our commitment to reliable local taxis, airport transfers and personal service across Reading and Berkshire.',
    keywords: ['Abbey Cars', 'local taxi service Reading', 'Reading taxi company', 'airport transfers Berkshire', 'executive travel Reading'],
  },
  fleet: {
    title: 'Our Fleet',
    description: 'Explore the comfortable and reliable vehicles available from Abbey Cars.',
  },
  'our-fleet': {
    title: 'Our Fleet',
    description: 'Explore the comfortable and reliable vehicles available from Abbey Cars.',
  },
  services: {
    title: 'Taxi Services',
    description: 'Book local taxis, airport transfers, corporate travel and specialist transport with Abbey Cars.',
  },
  'airport-transfers': {
    title: 'Airport Transfers',
    description: 'Reliable airport transfers from Reading to Heathrow, Gatwick, Luton and Stansted.',
  },
  'corporate-travel': {
    title: 'Corporate Travel',
    description: 'Professional and dependable corporate travel from Abbey Cars in Reading.',
  },
  contact: {
    title: 'Contact Abbey Cars',
    description: 'Contact Abbey Cars to arrange a taxi, airport transfer or private journey in Reading.',
  },
  booking: {
    title: 'Book a Taxi',
    description: 'Request a reliable taxi journey with Abbey Cars in Reading and Berkshire.',
  },
  'blogs/abbey-cars-vs-uber-reading': {
    title: 'Abbey Cars vs Uber in Reading | Local Taxi Guide',
    description: 'Compare Abbey Cars and Uber in Reading. Learn why local drivers, dependable service and direct support can make your journey easier.',
  },
}

export async function generateMetadata({ params }) {
  const { slug = [] } = await params
  const key = slug.join('/')
  const metadata = pageMetadata[key] || pageMetadata[slug[0]] || pageMetadata['']
  const canonical = `/${key}`

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    robots: { index: true, follow: true },
    alternates: { canonical },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
    },
  }
}

export default function CatchAllPage() {
  return <LegacyAppLoader />
}
