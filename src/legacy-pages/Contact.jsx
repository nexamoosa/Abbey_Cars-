import { useEffect, useState } from 'react'
import { getFormSettings, saveContact } from '../lib/api'
import { getSiteSettings } from '../lib/cms'
import usePageTitle from '../hooks/usePageTitle'

const defaultContactInfo = {
  phone: '+44 118 900 0000',
  email: 'hello@abbeycars.com',
  address: '18 Station Road, Reading, Berkshire, RG1 1AA',
  officeHours: 'Mon-Sat: 08:00 - 20:00\nSun: 10:00 - 16:00',
  whatsapp: '+44 7700 900123',
}

function Contact() {
  usePageTitle('Contact')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  })
  const [accessKeys, setAccessKeys] = useState([])
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [contactInfo, setContactInfo] = useState(defaultContactInfo)

  useEffect(() => {
    const settings = getSiteSettings()
    setContactInfo({ ...defaultContactInfo, ...(settings.contactInfo || {}) })

    const loadSettings = async () => {
      try {
        const data = await getFormSettings()
        const contactKeys = Array.isArray(data.accessKeys?.contactKeys)
          ? data.accessKeys.contactKeys
          : data.accessKeys?.contact
            ? [data.accessKeys.contact]
            : data.accessKeys?.contactBackup
              ? [data.accessKeys.contactBackup]
              : []
        setAccessKeys(contactKeys)
      } catch (error) {
        setStatus({ type: 'error', message: 'Unable to load contact form settings.' })
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const updateFormField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setStatus(null)
  }

  const validate = () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim() || !form.message.trim()) {
      setStatus({ type: 'error', message: 'Please fill in all required fields before sending.' })
      return false
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(form.email)) {
      setStatus({ type: 'error', message: 'Please provide a valid email address.' })
      return false
    }

    if (!accessKeys.length) {
      setStatus({ type: 'error', message: 'Contact form access key is not configured in Admin.' })
      return false
    }

    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus(null)

    if (!validate()) return

    const payloadBase = {
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      phone: form.phone,
      message: form.message,
      subject: 'Contact Form Submission',
    }

    try {
      const sendResults = await Promise.all(accessKeys.map(async (key) => {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payloadBase, access_key: key }),
        })
        const result = await response.json()
        return { ok: response.ok && result.success, message: result.message || 'Web3Forms submission failed.' }
      }))

      const successes = sendResults.filter((result) => result.ok)
      if (!successes.length) {
        throw new Error(sendResults[0]?.message || 'Web3Forms submission failed for all contact keys.')
      }

      await saveContact({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        message: form.message,
      })

      setForm({ firstName: '', lastName: '', email: '', phone: '', message: '' })
      setStatus({ type: 'success', message: 'Your message was sent successfully. We will contact you shortly.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to send the message. Please try again later.' })
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
        <div className="grid gap-8 bg-white p-5 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-slate-500">Contact Abbey Cars</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-5xl">Get in touch</h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">We’d love to hear from you. Whether you need a booking, a quote, or local travel advice, our team is here to help.</p>

            <div className="mt-6 overflow-hidden rounded-[26px] border border-white/40 bg-white/40 shadow-[0_18px_35px_rgba(15,23,42,0.06)]">
              <div
                className="h-[260px] w-full bg-cover bg-center sm:h-[320px]"
                style={{
                  backgroundImage: "url('https://i.pinimg.com/1200x/0d/a7/1f/0da71fc07695dff59adb2ef00eb698f8.jpg')",
                }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.07)] backdrop-blur-sm sm:p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-slate-900">Contact us</h2>
              <p className="mt-1 text-sm text-slate-500">We’d love to hear from you.</p>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  First name
                  <input
                    value={form.firstName}
                    onChange={(e) => updateFormField('firstName', e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-slate-400"
                    placeholder="First name"
                    required
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Last name
                  <input
                    value={form.lastName}
                    onChange={(e) => updateFormField('lastName', e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-slate-400"
                    placeholder="Last name"
                    required
                  />
                </label>
              </div>

              <label className="block text-sm font-medium text-slate-700">
                Email address
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateFormField('email', e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-slate-400"
                  placeholder="Your email address"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Phone number
                <input
                  value={form.phone}
                  onChange={(e) => updateFormField('phone', e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-slate-400"
                  placeholder="Your phone number"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Message
                <textarea
                  value={form.message}
                  onChange={(e) => updateFormField('message', e.target.value)}
                  className="mt-2 min-h-[120px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-slate-400"
                  placeholder="Your message here"
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-full bg-yellow-500 px-4 py-3 text-sm font-semibold text-black font-bold transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-75"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>

            {status ? (
              <div className={`mt-4 rounded-xl px-3 py-3 text-sm ${status.type === 'success' ? 'border border-emerald-200 bg-emerald-50 text-emerald-700' : 'border border-red-200 bg-red-50 text-red-700'}`}>
                {status.message}
              </div>
            ) : null}
          </form>
        </div>

        <div className="mt-8 grid gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:grid-cols-3 md:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Email</p>
            <a href={`mailto:${contactInfo.email}`} className="mt-2 block text-base font-semibold text-slate-900">{contactInfo.email}</a>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Phone</p>
            <a href={`tel:${contactInfo.phone}`} className="mt-2 block text-base font-semibold text-slate-900">{contactInfo.phone}</a>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Address</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{contactInfo.address}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
