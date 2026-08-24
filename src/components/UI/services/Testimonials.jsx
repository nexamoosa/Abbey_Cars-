import { useEffect, useState } from 'react'
import { getTestimonials } from '../../../lib/cms'

function Testimonials() {
  const [testimonials, setTestimonials] = useState(() => getTestimonials())
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

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

  const visibleTestimonials = Array.from({ length: Math.min(4, testimonials.length) }, (_, offset) => ({
    testimonial: testimonials[(activeIndex + offset) % testimonials.length],
    offset,
  }))

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">What Our Customers Say</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            Trusted by hundreds of satisfied customers across Berkshire and beyond.
          </p>
        </div>

        <div
          className="relative mx-auto max-w-6xl px-8 sm:px-10"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {visibleTestimonials.length > 0 ? (
            <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {visibleTestimonials.map(({ testimonial, offset }) => (
                <article
                  key={`${testimonial.id}-${offset}`}
                  className="flex min-h-[300px] flex-col rounded-2xl border border-slate-200 bg-slate-50 p-7 text-center shadow-sm transition-all duration-500 hover:border-yellow-400 hover:bg-yellow-50"
                >
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(Number(testimonial.rating) || 0)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-700 italic">&quot;{testimonial.review}&quot;</p>
                  <div className="mt-auto border-t border-slate-200 pt-5">
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="mt-1 text-xs text-slate-600">{testimonial.service}</p>
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
                className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-xl text-slate-700 shadow-sm transition hover:border-yellow-400 hover:bg-yellow-50 sm:-left-5"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                aria-label="Next testimonial"
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-xl text-slate-700 shadow-sm transition hover:border-yellow-400 hover:bg-yellow-50 sm:-right-5"
              >
                ›
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
