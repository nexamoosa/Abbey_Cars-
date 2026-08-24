import { NavLink } from 'react-router-dom'

const airportServices = [
  {
    id: 'heathrow',
    title: 'Heathrow Airport Transfers',
    description: 'Enjoy reliable transfers to and from Heathrow Airport with professional drivers, timely pickups, and comfortable vehicles for every trip.',
    route: '/services/heathrow-airport-transfers',
  },
  {
    id: 'gatwick',
    title: 'Gatwick Airport Transfers',
    description: 'Whether you\'re travelling for business or leisure, our Gatwick airport transfer service provides a convenient and stress-free travel experience.',
    route: '/services/gatwick-airport-transfers',
  },
  {
    id: 'luton-stansted',
    title: 'Luton & Stansted Transfers',
    description: 'Book dependable taxi transfers to Luton and Stansted Airports with fixed prices, spacious vehicles, and door-to-door service.',
    route: '/services/luton-stansted-airport-transfers',
  },
]

function AirportTransfers() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Airport Transfers</h2>
          <p className="mt-4 text-lg text-slate-600">
            Travel to and from the UK's major airports with fixed fares, flight monitoring, and on-time pickups for a hassle-free journey.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {airportServices.map((service) => (
            <article
              key={service.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-yellow-400"
            >
              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-900">{service.title}</h3>
                <p className="mt-3 text-base text-slate-600 leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <NavLink
                    to="/booking"
                    className="inline-flex items-center justify-center rounded-full bg-yellow-400 px-6 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-yellow-300"
                  >
                    Book Now
                  </NavLink>
                  <NavLink
                    to={service.route}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
                  >
                    Learn More
                  </NavLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AirportTransfers
