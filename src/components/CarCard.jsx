import { FiBriefcase, FiStar, FiSuitcase, FiUsers } from '../components/Icons'

function CarCard({ image, rating = 5.0, name, category, passengers, carryOns, bags, onBook }) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-[#e8e8e8] bg-white p-0 shadow-[0_2px_12px_rgba(15,23,42,0.08)] transition-all duration-300 hover:bg-yellow-400 hover:shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
      <div className="flex items-center gap-2 px-5 pb-2 pt-5">
        <span className="text-[1.05rem] font-bold text-slate-900">{Number(rating).toFixed(1)}</span>
        <div className="flex gap-1">
          {[...Array(5)].map((_, index) => (
            <FiStar key={index} size={16} className="fill-amber-400 text-amber-400 transition-colors duration-300 group-hover:fill-black group-hover:text-black" />
          ))}
        </div>
      </div>

      <div className="relative aspect-[4/2.7] overflow-hidden bg-transparent px-4 pb-2">
        {image ? <img src={image} alt={name} className="h-full w-full object-contain transition-all duration-300" /> : <div className="flex h-full items-center justify-center text-slate-400">No image</div>}
      </div>

      <div className="px-4 pb-1">
        <h3 className="text-[1.15rem] font-semibold uppercase tracking-[0.08em] text-slate-900">{name}</h3>
        {category ? <p className="mt-1 text-sm font-medium uppercase tracking-[0.25em] text-slate-600">{category}</p> : null}
      </div>

      <div className="flex items-center justify-between px-4 pb-2 pt-3 text-[0.95rem] text-slate-600">
        <div className="flex items-center gap-2"><FiUsers size={18} className="text-slate-700" /><span>{passengers}</span></div>
        <div className="flex items-center gap-2"><FiSuitcase size={18} className="text-slate-700" /><span>{carryOns}</span></div>
        <div className="flex items-center gap-2"><FiBriefcase size={18} className="text-slate-700" /><span>{bags}</span></div>
      </div>

      <div className="px-4 pb-4 pt-2">
        <button type="button" onClick={onBook} className="w-full rounded-2xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-black transition-all duration-300 group-hover:bg-black group-hover:text-white">
          Book Now
        </button>
      </div>
    </article>
  )
}

export default CarCard
