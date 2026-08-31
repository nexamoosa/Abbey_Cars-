import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa'

const postcodeAreas = [
  { code: 'Reading & Nearby', areas: 'Reading Town Centre, East Reading, South Reading, West Reading, Caversham, Tilehurst, Earley, Woodley, Whitley, Lower Earley, Cemetery Junction, Kings Road, Whiteknights and Green Park.' },
  { code: 'Wokingham & Surrounding Areas', areas: 'Wokingham, Winnersh, Finchampstead, Woosehill, Twyford, Hurst, Charvil, Ruscombe and Wargrave.' },
  { code: 'Newbury & West Berkshire', areas: 'Newbury, Thatcham, Speen, Donnington, Wash Common, Cold Ash, Hermitage, Hampstead Norreys, Bucklebury, Yattendon, Woolhampton, Aldermaston and Beenham.' },
  { code: 'Bracknell & Crowthorne', areas: 'Bracknell, Binfield, Warfield, Birch Hill, Harmans Water and Crowthorne.' },
  { code: 'Henley & Surrounding Areas', areas: 'Henley-on-Thames, Shiplake, Nettlebed, Remenham, Pangbourne, Goring-on-Thames, Streatley, Whitchurch-on-Thames and Upper Basildon.' },
]

function ServiceAreas() {
  const [expandedPostcodes, setExpandedPostcodes] = useState({})

  const togglePostcode = (code) => {
    setExpandedPostcodes((prev) => ({
      ...prev,
      [code]: !prev[code],
    }))
  }

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(280px,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:z-10">
            <div className="max-w-md">
              <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-slate-950">
                  <FaMapMarkerAlt className="text-sm" aria-hidden="true" />
                </span>
                <span>Local coverage</span>
              </div>
              <h2 className="max-w-xl text-3xl font-semibold leading-[1.12] text-slate-950 sm:text-[2.65rem]">
                  Proudly Serving Reading & Surrounding Areas
              </h2>
              <p className="mt-6 max-w-lg text-base leading-7 text-slate-600">
                From short trips around town to airport transfers and longer journeys, our drivers cover Reading, Wokingham, Newbury, Bracknell, Henley and the surrounding areas.
              </p>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-5">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Our coverage at a glance</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-3xl font-semibold leading-none text-slate-950">{postcodeAreas.length}</div>
                  <p className="mt-2 text-xs font-medium leading-4 text-slate-500">Main Regions</p>
                </div>
                <div>
                  <div className="text-3xl font-semibold leading-none text-slate-950">100<span className="text-yellow-600">+</span></div>
                  <p className="mt-2 text-xs font-medium leading-4 text-slate-500">Towns & Villages</p>
                </div>
                <div>
                  <div className="text-3xl font-semibold leading-none text-slate-950">24<span className="text-yellow-600">/7</span></div>
                  <p className="mt-2 text-xs font-medium leading-4 text-slate-500">Always Ready</p>
                </div>
              </div>
            </div>

          </div>

          {/* Desktop cards: one readable column on the right */}
          <div className="hidden space-y-6 lg:block">
            {postcodeAreas.map((item) => (
              <div
                key={item.code}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-yellow-400 hover:bg-white hover:shadow-lg"
              >
                <div className="grid gap-5 sm:grid-cols-[minmax(210px,0.7fr)_minmax(0,1.3fr)] sm:items-center sm:gap-8">
                  <div className="px-1 py-2">
                    <span className="block text-lg font-bold leading-snug text-slate-950">{item.code}</span>
                  </div>
                  <p className="text-[0.95rem] leading-7 text-slate-600">{item.areas}</p>
                </div>
                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <iframe
                    title={`${item.code} location map`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(`${item.code}, UK`)}&output=embed`}
                    className="h-52 w-full border-0 sm:h-56"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet - Collapsible Cards */}
        <div className="mb-8 space-y-4 lg:hidden">
          {postcodeAreas.map((item) => (
            <div key={item.code} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-yellow-400">
              <button
                onClick={() => togglePostcode(item.code)}
                className="flex w-full items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-white px-5 py-5 text-left transition hover:from-yellow-50 hover:to-yellow-50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="shrink-0 px-1 py-2">
                    <span className="text-sm font-bold text-slate-950">{item.code}</span>
                  </div>
                </div>
                <FaArrowRight
                  className={`text-yellow-500 transition-transform ${expandedPostcodes[item.code] ? 'rotate-90' : ''}`}
                />
              </button>
              {expandedPostcodes[item.code] && (
                <div className="border-t border-slate-200 bg-white px-5 py-5">
                  <p className="text-sm leading-6 text-slate-700">{item.areas}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA Message */}
        <div className="mt-12 flex flex-col gap-6 rounded-2xl border border-slate-800 bg-black p-6 text-white sm:p-8 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="max-w-2xl">
            <p className="text-lg font-semibold">Not sure if we serve your area?</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Share your pickup and destination, and we will confirm availability for your journey.
            </p>
          </div>
          <NavLink to="/contact" className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-[20px] bg-yellow-400 px-6 py-3 font-semibold text-slate-900 transition-colors hover:bg-yellow-500 md:self-auto">
            Check availability <FaArrowRight className="text-sm" />
          </NavLink>
        </div>
      </div>
    </section>
  )
}

export default ServiceAreas
