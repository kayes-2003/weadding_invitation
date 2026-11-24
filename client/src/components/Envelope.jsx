import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { fade } from '../lib/theme'

// step: 0 closed, 1 seal glows, 2 doors open, 3 zoom into the letter
export default function Envelope({ c, onDone }) {
  const [step, setStep] = useState(0)
  const reduce = useReducedMotion()
  const { decor, couple } = c
  const cover = decor.coverImage ? `url(${decor.coverImage})` : 'linear-gradient(#F6EAD3,#E7D5B5)'

  const open = () => {
    if (step) return
    if (reduce) return onDone()
    setStep(1)
    setTimeout(() => setStep(2), 900)
    setTimeout(() => setStep(3), 4300)
    setTimeout(onDone, 5700)
  }

  const door = (side) => ({
    className: `absolute top-0 h-full w-1/2 shadow-2xl ${side === 'left' ? 'left-0' : 'right-0'}`,
    style: { backgroundImage: cover, backgroundSize: '200% 100%', backgroundPosition: side, transformOrigin: side, backfaceVisibility: 'hidden', zIndex: 10 },
    animate: { rotateY: step >= 2 ? (side === 'left' ? -115 : 115) : 0 },
    transition: { duration: 2.8, ease: [0.45, 0, 0.2, 1] },
  })

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[#2B1A1D]"
      animate={{ opacity: step === 3 ? 0 : 1 }}
      transition={{ duration: 1.2 }}
    >
      <motion.div
        role="button" tabIndex={0} aria-label="Open the invitation"
        onClick={open} onKeyDown={(e) => e.key === 'Enter' && open()}
        className="relative aspect-[9/16] h-[min(92dvh,calc(96vw*16/9))] cursor-pointer"
        style={{ perspective: 1800 }}
        animate={{ scale: step === 3 ? 2.2 : 1 }}
        transition={{ duration: 1.4, ease: 'easeIn' }}
      >
        {/* the letter, waiting behind the doors */}
        <div className="absolute text-white inset-0 overflow-hidden bg-paper text-center" style={{ containerType: 'inline-size' }}>
          {decor.headerImage && <img src={decor.headerImage} alt="" className="w-full" style={fade('bottom')} />}
          <div className="absolute inset-x-0 top-[34%] px-[5cqw]">
  <p className="font-script text-white" style={{ fontSize: '14cqw', lineHeight: 1.1 }}>{decor.welcomeText}</p>
  <p className="mt-[4cqw] font-display" style={{ fontSize: '5cqw' }}>{decor.inviteText}</p>
  <p className="mt-[3cqw] font-display font-bold text-white" style={{ fontSize: '7cqw' }}>{couple.names}</p>
          </div>
        </div>

        <motion.div {...door('left')} />
        <motion.div {...door('right')} />

        {/* glow on the wax seal */}
        <motion.div
          className="pointer-events-none absolute z-20 aspect-square w-[22%] rounded-full"
          style={{ left: '48.6%', top: '51.5%', x: '-50%', y: '-50%', boxShadow: '0 0 36px 14px rgba(255,236,190,.95)' }}
          animate={{ opacity: step >= 2 ? 0 : step === 1 ? 1 : [0.15, 0.7, 0.15] }}
          transition={step ? { duration: 0.6 } : { repeat: Infinity, duration: 2.4 }}
        />
      </motion.div>

      <motion.p className="absolute bottom-6 text-sm text-paper/80" animate={{ opacity: step ? 0 : 1 }}>
        Tap the seal to open
      </motion.p>
    </motion.div>
  )
}
