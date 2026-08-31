import { NavLink } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaXTwitter, FaTiktok, FaGlobe } from 'react-icons/fa6'
import logoImage from '../assets/iamges/logo-01.png'
import { getFooterPages, getSocialLinks, getSiteSettings } from '../lib/cms'

const serviceLinks = [
  { id: 'airport', label: 'Airport Transfers', to: '/services/airport-transfers' },
  { id: 'local', label: 'Local Taxi', to: '/services/local-long-distance-taxi' },
  { id: 'corporate', label: 'Corporate Travel', to: '/services/corporate-executive-travel' },
  { id: 'executive', label: 'Executive Travel', to: '/services/corporate-executive-travel' },
]

const fleetLinks = [
  { label: 'Mercedes S Class', to: '/booking?vehicle=mercedes-s-class' },
  { label: 'Mercedes E Class', to: '/booking?vehicle=mercedes-e-class' },
  { label: 'BMW 7 Series', to: '/booking?vehicle=bmw-7-series' },
  { label: 'Mercedes Vito', to: '/booking?vehicle=mercedes-vito' },
]

const socialIconMap = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  x: FaXTwitter,
  tiktok: FaTiktok,
  website: FaGlobe,
}

function getSocialIcon(platform = 'website') {
  return socialIconMap[platform] || FaGlobe
}

function Footer() {
  const settings = getSiteSettings()
  const contactInfo = settings.contactInfo || {
    phone: '+44 118 945 4545',
    email: 'hello@abbeycars.com',
    address: 'Reading, Berkshire, UK',
  }
  const socialLinks = getSocialLinks().length ? getSocialLinks() : [
    { label: 'Facebook', url: 'https://facebook.com' },
    { label: 'Instagram', url: 'https://instagram.com' },
    { label: 'LinkedIn', url: 'https://linkedin.com' },
  ]

  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: '#000',
        color: 'var(--site-footer-text)',
        borderColor: 'var(--site-border)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1.15fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-yellow-400 p-2 shadow-[0_0_20px_rgba(250,204,21,0.35)]">
                <img src={typeof logoImage === 'string' ? logoImage : logoImage.src} alt="Abbey Cars logo" className="h-full w-full object-contain" />
              </div>
              <div className="leading-none">
                <p className="text-3xl font-black tracking-[-0.05em] text-white">AbbeyCars</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Premium travel, Reading</p>
              </div>
            </div>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
              Reliable airport transfers, executive travel, and comfortable taxi services across Reading and the surrounding Berkshire areas.
            </p>

            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map((s, idx) => {
                const Icon = getSocialIcon(s.icon || 'website')
                return (
                  <a
                    key={`${s.label}-${idx}`}
                    href={s.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition duration-200 hover:-translate-y-0.5 hover:border-yellow-400 hover:text-yellow-400"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-400">Our Services</p>
            <div className="mt-4 grid gap-2.5 text-sm text-slate-300">
              {serviceLinks.map((link) => (
                <NavLink key={link.id} to={link.to} className="transition hover:text-white hover:translate-x-0.5">{link.label}</NavLink>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-400">Our Fleet</p>
            <div className="mt-4 grid gap-2.5 text-sm text-slate-300">
              {fleetLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className="transition hover:text-white hover:translate-x-0.5">{link.label}</NavLink>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-400">Contact</p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <a href={`tel:${contactInfo.phone?.replace(/\s+/g, '')}`} className="block transition hover:text-white">{contactInfo.phone}</a>
              <a href={`mailto:${contactInfo.email}`} className="block transition hover:text-white">{contactInfo.email}</a>
              <p className="leading-6">{contactInfo.address}</p>
              {contactInfo.officeHours ? <p className="leading-6 text-slate-400">{contactInfo.officeHours}</p> : null}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Abbey Cars. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            {getFooterPages().filter((p) => p.enabled !== false).length ? (
              getFooterPages().filter((p) => p.enabled !== false).map((p) => (
                <NavLink key={p.to} to={p.to} className="transition hover:text-white">{p.label}</NavLink>
              ))
            ) : (
              <>
                <NavLink to="/about/privacy-policy" className="transition hover:text-white">Privacy Policy</NavLink>
                <NavLink to="/faq" className="transition hover:text-white">FAQ</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

