'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Swap this URL for your actual Vimeo/YouTube showreel
const SHOWREEL_EMBED = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1'

export function ShowreelModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[99990] flex items-center justify-center p-4 sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0" style={{ background: 'rgba(1,3,5,0.96)', backdropFilter: 'blur(24px)' }} />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full border border-[rgba(255,255,255,0.12)] flex items-center justify-center text-[var(--color-muted)] hover:text-white hover:border-white/30 transition-all"
            aria-label="Close showreel"
          >
            <span className="text-lg leading-none select-none">✕</span>
          </button>

          {/* Video */}
          <motion.div
            className="relative z-10 w-full max-w-5xl"
            style={{ aspectRatio: '16/9' }}
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
          >
            {/* Glow ring */}
            <div
              className="absolute -inset-1 rounded-2xl pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(0,80,255,0.25) 0%, transparent 70%)', filter: 'blur(20px)' }}
            />
            <iframe
              src={SHOWREEL_EMBED}
              className="w-full h-full rounded-2xl border border-white/[0.08]"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="ACRUX Showreel"
            />
          </motion.div>

          {/* Label */}
          <motion.p
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--color-muted)] text-xs tracking-[0.3em] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            ACRUX Studio — Showreel 2024
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
