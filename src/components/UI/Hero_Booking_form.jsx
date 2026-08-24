import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { saveBooking, getFormSettings, getFleet } from '../../lib/api'

// Small self-contained icon set (no external deps) so this component
// never breaks if the shared Icons module doesn't export these names.
const IconBase = ({ children, size = 16, className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
)
const PinIcon = (props) => (
  <IconBase {...props}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </IconBase>
)
const FlagIcon = (props) => (
  <IconBase {...props}>
    <path d="M4 22V4" />
    <path d="M4 4h13l-2 4 2 4H4" />
  </IconBase>
)
const CalendarIcon = (props) => (
  <IconBase {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </IconBase>
)
const ClockIcon = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </IconBase>
)
const UsersIcon = (props) => (
  <IconBase {...props}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </IconBase>
)
const BagIcon = (props) => (
  <IconBase {...props}>
    <rect x="3" y="7" width="18" height="14" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </IconBase>
)
const UserIcon = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
  </IconBase>
)
const PhoneIcon = (props) => (
  <IconBase {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
  </IconBase>
)
const MailIcon = (props) => (
  <IconBase {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 6-10 7L2 6" />
  </IconBase>
)
const SwapIcon = (props) => (
  <IconBase {...props}>
    <path d="M7 3v14M7 3 3 7M7 3l4 4" />
    <path d="M17 21V7M17 21l4-4M17 21l-4-4" />
  </IconBase>
)
const ArrowRightIcon = (props) => (
  <IconBase {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </IconBase>
)
const CheckCircleIcon = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m9 12 2 2 4-4" />
  </IconBase>
)
const AlertIcon = (props) => (
  <IconBase {...props}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    <path d="M12 9v4M12 17h.01" />
  </IconBase>
)

const perks = [
  { icon: CheckCircleIcon, label: 'Fixed, upfront fares' },
  { icon: ClockIcon, label: 'Available 24/7' },
  { icon: UsersIcon, label: 'Professional, vetted drivers' },
]

const inputBaseClass =
  'w-full rounded-xl border border-white/10 bg-black py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-transparent focus:bg-black focus:ring-2'

const labelClass = 'mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400'

function Field({ label, required, icon: Icon, children }) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required && <span style={{ color: 'var(--site-button-bg)' }}>*</span>}
      </label>
      <div className="relative">
        <Icon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        {children}
      </div>
    </div>
  )
}

