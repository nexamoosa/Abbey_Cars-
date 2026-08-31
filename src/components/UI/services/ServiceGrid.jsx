import { NavLink } from 'react-router-dom'
import { FaPlaneDeparture, FaCarSide, FaBriefcase, FaMoon, FaCalendarCheck, FaArrowRight } from 'react-icons/fa'
import local from '../../../assets/iamges/Local-Taxi-Journeys.jpg'
import business from '../../../assets/iamges/Executive-&-Business-Travel-Executive-&-Business-Travel.jpg'
import late from '../../../assets/iamges/Late-Night-Early-Morning-Rides.jpg'

const demoImages = {
  airport: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80',
  local,
  business,
  late,
  regular: local,
}

const services = [
  {
    id: 'airport',
    title: 'Airport Transfers',
    description: 'Reliable transfers to and from Heathrow, Gatwick and other major UK airports, with flight tracking where available.',
    slug: 'airport-transfers',
    image: demoImages.airport,
    icon: 'plane',
  },
  {
    id: 'local',
    title: 'Local Taxi Journeys',
    description: 'A dependable taxi service in Reading for quick trips across town, nearby areas, appointments and nights out.',
    slug: 'local-long-distance-taxi',
    image: demoImages.local,
    icon: 'car',
  },
  {
    id: 'business',
    title: 'Executive & Business Travel',
    description: 'Comfortable, dependable travel for business meetings, corporate events and regular professional bookings.',
    slug: 'corporate-executive-travel',
    image: demoImages.business,
    icon: 'briefcase',
  },
  {
    id: 'late',
    title: 'Late-Night & Early-Morning Rides',
    description: 'Getting home safely matters at every hour. Arrange a ride early, late or whenever you need to travel.',
    slug: 'late-night-early-morning-rides',
    image: demoImages.late,
    icon: 'late',
  },
 
]

const iconMap = {
  plane: <FaPlaneDeparture className="h-5 w-5" />,
  car: <FaCarSide className="h-5 w-5" />,
  briefcase: <FaBriefcase className="h-5 w-5" />,
  late: <FaMoon className="h-5 w-5" />,
  regular: <FaCalendarCheck className="h-5 w-5" />,
}

function ServiceGrid() {
  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 align-center mx-auto max-w-3xl text-center">
          <h2 className="text-center text-3xl font-bold text-slate-900 sm:text-4xl">Our Taxi <span className="text-yellow-400">Services in Reading</span> </h2>
          <p className="text-center mt-4 max-w-2xl text-lg text-slate-600">
            Whether you are travelling across town or heading further afield, our taxi service in Reading makes getting around easier.
          </p>
        </div>

        {/* Services Grid - Portrait Cards */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <NavLink
              key={service.slug}
              to={`/services/${service.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-[28px] border border-slate-200 bg-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.09)]"
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
                  {iconMap[service.icon] || iconMap.plane}
                </div>
              </div>

              {/* Bottom Content with Arrow */}
              <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-5 sm:p-6">
                <div className="max-w-[80%]">
                  <h3 className="text-[1rem] font-bold leading-[1.05] text-white sm:text-[1.25rem]">
                    {service.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-200">
                    {service.description}
                  </p>
                </div>

                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition-transform duration-300 group-hover:rotate-300 group-hover:-translate-y-1">
                  <FaArrowRight className="h-4 w-4" />
                </span>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServiceGrid
