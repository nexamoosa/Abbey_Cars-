import { useMemo, useState } from 'react'
import { FaArrowRight, FaChevronDown, FaPhoneAlt } from 'react-icons/fa'
import { NavLink, useSearchParams } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import { getSiteSettings } from '../lib/cms'

const faqs = [
  {
    category: 'Booking',
    question: 'How do I book a taxi with Abbey Cars?',
    answer: 'You can book online through our booking form or call our team directly. Add your pickup location, destination, date, time, passenger details and preferred vehicle so we can arrange your journey.',
  },
  {
    category: 'Booking',
    question: 'How far in advance can I book?',
    answer: 'You can book in advance for airport transfers, train journeys, appointments, school runs and regular travel. We also accept same-day bookings, subject to vehicle availability.',
  },
  {
    category: 'Airport Transfers',
    question: 'Do you provide airport transfers from Reading?',
    answer: 'Yes. We provide reliable transfers to and from Heathrow, Gatwick, Luton, Stansted and other major UK airports. Where available, flight tracking helps us stay informed if your flight is delayed.',
  },
  {
    category: 'Airport Transfers',
    question: 'What happens if my flight is delayed?',
    answer: 'If flight tracking is available for your booking, we monitor the flight information and adjust the collection plan where possible. Please include your flight number when booking.',
  },
  {
    category: 'Vehicles',
    question: 'What vehicles are available?',
    answer: 'Our fleet includes premium Mercedes, BMW and Vito vehicles. We can help you choose the right vehicle based on the number of passengers, luggage and comfort requirements.',
  },
  {
    category: 'Vehicles',
    question: 'Can I book a vehicle for a group?',
    answer: 'Yes. Our larger vehicles are suitable for group travel and extra luggage. Include your passenger and luggage details in the booking form so we can recommend the best option.',
  },
  {
    category: 'Service',
    question: 'Which areas do you cover?',
    answer: 'We cover Reading and nearby areas including Caversham, Tilehurst, Earley, Woodley and Green Park, as well as Wokingham, Newbury, Bracknell, Crowthorne, Henley and surrounding communities.',
  },
  {
    category: 'Service',
    question: 'Are you available early in the morning and late at night?',
    answer: 'Yes. Abbey Cars operates 24 hours a day, 7 days a week, including early-morning airport journeys and late-night rides home.',
  },
  {
    category: 'Payment',
    question: 'How much will my journey cost?',
    answer: 'We aim to provide clear, straightforward pricing. The final price can depend on the route, date, vehicle and journey requirements. Contact us with your details for a quote.',
  },
]

function Faq() {
  usePageTitle('FAQ')
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const phoneNumber = getSiteSettings().contactInfo?.phone || '+44 118 945 4545'
  const phoneHref = phoneNumber.replace(/\s+/g, '')
  const [activeCategory, setActiveCategory] = useState('All')
  const [openIndex, setOpenIndex] = useState(0)

  const categories = ['All', ...new Set(faqs.map((faq) => faq.category))]
  const filteredFaqs = useMemo(() => faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory
    const searchText = `${faq.question} ${faq.answer}`.toLowerCase()
    return matchesCategory && searchText.includes(query.toLowerCase().trim())
  }), [activeCategory, query])

  return (
    <main className="bg-slate-50 py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2" aria-label="FAQ categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => { setActiveCategory(category); setOpenIndex(0) }}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${activeCategory === category ? 'bg-yellow-400 text-slate-950' : 'bg-white text-slate-600 shadow-sm hover:text-slate-950'}`}
            >
              {category}
            </button>
          ))}
        </div>

        <section className="mt-5 space-y-3" aria-label="Frequently asked questions">
          {filteredFaqs.length ? filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <article key={faq.question} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-7"
                >
                  <span>
                    <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-yellow-600">{faq.category}</span>
                    <span className="mt-1 block text-base font-bold text-slate-900 sm:text-lg">{faq.question}</span>
                  </span>
                  <FaChevronDown className={`shrink-0 text-sm text-yellow-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
                {isOpen && <p className="border-t border-slate-100 px-5 pb-6 pt-4 text-sm leading-7 text-slate-600 sm:px-7">{faq.answer}</p>}
              </article>
            )
          }) : <p className="rounded-2xl bg-white p-8 text-center text-slate-600 shadow-sm">No questions match your search.</p>}
        </section>

        <section className="mt-12 flex flex-col items-start justify-between gap-6 rounded-3xl bg-yellow-400 p-7 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Still have a question?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-800">Our team is happy to check your route and help arrange your journey.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <NavLink to="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-100">Contact us <FaArrowRight /></NavLink>
            <a href={`tel:${phoneHref}`} className="inline-flex items-center gap-2 rounded-full border border-slate-950 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-yellow-300"><FaPhoneAlt /> Call us</a>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Faq
