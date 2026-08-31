import { useState } from 'react'
import { FaArrowRight, FaCalendarAlt, FaCarSide, FaMapMarkerAlt, FaPhoneAlt, FaUser, FaUsers, FaCheckCircle, FaMobileAlt } from 'react-icons/fa'
import { getSiteSettings } from '../../lib/cms'
import journeyImage from '../../assets/iamges/Home page image/HeroImage1.png'
import safetyImage from '../../assets/iamges/Home page image/Safety is non-negotiable..png'
import essentialsImage from '../../assets/iamges/Start with the essentials.png'
import routeImage from '../../assets/iamges/Set your route.png'
import timeImage from '../../assets/iamges/Choose a time that works for you.png'
import passengersImage from '../../assets/iamges/Tell us about your passengers.png'
import vehicleImage from '../../assets/iamges/Choose the right vehicle.png'
import reviewImage from '../../assets/iamges/Review and send your request.png'

export function ReadingIntro() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-[1440px] overflow-visible rounded-[28px] bg-yellow-400 lg:grid-cols-[.95fr_1.05fr]">
        <div className="relative min-h-[360px] overflow-visible sm:min-h-[500px]">
          <svg
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-auto w-[150%] max-w-none -translate-x-1/2 -translate-y-1/2"
            width="1200"
            height="343"
            viewBox="0 0 350 100"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M150 75 C125 40 105 25 75 25 C45 25 25 45 25 75 C25 105 45 125 75 125 C105 125 125 110 150 75 C175 40 195 25 225 25 C255 25 275 45 275 75 C275 105 255 125 225 125 C195 125 175 110 150 75Z"
              fill="none"
              stroke="#fffcfb"
              strokeWidth="25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <img src={typeof safetyImage === 'string' ? safetyImage : safetyImage.src} alt="Passenger booking a safe journey with Abbey Cars" className="absolute -top-12 left-1/2 z-10 h-[calc(100%+3rem)] w-auto max-w-none -translate-x-1/2 object-contain object-center sm:-top-16 sm:h-[calc(100%+4rem)]" />
        </div>
        <div className="flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-14 lg:px-16">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-950/70">A local service you can rely on</p>
          <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">Your Reading Local Taxi Service, Built on Trust</h2>
          <div className="mt-5 max-w-2xl text-sm leading-6 text-slate-950/75 sm:text-base">
            <p>We&apos;ve been proudly serving Reading and the surrounding areas for years. We&apos;re not a faceless national chain — we&apos;re a company that knows the area, the roads and the communities we serve.</p>
            <div className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-in-out ${isExpanded ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`} aria-hidden={!isExpanded}>
              <div className="min-h-0 space-y-3">
                <p>We&apos;ve built our reputation the simple way: by turning up when we say we will, treating every passenger with respect, and making sure every journey is safe, comfortable and hassle-free.</p>
                <p>Whether you need a quick trip across town, a dependable airport transfer or a safe way home after a night out, Abbey Cars is here for you — day or night, rain or shine.</p>
              </div>
            </div>
          </div>
          <button type="button" aria-expanded={isExpanded} onClick={() => setIsExpanded((expanded) => !expanded)} className="mt-6 inline-flex w-fit items-center rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold !text-white transition hover:bg-slate-800">
            {isExpanded ? 'Read less' : 'Read more'}
          </button>
        </div>
      </div>
    </section>
  )
}

const bookingSteps = [
  { icon: FaUser, image: essentialsImage, title: 'Start with the essentials', text: 'Tell us who is travelling and how we can reach you. Your details help us keep every booking clear, personal and easy to confirm.' },
  { icon: FaMapMarkerAlt, image: routeImage, title: 'Set your route', text: 'Add your pickup point and destination, from a Reading address to an airport or a longer journey across Berkshire. We use these details to plan the right trip.' },
  { icon: FaCalendarAlt, image: timeImage, title: 'Choose a time that works for you', text: 'Select your travel date and pickup time. Booking ahead gives us the best chance to have your driver ready exactly when you need to leave.' },
  { icon: FaUsers, image: passengersImage, title: 'Tell us about your passengers', text: 'Add the number of passengers and the luggage you are bringing. This makes it simple for us to match your journey with comfortable space.' },
  { icon: FaCarSide, image: vehicleImage, title: 'Choose the right vehicle', text: 'Review the available vehicles and select the one that suits your group, luggage and journey. Every option is chosen with comfort in mind.' },
  { icon: FaCheckCircle, image: reviewImage, title: 'Review and send your request', text: 'Check the details once, then submit your booking request. We will review it and contact you to confirm the journey with Abbey Cars.' },
]

export function HowToBook() {
  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">

        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-yellow-600">
            Simple from start to finish
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            How to Book with Abbey Cars
          </h2>

          <p className="mt-4 text-lg leading-7 text-slate-600">
            Booking your taxi in Reading is quick and straightforward. Simply
            provide your journey details through our online booking form, and
            we&apos;ll take care of the rest.
          </p>
        </div>

        {/* CARD STACK */}
        <div className="relative">

          {bookingSteps.map(({ icon: Icon, image, title, text }, index) => {

            const imageOnRight = index % 2 === 0
            const cardTone = index % 3
            const isDark = cardTone === 2

            return (
              <div
                key={title}
                className={`relative lg:h-[calc(100vh+180px)] ${index < bookingSteps.length - 1 ? 'lg:mb-[-180px]' : ''}`}
              >

                <article
                  className={`
                    lg:sticky
                    overflow-hidden
                    rounded-[28px]
                    border
                    p-6
                    shadow-[0_24px_70px_rgba(15,23,42,0.18)]
                    lg:p-8

                    ${
                      cardTone === 0
                        ? 'border-yellow-400 bg-yellow-400'
                        : cardTone === 1
                          ? 'border-slate-200 bg-white'
                          : 'border-black bg-black'
                    }
                  `}
                  style={{
                    top: `${index * 22}px`,
                    zIndex: index + 1,
                  }}
                >

                <span
                  className={`absolute left-5 top-5 z-10 text-5xl font-black leading-none lg:left-8 lg:top-8 lg:text-7xl ${
                    isDark ? 'text-yellow-400' : cardTone === 0 ? 'text-slate-950/45' : 'text-yellow-500'
                  }`}
                >
                  0{index + 1}
                </span>

                  <div
                    className={`
                      flex
                      min-h-[420px]
                      flex-col
                      gap-8

                      lg:min-h-[460px]
                      lg:flex-row
                      lg:items-stretch
                      lg:gap-0

                      ${imageOnRight ? '' : 'lg:flex-row-reverse'}
                    `}
                  >

                    {/* IMAGE */}
                    <div className="relative min-h-[240px] overflow-hidden rounded-2xl lg:w-[48%]">
                      <img
                        src={typeof image === 'string' ? image : image.src}
                        alt="Abbey Cars journey"
                        className="absolute inset-0 h-full w-full object-contain"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="relative flex flex-1 flex-col justify-center pt-8 lg:w-[52%] lg:px-16 lg:pt-12">

                      <Icon
                        className={`
                          text-2xl
                          ${
                            cardTone === 0
                              ? 'text-slate-950'
                              : 'text-yellow-500'
                          }
                        `}
                      />

                      <h3
                        className={`
                          mt-5
                          max-w-lg
                          text-3xl
                          font-bold
                          leading-[1.05]
                          sm:text-4xl
                          ${
                            isDark
                              ? 'text-white'
                              : 'text-slate-950'
                          }
                        `}
                      >
                        {title}
                      </h3>

                      <p
                        className={`
                          mt-5
                          max-w-lg
                          text-base
                          leading-7
                          sm:text-lg
                          ${
                            cardTone === 0
                              ? 'text-slate-950/75'
                              : isDark
                                ? 'text-slate-300'
                                : 'text-slate-600'
                          }
                        `}
                      >
                        {text}
                      </p>

                      <span
                        className={`
                          mt-8
                          inline-flex
                          w-fit
                          items-center
                          gap-2
                          text-xs
                          font-bold
                          uppercase
                          tracking-[0.18em]
                          ${
                            isDark
                              ? 'text-yellow-400'
                              : 'text-slate-950'
                          }
                        `}
                      >
                        Abbey Cars
                        <FaArrowRight />
                      </span>

                    </div>
                  </div>
                </article>

              </div>
            )
          })}

        </div>
      </div>
    </section>
  )
}

export function HomeFinalCTA() {
  const phoneNumber = getSiteSettings().contactInfo?.phone || '+44 118 945 4545'
  const telHref = phoneNumber.replace(/\s+/g, '')

  return (
    <section className="relative isolate overflow-hidden bg-black py-16 text-white sm:py-24">
      <svg className="pointer-events-none absolute -left-24 top-1/2 hidden h-[150%] w-80 -translate-y-1/2 text-white/15 lg:block" viewBox="0 0 320 600" fill="none" aria-hidden="true">
        <path d="M-30 55C35 8 105 18 110 82c5 65-73 74-82 137-10 68 77 74 108 29 35-51-16-112-64-75-49 38-15 111 44 131 67 23 98-43 73-91-24-47-92-40-111 15-20 59 26 113 83 117 53 4 77-37 66-78" stroke="currentColor" strokeWidth="34" strokeLinecap="round" />
      </svg>
      <svg className="pointer-events-none absolute -right-24 top-1/2 hidden h-[150%] w-80 -translate-y-1/2 scale-x-[-1] text-white/15 lg:block" viewBox="0 0 320 600" fill="none" aria-hidden="true">
        <path d="M-30 55C35 8 105 18 110 82c5 65-73 74-82 137-10 68 77 74 108 29 35-51-16-112-64-75-49 38-15 111 44 131 67 23 98-43 73-91-24-47-92-40-111 15-20 59 26 113 83 117 53 4 77-37 66-78" stroke="currentColor" strokeWidth="34" strokeLinecap="round" />
      </svg>
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold sm:text-5xl">Ready to travel?</h2>
        <p className="mt-5 text-lg leading-8 text-slate-300">Book your taxi online and let Abbey Cars take care of your journey from start to finish.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="/booking" className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-7 py-3 font-semibold text-slate-950 transition hover:bg-yellow-300">Book Online</a>
          <a href={`tel:${telHref}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-yellow-400 px-7 py-3 font-semibold text-yellow-400 transition hover:bg-yellow-400/10"><FaPhoneAlt /> Call Us Now</a>
        </div>
      </div>
    </section>
  )
}

