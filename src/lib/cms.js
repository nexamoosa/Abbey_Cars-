const STORAGE_KEY = 'abbey_cms_v1'
const MAX_DATA_URL_LENGTH = 180000
const MAX_GALLERY_ITEMS = 12
const DEFAULT_AREA_IMAGE = '/uploads/fleet-images/M-s-class-1786363492-815bb8444d68.jfif'

const defaultTestimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    review: 'Excellent service! The driver was punctual, professional, and the vehicle was immaculate. Highly recommended for airport transfers.',
    service: 'Airport Transfer',
  },
  {
    id: 2,
    name: 'Michael Chen',
    rating: 5,
    review: 'I use Abbey Cars regularly for my commute. Consistent quality, reliable timing, and friendly drivers. Five stars every time.',
    service: 'Local Taxi',
  },
  {
    id: 3,
    name: 'Emma Davies',
    rating: 5,
    review: 'Perfect for our wedding day. The premium vehicle looked stunning in our photos, and the driver was courteous and professional throughout.',
    service: 'Wedding Transport',
  },
  {
    id: 4,
    name: 'David Wilson',
    rating: 5,
    review: 'Booked for a long-distance journey to London. Comfortable ride, competitive pricing, and the online booking was hassle-free.',
    service: 'Long Distance',
  },
]

const defaultContactInfo = {
  phone: '+44 118 945 4545',
  email: 'hello@abbeycars.com',
  address: '18 Station Road, Reading, Berkshire, RG1 1AA',
  officeHours: 'Mon-Sat: 08:00 - 20:00\nSun: 10:00 - 16:00',
}

