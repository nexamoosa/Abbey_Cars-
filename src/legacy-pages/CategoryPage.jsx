import { useState, useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { FaMobileAlt } from 'react-icons/fa'
import { getBlogPosts, getPages } from '../lib/cms'
import usePageTitle from '../hooks/usePageTitle'
import Testimonials from '../components/UI/services/Testimonials'
import safetyImage from '../assets/iamges/Home page image/Safety is non-negotiable..png'
import homeHeroImage from '../assets/iamges/Home page image/HeroImage1.png'

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

function removeDuplicateBlogHeading(rawHtml) {
  if (typeof DOMParser === 'undefined' || !rawHtml) return rawHtml
  const document = new DOMParser().parseFromString(rawHtml, 'text/html')
  const heading = document.body.firstElementChild
  if (heading?.tagName === 'H1') {
    const media = Array.from(heading.querySelectorAll('img, video, iframe'))
    if (media.length) {
      const replacement = document.createElement('div')
      media.forEach((element) => replacement.appendChild(element))
      heading.replaceWith(replacement)
    } else {
      heading.remove()
    }
  }

  return document.body.innerHTML
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
    publishedAt: p.publishedAt || p.published_at || p.createdAt || p.created_at,
    to: p.to,
    featured_image: p.featured_image || p.meta?.featured_image || '',
    gallery: p.meta?.gallery || p.gallery || [],
    excerpt: p.excerpt || '',
  }))
  const merged = (categoryItems || []).concat(cmsMap)
  const item = merged?.find((page) => page.slug === slug)
  const pageTitle = item ? item.meta?.title || item.label || `${categoryTitles[category] || category}` : 'Page Not Found'
  usePageTitle(pageTitle)
  const [shareLabel, setShareLabel] = useState('Share')

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
  const plainAbout = typeof item.meta?.about === 'string' && !/<[a-z][\s\S]*>/i.test(item.meta.about) ? item.meta.about : ''
  const areaDescription = item.excerpt || plainAbout || (!item.content ? 'Premium transfer services across Berkshire and surrounding regions.' : '')
  const publishDate = item.publishedAt ? new Date(item.publishedAt) : null
  const formattedPublishDate = publishDate && !Number.isNaN(publishDate.getTime())
    ? publishDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null
  const relatedPosts = category === 'blogs'
    ? getBlogPosts().filter((post) => post.enabled !== false && post.slug !== item.slug).slice(0, 3)
    : []
  const handleShare = async () => {
    const shareData = { title: item.title || item.label, url: window.location.href }
    try {
      if (navigator.share) await navigator.share(shareData)
      else await navigator.clipboard.writeText(window.location.href)
      setShareLabel('Link copied')
    } catch (error) {
      if (error?.name !== 'AbortError') setShareLabel('Unable to share')
      return
    }
    window.setTimeout(() => setShareLabel('Share'), 1800)
  }

  if (category === 'areas-we-cover') {
    return (
      <section className="w-full bg-white text-black">
        <div className="relative w-full overflow-hidden bg-black text-white">
          {heroImage ? <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" /> : null}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/35" />
          <div className="relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-400">Areas we cover</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.08] sm:text-6xl">{item.label || item.title}</h1>
            {areaDescription ? <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/75">{areaDescription}</p> : null}
            <NavLink to="/booking" className="mt-8 inline-flex rounded-full bg-yellow-400 px-6 py-3 font-bold text-black transition hover:bg-yellow-300">Book your journey</NavLink>
          </div>
        </div>
        <div className="w-full border-y border-yellow-500/30 bg-yellow-400 text-black">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-7 text-center sm:grid-cols-3 sm:px-6 lg:px-8">
            <div><p className="text-2xl font-semibold">24/7</p><p className="mt-1 text-sm font-medium text-slate-950/70">Taxi service availability</p></div>
            <div><p className="text-2xl font-semibold">Local</p><p className="mt-1 text-sm font-medium text-slate-950/70">Reading drivers and route knowledge</p></div>
            <div><p className="text-2xl font-semibold">Direct</p><p className="mt-1 text-sm font-medium text-slate-950/70">Simple online booking</p></div>
          </div>
        </div>
        <div className="w-full px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          {galleryImages.length > 0 ? <div className="mx-auto mb-16 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">{galleryImages.map((image, index) => <img key={`${image}-${index}`} src={image} alt={`${item.label} gallery ${index + 1}`} className="h-64 w-full rounded-3xl object-cover shadow-sm" />)}</div> : null}
          {item.content ? <div className="area-page-content cms-content mx-auto max-w-5xl" dangerouslySetInnerHTML={{ __html: item.content }} /> : null}
        </div>
        <div className="w-full bg-black py-16 text-white sm:py-20"><div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8"><div><p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-400">Travel with Abbey Cars</p><h2 className="mt-3 text-3xl font-semibold leading-[1.12] sm:text-[2.65rem]">Ready to book your journey?</h2></div><NavLink to="/booking" className="inline-flex w-fit rounded-full bg-yellow-400 px-6 py-3 font-bold text-black transition hover:bg-yellow-300">Book online</NavLink></div></div>
      </section>
    )
  }

  if (category === 'about' && slug === 'privacy-policy') {
    return (
      <article className="bg-white text-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600">Abbey Cars</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-slate-500">Last updated: 25 August 2026</p>

          <div className="mt-10 space-y-8 text-base leading-7 text-slate-700">
            <section>
              <h2 className="text-2xl font-semibold text-slate-900">Who we are</h2>
              <p className="mt-3">Abbey Cars provides local taxi journeys, airport transfers and private travel across Reading and Berkshire. For privacy questions, contact us at <a className="font-semibold text-slate-900 underline" href="mailto:hello@abbeycars.com">hello@abbeycars.com</a> or <a className="font-semibold text-slate-900 underline" href="tel:+441189454545">+44 118 945 4545</a>.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900">Information we collect</h2>
              <p className="mt-3">When you request a booking, we may collect your name, phone number, email address, pickup location, drop-off location, travel date, travel time, passenger count, luggage details, preferred vehicle and any message you provide. When you contact us, we collect the name, contact details and message you submit.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900">How we use your information</h2>
              <p className="mt-3">We use this information to review and confirm bookings, contact you about your journey, answer enquiries, provide the requested transport service, maintain booking records and protect the security of our website. We do not sell your personal information.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900">Sharing your information</h2>
              <p className="mt-3">We share information only when necessary to provide the service, operate the website or comply with the law. Booking and contact submissions may be processed by our form delivery provider so that we can receive and respond to your request.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900">How long we keep information</h2>
              <p className="mt-3">We keep booking and enquiry information only for as long as needed to manage the request, provide our services, maintain accurate business records and meet legal or accounting obligations. We securely delete information when it is no longer required.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900">Your choices and rights</h2>
              <p className="mt-3">You can ask us what personal information we hold about you, request a correction or ask us to delete it where the law allows. You can also object to or restrict certain processing. Contact <a className="font-semibold text-slate-900 underline" href="mailto:hello@abbeycars.com">hello@abbeycars.com</a> to make a request.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900">Contact</h2>
              <p className="mt-3">Abbey Cars, 18 Station Road, Reading, Berkshire, RG1 1AA. Email: <a className="font-semibold text-slate-900 underline" href="mailto:hello@abbeycars.com">hello@abbeycars.com</a>.</p>
            </section>
          </div>
        </div>
      </article>
    )
  }

  if (category === 'about' && slug === 'our-story') {
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'TaxiService',
      name: 'Abbey Cars',
      description: 'Abbey Cars provides reliable local taxi journeys, airport transfers and executive travel across Reading and Berkshire.',
      areaServed: ['Reading', 'Berkshire'],
      telephone: '+44 118 945 4545',
      url: `${window.location.origin}/about/our-story`,
    }

    return (
      <section className="bg-white text-slate-950">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <section className="relative overflow-hidden bg-black text-white">
          <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-yellow-400">About Abbey Cars</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl">A local taxi service built around people, not just journeys.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">From a trusted local booking to a comfortable arrival, Abbey Cars brings dependable Reading taxi services and thoughtful personal service together.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <NavLink to="/booking" className="inline-flex items-center rounded-full bg-yellow-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-300">Book a journey</NavLink>
              <NavLink to="/contact" className="inline-flex items-center rounded-full border border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:border-yellow-400 hover:text-yellow-400">Contact our team</NavLink>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-yellow-400">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
            <div><p className="text-3xl font-black">Local</p><p className="mt-1 text-sm font-medium text-slate-900/70">Reading and Berkshire knowledge</p></div>
            <div><p className="text-3xl font-black">Reliable</p><p className="mt-1 text-sm font-medium text-slate-900/70">Clear bookings and dependable pickups</p></div>
            <div><p className="text-3xl font-black">Personal</p><p className="mt-1 text-sm font-medium text-slate-900/70">A team that is here to help</p></div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1fr_0.85fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-yellow-600">Our story</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">Good taxi service starts with knowing who you are serving.</h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
              <p>Abbey Cars was shaped around a simple idea: local passengers deserve a taxi service that knows the area, respects their time and makes it easy to speak to a real team.</p>
              <p>That means understanding the roads around Reading, planning ahead for airport and station journeys, and treating every booking as more than a pickup and a destination.</p>
              <p>As our service has grown, that principle has stayed the same. We combine practical local knowledge with comfortable vehicles, clear communication and professional drivers.</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-[28px] bg-slate-100">
            <img src={safetyImage.src || safetyImage} alt="Passenger enjoying a comfortable Abbey Cars journey" className="h-full min-h-[360px] w-full object-cover" />
          </div>
        </section>

        <section className="bg-slate-50 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-yellow-600">What guides us</p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-5xl">The standards behind every booking</h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                ['Local knowledge', 'We understand Reading, Berkshire and the routes that matter to passengers.'],
                ['Dependable service', 'We make bookings clear, pickups organised and journeys comfortable from start to finish.'],
                ['Respectful travel', 'We treat passengers, luggage, homes, workplaces and time with care.'],
              ].map(([title, text]) => (
                <article key={title} className="border-t-4 border-yellow-400 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-yellow-600">Here to help</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">One local team for the journeys that matter.</h2>
              <p className="mt-5 max-w-md leading-7 text-slate-600">From the school run to an airport departure, Abbey Cars helps passengers arrange comfortable travel across Reading and Berkshire.</p>
            </div>
            <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {[
                ['Local taxi journeys', 'Reliable travel across Reading, nearby communities and longer local routes.'],
                ['Airport transfers', 'Planned pickups for Heathrow, Gatwick, Luton, Stansted and other major airports.'],
                ['Business and executive travel', 'Comfortable, professional journeys for meetings, events and regular bookings.'],
                ['Specialist and group travel', 'Practical transport for families, groups, luggage, school runs and accessible travel needs.'],
              ].map(([title, text]) => (
                <div key={title} className="border-t border-slate-300 pt-4">
                  <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-yellow-600">How we work</p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-5xl">A better journey is made of small details.</h2>
            </div>
            <div className="space-y-8">
              {[
                ['01', 'Listen first', 'We start with the details of your journey, from the pickup point and timing to passengers, luggage and special requirements.'],
                ['02', 'Plan clearly', 'We use local route knowledge and practical experience to help organise the right vehicle and a sensible travel plan.'],
                ['03', 'Follow through', 'From the first confirmation to arrival, our focus is a calm, professional and dependable experience.'],
              ].map(([number, title, text]) => (
                <div key={number} className="grid gap-4 border-b border-slate-200 pb-8 sm:grid-cols-[64px_1fr]">
                  <span className="text-2xl font-semibold text-yellow-500">{number}</span>
                  <div><h3 className="text-xl font-semibold">{title}</h3><p className="mt-2 leading-7 text-slate-600">{text}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black text-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between md:py-20 lg:px-8">
            <div><p className="text-sm font-bold uppercase tracking-[0.24em] text-yellow-400">Travel with Abbey Cars</p><h2 className="mt-3 max-w-2xl text-3xl font-semibold sm:text-4xl">Ready to make your next journey simpler?</h2><p className="mt-3 max-w-xl leading-7 text-white/70">Book a local taxi, arrange an airport transfer or speak with our team about your plans.</p></div>
            <div className="flex shrink-0 flex-wrap gap-3"><NavLink to="/booking" className="rounded-full bg-yellow-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-yellow-300">Book online</NavLink><NavLink to="/services" className="rounded-full border border-white/30 px-6 py-3 font-bold text-white transition hover:border-yellow-400 hover:text-yellow-400">Explore services</NavLink></div>
          </div>
        </section>
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
        {category === 'blogs' ? (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
            <article>
              <header className="mb-8">
                <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Blog</p>
                <h1 className="mt-2 text-3xl font-bold text-zinc-900 md:text-5xl">{item.title || item.label}</h1>
                {formattedPublishDate ? <p className="mt-3 text-sm text-zinc-500">Published {formattedPublishDate}</p> : null}
                <button type="button" onClick={handleShare} className="mt-5 inline-flex rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800">
                  {shareLabel}
                </button>
              </header>
              {category === 'blogs' && heroImage ? (
                <img src={heroImage} alt={item.label || item.title} className="mb-8 h-64 w-full rounded-3xl object-cover md:h-96" />
              ) : null}
              {item && item.content ? (
                <div className="blog-detail-content" dangerouslySetInnerHTML={{ __html: removeDuplicateBlogHeading(item.content) }} />
              ) : <div />}
            </article>
            <aside className="h-fit space-y-5 lg:sticky lg:top-6">
              <div className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-4 shadow-sm sm:p-5">
                <h2 className="text-lg font-bold text-zinc-900">Related blogs</h2>
                {relatedPosts.length ? (
                  <div className="mt-4 space-y-3">
                    {relatedPosts.map((post, index) => {
                      const thumbSource = post.featured_image || [homeHeroImage, safetyImage, homeHeroImage][index % 3]
                      const thumbUrl = typeof thumbSource === 'string' ? thumbSource : (thumbSource?.src || homeHeroImage?.src || homeHeroImage)
                      return (
                        <NavLink key={post.slug} to={`/blogs/${post.slug}`} className="group flex gap-3 rounded-2xl border border-zinc-200 bg-white p-2.5 text-left transition hover:-translate-y-0.5 hover:border-yellow-300 hover:shadow-sm">
                          <img src={thumbUrl} alt={post.title} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-600">Read article</p>
                            <span className="mt-1 block text-sm font-semibold leading-5 text-zinc-800 transition group-hover:text-yellow-600">
                              {post.title}
                            </span>
                          </div>
                        </NavLink>
                      )
                    })}
                  </div>
                ) : <p className="mt-3 text-sm leading-6 text-zinc-600">More articles are coming soon.</p>}
              </div>

              <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-black p-4 text-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-yellow-400">App</p>
                    <h3 className="mt-2 text-lg font-semibold text-white">Download our app</h3>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-black">
                    <FaMobileAlt className="text-lg" />
                  </div>
                </div>

                <a
                  href="https://play.google.com/store/apps/details?id=com.abbeycars.passengerapp"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 block rounded-2xl border border-white/10 bg-white p-3 text-center transition hover:border-yellow-400"
                >
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.abbeycars.passengerapp"
                    alt="Google Play QR code for Abbey Cars app"
                    className="mx-auto aspect-square w-full max-w-[170px] object-contain"
                  />
                </a>

                <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300">
                  Scan to download
                </p>
              </div>
            </aside>
          </div>
        ) : null}
        {category !== 'blogs' && item && item.content ? <div dangerouslySetInnerHTML={{ __html: item.content }} /> : null}
      </div>
    </section>
  )
}

export default CategoryPage
