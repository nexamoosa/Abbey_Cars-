import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Banner from './components/Banner'
import { getSiteSettings } from './lib/cms'

function Layout() {
  const [maintenance, setMaintenance] = useState(getSiteSettings().maintenance)

  useEffect(() => {
    const onStorage = () => setMaintenance(getSiteSettings().maintenance)
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const location = useLocation()
  const isHome = location.pathname === '/' || location.pathname === '/home'
  const isServiceDetail = /^\/services\/[^/]+$/.test(location.pathname)
  const isServicesPage = location.pathname === '/services'

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: 'var(--site-bg)', color: 'var(--site-text)' }}
    >
      {maintenance ? (
        <div className="w-full bg-amber-400 text-black text-center py-2 font-semibold">This website is currently under maintenance.</div>
      ) : null}
      <Header />
      <Banner />

      <main className={`flex-1 ${isHome || isServiceDetail || isServicesPage ? '' : 'py-8'}`} style={{ backgroundColor: 'var(--site-bg)' }}>
        <div className={`${isHome || isServiceDetail || isServicesPage ? 'w-full px-0' : 'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8'}`}>
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Layout

