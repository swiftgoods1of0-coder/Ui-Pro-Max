'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PhoneCall } from 'lucide-react'

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="tel:+17175550100"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-full text-dark-950 font-semibold text-sm shadow-gold-lg group"
          style={{ background: 'linear-gradient(135deg, #C4922A, #E8C547)' }}
          aria-label="Call Powell Renovations"
        >
          <motion.div
            animate={{ rotate: [0, -15, 15, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
          >
            <PhoneCall size={18} className="text-dark-950" />
          </motion.div>
          <span className="hidden sm:inline">Get Free Estimate</span>
        </motion.a>
      )}
    </AnimatePresence>
  )
}
