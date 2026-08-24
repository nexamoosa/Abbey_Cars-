import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getFormSettings, getFleet, getApiBase, saveBooking } from '../lib/api'
import { MdDirectionsCar } from '../components/Icons'
import { FiBell, FiStar, FiCalendar, FiClock } from '../components/Icons'
import CarCard from '../components/CarCard'
import usePageTitle from '../hooks/usePageTitle'

function Fleet() {
  usePageTitle('Our Fleet')
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [bookingForm, setBookingForm] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    passengers: 1,
    luggage: '1',
    bookingDate: '',
    bookingTime: '',
    name: '',
    phone: '',
    email: '',
    rating: 5,
  })
  const [bookingStatus, setBookingStatus] = useState(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingAccessKeys, setBookingAccessKeys] = useState([])
  const [ratingModalOpen, setRatingModalOpen] = useState(false)
  const [postBookingRating, setPostBookingRating] = useState(0)
  const location = useLocation()

  const apiHost = getApiBase().replace(/\/api\/?$/, '')
  const resolveImageUrl = (src) => {
    if (!src) return ''
    const trimmed = String(src).trim()
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
    if (trimmed.startsWith('/')) return `${apiHost}${trimmed}`
    return `${apiHost}/${trimmed}`
  }

  useEffect(() => {
    let mounted = true
    const loadFleet = async () => {
      setLoading(true)
      setError(null)
      try {
        const [fleetResponse, settingsResponse] = await Promise.all([getFleet('all'), getFormSettings()])
        if (mounted) {
          setVehicles(fleetResponse.vehicles || [])
          const keys = Array.isArray(settingsResponse.accessKeys?.bookingKeys)
            ? settingsResponse.accessKeys.bookingKeys.map((key) => String(key).trim()).filter(Boolean)
            : []
          setBookingAccessKeys(keys)
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Unable to load fleet data.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadFleet()
    return () => { mounted = false }
  }, [])

  const visibleVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const status = String(vehicle.status ?? '').trim().toLowerCase()
      return status === '' || status === 'available'
    })
  }, [vehicles])

  useEffect(() => {
    if (loading || !vehicles.length) return
    const params = new URLSearchParams(location.search)
    const vehicleId = params.get('vehicle')
    if (!vehicleId) return
    const target = vehicles.find((vehicle) => String(vehicle.id) === String(vehicleId))
    if (!target) return
    setSelectedVehicle(target)
    setBookingForm((prev) => ({
      ...prev,
      passengers: target.passengers || 1,
      luggage: String(target.hand_carries ?? 1),
      rating: Number(target.rating ?? 5),
    }))
    setBookingStatus(null)
    setPostBookingRating(0)
    setBookingModalOpen(true)
  }, [location.search, loading, vehicles])

  const mostBooked = useMemo(() => {
    return visibleVehicles.reduce((best, vehicle) => {
      const bookings = Number(vehicle.bookings ?? 0)
      if (!best || bookings > Number(best.bookings ?? 0)) return vehicle
      return best
    }, null)
  }, [visibleVehicles])

  const openBooking = (vehicle) => {
    setSelectedVehicle(vehicle)
    setBookingForm({
      pickupLocation: '',
      dropoffLocation: '',
      passengers: vehicle.passengers || 1,
      luggage: String(vehicle.hand_carries ?? 1),
      bookingDate: '',
      bookingTime: '',
      name: '',
      phone: '',
      email: '',
      rating: Number(vehicle.rating ?? 5),
    })
    setBookingStatus(null)
    setPostBookingRating(0)
    setBookingModalOpen(true)
  }

  const handleBookingChange = (field, value) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmitBooking = async (event) => {
    event.preventDefault()
    if (!selectedVehicle) return

    setBookingLoading(true)
    setBookingStatus(null)

    try {
      const requestedDateTime = `${bookingForm.bookingDate}T${bookingForm.bookingTime}`
      if (!bookingAccessKeys.length) {
        throw new Error('Booking email keys are not configured in Admin Forms.')
      }

      const vehicleName = selectedVehicle.name || 'Selected vehicle'
      const emailPayload = {
        pickup_location: bookingForm.pickupLocation,
        dropoff_location: bookingForm.dropoffLocation,
        passengers: bookingForm.passengers,
        luggage: bookingForm.luggage,
        datetime: requestedDateTime,
        vehicle: vehicleName,
        first_name: bookingForm.name,
        name: bookingForm.name,
        phone: bookingForm.phone,
        email: bookingForm.email,
        subject: 'Booking Request',
        message: `Vehicle: ${vehicleName}\nPickup: ${bookingForm.pickupLocation}\nDrop-off: ${bookingForm.dropoffLocation}\nPassengers: ${bookingForm.passengers}\nLuggage: ${bookingForm.luggage}\nDate & Time: ${requestedDateTime}\nName: ${bookingForm.name}\nPhone: ${bookingForm.phone}\nEmail: ${bookingForm.email}`,
      }
      const emailResults = await Promise.all(bookingAccessKeys.map(async (key) => {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...emailPayload, access_key: key }),
        })
        const result = await response.json()
        return { ok: response.ok && result.success, message: result.message || 'Web3Forms submission failed.' }
      }))
      if (!emailResults.some((result) => result.ok)) {
        throw new Error(emailResults[0]?.message || 'Booking email could not be sent.')
      }

      await saveBooking({
        vehicle_id: Number(selectedVehicle.id),
        pickup_location: bookingForm.pickupLocation,
        dropoff_location: bookingForm.dropoffLocation,
        passengers: bookingForm.passengers,
        luggage: bookingForm.luggage,
        datetime: requestedDateTime,
        customer_name: bookingForm.name,
        phone: bookingForm.phone,
        email: bookingForm.email,
        message: `Vehicle: ${selectedVehicle.name}\nPickup: ${bookingForm.pickupLocation}\nDrop-off: ${bookingForm.dropoffLocation}\nPassengers: ${bookingForm.passengers}\nLuggage: ${bookingForm.luggage}\nDate & Time: ${requestedDateTime}`,
      })

      setBookingStatus({ success: true, message: `Booking request sent for ${selectedVehicle.name}.` })
      setBookingModalOpen(false)
      setRatingModalOpen(true)
    } catch (err) {
      setBookingStatus({ success: false, message: err.message || 'Booking failed, please try again.' })
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <section className="page-card space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white">
              <MdDirectionsCar size={18} /> OUR FLEET
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Flat car cards, clear specs, and instant booking.</h1>
            <p className="max-w-2xl text-sm text-slate-600 sm:text-base">Each card shows the vehicle image, specs, rating, bookings and a prominent book button. The booking form opens in a focused popup for the selected car.</p>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
            {mostBooked?.image ? (
              <div className="h-40 overflow-hidden bg-slate-100">
                <img src={resolveImageUrl(mostBooked.image)} alt={mostBooked.name} className="h-full w-full object-cover" />
              </div>
            ) : null}
            <div className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Top booked</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">{mostBooked?.name || 'No top pick yet'}</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-700">
                  {mostBooked ? `${Number(mostBooked.bookings || 0)} bookings` : 'No bookings yet'}
                </span>
              </div>
              {mostBooked?.category ? <p className="mt-3 text-sm uppercase tracking-[0.25em] text-slate-500">{mostBooked.category}</p> : null}
              <p className="mt-5 text-sm leading-6 text-slate-600">The current top choice in our fleet, selected by customers for reliability, comfort, and executive travel.</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">Loading fleet...</div>
      ) : error ? (
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">{error}</div>
      ) : visibleVehicles.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No vehicles are currently available.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {visibleVehicles.map((vehicle) => (
            <CarCard
              key={vehicle.id}
              image={resolveImageUrl(vehicle.image)}
              rating={vehicle.rating ?? 5}
              name={vehicle.name}
              category={vehicle.category}
              passengers={vehicle.passengers ?? 0}
              carryOns={vehicle.hand_carries ?? 0}
              bags={vehicle.bags ?? 0}
              onBook={() => openBooking(vehicle)}
            />
          ))}
        </div>
      )}

      {bookingModalOpen && selectedVehicle ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="absolute inset-0" onClick={() => setBookingModalOpen(false)} />
          <div className="relative z-10 max-w-3xl rounded-[2rem] bg-white p-8 shadow-2xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Book your ride</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">{selectedVehicle.name}</h2>
                <p className="mt-2 text-sm text-slate-600">Complete this quick booking form for the selected vehicle.</p>
              </div>
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmitBooking} autoComplete="off" className="mt-8 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  Pickup location
                  <input
                    name="pickup-location"
                    autoComplete="off"
                    value={bookingForm.pickupLocation}
                    onChange={(e) => handleBookingChange('pickupLocation', e.target.value)}
                    required
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  Dropoff location
                  <input
                    name="dropoff-location"
                    autoComplete="off"
                    value={bookingForm.dropoffLocation}
                    onChange={(e) => handleBookingChange('dropoffLocation', e.target.value)}
                    required
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="flex items-center gap-2 font-medium"><FiCalendar size={15} className="text-slate-500" /> Date</span>
                  <input
                    type="date"
                    name="booking-date"
                    autoComplete="off"
                    value={bookingForm.bookingDate}
                    onChange={(e) => handleBookingChange('bookingDate', e.target.value)}
                    required
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="flex items-center gap-2 font-medium"><FiClock size={15} className="text-slate-500" /> Time</span>
                  <input
                    type="time"
                    name="booking-time"
                    autoComplete="off"
                    value={bookingForm.bookingTime}
                    onChange={(e) => handleBookingChange('bookingTime', e.target.value)}
                    required
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  Your name
                  <input
                    name="customer-name"
                    autoComplete="name"
                    value={bookingForm.name}
                    onChange={(e) => handleBookingChange('name', e.target.value)}
                    required
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  Phone
                  <input
                    name="customer-phone"
                    autoComplete="tel"
                    value={bookingForm.phone}
                    onChange={(e) => handleBookingChange('phone', e.target.value)}
                    required
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm text-slate-700">
                Email
                <input
                  name="customer-email"
                  autoComplete="email"
                  type="email"
                  value={bookingForm.email}
                  onChange={(e) => handleBookingChange('email', e.target.value)}
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  Passengers
                  <input
                    name="passenger-count"
                    autoComplete="off"
                    type="number"
                    min="1"
                    value={bookingForm.passengers}
                    onChange={(e) => handleBookingChange('passengers', Number(e.target.value))}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  Luggage
                  <input
                    name="luggage-count"
                    autoComplete="off"
                    type="number"
                    min="0"
                    value={bookingForm.luggage}
                    onChange={(e) => handleBookingChange('luggage', e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                  />
                </label>
              </div>

              {bookingStatus ? (
                <div className={`rounded-3xl p-4 text-sm ${bookingStatus.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  {bookingStatus.message}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="rounded-full border border-slate-200 bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {bookingLoading ? 'Submitting...' : `Book ${selectedVehicle.name}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {ratingModalOpen && selectedVehicle ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4">
          <div className="absolute inset-0" onClick={() => { setRatingModalOpen(false); setSelectedVehicle(null) }} />
          <div className="relative z-10 w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <FiStar size={26} />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">Booking successful</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Thank you for booking with Abbey Cars</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Your request for {selectedVehicle.name} has been received. Before you go, how would you rate your experience so far?</p>
            <div className="mt-6 flex justify-center gap-2" aria-label="Rate your experience">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPostBookingRating(value)}
                  aria-label={`${value} star${value === 1 ? '' : 's'}`}
                  className={`rounded-full p-2 transition hover:scale-110 ${value <= postBookingRating ? 'text-amber-500' : 'text-slate-300'}`}
                >
                  <FiStar size={28} />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => { setRatingModalOpen(false); setSelectedVehicle(null) }}
              className="mt-6 w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {postBookingRating ? 'Send rating' : 'Done'}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default Fleet
