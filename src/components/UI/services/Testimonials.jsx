import { useEffect, useRef, useState } from 'react'
import { getTestimonials } from '../../../lib/cms'
import { FaChevronLeft, FaChevronRight, FaQuoteLeft, FaUser } from 'react-icons/fa'

function Testimonials() {
  const [testimonials, setTestimonials] = useState(() => getTestimonials())
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef(null)

  useEffect(() => {
    const refresh = () => {
      setTestimonials(getTestimonials())
      setActiveIndex(0)
    }
    window.addEventListener('cms-data-updated', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('cms-data-updated', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  useEffect(() => {
    if (isPaused || testimonials.length < 2) return undefined
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % testimonials.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [isPaused, testimonials.length])

  const move = (direction) => {
    setActiveIndex((index) => (index + direction + testimonials.length) % testimonials.length)
  }

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return
    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current
    const distance = touchEndX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(distance) < 45) return
    move(distance < 0 ? 1 : -1)
  }

  const visibleTestimonials = Array.from({ length: Math.min(3, testimonials.length) }, (_, offset) => ({
    testimonial: testimonials[(activeIndex + offset) % testimonials.length],
    offset,
  }))

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-600">What customers say</p>
          <h2 className="mt-4 text-3xl font-semibold leading-[1.12] text-slate-950 sm:text-[2.65rem]">What Our Customers Say</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Trusted by hundreds of satisfied customers across Berkshire and beyond.
          </p>
        </div>

        <div
          className="relative mx-auto max-w-6xl px-0 sm:px-10"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => { touchStartX.current = null }}
          style={{ touchAction: 'pan-y' }}
        >
          {visibleTestimonials.length > 0 ? (
            <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleTestimonials.map(({ testimonial, offset }) => (
                <article
                  key={`${testimonial.id}-${offset}`}
                  className={`${offset === 0 ? 'flex' : 'hidden'} group min-h-[290px] flex-col rounded-2xl bg-slate-100 p-5 text-left transition-colors duration-300 hover:bg-yellow-50 sm:flex sm:p-6`}
                >
                  <FaQuoteLeft className="text-3xl text-slate-300" aria-hidden="true" />
                  <p className="mt-5 text-base font-medium leading-7 text-slate-900">{testimonial.review}</p>
                  <div className="mt-auto -mb-10 flex w-fit items-center gap-2 rounded-full bg-white px-2.5 py-2 pr-4 shadow-sm">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-xs text-slate-950" aria-hidden="true"><FaUser /></span>
                    <div>
                      <p className="text-xs font-semibold leading-4 text-slate-900">{testimonial.name}</p>
                      <p className="text-[10px] leading-4 text-slate-500">{testimonial.service}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500">No testimonials available.</p>
          )}

          {testimonials.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label="Previous testimonial"
                className="absolute left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center border border-slate-300 bg-white text-sm text-slate-700 transition hover:border-yellow-400 hover:bg-yellow-400 lg:flex sm:-left-5"
              >
                <FaChevronLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                aria-label="Next testimonial"
                className="absolute right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center border border-slate-300 bg-white text-sm text-slate-700 transition hover:border-yellow-400 hover:bg-yellow-400 lg:flex sm:-right-5"
              >
                <FaChevronRight aria-hidden="true" />
              </button>
              <div className="mt-6 flex justify-center gap-2" aria-label="Testimonial slides">
                {testimonials.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show testimonial ${index + 1}`}
                    aria-current={index === activeIndex ? 'true' : undefined}
                    className={`h-2 rounded-full transition-all ${index === activeIndex ? 'w-6 bg-yellow-400' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
