import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { FiHome, FiBookOpen, FiMail, FiPhone, FiChevronDown, FiChevronLeft, FiChevronRight, FiMenu, FiX, FiUsers, FiBriefcase, FiSuitcase } from './Icons'
import { MdDirectionsCar, MdLocationOn, MdAirlineSeatIndividual, MdInfo } from './Icons'
import { getAreas, getSiteSettings } from '../lib/cms'
import { getApiBase, getFleet } from '../lib/api'
import logoImage from '../assets/iamges/logo-01.png'
import journeyImage from '../assets/iamges/Home page image/HeroImage1.png'
import safetyImage from '../assets/iamges/Home page image/Safety is non-negotiable..png'
import routeImage from '../assets/iamges/Set your route.png'

const navItems = []
const aboutImages = [journeyImage, safetyImage, routeImage, journeyImage]

const dropdowns = [
  {
    label: 'Services',
    to: '/services',
    icon: MdDirectionsCar,
    hasGroups: true,
    groups: [
      {
        label: 'Airport Transfers',
        items: [
          { to: '/services/heathrow-airport-transfers', label: 'Heathrow Airport Transfers' },
          { to: '/services/gatwick-airport-transfers', label: 'Gatwick Airport Transfers' },
          { to: '/services/luton-airport-transfers', label: 'Luton Airport Transfers' },
          { to: '/services/stansted-airport-transfers', label: 'Stansted Airport Transfers' },
        ],
      },
      {
        label: 'Executive Travel',
        items: [
          { to: '/services/corporate-executive-travel', label: 'Corporate & Executive Travel' },
          { to: '/services/wedding-event-cars', label: 'Wedding & Event Cars' },
        ],
      },
      {
        label: 'Local Transport',
        items: [
          { to: '/services/local-long-distance-taxi', label: 'Local & Long Distance Taxi' },
          { to: '/services/station-transfers', label: 'Station Transfers' },
          { to: '/services/school-run-service', label: 'School Run Service' },
        ],
      },
      {
        label: 'Specialist Services',
        items: [
          { to: '/services/courier-parcel-delivery', label: 'Courier & Parcel Delivery' },
          { to: '/services/wheelchair-accessible-vehicles', label: 'Wheelchair Accessible Vehicles' },
        ],
      },
    ],
  },
  {
    label: 'Areas We Cover',
    to: '/areas-we-cover',
    icon: MdLocationOn,
    items: [],
  },
  {
    label: 'Our Fleet',
    to: '/our-fleet',
    icon: MdAirlineSeatIndividual,
    items: [
      { to: '/our-fleet/mercedes-s-class', label: 'Mercedes S Class' },
      { to: '/our-fleet/mercedes-e-class', label: 'Mercedes E Class' },
      { to: '/our-fleet/bmw-7-series', label: 'BMW 7 Series' },
      { to: '/our-fleet/bmw-5-series', label: 'BMW 5 Series' },
      { to: '/our-fleet/mercedes-vito', label: 'Mercedes Vito' },
      { to: '/our-fleet/toyota-prius', label: 'Toyota Prius' },
    ],
  },
  {
    label: 'About',
    to: '/about',
    icon: MdInfo,
    items: [
      { to: '/about/our-story', label: 'Our Story' },
      { to: '/about/reviews-testimonials', label: 'Reviews & Testimonials' },
      { to: '/faq', label: 'FAQ' },
      { to: '/about/privacy-policy', label: 'Privacy Policy' },
    ],
  },
]