function Hero_Booking_form() {
  const [form, setForm] = useState({
    pickup: '',
    dropoff: '',
    bookingDate: '',
    bookingTime: '',
    passengers: '1',
    luggage: '1',
    vehicleId: '',
    name: '',
    phone: '',
    email: '',
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [vehicles, setVehicles] = useState([])
  const [accessKeys, setAccessKeys] = useState([])

  const handleChange = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const handleSwap = () => setForm((p) => ({ ...p, pickup: p.dropoff, dropoff: p.pickup }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    if (!form.pickup || !form.dropoff || !form.bookingDate || !form.bookingTime || !form.name || !form.phone || (vehicles.length > 0 && !form.vehicleId)) {
      setStatus({ type: 'error', message: 'Please complete the required fields.' })
      return
    }
    setLoading(true)
    try {
      // build payload and optionally submit to Web3Forms like the admin booking form
      const selectedVehicle = vehicles.find((v) => String(v.id) === String(form.vehicleId))
      const vehicleName = selectedVehicle?.name || ''
      const requestedDateTime = `${form.bookingDate}T${form.bookingTime}`

      const payloadBase = {
        pickup_location: form.pickup,
        dropoff_location: form.dropoff,
        passengers: Number(form.passengers) || 1,
        luggage: String(form.luggage || ''),
        datetime: requestedDateTime,
        vehicle: vehicleName,
        name: form.name,
        phone: form.phone,
        email: form.email,
        subject: 'Booking Request',
        message: `Vehicle: ${vehicleName}\nPickup: ${form.pickup}\nDrop-off: ${form.dropoff}\nPassengers: ${form.passengers}\nLuggage: ${form.luggage}\nDate & Time: ${requestedDateTime}${form.name ? `\nName: ${form.name}` : ''}${form.phone ? `\nPhone: ${form.phone}` : ''}${form.email ? `\nEmail: ${form.email}` : ''}`,
      }

      // Submit to configured Web3Forms access keys (if any) to match admin behaviour
      if (accessKeys.length) {
        const sendResults = await Promise.all(
          accessKeys.map(async (key) => {
            const resp = await fetch('https://api.web3forms.com/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...payloadBase, access_key: key }),
            })
            const result = await resp.json().catch(() => ({}))
            return { ok: resp.ok && result.success, message: result.message || 'Web3Forms submission failed.' }
          })
        )

        const successes = sendResults.filter((r) => r.ok)
        if (!successes.length) {
          throw new Error(sendResults[0]?.message || 'Web3Forms submission failed for all booking keys.')
        }
      }

      // save booking to local API (includes vehicle_id)
      await saveBooking({
        pickup_location: form.pickup,
        dropoff_location: form.dropoff,
        passengers: Number(form.passengers) || 1,
        luggage: String(form.luggage || ''),
        datetime: requestedDateTime,
        vehicle_id: Number(form.vehicleId),
        customer_name: form.name,
        phone: form.phone,
        email: form.email,
        message: payloadBase.message,
      })

      setStatus({ type: 'success', message: 'Booking request submitted successfully.' })
      setForm({ pickup: '', dropoff: '', bookingDate: '', bookingTime: '', passengers: '1', luggage: '1', name: '', phone: '', email: '', vehicleId: '' })
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to send booking.' })
    } finally {
      setLoading(false)
    }
  }

  // load fleet and form settings (access keys)
  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [settings, fleetResp] = await Promise.all([getFormSettings(), getFleet()])
        if (!mounted) return
        const bookingKeys = Array.isArray(settings.accessKeys?.bookingKeys)
          ? settings.accessKeys.bookingKeys
          : settings.accessKeys?.booking
            ? [settings.accessKeys.booking]
            : settings.accessKeys?.bookingBackup
              ? [settings.accessKeys.bookingBackup]
              : []
        setAccessKeys(bookingKeys.map((k) => String(k).trim()).filter(Boolean))
        setVehicles(fleetResp.vehicles || [])
      } catch (e) {
        // ignore — form will still allow saving to local API if keys/fleet unavailable
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <section className="w-full bg-black py-6 sm:py-8 hero-booking-form  relative z-30 pointer-events-auto">
      <style>{`
        .hero-booking-form input,
        .hero-booking-form select,
        .hero-booking-form textarea {
          background-color: #000 !important;
          color: #fff !important;
        }
        .hero-booking-form input::placeholder,
        .hero-booking-form textarea::placeholder {
          color: #fff !important;
          opacity: 1;
        }
        .hero-booking-form select, .hero-booking-form select option { background-color: #000 !important; color: #fff !important; }
        .hero-booking-form input[type='date'],
        .hero-booking-form input[type='time'] {
          color-scheme: dark;
        }
      `}</style>
      <div className="  mx-auto w-full max-w-7xl overflow-visible rounded-3xl  bg-black p-4 sm:p-5 shadow-2xl">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-3 lg:grid-cols-[repeat(4,minmax(0,1fr))]">
            <Field label="Pickup" required icon={PinIcon}>
              <input
                value={form.pickup}
                onChange={handleChange('pickup')}
                className={inputBaseClass}
                style={{ '--tw-ring-color': 'var(--site-button-bg)' }}
                placeholder="Pickup location"
              />
            </Field>
            <Field label="Dropoff" required icon={FlagIcon}>
              <input
                value={form.dropoff}
                onChange={handleChange('dropoff')}
                className={inputBaseClass}
                style={{ '--tw-ring-color': 'var(--site-button-bg)' }}
                placeholder="Dropoff location"
              />
            </Field>
            <Field label="Vehicle" required icon={UsersIcon}>
              <select
                value={form.vehicleId}
                onChange={handleChange('vehicleId')}
                className={`${inputBaseClass} appearance-none bg-black/80 text-white`}
                style={{ '--tw-ring-color': 'var(--site-button-bg)' }}
              >
                <option value="" style={{ backgroundColor: '#000', color: '#fff' }}>{vehicles.length ? 'Choose a vehicle' : 'Any vehicle'}</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id} style={{ backgroundColor: '#000', color: '#fff' }}>{v.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Date" required icon={CalendarIcon}>
              <input
                type="date"
                value={form.bookingDate}
                onChange={handleChange('bookingDate')}
                className={inputBaseClass}
                style={{ '--tw-ring-color': 'var(--site-button-bg)', colorScheme: 'dark' }}
              />
            </Field>
          </div>

          <div className="grid gap-3 lg:grid-cols-[repeat(3,minmax(0,1fr))]">
            <Field label="Time" required icon={ClockIcon}>
              <input
                type="time"
                value={form.bookingTime}
                onChange={handleChange('bookingTime')}
                className={inputBaseClass}
                style={{ '--tw-ring-color': 'var(--site-button-bg)', colorScheme: 'dark' }}
              />
            </Field>
            <Field label="Passengers" icon={UsersIcon}>
              <select
                value={form.passengers}
                onChange={handleChange('passengers')}
                className={`${inputBaseClass} appearance-none bg-black/80 text-white`}
                style={{ '--tw-ring-color': 'var(--site-button-bg)' }}
              >
                <option value="1" style={{ backgroundColor: '#000', color: '#fff' }}>1 passenger</option>
                <option value="2" style={{ backgroundColor: '#000', color: '#fff' }}>2 passengers</option>
                <option value="3" style={{ backgroundColor: '#000', color: '#fff' }}>3 passengers</option>
                <option value="4" style={{ backgroundColor: '#000', color: '#fff' }}>4 passengers</option>
                <option value="5" style={{ backgroundColor: '#000', color: '#fff' }}>5+ passengers</option>
              </select>
            </Field>
            <Field label="Luggage" icon={BagIcon}>
              <select
                value={form.luggage}
                onChange={handleChange('luggage')}
                className={`${inputBaseClass} appearance-none bg-black/80 text-white`}
                style={{ '--tw-ring-color': 'var(--site-button-bg)' }}
              >
                <option value="0" style={{ backgroundColor: '#000', color: '#fff' }}>0 bags</option>
                <option value="1" style={{ backgroundColor: '#000', color: '#fff' }}>1 bag</option>
                <option value="2" style={{ backgroundColor: '#000', color: '#fff' }}>2 bags</option>
                <option value="3" style={{ backgroundColor: '#000', color: '#fff' }}>3 bags</option>
                <option value="4" style={{ backgroundColor: '#000', color: '#fff' }}>4+ bags</option>
              </select>
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Name" required icon={UserIcon}>
              <input
                value={form.name}
                onChange={handleChange('name')}
                className={inputBaseClass}
                style={{ '--tw-ring-color': 'var(--site-button-bg)' }}
                placeholder="Full name"
              />
            </Field>
            <Field label="Phone" required icon={PhoneIcon}>
              <input
                value={form.phone}
                onChange={handleChange('phone')}
                className={inputBaseClass}
                style={{ '--tw-ring-color': 'var(--site-button-bg)' }}
                placeholder="Phone number"
              />
            </Field>
            <Field label="Email" icon={MailIcon}>
              <input
                value={form.email}
                onChange={handleChange('email')}
                className={inputBaseClass}
                style={{ '--tw-ring-color': 'var(--site-button-bg)' }}
                placeholder="Email (optional)"
              />
            </Field>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold shadow-lg transition hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: 'var(--site-button-bg)', color: 'var(--site-button-text)' }}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Sending...
                </>
              ) : (
                <>
                  Request Booking
                  <ArrowRightIcon size={16} />
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-500">
              We only use your information to process and confirm your booking. Read our{' '}
              <a href="https://example.com/privacy" className="font-medium text-slate-300 underline underline-offset-2 hover:text-white" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
              .
            </p>
            {status && (
              <div
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                  status.type === 'error'
                    ? 'bg-red-500/10 text-red-300 ring-1 ring-inset ring-red-500/30'
                    : 'bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/30'
                }`}
              >
                {status.type === 'error' ? <AlertIcon size={16} /> : <CheckCircleIcon size={16} />}
                {status.message}
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}

export default Hero_Booking_form