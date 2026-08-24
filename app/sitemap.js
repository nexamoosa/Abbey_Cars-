const publicRoutes = ['', 'about', 'fleet', 'our-fleet', 'services', 'faq', 'areas-we-cover', 'blogs', 'contact', 'booking', 'airport-transfers', 'corporate-travel', 'taxi-reading', 'taxi-wokingham', 'taxi-bracknell']

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return publicRoutes.map((route) => ({
    url: `${baseUrl}/${route}`,
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.7,
  }))
}
