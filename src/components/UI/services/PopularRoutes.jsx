import { NavLink } from 'react-router-dom'

const routes = [
  'Reading to Heathrow Airport',
  'Reading to Gatwick Airport',
  'Slough to Heathrow Airport',
  'Windsor to Heathrow Airport',
  'Maidenhead to Heathrow Airport',
  'Bracknell to Heathrow Airport',
  'Wokingham to Heathrow Airport',
  'Newbury to Heathrow Airport',
  'Berkshire to Heathrow Airport',
  'Berkshire to Gatwick Airport',
  'Berkshire to Luton Airport',
  'Berkshire to Stansted Airport',
  'Berkshire to London City Airport',
  'Reading Station Transfers',
  'Slough Station Transfers',
  'Long-Distance Travel Across the UK',
]

function PopularRoutes() {
  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Our Popular Routes</h2>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Here are some of our most frequently booked routes across Berkshire and to major UK airports.
          </p>
        </div>

        {/* Routes Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {routes.map((route, idx) => (
            <NavLink
              key={idx}
              to="/booking"
              className="group rounded-2xl border border-slate-200 bg-white px-6 py-4 text-center transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-50 hover:shadow-md"
            >
              <p className="text-sm font-semibold text-slate-900 group-hover:text-yellow-900">
                {route}
              </p>
            </NavLink>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <NavLink
            to="/booking"
            className="inline-flex items-center justify-center rounded-full bg-yellow-400 px-8 py-3 text-base font-semibold text-slate-900 transition hover:bg-yellow-300"
          >
            Book Your Route
          </NavLink>
        </div>
      </div>
    </section>
  )
}

export default PopularRoutes
