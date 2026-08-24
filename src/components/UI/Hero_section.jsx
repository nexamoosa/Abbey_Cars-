import heroImage from '../../assets/iamges/Home page image/HeroImage1.png'
import { NavLink } from 'react-router-dom'

function Hero_section() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <img
  className="absolute inset-0 h-full w-full object-cover"
  src={heroImage}
  alt="Hero Background"
  aria-hidden="true"
  style={{
    animation: "slowZoom 7s ease-in-out infinite alternate",
  }}
/>

<style>
  {`
    @keyframes slowZoom {
      from {
        transform: scale(1);
      }
      to {
        transform: scale(1.08);
      }
    }
  `}
</style>

      <div className="relative flex min-h-[100vh] items-end justify-end p-6 sm:p-10 z-10">
        <div className=" w-full max-w-lg rounded-[32px] border border-white/15 bg-white/90 p-8 shadow-2xl backdrop-blur-lg mb-17 sm:p-10">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500 ">Taxi in Reading you can trust</p>
          <h1 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">Taxi in Reading You Can Trust</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Safe, reliable journeys across Reading and the surrounding areas, available 24 hours a day, 7 days a week. Whether you need a local taxi, an airport transfer or a late-night ride home, Abbey Cars is here when you need us.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <NavLink to="/booking" className="inline-flex items-center justify-center rounded-2xl bg-[#fde507] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-yellow-400">
              Book Now
            </NavLink>
            <NavLink to="tel:+441189798484" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-black">
              Call Us
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero_section
