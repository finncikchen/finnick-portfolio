import { Link } from 'react-router-dom'
import logo from '../assets/images/logo.svg'
import returnIcon from '../assets/images/return-icon.png'
import dividerLine from '../assets/images/divider-line.png'

export default function Footer() {
  return (
    <footer className="bg-[#111315] flex flex-col items-center justify-between pt-20 px-16 pb-10 rounded-tl-[32px] rounded-tr-[32px] w-full mt-auto">
      <p className="font-poppins font-semibold text-[64px] text-center text-white leading-[1.4] w-full mb-16">
        Let&apos;s make some{' '}
        <span className="text-[#165dff]">cool stuff</span>
        {' '}together!
      </p>

      <div className="flex flex-col gap-16 items-center w-full">
        <Link to="/" className="flex items-center gap-2 font-poppins text-2xl text-white hover:opacity-70 transition-opacity">
          <img src={returnIcon} alt="" className="h-6 w-6 object-contain" />
          Return to Main
        </Link>

        <div className="flex flex-col gap-16 items-center w-full">
          <div className="flex flex-wrap items-end justify-between w-full">
            <div className="flex flex-col gap-1">
              <p className="font-poppins font-medium text-xs text-white/60 tracking-[-0.24px]">
                let&apos;s connect
              </p>
              <p className="font-poppins font-medium text-base text-white tracking-[-0.08px]">
                c4han@uw.edu
              </p>
            </div>
            <p className="font-poppins font-medium text-base text-white/55 tracking-[-0.08px]">
              © 2026 Finnick Chen
            </p>
          </div>

          <div className="flex flex-col gap-16 items-center opacity-24 w-full">
            <div className="w-full h-px relative">
              <img src={dividerLine} alt="" className="w-full h-px object-cover" />
            </div>
            <div className="relative w-full overflow-hidden" style={{ filter: 'blur(7px)', opacity: 0.71 }}>
              <img src={logo} alt="FINNICK" className="w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
