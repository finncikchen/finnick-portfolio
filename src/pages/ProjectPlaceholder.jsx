import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import homeBg from '../assets/images/home-bg.png'

const projectMeta = {
  bytedance: { title: 'ByteDance', subtitle: 'Internal Platform · Operational Tools' },
  bosch: { title: 'Bosch', subtitle: 'Internal Platform · Operational Tools' },
  yhlo: { title: 'YHLO', subtitle: 'Product Design' },
  'flower-star': { title: 'Flower Star', subtitle: 'Consumer Product Design' },
}

export default function ProjectPlaceholder() {
  const { id } = useParams()
  const meta = projectMeta[id] || { title: id, subtitle: '' }

  return (
    <div className="min-h-screen bg-navy flex flex-col overflow-hidden">
      <img
        src={homeBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
      />
      <div className="relative z-10 flex flex-col flex-1">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-8 px-16 py-24">
          <p className="font-poppins text-sm text-white/40 uppercase tracking-widest">Case Study</p>
          <h1 className="font-playfair font-semibold text-[64px] text-text-light text-center leading-[1.2]">
            {meta.title}
          </h1>
          <p className="font-poppins text-xl text-white/60">{meta.subtitle}</p>
          <p className="font-poppins text-sm text-white/30 mt-4">Content coming soon</p>
          <Link
            to="/work"
            className="mt-8 font-poppins text-base text-white/60 hover:text-white border border-white/20 hover:border-white/40 rounded-full px-8 py-3 transition-all"
          >
            ← Back to Work
          </Link>
        </div>
        <Footer />
      </div>
    </div>
  )
}
