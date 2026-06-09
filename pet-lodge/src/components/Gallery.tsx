'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { X, ZoomIn } from 'lucide-react'

const photos = [
  { src: '/images/yard-play.jpg', alt: 'Dogs playing in our fenced outdoor yard', span: 'col-span-2 row-span-2' },
  { src: '/images/boarding-dog.jpg', alt: 'A guest in our comfortable boarding suites', span: '' },
  { src: '/images/facility-building.jpg', alt: 'The Pet Lodge facility exterior', span: '' },
  { src: '/images/dogs-playing.jpg', alt: 'Group daycare playtime', span: 'col-span-2' },
  { src: '/images/pomeranian.jpg', alt: 'Fluffy guest enjoying the play area', span: '' },
  { src: '/images/transport-van.jpg', alt: 'Our pet transport vehicle', span: '' },
  { src: '/images/facility-sign.jpg', alt: 'The Pet Lodge — Leonardtown, MD', span: '' },
]

export default function Gallery() {
  const [selected, setSelected] = useState<string | null>(null)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="facility" className="py-24 bg-cream-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-sage-100 text-sage-700 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            Our Facility
          </span>
          <h2 className="font-display text-display text-forest-900 mb-4">
            See The Lodge for Yourself
          </h2>
          <p className="text-forest-600 max-w-xl mx-auto text-lg leading-relaxed">
            Wide open play yards, comfortable boarding suites, and a professional
            grooming studio — all in one welcoming place.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 auto-rows-[200px]">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.src}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`relative group overflow-hidden rounded-2xl cursor-pointer ${photo.span}`}
              onClick={() => setSelected(photo.src)}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${photo.src}')` }}
              />
              <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/30 transition-all duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                  <ZoomIn size={20} className="text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl w-full max-h-[85vh] rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="w-full h-full min-h-[50vh] bg-cover bg-center"
                style={{ backgroundImage: `url('${selected}')` }}
              />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
