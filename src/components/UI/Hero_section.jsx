import heroImage from '../../assets/iamges/Home page image/HeroImage1.png'
import { NavLink } from 'react-router-dom'
import { getSiteSettings } from '../../lib/cms'

function Hero_section() {
  const phoneNumber = getSiteSettings().contactInfo?.phone || '+44 118 945 4545'
  const telHref = phoneNumber.replace(/\s+/g, '')

  return (
    <section className="relative min-h-screen overflow-hidden">
      <img
  className="absolute inset-0 h-full w-full object-cover"
  src={typeof heroImage === 'string' ? heroImage : heroImage.src}
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

      <div className="relative flex min-h-[100vh] w-full min-w-0 items-end justify-end p-6 sm:p-10 z-10">
        <div className="mb-17 w-full min-w-0 max-w-lg rounded-[32px] border border-white/15 bg-white/90 p-8 shadow-2xl backdrop-blur-lg sm:p-10">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500 ">Taxi in Reading you can trust</p>
          <h1 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">Taxi in Reading You Can Trust</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Safe, reliable journeys across Reading and the surrounding areas, available 24 hours a day, 7 days a week. Whether you need a local taxi, an airport transfer or a late-night ride home, Abbey Cars is here when you need us.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <NavLink to="/booking" className="inline-flex items-center justify-center rounded-2xl bg-[#fde507] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-yellow-400">
              Book Now
            </NavLink>
            <a href={`tel:${telHref}`} className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-black">
              Call Us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero_section
