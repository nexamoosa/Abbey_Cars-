const STORAGE_KEY = 'abbey_cms_v1'
const MAX_DATA_URL_LENGTH = 180000
const MAX_GALLERY_ITEMS = 12

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
  phone: '+44 118 900 0000',
  email: 'hello@abbeycars.com',
  address: '18 Station Road, Reading, Berkshire, RG1 1AA',
  officeHours: 'Mon-Sat: 08:00 - 20:00\nSun: 10:00 - 16:00',
  whatsapp: '+44 7700 900123',
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {
      footerPages: [],
      areas: [],
      privacyPages: [],
      termsPages: [],
      blogPosts: [],
      testimonials: defaultTestimonials,
      siteSettings: { siteTitle: 'Abbey Cars', maintenance: false, favicon: '', contactInfo: defaultContactInfo },
    }
    const parsed = JSON.parse(raw)
    const siteSettings = parsed.siteSettings || {}
    return {
      ...parsed,
      testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : defaultTestimonials,
      siteSettings: {
        siteTitle: siteSettings.siteTitle || 'Abbey Cars',
        maintenance: Boolean(siteSettings.maintenance),
        favicon: siteSettings.favicon || '',
        contactInfo: { ...defaultContactInfo, ...(siteSettings.contactInfo || {}) },
      },
    }
  } catch (e) {
    return { footerPages: [], areas: [], privacyPages: [], termsPages: [], blogPosts: [], testimonials: defaultTestimonials, siteSettings: { siteTitle: 'Abbey Cars', maintenance: false, favicon: '', contactInfo: defaultContactInfo } }
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

export function getSocialLinks() {
  return load().socialLinks || []
}

export function addSocialLink(link) {
  const state = load()
  state.socialLinks = state.socialLinks || []
  state.socialLinks.push(link)
  save(state)
  return link
}

export function updateSocialLink(idx, link) {
  const state = load()
  state.socialLinks = state.socialLinks || []
  if (idx < 0 || idx >= state.socialLinks.length) return null
  state.socialLinks[idx] = { ...state.socialLinks[idx], ...link }
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
  getSocialLinks: () => load().socialLinks || [],
  addSocialLink: (link) => {
    const state = load()
    state.socialLinks = state.socialLinks || []
    state.socialLinks.push(link)
    save(state)
    return link
  },
  updateSocialLink: (idx, link) => {
    const state = load()
    state.socialLinks = state.socialLinks || []
    if (idx < 0 || idx >= state.socialLinks.length) return null
    state.socialLinks[idx] = { ...state.socialLinks[idx], ...link }
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
