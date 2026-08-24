import { useParams, NavLink } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'

const serviceContent = {
  'heathrow-airport-transfers': {
    title: 'Heathrow Airport Transfers',
    heading: 'Reliable Heathrow Airport Transfers',
    description: 'Enjoy reliable transfers to and from Heathrow Airport with professional drivers, timely pickups, and comfortable vehicles for every trip.',
    details: [
      'Fixed fares with no hidden charges',
      'Flight monitoring and delay tracking',
      'Meet & greet service available',
      'Premium vehicle options',
      'Professional and courteous drivers',
      'Available 24/7',
    ],
  },
  'gatwick-airport-transfers': {
    title: 'Gatwick Airport Transfers',
    heading: 'Stress-Free Gatwick Airport Travel',
    description: 'Whether you\'re travelling for business or leisure, our Gatwick airport transfer service provides a convenient and stress-free travel experience.',
    details: [
      'Competitive fixed pricing',
      'Early booking discounts available',
      'Spacious vehicles for families and groups',
      'Door-to-door service',
      'Professional drivers familiar with routes',
      'Flexible booking options',
    ],
  },
  'luton-airport-transfers': {
    title: 'Luton Airport Transfers',
    heading: 'Convenient Luton Airport Transfers',
    description: 'Book dependable taxi transfers to Luton Airport with fixed prices, spacious vehicles, and door-to-door service.',
    details: [
      'Fixed fares for peace of mind',
      'Quick and efficient service',
      'Modern, well-maintained vehicles',
      'Experienced local drivers',
      'Available for groups and individuals',
      'Easy online booking system',
    ],
  },
  'stansted-airport-transfers': {
    title: 'Stansted Airport Transfers',
    heading: 'Efficient Stansted Airport Transfers',
    description: 'Travel to and from Stansted Airport with confidence. Our professional drivers ensure timely, comfortable, and reliable transfers.',
    details: [
      'Punctual pickup and drop-off',
      'Fixed transparent pricing',
      'Comfortable vehicles',
      'Professional drivers',
      'Real-time booking confirmation',
      'Customer support available',
    ],
  },
  'corporate-executive-travel': {
    title: 'Corporate & Executive Travel',
    heading: 'Premium Corporate Transport',
    description: 'Professional transport for business meetings, corporate events, and executive travel. Our premium vehicles and experienced drivers ensure you arrive on time and in comfort.',
    details: [
      'Dedicated account management',
      'Fixed corporate rates',
      'Premium vehicle options',
      'Professional and discreet drivers',
      'Flexible booking for regular journeys',
      'Business-focused amenities',
    ],
  },
  'wedding-event-cars': {
    title: 'Wedding & Event Cars',
    heading: 'Luxury Transport for Your Special Day',
    description: 'Travel in comfort and style on your special day. We provide reliable transport for weddings, parties, concerts, sporting events, and other special occasions.',
    details: [
      'Premium luxury vehicles',
      'Professional drivers trained in event transport',
      'Flexible scheduling for all-day events',
      'Competitive event pricing',
      'Decorative options available',
      'Group booking discounts',
    ],
  },
  'local-long-distance-taxi': {
    title: 'Local & Long Distance Taxi',
    heading: 'Taxi Service for Every Journey',
    description: 'From short local journeys across Berkshire to long-distance trips anywhere in the UK, we provide safe, comfortable, and affordable taxi services tailored to your travel needs.',
    details: [
      'Competitive rates for all distances',
      'Comfortable, modern vehicles',
      'Fixed fares available',
      'Professional drivers',
      'Available 24/7',
      'Easy advance booking',
    ],
  },
  'station-transfers': {
    title: 'Station Transfers',
    heading: 'Convenient Train Station Transfers',
    description: 'Need a taxi to or from the train station? We offer prompt station transfers across Berkshire, ensuring you never miss a train or face unnecessary delays.',
    details: [
      'Flexible timing for train connections',
      'Journey tracking and updates',
      'Professional drivers familiar with stations',
      'Fixed fares available',
      'Luggage-friendly vehicles',
      'Reliable and punctual service',
    ],
  },
  'school-run-service': {
    title: 'School Run Service',
    heading: 'Safe & Reliable School Transport',
    description: 'Our dependable school run service provides safe and punctual transport for children, giving parents peace of mind with experienced and professional drivers.',
    details: [
      'Experienced, trustworthy drivers',
      'Flexible scheduling options',
      'Regular route discounts',
      'Safe, comfortable vehicles',
      'Parent communication and updates',
      'Professional and courteous service',
    ],
  },
  'courier-parcel-delivery': {
    title: 'Courier & Parcel Delivery',
    heading: 'Fast & Reliable Courier Service',
    description: 'Professional courier and parcel delivery across Berkshire and the UK. We ensure your packages arrive safely and on time.',
    details: [
      'Fast same-day delivery available',
      'Insured parcels',
      'Real-time tracking',
      'Professional handling',
      'Flexible delivery windows',
      'Competitive pricing for regular deliveries',
    ],
  },
  'wheelchair-accessible-vehicles': {
    title: 'Wheelchair Accessible Vehicles',
    heading: 'Accessible Transport for Everyone',
    description: 'We provide professional wheelchair accessible transport, ensuring comfortable and dignified travel for all passengers.',
    details: [
      'Fully accessible vehicles',
      'Ramps and securing equipment',
      'Professional, trained drivers',
      'Comfortable seating options',
      'Flexible booking and scheduling',
      'Available 24/7 for medical appointments',
    ],
  },
}