const defaultAreas = [
  {
    title: 'Taxi in Reading – Fast, Reliable & Affordable Local Taxi Service | Abbey Cars',
    label: 'Taxi in Reading',
    slug: 'reading',
    to: '/areas-we-cover/reading',
    enabled: true,
    status: 'published',
    featured_image: '/uploads/fleet-images/PLATINUM_EXECUTIVE_CARS_-_Facebook-CoverPage-1786357364-5aef72fc4ca0.png',
    excerpt: 'Looking for a dependable taxi in Reading? Abbey Cars provides safe, clean and punctual taxi services across Reading and the surrounding areas, 24 hours a day, 7 days a week.',
    meta: {
      description: 'Reliable local taxi journeys across Reading and the surrounding Berkshire area.',
      breadcrumbs: 'Home > Areas We Cover > Reading',
      services: ['Local taxi journeys', 'Airport transfers'],
    },
    content: '<h2>Taxi in Reading – Fast, Reliable &amp; Affordable Local Taxi Service | Abbey Cars</h2><p>Looking for a dependable taxi in Reading? Whether you need a quick ride across town, a transfer to Reading Station, or a comfortable journey to the airport, Abbey Cars is here to help. We provide safe, clean, and punctual taxi services across Reading and the surrounding areas, 24 hours a day, 7 days a week.</p><p>Our professional drivers know every street, shortcut, and traffic hotspot in Reading. From the town centre and University of Reading to Caversham, Tilehurst, Woodley and Earley, we get you where you need to be on time and without stress.</p><h2>Reliable Taxi Service in Reading for Every Occasion</h2><p>We offer a full range of taxi services tailored to local needs:</p><ul><li>Local taxis in Reading – Perfect for shopping trips, hospital visits, nights out, or simply getting home safely.</li><li>Reading Station transfers – Fast pick-ups and drop-offs at Reading railway station.</li><li>Airport transfers – Comfortable and reliable journeys to Heathrow, Gatwick, Stansted, Luton and Southampton airports.</li><li>University of Reading taxis – Ideal for students, staff and visitors.</li><li>Corporate and business travel – Professional service for meetings and events.</li><li>Hospital appointments – Reliable transport to Royal Berkshire Hospital and other medical centres.</li><li>Wedding and special events – Smart, well-presented vehicles for your special day.</li><li>Night-time and weekend service – Safe travel when public transport options are limited.</li></ul><p>All our vehicles are modern, well-maintained, fully licensed and insured. We offer saloon cars, larger vehicles for groups, and executive options if you prefer a more premium experience.</p><h2>Areas We Cover in and Around Reading</h2><p>Our taxi in Reading service covers the whole town and nearby areas, including:</p><ul><li>Reading town centre</li><li>Caversham</li><li>Tilehurst</li><li>Woodley</li><li>Earley</li><li>University of Reading campus</li><li>Reading Station</li><li>Royal Berkshire Hospital</li><li>GreenPark</li><li>Thames Valley Park</li><li>and surrounding villages</li></ul><p>Wherever you are in the Reading area, simply give us a call or book online and a driver will be on the way.</p><h2>Why Choose Abbey Cars for Your Taxi in Reading?</h2><ul><li>Local knowledge – Our drivers live and work in the Reading area, so they know the quickest routes.</li><li>24/7 availability – Day or night, weekday or weekend, we are always ready.</li><li>Clean, comfortable vehicles – Regularly cleaned and sanitised for your peace of mind.</li><li>Friendly, professional drivers – Courteous, reliable and fully licensed.</li><li>Easy booking – Book through our website in seconds.</li><li>Punctual service – We understand your time is valuable and aim to arrive promptly.</li></ul><p>Whether you’re a local resident, a student, a business traveller or a visitor to Reading, you can count on Abbey Cars for a smooth and stress-free journey.</p><h2>How to Book Your Taxi in Reading</h2><p>Booking a taxi with Abbey Cars is simple and quick:</p><ol><li>Call us on +44 118 945 4545.</li><li>Use the online booking form on our website.</li><li>Tell us your pick-up location, destination and preferred time.</li></ol><p>We’ll confirm your booking straight away and send you driver details when your taxi is on the way. Advance bookings are welcome, and we also accept last-minute requests whenever possible.</p><h2>Frequently Asked Questions</h2><h3>How much does a taxi in Reading cost?</h3><p>Fares depend on distance, time of day and vehicle type. Just contact us with your journey details.</p><h3>Do you provide airport transfers from Reading?</h3><p>Yes. We regularly take passengers to Heathrow, Gatwick, Stansted, Luton and other airports. We monitor flight times and adjust pick-up times if needed.</p><h3>Are your taxis available 24 hours a day?</h3><p>Yes. Our taxi service in Reading operates around the clock, every day of the year.</p><h3>Can I book a taxi for a group?</h3><p>Absolutely. We have larger vehicles available for groups and can arrange multiple cars if required.</p><h3>Do you cover areas outside Reading?</h3><p>Yes. As well as Reading itself, we cover nearby towns and villages. Just let us know your destination when booking.</p><h2>Book Your Taxi in Reading Today</h2><p>Don’t leave your journey to chance. Choose a trusted local taxi service that puts reliability, safety and customer service first. Whether you need a short trip across Reading or a longer transfer, Abbey Cars is ready to help.</p><p>Call +44 118 945 4545 now or book online. We look forward to driving you safely to your destination.</p><p>Abbey Cars – Your local taxi service in Reading.</p>',
  },
]

