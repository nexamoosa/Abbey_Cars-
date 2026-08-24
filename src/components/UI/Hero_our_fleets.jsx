import { useEffect, useState, useRef } from 'react'
import { getFleet, getFormSettings, saveBooking } from '../../lib/api'
import { FiChevronLeft, FiChevronRight, FiStar, FiUsers, FiSuitcase, FiBriefcase } from '../Icons'

function Hero_our_fleets() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardsPerView, setCardsPerView] = useState(4)
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
  })
  const [bookingStatus, setBookingStatus] = useState(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingAccessKeys, setBookingAccessKeys] = useState([])
  const containerRef = useRef(null)

  const apiHost = window.location.origin

  const resolveImageUrl = (src) => {
    if (!src) return ''
    const trimmed = String(src).trim()
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
    if (trimmed.startsWith('/')) return `${apiHost}${trimmed}`
    return `${apiHost}/${trimmed}`
  }

  // Fetch vehicles and form settings
  useEffect(() => {
    let mounted = true
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [fleetResponse, settingsResponse] = await Promise.all([
          getFleet('all'),
          getFormSettings(),
        ])
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
    loadData()
    return () => { mounted = false }
  }, [])

  // Responsive cards per view
  useEffect(() => {
    const updateCardsPerView = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        if (width < 768) setCardsPerView(1)
        else setCardsPerView(4)
      }
    }
    updateCardsPerView()
    window.addEventListener('resize', updateCardsPerView)
    return () => window.removeEventListener('resize', updateCardsPerView)
  }, [])

  const shouldShowCarousel = vehicles.length > cardsPerView
  const maxIndex = Math.max(0, vehicles.length - cardsPerView)

  useEffect(() => {
    setCurrentIndex((index) => Math.min(index, maxIndex))
  }, [maxIndex])

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

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
    })
    setBookingStatus(null)
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

      const emailResults = await Promise.all(
        bookingAccessKeys.map(async (key) => {
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...emailPayload, access_key: key }),
          })
          const result = await response.json()
          return { ok: response.ok && result.success, message: result.message || 'Web3Forms submission failed.' }
        })
      )

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
      setTimeout(() => {
        setBookingModalOpen(false)
      }, 1500)
    } catch (err) {
      setBookingStatus({ success: false, message: err.message || 'Booking failed, please try again.' })
    } finally {
      setBookingLoading(false)
    }
  }

  const visibleVehicles = vehicles.slice(currentIndex, currentIndex + cardsPerView)

  return (
    <section className="relative overflow-hidden bg-[#f4f4f4] py-14 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <h2 className="text-center text-3xl font-bold text-slate-900 sm:text-4xl">
              Our Fleet
            </h2>
            <p className="text-center text-3xl font-bold text-slate-900 sm:text-2xl">
              Premium vehicles for every kind of journey.
            </p>
          </div>
        </div>

        {/* Navigation Arrows */}
        {shouldShowCarousel && (
          <div className="mb-8 flex items-center gap-4">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="inline-flex h-12 w-25 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-[0_2px_12px_rgba(15,23,42,0.08)] transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Previous vehicles"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="inline-flex h-12 w-25 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-[0_2px_12px_rgba(15,23,42,0.08)] transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Next vehicles"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
            Loading fleet...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && vehicles.length === 0 && (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
            No vehicles are currently available.
          </div>
        )}

        {/* Vehicle Cards */}
        {!loading && !error && vehicles.length > 0 && (
          <div ref={containerRef} className="grid gap-6 grid-cols-1 md:grid-cols-4 overflow-hidden transition-all duration-500 ease-in-out">
            {visibleVehicles.map((vehicle) => (
              <article
                key={vehicle.id}
                className="group overflow-hidden rounded-[24px] border border-[#e8e8e8] bg-white p-0 shadow-[0_2px_12px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_12px_30px_rgba(15,23,42,0.12)] hover:bg-yellow-400"
              >
                {/* Rating */}
                <div className="flex items-center gap-2 px-5 pt-5 pb-2">
                  <span className="text-[1.05rem] font-bold text-slate-900">
                    {Number(vehicle.rating ?? 5).toFixed(1)}
                  </span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, index) => (
                      <FiStar
                        key={index}
                        size={16}
                        className="fill-amber-400 text-amber-400 group-hover:fill-black group-hover:text-black transition-colors duration-300"
                      />
                    ))}
                  </div>
                </div>

                {/* Vehicle Image */}
                <div className="relative aspect-[4/2.7] overflow-hidden bg-transparent px-4 pb-2">
                  {vehicle.image ? (
                    <img
                      src={resolveImageUrl(vehicle.image)}
                      alt={vehicle.name}
                      className="h-full w-full object-contain transition-all duration-300"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      No image
                    </div>
                  )}
                </div>

                {/* Vehicle Name */}
                <div className="px-4 pb-1">
                  <h3 className="text-[1.15rem] font-semibold uppercase tracking-[0.08em] text-slate-900">
                    {vehicle.name}
                  </h3>
                </div>

                {/* Vehicle Details */}
                <div className="flex items-center justify-between px-4 pb-2 pt-3 text-[0.95rem] text-slate-600">
                  <div className="flex items-center gap-2">
                    <FiUsers size={18} className="text-slate-700" />
                    <span>{vehicle.passengers || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiSuitcase size={18} className="text-slate-700" />
                    <span>{vehicle.hand_carries || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiBriefcase size={18} className="text-slate-700" />
                    <span>{vehicle.bags || 0}</span>
                  </div>
                </div>

                {/* Book Now Button */}
                <div className="px-4 pb-4 pt-2">
                  <button
                    type="button"
                    onClick={() => openBooking(vehicle)}
                    className="w-full rounded-2xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-black transition-all duration-300 group-hover:bg-black group-hover:text-white"
                  >
                    Book Now
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && selectedVehicle ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="absolute inset-0" onClick={() => setBookingModalOpen(false)} />
          <div className="relative z-10 max-w-3xl w-full rounded-[2rem] bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Book your ride</p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-slate-900">{selectedVehicle.name}</h2>
                <p className="mt-2 text-sm text-slate-600">Complete this quick booking form for the selected vehicle.</p>
              </div>
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 self-start sm:self-auto"
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
                  Date
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
                  Time
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
                <div
                  className={`rounded-3xl p-4 text-sm ${
                    bookingStatus.success
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-red-50 text-red-700 border border-red-100'
                  }`}
                >
                  {bookingStatus.message}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="rounded-full border border-slate-200 bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default Hero_our_fleets
