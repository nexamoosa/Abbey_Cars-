import { NavLink } from 'react-router-dom'

function ServicesCTA() {
  return (
    <section className="relative overflow-hidden bg-black py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Ready for a Safe, Reliable Ride?
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-200">
            Booking with Abbey Cars is quick and easy. Whether you need a Reading taxi UK service for a local journey, an airport transfer or a longer trip, we are ready to get you where you need to go.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <NavLink
              to="/booking"
              className="inline-flex items-center justify-center rounded-full bg-yellow-400 px-8 py-3 text-base font-semibold text-slate-900 transition hover:bg-yellow-300"
            >
              Book Online
            </NavLink>
            <a
              href="tel:+441189798484"
              className="inline-flex items-center justify-center rounded-full border border-yellow-400 bg-transparent px-8 py-3 text-base font-semibold text-yellow-400 transition hover:bg-yellow-400/10"
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
  )
}

export default ServicesCTA