const defaultBlogPosts = [
  {
    title: 'Abbey Cars vs Uber: Why Local Taxi Service Still Matters in Reading',
    slug: 'abbey-cars-vs-uber-reading',
    enabled: true,
    published: true,
    publishedAt: '2026-08-24',
    excerpt: 'Compare Abbey Cars and Uber in Reading and discover why local drivers, dependable service and direct support can make every journey easier.',
    featured_image: '/uploads/fleet-images/PLATINUM_EXECUTIVE_CARS_-_Facebook-CoverPage-1786357364-5aef72fc4ca0.png',
    meta: {
      title: 'Abbey Cars vs Uber in Reading | Local Taxi Guide',
      description: 'Compare Abbey Cars and Uber in Reading. Learn why local drivers, dependable service and direct support can make your journey easier.',
    },
    content: '<h1>Abbey Cars vs Uber: Why Local Taxi Service Still Matters in Reading</h1><p>When you need a ride in Reading, you may be deciding between a local taxi company and a large app-based service such as Uber. Both options can be useful, but they offer different experiences. The right choice depends on what matters most for your journey: dependable availability, local knowledge, clear communication, comfort and personal service.</p><h2>Local knowledge makes a difference</h2><p>Abbey Cars is built around Reading and the surrounding Berkshire area. Local drivers understand the roads, neighbourhoods, stations, airports and common routes that matter to passengers. That local knowledge helps make journeys smoother, especially when traffic changes or you are travelling to an address that is less familiar to a national platform.</p><h2>Direct support from a local team</h2><p>With Abbey Cars, you have a direct local point of contact for your booking. If your plans change, you have a question, or you need to arrange a journey in advance, speaking with a local team can be simpler than relying only on an app. Clear communication is particularly valuable for airport transfers, early morning pickups, business travel and important events.</p><h2>Booking ahead with confidence</h2><p>App-based rides are often requested when you are already ready to travel. Abbey Cars also supports planned journeys, giving you the opportunity to share your pickup details, destination, date and time in advance. Planning ahead helps you organise airport transfers, station journeys, school runs, long-distance travel and group trips with less last-minute uncertainty.</p><h2>A vehicle suited to your journey</h2><p>Different journeys need different amounts of space. You may be travelling alone, carrying luggage, or arranging transport for several passengers. Abbey Cars offers a fleet designed for a range of local and longer journeys, so your vehicle choice can take account of passenger numbers, luggage and comfort.</p><h2>When Uber may suit you</h2><p>Uber can be convenient when the app is available in your area and you want to request a ride immediately. It may suit passengers who prefer app-based booking and are comfortable with variable availability and pricing. Comparing both options before you travel helps you choose the service that fits your priorities.</p><h2>Why passengers choose Abbey Cars</h2><ul><li>Local drivers who know Reading and Berkshire.</li><li>Advance booking for planned journeys.</li><li>Direct communication with a local taxi team.</li><li>Options for airport transfers, business travel and longer journeys.</li><li>Vehicle choices for different passenger and luggage needs.</li></ul><h2>Choose the service that fits your journey</h2><p>There is no single best option for every passenger. If you value local knowledge, planned bookings and direct support, Abbey Cars is a dependable alternative to an app-only ride. For your next journey in Reading, contact Abbey Cars or request a booking online and share the details of the trip you need.</p><p><a href="/booking">Request a booking with Abbey Cars</a> or <a href="/contact">contact our local team</a> to get started.</p>',
  },
  {
    title: 'Reading to Heathrow Airport Transfers: Planning a Stress-Free Journey',
    slug: 'reading-to-heathrow-airport-transfer-guide',
    enabled: true,
    published: true,
    publishedAt: '2026-08-25',
    excerpt: 'A practical guide to booking a dependable Heathrow airport transfer from Reading, including pickup times, luggage and vehicle choices.',
    featured_image: '/uploads/fleet-images/M-s-class-1786363492-815bb8444d68.jfif',
    meta: {
      title: 'Reading to Heathrow Airport Transfers | Abbey Cars',
      description: 'Plan a reliable Heathrow airport transfer from Reading with Abbey Cars. Learn when to book, what details to provide and how to travel comfortably with luggage.',
    },
    content: '<h1>Reading to Heathrow Airport Transfers: Planning a Stress-Free Journey</h1><p>Travelling from Reading to Heathrow is easier when your airport transfer is planned around your flight, luggage and pickup point. Abbey Cars provides pre-booked airport transfers for passengers who want a clear plan and a dependable local driver.</p><h2>How early should you leave Reading?</h2><p>Allow time for the journey, airport check-in, security and possible traffic delays. When you book, share your flight time and preferred pickup time so our team can help organise a sensible schedule for your journey.</p><h2>Share the right booking details</h2><p>Your pickup address, terminal, travel date, flight time, passenger count and luggage details help us prepare for the journey. Accurate information also makes it easier to choose a vehicle with enough space for everyone and everything you are carrying.</p><h2>Travel comfortably with Abbey Cars</h2><p>Our local taxi team supports airport journeys from Reading and nearby areas. Whether you are travelling for business, a family holiday or an important event, booking ahead gives you one less detail to manage on the day.</p><h2>Book your airport transfer</h2><p>Use the Abbey Cars booking form to send your journey details, or contact our team if you would like to discuss your pickup. We will review the request and contact you to confirm the arrangements.</p>',
  },
  {
    title: 'How to Book a Local Taxi in Reading for Any Journey',
    slug: 'how-to-book-a-local-taxi-reading',
    enabled: true,
    published: true,
    publishedAt: '2026-08-25',
    excerpt: 'Learn how to arrange a local taxi in Reading for everyday journeys, appointments, stations, nights out and longer trips across Berkshire.',
    featured_image: '/uploads/fleet-images/M-Vito__1_-1786374136-b6a3179b2152.jfif',
    meta: {
      title: 'How to Book a Local Taxi in Reading | Abbey Cars',
      description: 'Book a local taxi in Reading with Abbey Cars. Find out what journey details to provide for quick trips, appointments, station transfers and longer travel.',
    },
    content: '<h1>How to Book a Local Taxi in Reading for Any Journey</h1><p>A local taxi is useful for much more than a last-minute trip across town. Abbey Cars helps passengers arrange everyday journeys, station transfers, appointments, nights out and longer travel from Reading and the surrounding area.</p><h2>Start with your pickup and destination</h2><p>Tell us where you would like to be collected and where you are going. A full address or postcode helps our team understand the route and prepare for the right pickup.</p><h2>Choose a date and time</h2><p>For planned journeys, enter your travel date and pickup time when you submit your booking. Booking ahead is especially helpful for early starts, appointments, station journeys and events where arriving on time matters.</p><h2>Tell us about passengers and luggage</h2><p>Passenger numbers and luggage details help us match your journey with a comfortable vehicle. If you are travelling as a group or carrying extra bags, include that information in the booking request.</p><h2>Get local support</h2><p>Abbey Cars is a Reading taxi company with local knowledge of Berkshire routes and communities. If you are unsure about any part of your journey, contact our team before sending your request.</p>',
  },
  {
    title: 'Choosing the Right Vehicle for Business and Group Travel',
    slug: 'choosing-right-vehicle-business-group-travel',
    enabled: true,
    published: true,
    publishedAt: '2026-08-25',
    excerpt: 'The right taxi makes business travel, airport journeys and group bookings more comfortable. Here is what to consider before you book.',
    featured_image: '/uploads/fleet-images/PLATINUM_EXECUTIVE_CARS_-_Facebook-CoverPage-1786357364-5aef72fc4ca0.png',
    meta: {
      title: 'Best Taxi Vehicle for Business and Group Travel | Abbey Cars',
      description: 'Choose a comfortable Abbey Cars vehicle for business travel, airport transfers and group journeys by considering passengers, luggage and comfort.',
    },
    content: '<h1>Choosing the Right Vehicle for Business and Group Travel</h1><p>Vehicle choice can make a real difference to a planned journey. Business passengers may value a calm, comfortable arrival, while groups need enough seating and luggage space for everyone travelling together.</p><h2>Consider the number of passengers</h2><p>Begin with the number of people travelling. A vehicle that gives passengers enough room helps the journey feel more comfortable, particularly on airport transfers and longer trips.</p><h2>Include your luggage details</h2><p>Suitcases, hand luggage and work equipment all take up space. Include your luggage requirements when you book so we can review the most suitable vehicle for the journey.</p><h2>Plan for business travel</h2><p>For meetings, conferences and corporate events, a pre-booked vehicle gives you a clearer travel plan. Share the pickup time and destination in advance so your journey can be organised around your schedule.</p><h2>Arrange your journey with Abbey Cars</h2><p>Abbey Cars offers a range of comfortable vehicles for local taxi journeys, airport transfers and longer travel from Reading. Send your details through our booking form and our team will contact you to confirm the request.</p>',
  },
]

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {
      footerPages: [],
      areas: [],
      privacyPages: [],
      termsPages: [],
      areas: defaultAreas,
      blogPosts: defaultBlogPosts,
      testimonials: defaultTestimonials,
      siteSettings: { siteTitle: 'Abbey Cars', maintenance: false, favicon: '', contactInfo: defaultContactInfo },
    }
    const parsed = JSON.parse(raw)
    const savedBlogs = Array.isArray(parsed.blogPosts) ? parsed.blogPosts : []
    const savedBlogSlugs = new Set(savedBlogs.map((post) => post.slug))
    const blogPosts = [...savedBlogs, ...defaultBlogPosts.filter((post) => !savedBlogSlugs.has(post.slug))]
    const siteSettings = parsed.siteSettings || {}
    return {
      ...parsed,
      areas: Array.isArray(parsed.areas) && parsed.areas.length ? parsed.areas : defaultAreas,
      blogPosts: blogPosts.length ? blogPosts : defaultBlogPosts,
      testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : defaultTestimonials,
      siteSettings: {
        siteTitle: siteSettings.siteTitle || 'Abbey Cars',
        maintenance: Boolean(siteSettings.maintenance),
        favicon: siteSettings.favicon || '',
        contactInfo: { ...defaultContactInfo, ...(siteSettings.contactInfo || {}) },
      },
    }
  } catch (e) {
    return { footerPages: [], areas: defaultAreas, privacyPages: [], termsPages: [], blogPosts: defaultBlogPosts, testimonials: defaultTestimonials, siteSettings: { siteTitle: 'Abbey Cars', maintenance: false, favicon: '', contactInfo: defaultContactInfo } }
  }
}

