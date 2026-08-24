import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import { getAreas } from '../lib/cms'
import { getApiBase } from '../lib/api'

function Areas() {
  usePageTitle('Areas We Cover')
  const [areas, setAreas] = useState([])
  const apiHost = getApiBase().replace(/\/api\/?$/, '')
  
  const resolveImageUrl = (src) => {
    if (!src) return ''
    const value = String(src).trim()
    if (/^https?:\/\//.test(value)) return value
    return value.startsWith('/') ? `${apiHost}${value}` : `${apiHost}/${value}`
  }

  useEffect(() => {
    const loadAreas = () => {
      const allAreas = getAreas().filter((a) => a.enabled !== false)
      setAreas(allAreas)
    }
    loadAreas()

    // Listen for CMS updates
    const onStorageChange = () => loadAreas()
    const onCmsUpdate = () => loadAreas()
    window.addEventListener('storage', onStorageChange)
    window.addEventListener('cms-data-updated', onCmsUpdate)
    return () => {
      window.removeEventListener('storage', onStorageChange)
      window.removeEventListener('cms-data-updated', onCmsUpdate)
    }
  }, [])

  return (
    <section className="page-card">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black">Areas We Cover</h1>
          <p className="mt-4 text-lg text-gray-600">Premium transfer services across Berkshire and surrounding regions</p>
        </div>

        {areas.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-gray-500">No service areas available at this time.</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area, idx) => (
              <NavLink
                key={`area-${idx}-${area.slug || area.to}`}
                to={area.to}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="aspect-video overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                  {area.featured_image ? (
                    <img src={area.featured_image} alt={area.label} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-sm text-gray-400">Service Area</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-black transition-colors group-hover:text-blue-600">{area.label}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">{area.excerpt || area.meta?.about || 'Premium transfer services'}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-all group-hover:gap-3">
                    View Details
                    <span>→</span>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Areas
