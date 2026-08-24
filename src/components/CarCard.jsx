import { FiBriefcase, FiStar, FiSuitcase, FiUsers } from '../components/Icons'

function CarCard({ image, rating = 5.0, name, category, passengers, carryOns, bags, onBook }) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-slate-100">
        <img src={image} alt={name} className="absolute inset-0 h-full w-full object-cover" />

        <div className="absolute left-3 top-3 flex items-center gap-3 text-sm font-semibold text-slate-950">
          <span className="text-lg font-bold leading-none">{Number(rating).toFixed(1)}</span>
          <span className="flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, index) => (
              <FiStar key={index} className="h-3.5 w-3.5" />
            ))}
          </span>
        </div>

        <div className="absolute left-3 bottom-3 max-w-[70%] text-left text-slate-950">
          <h2 className="text-2xl font-bold leading-tight">{name}</h2>
          {category ? <p className="mt-1 text-sm font-medium uppercase tracking-[0.25em] text-slate-600">{category}</p> : null}
        </div>
      </div>

      <div className="p-6">
        <ul className="space-y-3 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <FiUsers className="h-4 w-4 text-slate-600" />
            <span>{passengers} Passenger{passengers === 1 ? '' : ''}</span>
          </li>
          <li className="flex items-center gap-2">
            <FiBriefcase className="h-4 w-4 text-slate-600" />
            <span>{carryOns} Hand Carries</span>
          </li>
          <li className="flex items-center gap-2">
            <FiSuitcase className="h-4 w-4 text-slate-600" />
            <span>{bags} Bags</span>
          </li>
        </ul>

        <button
          type="button"
          onClick={onBook}
          className="mt-8 inline-flex w-full items-center justify-center rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] transition hover:brightness-95 focus:outline-none focus:ring-2"
          style={{ backgroundColor: 'var(--site-button-bg)', color: 'var(--site-button-text)' }}
        >
          BOOK NOW
        </button>
      </div>
    </article>
  )
}

export default CarCard