function compactPayloadForStorage(value, depth = 0) {
  if (typeof value === 'string') {
    if (value.startsWith('data:image/')) {
      return value.length > MAX_DATA_URL_LENGTH ? '' : value
    }
    return value
  }

  if (Array.isArray(value)) {
    const compacted = value.map((item) => compactPayloadForStorage(item, depth + 1))
    if (depth === 0) {
      return compacted.filter((item) => item !== '' && item !== null && item !== undefined).slice(0, MAX_GALLERY_ITEMS)
    }
    return compacted.filter((item) => item !== '' && item !== null && item !== undefined)
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        if (key === 'featured_image' || key === 'image' || key === 'gallery' || key === 'images' || key === 'hero_image') {
          const compacted = compactPayloadForStorage(item, depth + 1)
          return [key, Array.isArray(compacted) ? compacted.slice(0, MAX_GALLERY_ITEMS) : compacted]
        }
        return [key, compactPayloadForStorage(item, depth + 1)]
      })
    )
  }

  return value
}

function save(state) {
  try {
    const payload = JSON.stringify(state)
    localStorage.setItem(STORAGE_KEY, payload)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cms-data-updated', { detail: { key: STORAGE_KEY } }))
    }
    return true
  } catch (error) {
    if (error && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
      try {
        const compactState = compactPayloadForStorage(state)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(compactState))
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cms-data-updated', { detail: { key: STORAGE_KEY } }))
        }
        return true
      } catch (fallbackError) {
        console.error('CMS storage quota exceeded even after compacting payloads.', fallbackError)
        return false
      }
    }
    throw error
  }
}

