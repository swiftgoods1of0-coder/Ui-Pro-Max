'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

type Ctx = { navigate: (href: string) => void }
const TransitionContext = createContext<Ctx>({ navigate: () => {} })

export function useTransitionNavigate() {
  return useContext(TransitionContext).navigate
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  // phase: idle → covering (curtain slides in) → uncovering (curtain slides out)
  const [phase, setPhase] = useState<'idle' | 'covering' | 'uncovering'>('idle')
  const [pendingHref, setPendingHref] = useState('')

  const navigate = useCallback((href: string) => {
    setPendingHref(href)
    setPhase('covering')
  }, [])

  const onCoverComplete = () => {
    if (phase !== 'covering') return
    router.push(pendingHref)
    // Brief pause so the new page renders under the curtain, then reveal
    setTimeout(() => setPhase('uncovering'), 80)
  }

  const onUncoverComplete = () => {
    if (phase === 'uncovering') setPhase('idle')
  }

  const isCovering   = phase === 'covering'
  const isUncovering = phase === 'uncovering'
  const visible      = isCovering || isUncovering

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      {visible && (
        <motion.div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 99999,
            background: 'linear-gradient(135deg,#010305 0%,#020818 100%)',
            transformOrigin: isCovering ? 'left center' : 'right center',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isCovering ? 1 : 0 }}
          transition={{ duration: 0.52, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={isCovering ? onCoverComplete : onUncoverComplete}
        >
          {/* Logo centred on curtain */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: isCovering ? 1 : 0, y: 0 }}
              transition={{ duration: 0.25, delay: 0.18 }}
              className="font-heading font-bold text-white tracking-[0.4em] text-sm uppercase"
            >
              ACRUX
            </motion.span>
          </div>
        </motion.div>
      )}
    </TransitionContext.Provider>
  )
}
