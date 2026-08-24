import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getPages } from '../lib/cms'
import usePageTitle from '../hooks/usePageTitle'
import Testimonials from '../components/UI/services/Testimonials'

const pageData = {
  services: [
    { slug: 'heathrow-airport-transfers', label: 'Heathrow Airport Transfers' },
    { slug: 'gatwick-airport-transfers', label: 'Gatwick Airport Transfers' },
    { slug: 'luton-stansted-transfers', label: 'Luton & Stansted Transfers' },
    { slug: 'corporate-executive-travel', label: 'Corporate & Executive Travel' },
    { slug: 'local-long-distance-taxi', label: 'Local & Long Distance Taxi' },
    { slug: 'station-transfers', label: 'Station Transfers' },
    { slug: 'school-run-service', label: 'School Run Service' },
    { slug: 'courier-parcel-delivery', label: 'Courier & Parcel Delivery' },
    { slug: 'wedding-event-cars', label: 'Wedding & Event Cars' },
    { slug: 'wheelchair-accessible-vehicles', label: 'Wheelchair Accessible Vehicles' },
  ],
  'areas-we-cover': [],
  'our-fleet': [
    { slug: 'mercedes-e-class', label: 'MERCEDES E CLASS' },
    { slug: 'mercedes-s-class', label: 'Mercedes S Class' },
    { slug: 'mercedes-vito', label: 'Mercedes Vito' },
    { slug: 'bmw-7-series', label: 'BMW 7 Series' },
    { slug: 'bmw-5-series', label: 'BMW 5 Series' },
    { slug: 'toyota-prius', label: 'Toyota Prius' },
  ],
  about: [
    { slug: 'our-story', label: 'Our Story' },
    { slug: 'meet-the-drivers', label: 'Meet the Drivers' },
    { slug: 'reviews-testimonials', label: 'Reviews & Testimonials' },
    { slug: 'privacy-policy', label: 'Privacy Policy' },
    { slug: 'terms-conditions', label: 'Terms & Conditions' },
    { slug: 'refund-policy', label: 'Refund Policy' },
  ],
}

const categoryTitles = {
  services: 'Services',
  'areas-we-cover': 'Areas We Cover',
  'our-fleet': 'Our Fleet',
  about: 'About Us',
  blogs: 'Blog',
}

function CategoryPage() {
  const { category, slug } = useParams()
  const [cmsTick, setCmsTick] = useState(0)
  useEffect(() => {
    const handler = () => setCmsTick((v) => v + 1)
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])
  const categoryItems = pageData[category]
  const cmsItems = getPages(category).filter((p) => p.enabled !== false)
  const cmsMap = (cmsItems || []).map((p) => ({
    slug: p.slug || p.to?.split('/').pop(),
    label: p.label || p.title || 'Service Area',
    title: p.title || p.label || 'Service Area',
    content: p.content || '',
    meta: p.meta || {},
    to: p.to,
    featured_image: p.featured_image || p.meta?.featured_image || '',
    gallery: p.meta?.gallery || p.gallery || [],
    excerpt: p.excerpt || p.meta?.about || '',
  }))
  const merged = (categoryItems || []).concat(cmsMap)
  const item = merged?.find((page) => page.slug === slug)
  const pageTitle = item ? item.meta?.title || item.label || `${categoryTitles[category] || category}` : 'Page Not Found'
  usePageTitle(pageTitle)

  if (!categoryItems && (!cmsItems || cmsItems.length === 0)) {
    return (
      <section className="page-card">
        <h1>Page not found</h1>
        <p>The requested category does not exist.</p>
      </section>
    )
  }

  if (!item) {
    return (
      <section className="page-card">
        <h1>Page not found</h1>
        <p>The requested page was not found in {categoryTitles[category] || category}.</p>
      </section>
    )
  }

  const heroImage = item.featured_image || item.meta?.featured_image || ''
  const galleryImages = Array.isArray(item.gallery) ? item.gallery : (item.meta?.gallery || [])
  const areaDescription = item.excerpt || item.meta?.about || item.content || 'Premium transfer services across Berkshire and surrounding regions.'

  if (category === 'areas-we-cover') {
    return (
      <section className="bg-white text-zinc-900">
        <div className="relative overflow-hidden">
          {heroImage ? (
            <>
              <img src={heroImage} alt={item.label} className="h-[300px] w-full object-cover md:h-[380px]" />
              <div className="absolute inset-0 bg-black/35" />
            </>
          ) : (
            <div className="h-[300px] w-full bg-yellow-400 md:h-[380px]" />
          )}

          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-6xl">
              <nav className="mb-4 text-sm text-white/90">
                <span>Home</span>
                <span className="mx-2">/</span>
                <span>Areas We Cover</span>
                <span className="mx-2">/</span>
                <span>{item.label}</span>
              </nav>
              <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">{item.label}</h1>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          {galleryImages.length > 0 && (
            <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${item.label} gallery ${index + 1}`}
                  className="h-52 w-full rounded-2xl object-cover shadow-sm ring-1 ring-zinc-200"
                />
              ))}
            </div>
          )}

          <div className="max-w-4xl rounded-3xl bg-white p-0">
            <p className="mb-6 text-lg leading-8 text-zinc-700">{areaDescription}</p>
            {item.content ? (
              <div className="cms-content prose max-w-none text-zinc-800" dangerouslySetInnerHTML={{ __html: item.content }} />
            ) : null}
          </div>
        </div>
      </section>
    )
  }

  if (category === 'about' && slug === 'reviews-testimonials') {
    return (
      <main className="bg-slate-50">
        <Testimonials />
      </main>
    )
  }

  return (
    <section className="page-card">
      <div className="cms-content" style={{ textAlign: 'left', marginTop: '1rem' }}>
        {item && item.content ? (
          <div dangerouslySetInnerHTML={{ __html: item.content }} />
        ) : (
          <div />
        )}
      </div>
    </section>
  )
}

export default CategoryPage