export function getFooterPages() {
  return load().footerPages || []
}

export function addFooterPage(page) {
  const state = load()
  state.footerPages = state.footerPages || []
  const p = { ...page, enabled: page.enabled !== undefined ? page.enabled : true }
  state.footerPages.push(p)
  save(state)
  return p
}

function normalizeArea(area) {
  if (!area || typeof area !== 'object') return null
  const label = typeof area.label === 'string' ? area.label.trim() : (typeof area.title === 'string' ? area.title.trim() : '')
  const slug = typeof area.slug === 'string' ? area.slug.trim() : (typeof area.to === 'string' ? area.to.split('/').pop() || '' : '')
  const to = typeof area.to === 'string' && area.to.trim() ? area.to.trim() : (slug ? `/areas-we-cover/${slug}` : '')

  if (!label && !slug && !to) return null

  return {
    ...area,
    label: label || slug || 'Service Area',
    slug: slug || to.split('/').pop() || '',
    to: to || `/areas-we-cover/${slug || 'service-area'}`,
    enabled: area.enabled !== false,
  }
}

export function getAreas() {
  const areas = load().areas || []
  return areas
    .map(normalizeArea)
    .map((area) => area?.slug === 'reading' && (!area.featured_image || String(area.featured_image).includes('PLATINUM_EXECUTIVE')) ? { ...area, featured_image: DEFAULT_AREA_IMAGE } : area)
    .filter(Boolean)
    .filter((area) => area.label && (area.slug || area.to))
}

