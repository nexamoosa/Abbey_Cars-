import usePageTitle from '../hooks/usePageTitle'
import { NavLink } from 'react-router-dom'
import { FaArrowRight, FaCarSide, FaClock, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa'
import journeyImage from '../assets/iamges/Home page image/HeroImage1.png'
import safetyImage from '../assets/iamges/Home page image/Safety is non-negotiable..png'
import routeImage from '../assets/iamges/Set your route.png'

function About() {
  usePageTitle('About')

  return (
    <main className="bg-white text-slate-950">
      <section className="relative overflow-hidden bg-black text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-28">
          <div className="relative z-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-400">About Abbey Cars</p>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.05] sm:text-6xl">Local knowledge. Dependable journeys.</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/75 sm:text-lg">Abbey Cars is a trusted local taxi service for Reading and the surrounding Berkshire area, helping people travel comfortably from the first booking to the final arrival.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <NavLink to="/booking" className="inline-flex items-center gap-2 rounded-[20px] bg-yellow-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-yellow-300">Book a journey <FaArrowRight className="text-xs" /></NavLink>
              <NavLink to="/contact" className="inline-flex items-center gap-2 rounded-[20px] border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-yellow-400 hover:text-yellow-400">Contact our team</NavLink>
            </div>
          </div>
          <div className="relative min-h-[300px] overflow-hidden rounded-[20px] bg-yellow-400 sm:min-h-[430px]">
            <img src={typeof journeyImage === 'string' ? journeyImage : journeyImage.src} alt="Passenger travelling comfortably with Abbey Cars" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/10" />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-yellow-400">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div><p className="text-2xl font-semibold">Reading first</p><p className="mt-1 text-sm text-slate-950/70">Local knowledge that keeps journeys straightforward.</p></div>
          <div><p className="text-2xl font-semibold">Everyday reliable</p><p className="mt-1 text-sm text-slate-950/70">Clear bookings and dependable pickups.</p></div>
          <div><p className="text-2xl font-semibold">Here to help</p><p className="mt-1 text-sm text-slate-950/70">A real local team when you need us.</p></div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">Who we are</p>
          <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight sm:text-5xl">A local service built around the people we carry.</h2>
          <div className="mt-6 max-w-xl space-y-5 text-base leading-7 text-slate-600">
            <p>Abbey Cars was created around a simple idea: passengers deserve a taxi service that knows the area, respects their time and makes it easy to speak with a real team.</p>
            <p>We serve Reading, Wokingham, Newbury, Bracknell, Henley and the surrounding areas with local taxi journeys, airport transfers, business travel and longer-distance bookings.</p>
            <p>Whether you are heading to an appointment, catching a flight or arranging travel for a group, we focus on making the journey calm, comfortable and dependable.</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-[20px] bg-slate-100">
          <img src={typeof safetyImage === 'string' ? safetyImage : safetyImage.src} alt="A passenger enjoying a safe Abbey Cars journey" className="h-[320px] w-full object-cover sm:h-[420px]" />
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">What matters to us</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">The standards behind every booking.</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [FaMapMarkerAlt, 'Local knowledge', 'We know Reading, Berkshire and the routes that matter to passengers.'],
              [FaClock, 'Dependable timing', 'We organise bookings clearly and take your pickup time seriously.'],
              [FaCarSide, 'Comfortable vehicles', 'Our vehicles are selected, maintained and prepared for the journey ahead.'],
              [FaShieldAlt, 'Professional care', 'We treat passengers, luggage, homes, workplaces and time with respect.'],
            ].map(([Icon, title, text]) => (
              <article key={title} className="border-t-4 border-yellow-400 bg-white p-6">
                <Icon className="text-xl text-yellow-600" aria-hidden="true" />
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:px-8">
        <div className="overflow-hidden rounded-[20px] bg-yellow-400">
          <img src={typeof routeImage === 'string' ? routeImage : routeImage.src} alt="Planning a route with Abbey Cars" className="h-[300px] w-full object-contain sm:h-[390px]" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">How we work</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">A better journey is made of small details.</h2>
          <div className="mt-8 space-y-6">
            {[
              ['01', 'Listen first', 'We start with your pickup point, destination, timing, passengers and luggage.'],
              ['02', 'Plan clearly', 'We use practical local knowledge to help organise the right vehicle and route.'],
              ['03', 'Confirm the details', 'We review your request and contact you so the arrangements are clear.'],
              ['04', 'Follow through', 'Our focus stays on a calm, professional and dependable arrival.'],
            ].map(([number, title, text]) => (
              <div key={number} className="grid grid-cols-[44px_1fr] gap-4 border-b border-slate-200 pb-6 last:border-0">
                <span className="text-lg font-semibold text-yellow-600">{number}</span>
                <div><h3 className="text-lg font-semibold">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div><p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-400">Travel with Abbey Cars</p><h2 className="mt-3 text-3xl font-semibold">Ready to plan your next journey?</h2><p className="mt-3 max-w-xl text-sm leading-6 text-white/70">Book a local taxi, arrange an airport transfer or speak with our team about your plans.</p></div>
          <NavLink to="/booking" className="inline-flex w-fit items-center gap-2 rounded-[20px] bg-yellow-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-yellow-300">Book online <FaArrowRight className="text-xs" /></NavLink>
        </div>
      </section>
    </main>
  )
}

export default About
