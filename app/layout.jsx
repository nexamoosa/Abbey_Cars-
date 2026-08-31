import '../src/index.css'
import '../src/App.css'
import logoImage from '../src/assets/iamges/logo-01.png'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  icons: { icon: logoImage.src },
  title: {
    default: 'Abbey Cars',
    template: '%s',
  },
  description: 'Reliable taxi service in Reading, airport transfers, corporate travel and comfortable journeys across Berkshire.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Abbey Cars',
    title: 'Abbey Cars',
    description: 'Reliable taxi service in Reading, airport transfers and comfortable journeys across Berkshire.',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abbey Cars',
    description: 'Reliable taxi service in Reading, airport transfers and comfortable journeys across Berkshire.',
  },
  robots: { index: true, follow: true },
}

export const pageMetadata = {
  '': {
    title: 'Taxi Service in Reading',
    description: 'Reliable taxi service in Reading...',
  },

  services: {
    title: 'Taxi Services in Reading',
    description: 'Book local taxis, airport transfers and corporate travel...',
  },

  booking: {
    title: 'Book a Taxi in Reading',
    description: 'Book a reliable taxi with Abbey Cars...',
  },
}

export default function RootLayout({ children }) {
  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Abbey Cars',
    description: 'Reliable taxi service in Reading, airport transfers and comfortable journeys across Berkshire.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    telephone: '+441189454545',
    areaServed: ['Reading', 'Wokingham', 'Bracknell', 'Berkshire'],
  }

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} />
      </body>
    </html>
  )
}