export function addArea(area) {
  const state = load()
  state.areas = state.areas || []
  const a = { ...area, enabled: area.enabled !== undefined ? area.enabled : true }
  state.areas.push(a)
  save(state)
  return a
}

export function updateArea(slug, updated) {
  const state = load()
  state.areas = state.areas || []
  const idx = state.areas.findIndex((p) => p.slug === slug || p.to?.endsWith(slug))
  if (idx === -1) return null
  state.areas[idx] = { ...state.areas[idx], ...updated }
  save(state)
  return state.areas[idx]
}

export function removeArea(slug) {
  const state = load()
  state.areas = state.areas || []
  const idx = state.areas.findIndex((p) => p.slug === slug || p.to?.endsWith(slug))
  if (idx === -1) return false
  state.areas.splice(idx, 1)
  save(state)
  return true
}

export function getPrivacyPages() {
  return load().privacyPages || []
}

export function addPrivacyPage(page) {
  const state = load()
  state.privacyPages = state.privacyPages || []
  const p = { ...page, enabled: page.enabled !== undefined ? page.enabled : true }
  state.privacyPages.push(p)
  // also ensure footer link is added
  state.footerPages = state.footerPages || []
  state.footerPages.push({ to: `/privacy/${p.slug}`, label: p.title })
  save(state)
  return p
}

export function updatePrivacyPage(slug, updated) {
  const state = load()
  state.privacyPages = state.privacyPages || []
  const idx = state.privacyPages.findIndex((p) => p.slug === slug)
  if (idx === -1) return null
  state.privacyPages[idx] = { ...state.privacyPages[idx], ...updated }
  state.footerPages = state.footerPages || []
  const fidx = state.footerPages.findIndex((f) => f.to === `/privacy/${slug}`)
  if (fidx !== -1) state.footerPages[fidx].label = state.privacyPages[idx].title
  save(state)
  return state.privacyPages[idx]
}

export function removePrivacyPage(slug) {
  const state = load()
  state.privacyPages = state.privacyPages || []
  const idx = state.privacyPages.findIndex((p) => p.slug === slug)
  if (idx === -1) return false
  state.privacyPages.splice(idx, 1)
  state.footerPages = state.footerPages || []
  const fidx = state.footerPages.findIndex((f) => f.to === `/privacy/${slug}`)
  if (fidx !== -1) state.footerPages.splice(fidx, 1)
  save(state)
  return true
}

export function getTermsPages() {
  return load().termsPages || []
}

export function addTermsPage(page) {
  const state = load()
  state.termsPages = state.termsPages || []
  const p = { ...page, enabled: page.enabled !== undefined ? page.enabled : true }
  state.termsPages.push(p)
  state.footerPages = state.footerPages || []
  state.footerPages.push({ to: `/terms/${p.slug}`, label: p.title })
  save(state)
  return p
}

export function updateTermsPage(slug, updated) {
  const state = load()
  state.termsPages = state.termsPages || []
  const idx = state.termsPages.findIndex((p) => p.slug === slug)
  if (idx === -1) return null
  state.termsPages[idx] = { ...state.termsPages[idx], ...updated }
  state.footerPages = state.footerPages || []
  const fidx = state.footerPages.findIndex((f) => f.to === `/terms/${slug}`)
  if (fidx !== -1) state.footerPages[fidx].label = state.termsPages[idx].title
  save(state)
  return state.termsPages[idx]
}