function ServiceDetail() {
  const { slug } = useParams()
  const service = serviceContent[slug]

  if (!service) {
    return (
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">Service Not Found</h1>
          <p className="mt-4 text-slate-600">The service you're looking for doesn't exist.</p>
        </div>
      </section>
    )
  }

  usePageTitle(service.title)

  return (
    <main>
      {/* Merged Hero Section with Breadcrumbs */}
      <section className="relative overflow-hidden bg-yellow-400 w-full min-h-[70vh] flex flex-col items-center justify-center py-6">
        <div className="px-4 sm:px-6 lg:px-8 w-full">
          <div className="mx-auto max-w-[1440px]">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center justify-center gap-2 text-sm mb-6">
              <NavLink to="/" className="text-black font-medium hover:opacity-70 transition">
                Home
              </NavLink>
              <span className="text-black">/</span>
              <NavLink to="/services" className="text-black font-medium hover:opacity-70 transition">
                Services
              </NavLink>
              <span className="text-black">/</span>
              <span className="text-black font-medium">{service.title}</span>
            </nav>

            {/* Hero Content - Centered */}
            <div className="text-center">
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                {service.heading}
              </h1>
              <p className="mt-6 text-lg text-white max-w-2xl mx-auto">
                {service.description}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row items-center justify-center">
                <NavLink
                  to="/booking"
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Book Now
                </NavLink>
                <NavLink
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white bg-transparent px-8 py-3 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  Get In Touch
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[1440px]  px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12s lg:grid-cols-2">
            {/* Left Content */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Why Choose Our {service.title}?</h2>
              <p className="mt-4 text-lg text-slate-600">
                We offer comprehensive {service.title.toLowerCase()} tailored to your needs.
              </p>

              <ul className="mt-8 space-y-4">
                {service.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400">
                      <svg className="h-4 w-4 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                    <span className="text-base text-slate-700">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side - Benefits Box */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 lg:p-12">
              <h3 className="text-2xl font-bold text-slate-900">Service Highlights</h3>
              <div className="mt-8 space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900">Available 24/7</h4>
                  <p className="mt-2 text-slate-600">Book anytime that suits you</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Professional Drivers</h4>
                  <p className="mt-2 text-slate-600">Experienced and courteous service</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Transparent Pricing</h4>
                  <p className="mt-2 text-slate-600">No hidden charges or surprises</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Easy Booking</h4>
                  <p className="mt-2 text-slate-600">Simple online reservation system</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black py-16 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to Book?</h2>
          <p className="mt-4 text-lg text-slate-200">
            Get your {service.title.toLowerCase()} sorted in just a few clicks.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <NavLink
              to="/booking"
              className="inline-flex items-center justify-center rounded-full bg-yellow-400 px-8 py-3 text-base font-semibold text-slate-900 transition hover:bg-yellow-300"
            >
              Book Now
            </NavLink>
            <NavLink
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-yellow-400 bg-transparent px-8 py-3 text-base font-semibold text-yellow-400 transition hover:bg-yellow-400/10"
            >
              Get In Touch
            </NavLink>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ServiceDetail
