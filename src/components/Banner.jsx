import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { getPages } from '../lib/cms'

function segmentToLabel(seg) {
  return seg.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function Banner() {
  const { pathname } = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  if (!pathname || pathname === '/' || pathname.startsWith('/admin') || pathname === '/contact' || pathname === '/booking' || pathname === '/services' || pathname === '/about/our-story' || /^\/services\/[^/]+$/.test(pathname)) return null

  const parts = pathname.split('/').filter(Boolean)
  let title = segmentToLabel(parts[parts.length - 1] || '')
  if (pathname === '/faq') title = 'How can we help?'

  // check CMS pages for nicer titles on dynamic pages
  if (parts[0] === 'privacy' || parts[0] === 'terms' || parts[0] === 'areas-we-cover') {
    const pages = getPages(parts[0]).filter((pg) => pg.enabled !== false)
    const slug = parts[1]
    const p = pages.find((pg) => (pg.slug || pg.to?.split('/').pop()) === slug)
    if (p) title = p.title || p.label || title
  }

  return (
    <div className="w-full bg-yellow-500 text-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[70vh] flex-col items-center justify-center py-6 text-center">
          <div>
            <div className="text-5xl font-bold tracking-wide text-black">{title}</div>
            {pathname === '/faq' ? (
              <>
                <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-black sm:text-lg">
                  Find quick answers about booking a taxi in Reading, airport transfers, our vehicles and the areas we cover.
                </p>
                <label className="mx-auto mt-7 flex max-w-xl items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left text-slate-900 shadow-lg">
                  <FaSearch className="shrink-0 text-slate-400" aria-hidden="true" />
                  <span className="sr-only">Search frequently asked questions</span>
                  <input
                    type="search"
                    value={searchParams.get('q') || ''}
                    onChange={(event) => {
                      const next = new URLSearchParams(searchParams)
                      if (event.target.value) next.set('q', event.target.value)
                      else next.delete('q')
                      setSearchParams(next, { replace: true })
                    }}
                    placeholder="Search your question"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </label>
              </>
            ) : null}
            {pathname !== '/faq' ? (
              <nav className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-black">
                <Link to="/" className="text-black text-lg hover:underline">Home</Link>
                {parts.map((p, i) => (
                  <span key={i} className="text-lg text-black">/ {segmentToLabel(p)}</span>
                ))}
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