export function removeTermsPage(slug) {
  const state = load()
  state.termsPages = state.termsPages || []
  const idx = state.termsPages.findIndex((p) => p.slug === slug)
  if (idx === -1) return false
  state.termsPages.splice(idx, 1)
  state.footerPages = state.footerPages || []
  const fidx = state.footerPages.findIndex((f) => f.to === `/terms/${slug}`)
  if (fidx !== -1) state.footerPages.splice(fidx, 1)
  save(state)
  return true
}

export function getBlogPosts() {
  return load().blogPosts || []
}

export function getDefaultBlogPosts() {
  return defaultBlogPosts
}

export function addBlogPost(page) {
  const state = load()
  state.blogPosts = state.blogPosts || []
  const p = { ...page, enabled: page.enabled !== undefined ? page.enabled : true, to: `/blogs/${page.slug}` }
  state.blogPosts.push(p)
  save(state)
  return p
}

export function updateBlogPost(slug, updated) {
  const state = load()
  state.blogPosts = state.blogPosts || []
  const idx = state.blogPosts.findIndex((p) => p.slug === slug)
  if (idx === -1) return null
  const updatedPost = { ...state.blogPosts[idx], ...updated }
  if (updatedPost.slug) {
    updatedPost.to = `/blogs/${updatedPost.slug}`
  }
  state.blogPosts[idx] = updatedPost
  save(state)
  return state.blogPosts[idx]
}

export function removeBlogPost(slug) {
  const state = load()
  state.blogPosts = state.blogPosts || []
  const idx = state.blogPosts.findIndex((p) => p.slug === slug)
  if (idx === -1) return false
  state.blogPosts.splice(idx, 1)
  save(state)
  return true
}

export function getTestimonials() {
  const testimonials = load().testimonials
  return Array.isArray(testimonials) ? testimonials.filter((testimonial) => testimonial.enabled !== false) : []
}

export function getAllTestimonials() {
  const testimonials = load().testimonials
  return Array.isArray(testimonials) ? testimonials : []
}

export function addTestimonial(testimonial) {
  const state = load()
  state.testimonials = state.testimonials || []
  const item = { ...testimonial, id: Date.now(), enabled: testimonial.enabled !== false }
  state.testimonials.push(item)
  save(state)
  return item
}

export function updateTestimonial(id, updated) {
  const state = load()
  state.testimonials = state.testimonials || []
  const idx = state.testimonials.findIndex((testimonial) => String(testimonial.id) === String(id))
  if (idx === -1) return null
  state.testimonials[idx] = { ...state.testimonials[idx], ...updated }
  save(state)
  return state.testimonials[idx]
}

export function removeTestimonial(id) {
  const state = load()
  state.testimonials = state.testimonials || []
  const idx = state.testimonials.findIndex((testimonial) => String(testimonial.id) === String(id))
  if (idx === -1) return false
  state.testimonials.splice(idx, 1)
  save(state)
  return true
}

export function getSiteSettings() {
  const siteSettings = load().siteSettings || {}
  return {
    siteTitle: siteSettings.siteTitle || 'Abbey Cars',
    maintenance: Boolean(siteSettings.maintenance),
    favicon: siteSettings.favicon || '',
    contactInfo: { ...defaultContactInfo, ...(siteSettings.contactInfo || {}) },
  }
}

export function setSiteSettings(settings) {
  const state = load()
  const next = {
    ...(state.siteSettings || {}),
    ...settings,
    contactInfo: { ...defaultContactInfo, ...((state.siteSettings && state.siteSettings.contactInfo) || {}), ...((settings && settings.contactInfo) || {}) },
  }
  state.siteSettings = next
  save(state)
  return state.siteSettings
}

export function createPage(category, { title, slug, meta = {}, content = '' }) {
  const page = { title, slug, meta, content }
  if (category === 'privacy') return addPrivacyPage(page)
  if (category === 'terms') return addTermsPage(page)
  if (category === 'areas-we-cover' || category === 'area') return addArea({ to: `/areas-we-cover/${slug}`, label: title, slug, meta, content })
  if (category === 'blogs' || category === 'blog') return addBlogPost({ title, slug, meta, content })
  return addFooterPage({ to: `/${category}/${slug}`, label: title, slug, meta, content })
}

