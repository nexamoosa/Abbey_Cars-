import { NavLink } from 'react-router-dom'
import { getFooterPages, getSocialLinks, getSiteSettings } from '../lib/cms'

function SocialIcon({ label, children }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center transition hover:opacity-90"
      style={{
        color: 'var(--site-footer-icon)',
      }}
    >
      {children}
    </a>
  )
}

function Footer() {
  const settings = getSiteSettings()
  const contactInfo = settings.contactInfo || {
    phone: '+44 1234 567890',
    email: 'bookings@abbeycars.com',
    address: 'Reading, Berkshire, UK',
  }
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
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr_1fr]">
          <div>
            <p className="text-2xl font-bold tracking-[0.2em]">Abbey Cars</p>
            <p className="mt-3 max-w-xl text-sm leading-6" >
              Reliable airport transfers, executive travel, and premium chauffeur service across the UK.
            </p>

            <div className="mt-5 flex items-center gap-3">
              {getSocialLinks().length ? (
                getSocialLinks().map((s, idx) => (
                  <a key={idx} href={s.url} target="_blank" rel="noreferrer" aria-label={s.label} className="flex h-10 w-10 items-center justify-center transition hover:opacity-90" >
                    <span className="text-sm">{s.label[0] || 'S'}</span>
                  </a>
                ))
              ) : (
                <>
                  <SocialIcon label="Facebook">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </SocialIcon>
                  <SocialIcon label="Instagram">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
                    </svg>
                  </SocialIcon>
                </>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: 'var(--site-footer-icon)' }}>Quick Links</p>
            <div className="mt-4 grid gap-2 text-sm" style={{ color: 'var(--site-footer-text)' }}>
              <NavLink to="/about" className="transition hover:opacity-90">About</NavLink>
              <NavLink to="/services" className="transition hover:opacity-90">Services</NavLink>
              <NavLink to="/our-fleet" className="transition hover:opacity-90">Our Fleet</NavLink>
              <NavLink to="/areas-we-cover" className="transition hover:opacity-90">Areas We Cover</NavLink>
              <NavLink to="/blogs" className="transition hover:opacity-90">Blogs</NavLink>
             
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: 'var(--site-footer-icon)' }}>Contact</p>
            <div className="mt-4 space-y-3 text-sm" style={{ color: 'var(--site-footer-text)' }}>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center" style={{ color: 'var(--site-footer-icon)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.5 12.5 0 0 0 .7 2.74 2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.34-1.34a2 2 0 0 1 2.11-.45 12.5 12.5 0 0 0 2.74.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <a href={`tel:${contactInfo.phone}`} className="transition hover:opacity-90">{contactInfo.phone}</a>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center" style={{ color: 'var(--site-footer-icon)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16v16H4z" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <a href={`mailto:${contactInfo.email}`} className="transition hover:opacity-90">{contactInfo.email}</a>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center" style={{ color: 'var(--site-footer-icon)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 21s-6-5.58-6-11a6 6 0 0 1 12 0c0 5.42-6 11-6 11z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </span>
                <span>{contactInfo.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t pt-5 text-xs sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: 'var(--site-border)', color: 'var(--site-footer-icon)' }}>
          <p>© 2026 Abbey Cars. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {getFooterPages().filter((p) => p.enabled !== false).length ? (
                getFooterPages().filter((p) => p.enabled !== false).map((p) => (
                  <NavLink key={p.to} to={p.to} className="transition hover:opacity-90">{p.label}</NavLink>
                ))
              ) : (
              <>
                <NavLink to="/privacy" className="transition hover:opacity-90">Privacy Policy</NavLink>
                <NavLink to="/faq" className="transition hover:opacity-90">FAQ</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

