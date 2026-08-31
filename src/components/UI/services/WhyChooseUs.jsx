import { FaCheckCircle, FaMapMarkerAlt, FaCarSide, FaClock, FaUsers, FaLock } from 'react-icons/fa'

function WhyChooseUs() {
  const trustPoints = [
    { icon: FaCheckCircle, title: 'Fully Licensed & Insured Drivers', description: 'Every driver is licensed, insured and background-checked. Your safety is always our priority.' },
    { icon: FaMapMarkerAlt, title: 'Local Knowledge You Can Rely On', description: 'Our drivers know Reading and the surrounding areas, helping every journey stay smooth and straightforward.' },
    { icon: FaCarSide, title: 'A Fleet You Can Trust', description: 'Premium Mercedes, BMW and Vito vehicles are cleaned, maintained and checked regularly.' },
    { icon: FaClock, title: 'Available Around the Clock', description: 'Early flight, late shift or night out, Abbey Cars operates 24 hours a day, 7 days a week.' },
    { icon: FaUsers, title: 'Friendly, Familiar Faces', description: 'Our drivers are friendly, polite and professional, treating every passenger with care and respect.' },
    { icon: FaLock, title: 'Honest, Upfront Pricing', description: 'Clear, straightforward pricing with no unnecessary surprises or hidden charges.' },
  ]

  return (
    <section className="bg-[#fafafa] py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 w-full">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-600">Why riders choose us</p>
          <h2 className="mt-4 text-3xl font-semibold leading-[1.12] text-slate-950 sm:text-[2.65rem]">Why Reading Trusts Abbey Cars</h2>
          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">We turn up when we say we will, treat every passenger with respect, and make sure every journey is safe, comfortable and hassle-free.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trustPoints.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-yellow-400 hover:shadow-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400 text-slate-950"><Icon className="text-lg" /></div>
              <h3 className="mt-6 text-xl font-bold text-slate-950">{title}</h3>
              <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