export function DownloadApp() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] border border-slate-200 bg-yellow-400 shadow-[0_18px_50px_rgba(15,23,42,0.12)] lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative flex flex-col justify-center overflow-hidden p-8 sm:p-12 lg:p-16">
          <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full border-[22px] border-black/10" />
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-xl text-yellow-400"><FaMobileAlt /></div>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.3em] text-slate-950/65">Available on Google Play</p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-[1.12] text-slate-950 sm:text-[2.65rem]">Download our app</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-950/75 sm:text-lg">Book your Abbey Cars journey wherever you are. Our mobile app makes booking your next trip even simpler.</p>
            <a href="https://play.google.com/store/apps/details?id=com.abbeycars.passengerapp" target="_blank" rel="noreferrer" className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-slate-100">Download on Google Play <FaArrowRight /></a>
          </div>
        </div>
        <div className="flex items-center justify-center bg-black p-6 sm:p-10">
          <div className="w-full max-w-md rounded-[1.5rem] border border-white/15 bg-white p-5 shadow-2xl sm:p-7">
            <div className="flex items-end justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Google Play</p><h3 className="mt-2 text-2xl font-semibold text-slate-950">Scan to download</h3></div>
              <FaMobileAlt className="mb-1 text-2xl text-yellow-500" />
            </div>
            <div className="mt-6 flex justify-center">
              <a href="https://play.google.com/store/apps/details?id=com.abbeycars.passengerapp" target="_blank" rel="noreferrer" className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center transition hover:border-yellow-400"><img src="https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.abbeycars.passengerapp" alt="Google Play QR code" className="mx-auto aspect-square w-full max-w-[190px] object-contain" /><p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-950">Google Play</p></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}