import { useEffect, useMemo, useState } from 'react'
import { getFormSettings, getFleet, saveBooking } from '../lib/api'
import { FiCalendar, FiClock } from '../components/Icons'
import usePageTitle from '../hooks/usePageTitle'

function Booking() {
  usePageTitle('Booking')
  const [form, setForm] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    passengers: 1,
    luggage: '1',
    bookingDate: '',
    bookingTime: '',
    vehicleId: '',
    name: '',
    phone: '',
    email: '',
  })
  const [accessKeys, setAccessKeys] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [settings, vehiclesData] = await Promise.all([
          getFormSettings(),
          getFleet(),
        ])
        const bookingKeys = Array.isArray(settings.accessKeys?.bookingKeys)
          ? settings.accessKeys.bookingKeys
          : settings.accessKeys?.booking
            ? [settings.accessKeys.booking]
            : settings.accessKeys?.bookingBackup
              ? [settings.accessKeys.bookingBackup]
              : []
        setAccessKeys(bookingKeys)
        setVehicles(vehiclesData.vehicles || [])
      } catch (error) {
        setStatus({ type: 'error', message: 'Unable to load booking form data.' })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const validate = () => {
    if (
      !form.pickupLocation.trim() ||
      !form.dropoffLocation.trim() ||
      !form.passengers ||
      !form.luggage.trim() ||
      !form.bookingDate.trim() ||
      !form.bookingTime.trim() ||
      !form.vehicleId
    ) {
      setStatus({ type: 'error', message: 'Please fill in all required booking fields.' })
      return false
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' })
      return false
    }

    if (!accessKeys.length) {
      setStatus({ type: 'error', message: 'Booking form access key is not configured in Admin.' })
      return false
    }

    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus(null)
    if (!validate()) return

    const selectedVehicle = vehicles.find((v) => String(v.id) === String(form.vehicleId))
    const vehicleName = selectedVehicle?.name || ''
    const requestedDateTime = `${form.bookingDate}T${form.bookingTime}`
    const payloadBase = {
      pickup_location: form.pickupLocation,
      dropoff_location: form.dropoffLocation,
      passengers: form.passengers,
      luggage: form.luggage,
      datetime: requestedDateTime,
      vehicle: vehicleName,
      name: form.name,
      phone: form.phone,
      email: form.email,
      subject: 'Booking Request',
      message: `Vehicle: ${vehicleName}\nPickup: ${form.pickupLocation}\nDrop-off: ${form.dropoffLocation}\nPassengers: ${form.passengers}\nLuggage: ${form.luggage}\nDate & Time: ${requestedDateTime}${form.name ? `\nName: ${form.name}` : ''}${form.phone ? `\nPhone: ${form.phone}` : ''}${form.email ? `\nEmail: ${form.email}` : ''}`,
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
        throw new Error(sendResults[0]?.message || 'Web3Forms submission failed for all booking keys.')
      }

      await saveBooking({
        pickup_location: form.pickupLocation,
        dropoff_location: form.dropoffLocation,
        passengers: form.passengers,
        luggage: form.luggage,
        datetime: requestedDateTime,
        vehicle_id: Number(form.vehicleId),
        customer_name: form.name,
        phone: form.phone,
        email: form.email,
        message: payloadBase.message,
      })

      setForm({
        pickupLocation: '',
        dropoffLocation: '',
        passengers: 1,
        luggage: '1',
        bookingDate: '',
        bookingTime: '',
        vehicleId: '',
        name: '',
        phone: '',
        email: '',
      })
      setStatus({ type: 'success', message: 'Booking request submitted successfully.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Unable to submit booking. Please try again later.' })
    }
  }

  const vehicleOptions = useMemo(() => vehicles.filter((v) => (v.status || '').toLowerCase() !== 'inactive'), [vehicles])

  return (
    <section className="page-card max-w-4xl mx-auto">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Booking</h1>
          <p className="mt-2 text-sm text-zinc-600">Reserve your vehicle and choose your pickup details below.</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="grid gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Pickup Location / ZIP Code
              <input
                name="pickup-location"
                autoComplete="off"
                value={form.pickupLocation}
                onChange={(e) => setForm((prev) => ({ ...prev, pickupLocation: e.target.value }))}
                className="mt-2 rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none focus:border-black"
                required
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Drop-off Location / ZIP Code
              <input
                name="dropoff-location"
                autoComplete="off"
                value={form.dropoffLocation}
                onChange={(e) => setForm((prev) => ({ ...prev, dropoffLocation: e.target.value }))}
                className="mt-2 rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none focus:border-black"
                required
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Number of Passengers
              <input
                name="passenger-count"
                autoComplete="off"
                type="number"
                min="1"
                value={form.passengers}
                onChange={(e) => setForm((prev) => ({ ...prev, passengers: Number(e.target.value) }))}
                className="mt-2 rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none focus:border-black"
                required
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Luggage
              <input
                name="luggage-count"
                autoComplete="off"
                value={form.luggage}
                onChange={(e) => setForm((prev) => ({ ...prev, luggage: e.target.value }))}
                className="mt-2 rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none focus:border-black"
                required
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              <span className="flex items-center gap-2"><FiCalendar size={15} className="text-zinc-500" /> Date</span>
              <input
                type="date"
                name="booking-date"
                autoComplete="off"
                value={form.bookingDate}
                onChange={(e) => setForm((prev) => ({ ...prev, bookingDate: e.target.value }))}
                className="mt-2 rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none focus:border-black"
                required
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              <span className="flex items-center gap-2"><FiClock size={15} className="text-zinc-500" /> Time</span>
              <input
                type="time"
                name="booking-time"
                autoComplete="off"
                value={form.bookingTime}
                onChange={(e) => setForm((prev) => ({ ...prev, bookingTime: e.target.value }))}
                className="mt-2 rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none focus:border-black"
                required
              />
            </label>
          </div>

          <label className="flex flex-col text-sm font-medium text-zinc-700">
            Select Vehicle
            <select
              value={form.vehicleId}
              onChange={(e) => setForm((prev) => ({ ...prev, vehicleId: e.target.value }))}
              className="mt-2 rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none focus:border-black"
              required
            >
              <option value="">Choose a vehicle</option>
              {vehicleOptions.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Name
              <input
                name="customer-name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="mt-2 rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none focus:border-black"
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Phone Number
              <input
                name="customer-phone"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                className="mt-2 rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none focus:border-black"
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-zinc-700">
              Email Address
              <input
                name="customer-email"
                autoComplete="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="mt-2 rounded-2xl border border-zinc-300 bg-zinc-50 px-4 py-3 outline-none focus:border-black"
              />
            </label>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
           
            <button
              type="submit"
              className="w-full rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-900"
              disabled={loading}
            >
              Book Now
            </button>
          </div>

          {status ? (
            <div className={`rounded-2xl px-4 py-3 text-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {status.message}
            </div>
          ) : null}
        </form>
      </div>
    </section>
  )
}

export default Booking
