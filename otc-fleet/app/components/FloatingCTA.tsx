'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Calendar } from 'lucide-react'

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleSchedule = (e: React.MouseEvent) => {
    e.preventDefault()
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          aria-label="Mobile call to action bar"
        >
          {/* Orange gradient top line */}
          <div className="h-0.5 bg-gradient-to-r from-brand-dark via-brand to-brand-dark-dark-dark" />

          <div
            className="grid grid-cols-2"
            style={{ backgroundColor: '#0a1628' }}
          >
            {/* Call button */}
            <a
              href="tel:7172083600"
              className="flex items-center justify-center gap-2 py-4 font-bold text-sm transition-all duration-200 active:scale-95"
              style={{ backgroundColor: '#FFD400', color: '#ffffff' }}
              aria-label="Call Lancaster location at 717-208-3600"
            >
              <Phone className="w-4 h-4" />
              <span>Call Lancaster</span>
            </a>

            {/* Schedule button */}
            <a
              href="#contact"
              onClick={handleSchedule}
              className="flex items-center justify-center gap-2 py-4 font-bold text-sm border-l transition-all duration-200 active:scale-95"
              style={{
                backgroundColor: '#0d1f3c',
                borderColor: 'rgba(255,212,0,0.3)',
                color: '#ffffff',
              }}
              aria-label="Schedule service"
            >
              <Calendar className="w-4 h-4" style={{ color: '#FFD400' }} />
              <span>Schedule Service</span>
            </a>
          </div>

          {/* Safe area padding for iOS */}
          <div className="h-safe-bottom" style={{ backgroundColor: '#0a1628' }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
