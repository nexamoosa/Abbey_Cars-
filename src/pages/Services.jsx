import { useMemo, useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  FaPlaneDeparture,
  FaBriefcase,
  FaStar,
  FaCarSide,
  FaTrain,
  FaShieldAlt,
  FaBox,
  FaWheelchair,
  FaArrowRight,
} from 'react-icons/fa'
import { GiPartyPopper } from 'react-icons/gi'
import usePageTitle from '../hooks/usePageTitle'

const demoImages = {
  airport:
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  corporate:
    'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=900&q=80',
  wedding:
    'https://images.unsplash.com/photo-1525302220185-c387a117886e?auto=format&fit=crop&w=900&q=80',
  local:
    'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=900&q=80',
  specialist:
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80',
  premium:
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80',
}

const serviceData = [
  {
    id: 1,
    title: 'Heathrow Airport Transfers',
    description: 'Door-to-door airport rides with fixed fares and dependable punctual pickups.',
    category: 'Airport Transfers',
    slug: 'heathrow-airport-transfers',
    image: demoImages.airport,
    icon: 'plane',
  },
  {
    id: 2,
    title: 'Gatwick Airport Transfers',
    description: 'Stress-free airport journeys for early flights, late arrivals, and every trip in between.',
    category: 'Airport Transfers',
    slug: 'gatwick-airport-transfers',
    image: demoImages.airport,
    icon: 'plane',
  },
  {
    id: 3,
    title: 'Luton Airport Transfers',
    description: 'Smooth, comfortable travel to and from Luton with clear pricing and expert drivers.',
    category: 'Airport Transfers',
    slug: 'luton-airport-transfers',
    image: demoImages.airport,
    icon: 'plane',
  },
  {
    id: 4,
    title: 'Stansted Airport Transfers',
    description: 'Reliable transfers with flight tracking and professional service from door to terminal.',
    category: 'Airport Transfers',
    slug: 'stansted-airport-transfers',
    image: demoImages.airport,
    icon: 'plane',
  },
  {
    id: 5,
    title: 'Corporate & Executive Travel',
    description: 'Executive travel designed for meetings, client visits, and seamless business schedules.',
    category: 'Corporate Travel',
    slug: 'corporate-executive-travel',
    image: demoImages.corporate,
    icon: 'briefcase',
  },
  {
    id: 6,
    title: 'Wedding & Event Cars',
    description: 'Luxury cars for weddings, parties, and special occasions with elegant presentation.',
    category: 'Wedding & Events',
    slug: 'wedding-event-cars',
    image: demoImages.wedding,
    icon: 'sparkle',
  },
  {
    id: 7,
    title: 'Local & Long Distance Taxi',
    description: 'Flexible local trips and longer routes with a friendly, punctual chauffeur service.',
    category: 'Business Travel',
    slug: 'local-long-distance-taxi',
    image: demoImages.local,
    icon: 'car',
  },
  {
    id: 8,
    title: 'Station Transfers',
    description: 'On-time train station pickups and drop-offs for smooth everyday travel plans.',
    category: 'Business Travel',
    slug: 'station-transfers',
    image: demoImages.local,
    icon: 'train',
  },
  {
    id: 9,
    title: 'School Run Service',
    description: 'Safe, trusted school transport for families who need reliability and care.',
    category: 'Business Travel',
    slug: 'school-run-service',
    image: demoImages.local,
    icon: 'shield',
  },
  {
    id: 10,
    title: 'Courier & Parcel Delivery',
    description: 'Fast and secure delivery support for parcels, documents, and business handovers.',
    category: 'Specialist Services',
    slug: 'courier-parcel-delivery',
    image: demoImages.specialist,
    icon: 'package',
  },
  {
    id: 11,
    title: 'Wheelchair Accessible Vehicles',
    description: 'Comfortable accessibility-focused journeys with equipment and trained support.',
    category: 'Specialist Services',
    slug: 'wheelchair-accessible-vehicles',
    image: demoImages.specialist,
    icon: 'access',
  },
  {
    id: 12,
    title: 'Private Chauffeur Booking',
    description: 'Premium private travel for clients who value punctuality, comfort, and discretion.',
    category: 'Corporate Travel',
    slug: 'private-chauffeur-booking',
    image: demoImages.premium,
    icon: 'star',
  },
]

const iconMap = {
  plane: <FaPlaneDeparture className="h-5 w-5" />,
  briefcase: <FaBriefcase className="h-5 w-5" />,
  sparkle: <GiPartyPopper className="h-5 w-5" />,
  car: <FaCarSide className="h-5 w-5" />,
  train: <FaTrain className="h-5 w-5" />,
  shield: <FaShieldAlt className="h-5 w-5" />,
  package: <FaBox className="h-5 w-5" />,
  access: <FaWheelchair className="h-5 w-5" />,
  star: <FaStar className="h-5 w-5" />,
}

const categories = ['All Services', ...new Set(serviceData.map((service) => service.category))]

// Custom hook for slide-up animation on scroll
const useInViewAnimation = () => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return [ref, isVisible]
}

