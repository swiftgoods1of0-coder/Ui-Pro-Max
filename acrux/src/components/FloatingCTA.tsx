'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function FloatingCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.35)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#contact"
          className="fixed bottom-7 right-5 sm:right-8 z-[9990] flex items-center gap-2.5 btn-primary pl-4 pr-5 py-3 rounded-full text-[0.82rem] font-semibold tracking-[0.06em]"
          style={{ boxShadow: '0 8px 32px rgba(0,80,255,0.45), 0 2px 8px rgba(0,0,0,0.6)' }}
          initial={{ opacity: 0, y: 20, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.9 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Pulsing availability dot */}
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span>2 spots left — Start Project</span>
        </motion.a>
      )}
    </AnimatePresence>
  )
}