export function getPages(category) {
  const state = load()
  if (category === 'privacy') return (state.privacyPages || []).filter((p) => p.enabled !== false)
  if (category === 'terms') return (state.termsPages || []).filter((p) => p.enabled !== false)
  if (category === 'areas-we-cover' || category === 'area') return (state.areas || []).filter((p) => p.enabled !== false)
  if (category === 'footer') return (state.footerPages || []).filter((p) => p.enabled !== false)
  if (category === 'blogs' || category === 'blog') return (state.blogPosts || []).filter((p) => p.enabled !== false)
  return []
}

function inferSocialPlatform(link = {}) {
  const haystack = `${link.label || ''} ${link.url || ''}`.toLowerCase()

  if (haystack.includes('facebook')) return 'facebook'
  if (haystack.includes('instagram')) return 'instagram'
  if (haystack.includes('linkedin')) return 'linkedin'
  if (haystack.includes('youtube') || haystack.includes('youtu.be')) return 'youtube'
  if (haystack.includes('x.com') || haystack.includes('twitter')) return 'x'
  if (haystack.includes('tiktok')) return 'tiktok'
  return 'website'
}

function normalizeSocialLink(link = {}) {
  return {
    label: link.label || 'Social',
    url: link.url || '#',
    icon: inferSocialPlatform(link),
  }
}

export function getSocialLinks() {
  return (load().socialLinks || []).map(normalizeSocialLink)
}

export function addSocialLink(link) {
  const state = load()
  state.socialLinks = state.socialLinks || []
  const normalized = normalizeSocialLink(link)
  state.socialLinks.push(normalized)
  save(state)
  return normalized
}

export function updateSocialLink(idx, link) {
  const state = load()
  state.socialLinks = state.socialLinks || []
  if (idx < 0 || idx >= state.socialLinks.length) return null
  state.socialLinks[idx] = normalizeSocialLink({ ...state.socialLinks[idx], ...link })
  save(state)
  return state.socialLinks[idx]
}

export function removeSocialLink(idx) {
  const state = load()
  state.socialLinks = state.socialLinks || []
  if (idx < 0 || idx >= state.socialLinks.length) return false
  state.socialLinks.splice(idx, 1)
  save(state)
  return true
}

export default {
  getFooterPages,
  addFooterPage,
  getAreas,
  addArea,
  updateArea,
  removeArea,
  getPrivacyPages,
  addPrivacyPage,
  updatePrivacyPage,
  removePrivacyPage,
  getTermsPages,
  addTermsPage,
  updateTermsPage,
  removeTermsPage,
  getBlogPosts,
  addBlogPost,
  updateBlogPost,
  removeBlogPost,
  getTestimonials,
  getAllTestimonials,
  addTestimonial,
  updateTestimonial,
  removeTestimonial,
  getSiteSettings,
  setSiteSettings,
  createPage,
  getPages,
  // social links
  getSocialLinks: () => (load().socialLinks || []).map(normalizeSocialLink),
  addSocialLink: (link) => {
    const state = load()
    state.socialLinks = state.socialLinks || []
    const normalized = normalizeSocialLink(link)
    state.socialLinks.push(normalized)
    save(state)
    return normalized
  },
  updateSocialLink: (idx, link) => {
    const state = load()
    state.socialLinks = state.socialLinks || []
    if (idx < 0 || idx >= state.socialLinks.length) return null
    state.socialLinks[idx] = normalizeSocialLink({ ...state.socialLinks[idx], ...link })
    save(state)
    return state.socialLinks[idx]
  },
  removeSocialLink: (idx) => {
    const state = load()
    state.socialLinks = state.socialLinks || []
    if (idx < 0 || idx >= state.socialLinks.length) return false
    state.socialLinks.splice(idx, 1)
    save(state)
    return true
  },
}