function Header() {
  const { pathname } = useLocation()
  const isHome = pathname === '/' || pathname === '/home'
  const primaryPhone = getSiteSettings().contactInfo?.phone || '+44 118 945 4545'
  const primaryPhoneHref = primaryPhone.replace(/\s+/g, '')
  const [showMenu, setShowMenu] = useState(false)
  const [areas, setAreas] = useState(() => getAreas().filter((a) => a.enabled !== false))
  const [fleetItems, setFleetItems] = useState([])
  const [fleetCarouselIndex, setFleetCarouselIndex] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(98)
  const headerRef = useRef(null)
  const apiHost = getApiBase().replace(/\/api\/?$/, '')
  const resolveImageUrl = (src) => {
    if (!src) return ''
    const value = String(src).trim()
    if (/^https?:\/\//.test(value)) return value
    return value.startsWith('/') ? `${apiHost}${value}` : `${apiHost}/${value}`
  }

  const refreshFleetItems = async () => {
    try {
      const res = await getFleet('all')
      setFleetItems(res.vehicles || [])
      setFleetCarouselIndex(0)
    } catch (err) {
      setFleetItems([])
    }
  }

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.getBoundingClientRect().height)
    }
    updateHeaderHeight()
    const observer = new ResizeObserver(updateHeaderHeight)
    if (headerRef.current) observer.observe(headerRef.current)
    window.addEventListener('resize', updateHeaderHeight)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateHeaderHeight)
    }
  }, [])

  useEffect(() => {
    const refreshHeaderData = () => {
      setAreas(getAreas().filter((a) => a.enabled !== false))
      refreshFleetItems()
    }

    const onStorage = () => refreshHeaderData()
    const onCmsUpdate = () => refreshHeaderData()

    window.addEventListener('storage', onStorage)
    window.addEventListener('cms-data-updated', onCmsUpdate)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('cms-data-updated', onCmsUpdate)
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await getFleet('all')
        if (!mounted) return
        setFleetItems(res.vehicles || [])
      } catch (err) {
        // ignore - fallback to static list
      }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!showMenu) return
    let mounted = true
    ;(async () => {
      try {
        const res = await getFleet('all')
        if (!mounted) return
        setFleetItems(res.vehicles || [])
      } catch (err) {
        // ignore
      }
    })()
    return () => { mounted = false }
  }, [showMenu])

  const fleetSource = fleetItems.length > 0 ? fleetItems : dropdowns[2].items
  const fleetPageSize = 3
  const fleetMaxIndex = Math.max(0, fleetSource.length - fleetPageSize)
  const visibleFleetItems = fleetSource.slice(fleetCarouselIndex, fleetCarouselIndex + fleetPageSize)

  const transparentHome = isHome && !scrolled
  const headerText = transparentHome || scrolled ? '#fff' : '#000'
  const headerIcon = headerText
  const pillStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 10px',
    borderRadius: 9999,
  }
  const dropdownPanelStyle = {
    position: 'fixed',
    top: scrolled ? 82 : headerHeight,
    right: 0,
    left: 0,
    width: 'auto',
    height: 'auto',
    transform: 'none',
    zIndex: 100,
  }

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-[200] ${scrolled ? 'shadow-lg' : ''}`}
      style={{
        backgroundColor: transparentHome ? 'transparent' : scrolled ? '#000' : '#fff',
        color: headerText,
        zIndex: 9999,
        transition: 'background-color .65s ease, color .65s ease, box-shadow .65s ease',
      }}
    >
      <div
        className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        style={{ paddingTop: !scrolled ? 20 : undefined, transition: 'padding-top .22s ease' }}
      >
        {/* Logo */}
        <div className="flex-shrink-0">
          <NavLink to="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-2xl bg-[#fde507] shadow-sm">
            <img src={typeof logoImage === 'string' ? logoImage : logoImage.src} alt="Abbey Cars logo" className="h-12 w-auto rounded-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <span className="inline-flex items-center rounded-xl text-[1.5rem] font-black leading-none tracking-[-0.04em] ">Abbey<span className="text-[#fde507]">Cars</span> </span>
            </div>
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center justify-center gap-1 px-8 lg:flex">
          <div style={pillStyle}>

          {/* Services Dropdown */}
          <div className="group relative">
            <NavLink
              to={dropdowns[0].to}
              className={({ isActive }) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive ? 'text-black' : 'text-[#111827] hover:text-[#111827]'
              }`}
              style={{ color: headerText }}
            >
              Services
              <FiChevronDown size={14} className="transition group-hover:rotate-180" />
            </NavLink>
            <div style={dropdownPanelStyle} className="dropdown-shell dropdown-full-width absolute top-full opacity-0 invisible -translate-y-2 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-5 py-5 sm:grid-cols-2 lg:grid-cols-4">
                  {dropdowns[0].groups.map((group) => (
                    <div key={group.label} className="dropdown-group border-b last:border-0 px-2 py-2 sm:border-b-0 sm:border-r sm:last:border-r-0">
                      <p className="dropdown-label mb-2 text-xs font-semibold uppercase">{group.label}</p>
                      {group.items.map((item) => (
                        <NavLink key={item.to || item.slug || item.label} to={item.to} className="dropdown-link block rounded px-2 py-1.5 text-sm">
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Areas We Cover Dropdown */}
          <div className="group relative">
            <NavLink
              to={dropdowns[1].to}
              className={({ isActive }) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive ? 'text-black' : 'text-[#111827] hover:text-[#111827]'
              }`}
              style={{ color: headerText }}
            >
              Areas
              <FiChevronDown size={14} className="transition group-hover:rotate-180" />
            </NavLink>
            <div style={dropdownPanelStyle} className="dropdown-full-width absolute top-full opacity-0 invisible -translate-y-2 transition-all duration-150 ease-out group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto pointer-events-none">
              <div className="dropdown-shell mx-auto max-w-5xl overflow-hidden">
                <div className="grid gap-5 p-5 lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="dropdown-feature rounded-[16px] p-5">
                    <p className="dropdown-label text-[10px] uppercase tracking-[0.35em]">Coverage</p>
                    <h3 className="mt-3 text-xl font-semibold sm:text-2xl">Areas we cover</h3>
                    <p className="mt-3 text-sm leading-6">Explore our most popular service areas and get fast airport or local transfers across Berkshire.</p>
                    <NavLink
                      to="/areas-we-cover"
                      className="dropdown-feature-button mt-5 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition"
                    >
                      View all areas
                    </NavLink>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {areas.slice(0, 8).map((item, idx) => (
                      <NavLink
                        key={`area-${idx}-${item.slug || item.to || item.label}`}
                        to={item.to}
                        className="dropdown-card group overflow-hidden rounded-[12px] border text-sm font-medium transition"
                      >
                        <div className="aspect-[5/3] overflow-hidden bg-gradient-to-br from-yellow-50 to-zinc-100">
                          {item.featured_image ? (
                            <img src={resolveImageUrl(item.featured_image)} alt={item.label} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.18em] text-zinc-400">Service area</div>
                          )}
                        </div>
                        <div className="bg-white px-3 py-2.5">
                          <p className="truncate text-sm font-semibold text-zinc-900">{item.label}</p>
                        </div>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Fleet Dropdown */}
          <div className="group relative">
            <NavLink
              to={dropdowns[2].to}
              className={({ isActive }) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive ? 'text-black' : 'text-[#111827] hover:text-[#111827]'
              }`}
              style={{ color: headerText }}
            >
              Fleet
              <FiChevronDown size={14} className="transition group-hover:rotate-180" />
            </NavLink>
            <div style={dropdownPanelStyle} className="dropdown-full-width absolute top-full opacity-0 invisible -translate-y-2 transition-all duration-150 ease-out group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto pointer-events-none">
              <div className="dropdown-shell mx-auto max-w-7xl overflow-hidden">
                <div className="grid gap-5 p-5 lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="dropdown-feature rounded-[16px] p-5">
                    <p className="dropdown-label text-[10px] uppercase tracking-[0.35em]">Premium fleet</p>
                    <h3 className="mt-3 text-xl font-semibold sm:text-2xl">Modern vehicles, executive comfort</h3>
                    <p className="mt-3 text-sm leading-6">A refined collection of ready-to-book cars, selected for business travel, airport transfers, and VIP journeys.</p>
                    <NavLink
                      to="/our-fleet"
                      className="dropdown-feature-button mt-5 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition"
                    >
                      View full fleet
                    </NavLink>
                  </div>

                  <div className="min-w-0">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="dropdown-label text-[10px] uppercase tracking-[0.3em]">Browse the fleet</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          aria-label="Previous fleet vehicles"
                          disabled={fleetCarouselIndex === 0}
                          onClick={() => setFleetCarouselIndex((index) => Math.max(0, index - 1))}
                          className="dropdown-carousel-button"
                        >
                          <FiChevronLeft size={14} />
                        </button>
                        <button
                          type="button"
                          aria-label="Next fleet vehicles"
                          disabled={fleetCarouselIndex >= fleetMaxIndex}
                          onClick={() => setFleetCarouselIndex((index) => Math.min(fleetMaxIndex, index + 1))}
                          className="dropdown-carousel-button"
                        >
                          <FiChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="grid min-w-0 gap-3 sm:grid-cols-3">
                    {visibleFleetItems.map((vehicle) => {
                      return (
                        <NavLink
                          key={vehicle.id || vehicle.to}
                          to={vehicle.id ? `/our-fleet?vehicle=${vehicle.id}` : vehicle.to}
                          className="dropdown-card group relative min-w-0 overflow-hidden rounded-[14px] transition duration-150 ease-out hover:-translate-y-1 hover:shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                        >
                          <div className="overflow-hidden bg-slate-100">
                            <div className="aspect-[5/3] overflow-hidden">
                              {vehicle.image ? (
                                <img src={resolveImageUrl(vehicle.image)} alt={vehicle.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                              ) : (
                                <div className="flex h-full items-center justify-center text-[10px] text-slate-400">Fleet vehicle</div>
                              )}
                            </div>
                          </div>
                          <div className="bg-white px-3 py-2">
                            <p className="truncate text-xs font-semibold text-slate-900">{vehicle.name || vehicle.label}</p>
                            <p className="mt-1 truncate text-[10px] uppercase tracking-[0.2em] text-slate-500">{vehicle.category || 'Executive vehicle'}</p>
                          </div>
                        </NavLink>
                      )
                    })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Dropdown */}
          <div className="group relative">
            <NavLink
              to={dropdowns[3].to}
              className={({ isActive }) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive ? 'text-black' : 'text-[#111827] hover:text-[#111827]'
              }`}
              style={{ color: headerText }}
            >
              About
              <FiChevronDown size={14} className="transition group-hover:rotate-180" />
            </NavLink>
            <div style={dropdownPanelStyle} className="dropdown-shell dropdown-full-width absolute top-full opacity-0 invisible -translate-y-2 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
              <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {dropdowns[3].items.map((item, index) => (
                    <NavLink key={item.to || item.slug || item.label} to={item.to} className="dropdown-card group overflow-hidden rounded-xl text-sm">
                      <div className="relative aspect-[2.4/1] overflow-hidden bg-yellow-400">
                        <img src={typeof aboutImages[index] === 'string' ? aboutImages[index] : aboutImages[index].src} alt="" className="h-full w-full object-cover opacity-85 transition duration-300 group-hover:scale-105" />
                        <span className="absolute inset-0 bg-black/25" />
                      </div>
                      <div className="bg-white px-4 py-3 font-semibold text-zinc-900 transition group-hover:bg-yellow-400">
                        {item.label}
                      </div>
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive ? 'text-black' : 'text-[#111827] hover:text-[#111827]'
              }`
            }
            style={{ color: headerText }}
          >
            Contact Us
          </NavLink>
          <NavLink
            to="/blogs"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive ? 'text-black' : 'text-[#111827] hover:text-[#111827]'
              }`
            }
            style={{ color: headerText }}
          >
            Blogs
          </NavLink>
          </div>
        </nav>

        {/* Booking Button & Mobile Menu */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={`tel:${primaryPhoneHref}`}
              aria-label="Call Abbey Cars"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full transition"
              style={{
                color: headerIcon,
              }}
            >
              <FiPhone size={18} style={{ color: headerIcon }} />
            </a>
            <NavLink
              to="/contact"
              aria-label="Contact Abbey Cars"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full transition"
              style={{
                color: headerIcon,
              }}
            >
              <FiMail size={18} style={{ color: headerIcon }} />
            </NavLink>
            <NavLink
              to="/booking"
              className="inline-flex items-center justify-center rounded-2xl bg-[#fde507] px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-400"
              style={{
                backgroundColor: 'var(--site-button-bg)',
                color: 'var(--site-button-text)',
              }}
            >
              Book Now
              
            </NavLink>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border bg-transparent p-2 text-sm lg:hidden"
            aria-expanded={showMenu}
            onClick={() => setShowMenu((value) => !value)}
            style={{
              borderColor: scrolled ? 'rgba(255,255,255,0.28)' : 'rgba(15, 23, 42, 0.12)',
              color: headerIcon,
            }}
          >
            {showMenu ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="border-t border-slate-200 bg-[#f4f5f6] px-4 py-4 text-slate-950 shadow-xl lg:hidden">
          <div className="space-y-2">
            {navItems.map((item) => {
              return (
                <NavLink
                  key={item.to || item.slug || item.label}
                  to={item.to}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 hover:bg-white"
                  onClick={() => setShowMenu(false)}
                >
                  {item.label}
                </NavLink>
              )
            })}

            <details className="group">
              <summary className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 hover:bg-white" onClick={(e) => {
                // Navigate to Services page when clicking the summary
                if (e.target.tagName !== 'A') {
                  window.location.href = dropdowns[0].to
                }
              }}>
                Services
              </summary>
              <div className="ml-4 space-y-1 border-l border-slate-300 py-2 pl-2">
                {dropdowns[0].groups.map((group) => (
                  <details key={group.label} className="group/sub">
                    <summary className="cursor-pointer text-xs font-semibold uppercase text-slate-500 hover:text-slate-900">
                      {group.label}
                    </summary>
                    <div className="ml-2 space-y-1 py-1 pl-2">
                      {group.items.map((item) => (
                        <NavLink
                          key={item.to || item.slug || item.label}
                          to={item.to}
                          className="block rounded px-2 py-1 text-sm text-slate-600 hover:bg-white hover:text-slate-950"
                          onClick={() => setShowMenu(false)}
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </details>

            <details className="group">
              <summary className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 hover:bg-white" onClick={(e) => {
                if (e.target.tagName !== 'A') {
                  window.location.href = dropdowns[1].to
                }
              }}>
                Areas We Cover
              </summary>
              <div className="ml-4 space-y-1 border-l border-slate-300 py-2 pl-2">
                {areas.map((item) => (
                  <NavLink
                    key={item.to || item.slug || item.label}
                    to={item.to}
                    className="block rounded px-2 py-1 text-sm text-slate-600 hover:bg-white hover:text-slate-950"
                    onClick={() => setShowMenu(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </details>

            {/* Mobile third group hidden per request */}

            <details className="group">
              <summary className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 hover:bg-white" onClick={(e) => {
                if (e.target.tagName !== 'A') {
                  window.location.href = dropdowns[3].to
                }
              }}>
                About
              </summary>
              <div className="ml-4 space-y-1 border-l border-slate-300 py-2 pl-2">
                {dropdowns[3].items.map((item) => (
                  <NavLink
                    key={item.to || item.slug || item.label}
                    to={item.to}
                    className="block rounded px-2 py-1 text-sm text-slate-600 hover:bg-white hover:text-slate-950"
                    onClick={() => setShowMenu(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </details>

            <NavLink
              to="/contact"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 hover:bg-white"
              onClick={() => setShowMenu(false)}
            >
              Contact Us
            </NavLink>

            <NavLink
              to="/blogs"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 hover:bg-white"
              onClick={() => setShowMenu(false)}
            >
              Blogs
            </NavLink>

          </div>
        </div>
      )}
    </header>
  )
}

export default Header
