import { NavLink } from 'react-router-dom'

function ServicesHero() {
  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-6 lg:max-w-2xl">
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Our Taxi Services in Berkshire
            </h1>
            <p className="text-lg leading-relaxed text-slate-200">
              Whatever your travel needs, we offer a range of taxi services for individuals, families, and businesses. Explore our services below to find the right transport solution.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <NavLink
                to="/booking"
                className="inline-flex items-center justify-center rounded-full bg-yellow-400 px-8 py-3 text-base font-semibold text-slate-900 transition hover:bg-yellow-300"
              >
                Book Now
              </NavLink>
              <button
                onClick={() => {
                  document.querySelector('#services-grid')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center justify-center rounded-full border border-yellow-400 bg-transparent px-8 py-3 text-base font-semibold text-yellow-400 transition hover:bg-yellow-400/10"
              >
                Explore Services
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServicesHero
