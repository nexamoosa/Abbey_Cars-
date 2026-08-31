import { useState } from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { FaArrowRight, FaCheck, FaClock, FaCreditCard, FaMapMarkerAlt, FaPlaneArrival, FaShieldAlt, FaSuitcase, FaUserCheck } from 'react-icons/fa'
import usePageTitle from '../hooks/usePageTitle'
import Hero_our_fleets from '../components/UI/Hero_our_fleets'

const serviceContent = {
  'heathrow-airport-transfers': {
    title: 'Heathrow Airport Transfers',
    heading: 'Heathrow Airport Transfer',
    description: 'Skip the stress of getting to Heathrow. We offer comfortable private transfers from Reading and the surrounding areas straight to your terminal.',
    details: [
      'Fixed fares with no hidden charges',
      'Flight monitoring and delay tracking',
      'Meet & greet service available',
      'Premium vehicle options',
      'Professional and courteous drivers',
      'Available 24/7',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=85',
      arrival: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=85',
      vehicle: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=85',
      luggage: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=85',
    },
    intro: [
      'Your driver arrives on time, helps with your luggage, and takes you directly to the airport — no queues, no delays, and no last-minute worries. Ideal for early morning departures and late-night flights.',
    ],
    sections: [
      {
        heading: 'Arrive Relaxed: Heathrow to Reading Private Transfers',
        paragraphs: [
          'Arriving at Heathrow? Your driver will meet you inside the terminal (Meet & Greet available) with a name board, assist with your bags, and take you directly to your home, hotel, or any address in Reading and the surrounding areas.',
          'We track your flight in real time, so even if your flight is delayed, your driver will still be there waiting for you.',
        ],
      },
      {
        heading: 'Where We Pick You Up & Drop You Off',
        paragraphs: [
          'We provide reliable private transfers between Heathrow Airport and a wide range of locations across Reading and the surrounding areas.',
          'Wherever you are in these areas, we can take you to Heathrow — or collect you from Heathrow and take you safely to your destination.',
        ],
        areas: [
          { heading: 'Reading & Nearby', places: 'Reading Town Centre, East Reading, South Reading, West Reading, Caversham, Tilehurst, Earley, Woodley, Whitley, Lower Earley, Cemetery Junction, Kings Road, Whiteknights and Green Park.' },
          { heading: 'Wokingham & Surrounding Areas', places: 'Wokingham, Winnersh, Finchampstead, Woosehill, Twyford, Hurst, Charvil, Ruscombe and Wargrave.' },
          { heading: 'Newbury & West Berkshire', places: 'Newbury, Thatcham, Speen, Donnington, Wash Common, Cold Ash, Hermitage, Hampstead Norreys, Bucklebury, Yattendon, Woolhampton, Aldermaston and Beenham.' },
          { heading: 'Bracknell & Crowthorne', places: 'Bracknell, Binfield, Warfield, Birch Hill, Harmans Water and Crowthorne.' },
          { heading: 'Henley & Surrounding Areas', places: 'Henley-on-Thames, Shiplake, Nettlebed, Remenham, Pangbourne, Goring-on-Thames, Streatley, Whitchurch-on-Thames and Upper Basildon.' },
        ],
        closing: 'Not sure if we cover your exact address? Just send us your pick-up location and destination and we’ll be happy to confirm.',
      },
      {
        heading: 'Clear Pricing, Instant Quotes',
        paragraphs: [
          'Our prices depend on your pick-up location, destination, and time of travel.',
          'You’ll always see the full price before you confirm your booking.',
          'Get an instant online quote in under 30 seconds by entering your pick-up and drop-off details.',
        ],
      },
      {
        heading: 'Book Anytime – We’re Available 24/7',
        items: [
          'Available 24 hours a day, 7 days a week',
          'Including weekends, bank holidays, and early morning/late night flights',
          'Easy online booking with instant confirmation',
          'You can also book by phone',
        ],
        closing: 'Book in advance or make a last-minute reservation — we’re ready when you are.',
      },
      {
        heading: 'Choose the Perfect Vehicle for Your Journey',
        items: [
          'Standard Saloon – Comfortable for 1–3 passengers with luggage',
          'Executive Saloon – Premium cars for business travellers',
          'Estate Car – Extra boot space for more luggage',
          'MPV / 6-Seater – Ideal for families or small groups',
          '8-Seater Minivan – Perfect for larger groups or extra luggage',
        ],
        closing: 'All vehicles are modern, clean, air-conditioned, and fully licensed.',
      },
      {
        heading: 'Professional Drivers You Can Rely On',
        items: [
          'Fully licensed and professional drivers',
          'DBS-checked for your safety',
          'Smart, polite, and experienced',
          'Fluent English-speaking drivers',
          'Help with luggage included',
          'Quiet and comfortable journey',
        ],
        closing: 'Your driver will send you their details before pick-up so you know exactly who is coming.',
      },
      {
        heading: 'Travelling with Family, Groups or Extra Luggage?',
        items: [
          'Generous luggage allowance in every vehicle',
          'Extra luggage space available on request',
          'Free child seats and booster seats (please request when booking)',
          'Spacious vehicles for families and groups',
          'Assistance with multiple suitcases and pushchairs',
        ],
        closing: 'Travelling with a lot of bags or young children? Just let us know and we’ll arrange the right vehicle.',
      },
    ],
    faqs: [
      { question: 'Do you provide transfers from Reading to Heathrow Airport?', answer: 'Yes, we offer private transfers from Reading and all surrounding areas straight to Heathrow Airport (LHR). Our drivers pick you up from your door and take you directly to your terminal.' },
      { question: 'Can you collect me from Heathrow and take me to Reading?', answer: 'Yes. We provide Meet & Greet service at Heathrow. Your driver will wait inside the terminal with a name board and take you to any address in Reading or the surrounding areas.' },
      { question: 'Which areas do you cover?', answer: 'We cover Reading and nearby areas including Caversham, Tilehurst, Earley, Woodley, Wokingham, Newbury, Bracknell, Henley-on-Thames, and many more. If you’re not sure, just send us your address and we’ll confirm.' },
      { question: 'How does pricing work?', answer: 'Our prices depend on your pick-up location, destination, and time of travel. You’ll always see the full price before confirming your booking. You can get an instant online quote in under 30 seconds.' },
      { question: 'Are you available 24/7?', answer: 'Yes, we operate 24 hours a day, 7 days a week, including weekends, bank holidays, and early morning or late-night flights.' },
      { question: 'Do you offer child seats and vehicles for groups?', answer: 'Yes. Free child seats and booster seats are available on request. We also have spacious 6-seater and 8-seater vehicles for families and groups with extra luggage.' },
    ],
  },
  'gatwick-airport-transfers': {
    title: 'Gatwick Airport Transfers',
    heading: 'Stress-Free Gatwick Airport Travel',
    description: 'Whether you\'re travelling for business or leisure, our Gatwick airport transfer service provides a convenient and stress-free travel experience.',
    details: [
      'Competitive fixed pricing',
      'Early booking discounts available',
      'Spacious vehicles for families and groups',
      'Door-to-door service',
      'Professional drivers familiar with routes',
      'Flexible booking options',
    ],
  },
  'luton-airport-transfers': {
    title: 'Luton Airport Transfers',
    heading: 'Convenient Luton Airport Transfers',
    description: 'Book dependable taxi transfers to Luton Airport with fixed prices, spacious vehicles, and door-to-door service.',
    details: [
      'Fixed fares for peace of mind',
      'Quick and efficient service',
      'Modern, well-maintained vehicles',
      'Experienced local drivers',
      'Available for groups and individuals',
      'Easy online booking system',
    ],
  },
  'stansted-airport-transfers': {
    title: 'Stansted Airport Transfers',
    heading: 'Efficient Stansted Airport Transfers',
    description: 'Travel to and from Stansted Airport with confidence. Our professional drivers ensure timely, comfortable, and reliable transfers.',
    details: [
      'Punctual pickup and drop-off',
      'Fixed transparent pricing',
      'Comfortable vehicles',
      'Professional drivers',
      'Real-time booking confirmation',
      'Customer support available',
    ],
  },
  'corporate-executive-travel': {
    title: 'Corporate & Executive Travel',
    heading: 'Premium Corporate Transport',
    description: 'Professional transport for business meetings, corporate events, and executive travel. Our premium vehicles and experienced drivers ensure you arrive on time and in comfort.',
    details: [
      'Dedicated account management',
      'Fixed corporate rates',
      'Premium vehicle options',
      'Professional and discreet drivers',
      'Flexible booking for regular journeys',
      'Business-focused amenities',
    ],
  },
  'wedding-event-cars': {
    title: 'Wedding & Event Cars',
    heading: 'Luxury Transport for Your Special Day',
    description: 'Travel in comfort and style on your special day. We provide reliable transport for weddings, parties, concerts, sporting events, and other special occasions.',
    details: [
      'Premium luxury vehicles',
      'Professional drivers trained in event transport',
      'Flexible scheduling for all-day events',
      'Competitive event pricing',
      'Decorative options available',
      'Group booking discounts',
    ],
  },
  'local-long-distance-taxi': {
    title: 'Local & Long Distance Taxi',
    heading: 'Taxi Service for Every Journey',
    description: 'From short local journeys across Berkshire to long-distance trips anywhere in the UK, we provide safe, comfortable, and affordable taxi services tailored to your travel needs.',
    details: [
      'Competitive rates for all distances',
      'Comfortable, modern vehicles',
      'Fixed fares available',
      'Professional drivers',
      'Available 24/7',
      'Easy advance booking',
    ],
  },
  'station-transfers': {
    title: 'Station Transfers',
    heading: 'Convenient Train Station Transfers',
    description: 'Need a taxi to or from the train station? We offer prompt station transfers across Berkshire, ensuring you never miss a train or face unnecessary delays.',
    details: [
      'Flexible timing for train connections',
      'Journey tracking and updates',
      'Professional drivers familiar with stations',
      'Fixed fares available',
      'Luggage-friendly vehicles',
      'Reliable and punctual service',
    ],
  },
  'school-run-service': {
    title: 'School Run Service',
    heading: 'Safe & Reliable School Transport',
    description: 'Our dependable school run service provides safe and punctual transport for children, giving parents peace of mind with experienced and professional drivers.',
    details: [
      'Experienced, trustworthy drivers',
      'Flexible scheduling options',
      'Regular route discounts',
      'Safe, comfortable vehicles',
      'Parent communication and updates',
      'Professional and courteous service',
    ],
  },
  'courier-parcel-delivery': {
    title: 'Courier & Parcel Delivery',
    heading: 'Fast & Reliable Courier Service',
    description: 'Professional courier and parcel delivery across Berkshire and the UK. We ensure your packages arrive safely and on time.',
    details: [
      'Fast same-day delivery available',
      'Insured parcels',
      'Real-time tracking',
      'Professional handling',
      'Flexible delivery windows',
      'Competitive pricing for regular deliveries',
    ],
  },
  'wheelchair-accessible-vehicles': {
    title: 'Wheelchair Accessible Vehicles',
    heading: 'Accessible Transport for Everyone',
    description: 'We provide professional wheelchair accessible transport, ensuring comfortable and dignified travel for all passengers.',
    details: [
      'Fully accessible vehicles',
      'Ramps and securing equipment',
      'Professional, trained drivers',
      'Comfortable seating options',
      'Flexible booking and scheduling',
      'Available 24/7 for medical appointments',
    ],
  },
}

function DetailedServiceContent({ service }) {
  const navigate = useNavigate()
  const [openArea, setOpenArea] = useState(0)
  const arrivalSection = service.sections[0]
  const coverageSection = service.sections[1]
  const pricingSection = service.sections[2]
  const bookingSection = service.sections[3]
  const driversSection = service.sections[5]
  const familySection = service.sections[6]
  const steps = [
    { icon: FaMapMarkerAlt, title: 'Enter your route', text: 'Add your pick-up and drop-off details.' },
    { icon: FaCreditCard, title: 'See a fixed price', text: 'Know the full price before you confirm.' },
    { icon: FaCheck, title: 'Confirm and relax', text: 'Book online and receive instant confirmation.' },
  ]
  const benefits = [
    { icon: FaShieldAlt, title: 'Licensed & DBS-checked', text: 'Professional drivers you can rely on.' },
    { icon: FaPlaneArrival, title: 'Flight tracking', text: 'We monitor delays and stay on schedule.' },
    { icon: FaSuitcase, title: 'Luggage help included', text: 'Assistance with bags and pushchairs.' },
    { icon: FaUserCheck, title: 'Fluent English-speaking', text: 'Smart, polite and experienced service.' },
    { icon: FaCreditCard, title: 'Transparent booking', text: 'Clear pricing with no surprises.' },
    { icon: FaClock, title: 'Available 24/7', text: 'Including weekends and bank holidays.' },
  ]
  return (
    <>
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-600">The Abbey standard</p>
              <h2 className="mt-4 text-3xl font-semibold leading-[1.12] text-slate-950 sm:text-[2.65rem]">{arrivalSection.heading}</h2>
              {arrivalSection.paragraphs.map((paragraph) => <p key={paragraph} className="mt-6 text-lg leading-8 text-slate-600">{paragraph}</p>)}
            </div>
            <div className="relative overflow-hidden rounded-[2rem] bg-black shadow-2xl">
              <img src={service.images.arrival} alt="Heathrow airport arrival" className="h-[360px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-8"><p className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-400">Meet & Greet available</p><p className="mt-2 text-2xl font-bold text-white">We’ll be there when you land.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fafafa] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-600">Clear pricing, simple booking</p><h2 className="mt-4 text-3xl font-semibold leading-[1.12] text-slate-950 sm:text-[2.65rem]">{pricingSection.heading}</h2><div className="mx-auto mt-6 max-w-3xl space-y-2 text-base leading-7 text-slate-600 sm:text-lg"><p>{pricingSection.paragraphs.slice(0, 2).join(' ')}</p><p>{pricingSection.paragraphs[2]}</p></div></div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => { const Icon = step.icon; return <article key={step.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-base font-bold text-black">0{index + 1}</span><Icon className="text-xl text-slate-400" /></div><h3 className="mt-7 text-xl font-bold text-slate-950">{step.title}</h3><p className="mt-3 text-base leading-7 text-slate-600">{step.text}</p></article> })}
          </div>
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 sm:p-8"><h3 className="text-xl font-bold text-slate-950 sm:text-2xl">{bookingSection.heading}</h3><ul className="mt-5 grid gap-3 sm:grid-cols-2">{bookingSection.items.map((item) => <li key={item} className="flex gap-3 text-base leading-7 text-slate-700"><FaCheck className="mt-1.5 shrink-0 text-yellow-500" />{item}</li>)}</ul><p className="mt-5 text-base leading-7 text-slate-600">{bookingSection.closing}</p></div>
        </div>
      </section>

      <section className="bg-black py-20 text-white sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div><p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-400">Coverage</p><h2 className="mt-4 text-3xl font-semibold leading-[1.12] sm:text-[2.65rem]">{coverageSection.heading}</h2><div className="mt-6 space-y-4 text-lg leading-8 text-white/70">{coverageSection.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>
            <div className="space-y-3">{coverageSection.areas.map((area, index) => { const isOpen = openArea === index; return <div key={area.heading} className="border-b border-white/15 py-5"><button type="button" aria-expanded={isOpen} onClick={() => setOpenArea(isOpen ? -1 : index)} className="flex w-full items-center justify-between gap-6 text-left text-xl font-bold text-white"><span>{area.heading}</span><span className={`text-2xl font-light text-yellow-400 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span></button><div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}><div className="min-h-0 overflow-hidden"><p className="max-w-3xl pt-4 leading-7 text-white/65">{area.places}</p></div></div></div> })}<p className="pt-5 text-white/70">{coverageSection.closing}</p></div>
          </div>
        </div>
      </section>

      <Hero_our_fleets />

      <section className="bg-[#fafafa] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-600">Why riders choose Abbey Cars</p><h2 className="mt-4 text-3xl font-semibold leading-[1.12] text-slate-950 sm:text-[2.65rem]">The details that make your journey easier.</h2></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{benefits.map((benefit) => { const Icon = benefit.icon; return <article key={benefit.title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><Icon className="text-2xl text-yellow-500" /><h3 className="mt-5 text-xl font-bold text-slate-950">{benefit.title}</h3><p className="mt-2 leading-7 text-slate-600">{benefit.text}</p></article> })}</div><div className="mt-10 grid gap-4 lg:grid-cols-2"><details className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xl font-bold text-slate-950"><span>{driversSection.heading}</span><span className="text-2xl font-light text-yellow-600 transition group-open:rotate-45">+</span></summary><ul className="mt-5 space-y-3 text-slate-700">{driversSection.items.map((item) => <li key={item} className="flex gap-3"><FaCheck className="mt-1.5 shrink-0 text-yellow-500" />{item}</li>)}</ul><p className="mt-5 leading-7 text-slate-600">{driversSection.closing}</p></details><details className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xl font-bold text-slate-950"><span>{familySection.heading}</span><span className="text-2xl font-light text-yellow-600 transition group-open:rotate-45">+</span></summary><ul className="mt-5 space-y-3 text-slate-700">{familySection.items.map((item) => <li key={item} className="flex gap-3"><FaCheck className="mt-1.5 shrink-0 text-yellow-500" />{item}</li>)}</ul><p className="mt-5 leading-7 text-slate-600">{familySection.closing}</p></details></div></div>
      </section>

      <section className="bg-yellow-400 py-16 sm:py-20"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="grid items-center gap-8 rounded-[2rem] bg-black p-8 text-white shadow-2xl sm:p-12 lg:grid-cols-[1fr_auto] lg:p-14"><div><p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-400">Reviews coming soon</p><h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-[1.12] sm:text-[2.65rem]">Real journeys. Real feedback.</h2><p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">We’ll add our verified Google or Trustpilot reviews here as soon as they are available.</p></div><div className="text-8xl leading-none text-yellow-400" aria-hidden="true">“</div></div></div></section>

      <section className="bg-[#fafafa] py-20 sm:py-28"><div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"><p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-600">Need to know</p><h2 className="mt-4 text-3xl font-semibold leading-[1.12] text-slate-950 sm:text-[2.65rem]">Frequently asked questions.</h2><div className="mt-10 divide-y divide-slate-300 border-y border-slate-300">{service.faqs.map((faq) => <details key={faq.question} className="group py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-bold text-slate-950"><span>{faq.question}</span><span className="text-2xl font-light text-yellow-600 transition group-open:rotate-45">+</span></summary><p className="max-w-3xl pt-4 leading-7 text-slate-600">{faq.answer}</p></details>)}</div></div></section>

      <section className="bg-black py-16 sm:py-20"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8"><div><p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-400">Ready when you are</p><h2 className="mt-3 text-3xl font-semibold leading-[1.12] text-white sm:text-[2.65rem]">Ready to book your Heathrow transfer?</h2><p className="mt-3 text-white/65">We’re here to make your journey simple, comfortable, and stress-free.</p></div><button type="button" onClick={() => navigate('/booking')} className="inline-flex shrink-0 items-center gap-3 rounded-full bg-yellow-400 px-7 py-4 font-bold text-black transition hover:bg-yellow-300">Get instant quote <FaArrowRight /></button></div></section>
    </>
  )
}

function GenericServiceContent({ service }) {
  return (
    <>
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-600">The Abbey standard</p>
              <h2 className="mt-4 text-3xl font-semibold leading-[1.12] text-slate-950 sm:text-[2.65rem]">Why choose our {service.title.toLowerCase()}?</h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">We provide dependable, comfortable {service.title.toLowerCase()} tailored to your journey.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {service.details.map((detail, index) => (
                <article key={detail} className="rounded-3xl border border-slate-200 bg-[#fafafa] p-6 transition hover:-translate-y-1 hover:border-yellow-400 hover:bg-white hover:shadow-md">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-black">0{index + 1}</span>
                  <p className="mt-5 font-semibold leading-7 text-slate-950">{detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#fafafa] py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-600">Ready when you are</p>
          <h2 className="mt-4 text-3xl font-semibold leading-[1.12] text-slate-950 sm:text-[2.65rem]">Make your next journey simple.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">Book your {service.title.toLowerCase()} with Abbey Cars and travel with confidence.</p>
          <NavLink to="/booking" className="mt-8 inline-flex items-center gap-3 rounded-full bg-yellow-400 px-7 py-4 font-bold text-black transition hover:bg-yellow-300">Book now <FaArrowRight /></NavLink>
        </div>
      </section>
    </>
  )
}

function ServiceDetail() {
  const { slug } = useParams()
  const service = serviceContent[slug]

  if (!service) {
    return (
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">Service Not Found</h1>
          <p className="mt-4 text-slate-600">The service you're looking for doesn't exist.</p>
        </div>
      </section>
    )
  }

  usePageTitle(service.title)

  return (
    <main>
      {/* Merged Hero Section with Breadcrumbs */}
      <section className="relative flex min-h-[620px] w-full flex-col justify-center overflow-hidden bg-slate-950 pb-20 pt-32">
        {service.images?.hero ? <>
          <img src={service.images.hero} alt="Premium vehicle ready for a Heathrow airport transfer" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-slate-950/65" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/60" />
        </> : null}
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Breadcrumb Navigation */}
            <nav className={`mb-12 flex items-center gap-2 text-sm ${service.images?.hero ? 'text-white/70' : 'text-black'}`}>
              <NavLink to="/" className="font-medium transition hover:opacity-70">
                Home
              </NavLink>
              <span>/</span>
              <NavLink to="/services" className="font-medium transition hover:opacity-70">
                Services
              </NavLink>
              <span>/</span>
              <span className="font-medium">{service.title}</span>
            </nav>

            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-yellow-400">{service.sections ? 'Private airport transfers from Reading' : 'Professional travel across Reading'}</p>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {service.heading}
              </h1>
              <p className="mt-7 max-w-2xl text-xl leading-8 text-white/85 sm:text-2xl">
                {service.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-wider text-white/75">
                <span>24/7 availability</span><span>Meet & Greet</span><span>Flight tracking</span><span>Fixed price</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {service.sections ? <DetailedServiceContent service={service} /> : <GenericServiceContent service={service} />}
    </main>
  )
}

export default ServiceDetail