// Service Card Component with animation
function ServiceCard({ service, iconMap }) {
  const [ref, isVisible] = useInViewAnimation()

  return (
    <NavLink
      ref={ref}
      to={`/services/${service.slug}`}
      className={`group relative block aspect-[3/4] overflow-hidden rounded-[28px] border border-slate-200 bg-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.09)] ${
        isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-12'
      }`}
    >
      <img
        src={service.image}
        alt={service.title}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      {/* Top Left Icon */}
      <div className="absolute top-5 left-5 z-20">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/30 bg-[#facc15] text-slate-900 shadow-sm backdrop-blur-sm">
          {iconMap[service.icon] || iconMap.car}
        </div>
      </div>

      {/* Bottom Content with Arrow */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-5 sm:p-6">
        <div className="max-w-[80%]">
          <h3 className="text-[1rem] font-bold leading-[1.05] text-white sm:text-[1.50rem]">
            {service.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-200">
            {service.description}
          </p>
        </div>

        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition-transform duration-300  group-hover:-translate-y-1">
          <FaArrowRight className="h-4 w-4" />
        </span>
      </div>
    </NavLink>
  )
}

function Services() {
  usePageTitle('Services')
  const [activeCategory, setActiveCategory] = useState('All Services')
  const [visibleCount, setVisibleCount] = useState(8)

  const filteredServices = useMemo(() => {
    if (activeCategory === 'All Services') {
      return serviceData.slice(0, visibleCount)
    }
    return serviceData.filter((service) => service.category === activeCategory)
  }, [activeCategory, visibleCount])

  const hasMore = activeCategory === 'All Services' && serviceData.length > visibleCount

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    if (category !== 'All Services') {
      setVisibleCount(8)
    } else {
      setVisibleCount(8)
    }
  }

  return (
    <main>
      <section className="relative overflow-hidden bg-yellow-400 w-full min-h-[70vh] flex flex-col items-center justify-center py-6">
        <div className="px-4 sm:px-6 lg:px-8 w-full">
          <div className="mx-auto max-w-[1440px]">
            <nav className="flex items-center justify-center gap-2 text-sm mb-6">
              <NavLink to="/" className="text-black font-medium hover:opacity-70 transition">
                Home
              </NavLink>
              <span className="text-black">/</span>
              <span className="text-black font-medium">Services</span>
            </nav>

            <div className="text-center">
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Taxi Service in Reading for Every Journey
              </h1>
              <p className="mt-6 text-lg text-white max-w-2xl mx-auto">
                Whether you are travelling across town or heading further afield, Abbey Cars provides safe, reliable taxi services for local journeys, airport transfers, business travel and more.
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
                  className="inline-flex items-center justify-center rounded-full border-2 border-white bg-transparent px-8 py-3 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  Contact Us
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services-grid" className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="border-b border-slate-200 pb-4">
              <div className="mx-auto flex max-w-fit gap-3 overflow-x-auto pb-1 text-center [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {categories.map((category) => {
                  const isActive = activeCategory === category

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategoryChange(category)}
                      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? 'bg-[#facc15] text-slate-900 shadow-[0_8px_20px_rgba(250,204,21,0.28)]'
                          : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {category}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-7 md:grid-cols-3 xl:grid-cols-4">
            {filteredServices.map((service) => (
              <ServiceCard key={service.slug} service={service} iconMap={iconMap} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => Math.min(count + 8, serviceData.length))}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-300 hover:border-[#facc15] hover:bg-[#facc15] hover:text-slate-900"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Why Reading Trusts Abbey Cars</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Fully licensed drivers, local knowledge, a trusted fleet and straightforward service, day or night.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Fully Licensed & Insured Drivers', description: 'Every driver is licensed, insured and background-checked.' },
              { title: 'Local Knowledge You Can Rely On', description: 'Our drivers know Reading and the surrounding areas well.' },
              { title: 'A Fleet You Can Trust', description: 'Clean, maintained Mercedes, BMW and Vito vehicles.' },
              { title: 'Available Around the Clock', description: 'Abbey Cars operates 24 hours a day, 7 days a week.' },
              { title: 'Friendly, Familiar Faces', description: 'Polite, professional drivers who treat every passenger with care.' },
              { title: 'Honest, Upfront Pricing', description: 'Clear pricing with no unnecessary surprises or hidden charges.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-black py-16 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">Ready for a Safe, Reliable Ride?</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-200">
              Book your taxi in Reading online and let Abbey Cars take care of your journey from start to finish.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <NavLink
                to="/booking"
                className="inline-flex items-center justify-center rounded-full bg-[#facc15] px-8 py-3 text-base font-semibold text-slate-900 transition hover:bg-yellow-300"
              >
                Book Online
              </NavLink>
              <a
                href="tel:+441189798484"
                className="inline-flex items-center justify-center rounded-full border border-[#facc15] px-8 py-3 text-base font-semibold text-[#facc15] transition hover:bg-[#facc15]/10"
              >
                Call Us Now
              </a>
              <a
                href="https://wa.me/441189798484"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-3 text-base font-semibold text-white transition hover:border-white"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Services
