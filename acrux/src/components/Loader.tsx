'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WORD = 'ACRUX'

export function Loader() {
  const [pct, setPct] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    let n = 0
    const id = setInterval(() => {
      // Accelerates toward 100 with natural feel
      const jump = Math.random() < 0.25 ? Math.floor(Math.random() * 5) + 2 : 1
      n = Math.min(n + jump, 100)
      setPct(n)
      if (n >= 100) {
        clearInterval(id)
        setTimeout(() => setDone(true), 320)
      }
    }, 20)

    return () => clearInterval(id)
  }, [])

  const onExitComplete = () => {
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
  }

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#020508] select-none"
          exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* Subtle radial glow behind letters */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: 600,
              height: 300,
              background: 'radial-gradient(ellipse at center, rgba(0,80,255,0.12) 0%, transparent 70%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -60%)',
            }}
          />

          {/* ACRUX letters — each slides up through a mask */}
          <div className="flex items-end overflow-hidden">
            {WORD.split('').map((ch, i) => (
              <div key={i} className="overflow-hidden">
                <motion.span
                  className="block font-heading font-bold text-white"
                  style={{
                    fontSize: 'clamp(3.5rem, 14vw, 8rem)',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    paddingRight: i < WORD.length - 1 ? '0.04em' : 0,
                  }}
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                >
                  {ch}
                </motion.span>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <motion.p
            className="mt-5 font-body text-[10px] sm:text-[11px] tracking-[0.42em] uppercase"
            style={{ color: 'rgba(100,130,160,0.75)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Built To Be Remembered
          </motion.p>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-10 sm:bottom-14"
            style={{ width: 'clamp(140px, 30vw, 220px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[9px] tracking-[0.28em] uppercase" style={{ color: 'rgba(80,110,140,0.7)' }}>
                Loading
              </span>
              <span className="font-mono text-[9px] tracking-[0.15em] text-white tabular-nums">
                {String(pct).padStart(3, ' ')}%
              </span>
            </div>
            <div className="h-px rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg,#0055ee,#00ccff)',
                  transformOrigin: 'left center',
                }}
                animate={{ scaleX: pct / 100 }}
                transition={{ ease: 'linear', duration: 0.18 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
