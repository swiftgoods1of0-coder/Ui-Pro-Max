'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const reviews = [
  {
    name: 'Jennifer M.',
    location: 'York, PA',
    rating: 5,
    date: 'March 2024',
    text: 'Powell Renovations completely transformed our kitchen. The craftsmanship is outstanding — the tile work, the cabinet installation, every detail is perfect. They showed up every day on time, kept our home clean, and finished the project exactly when they said they would. Already booked them for the master bath.',
    service: 'Kitchen Remodel',
  },
  {
    name: 'David R.',
    location: 'Spring Grove, PA',
    rating: 5,
    date: 'January 2024',
    text: 'Had a major plumbing issue — a pipe burst behind the wall on a Sunday morning. Powell had someone out within two hours. Fixed the problem fast, was upfront about pricing from the start, and left the area cleaner than before. No inflated emergency pricing either. These guys have earned a customer for life.',
    service: 'Emergency Plumbing',
  },
  {
    name: 'Karen T.',
    location: 'Shrewsbury, PA',
    rating: 5,
    date: 'November 2023',
    text: 'Our siding hadn\'t been cleaned in years and the driveway looked terrible. After one afternoon with Powell\'s pressure washing crew, the house looked brand new. Neighbors literally stopped to ask what we did to it. The price was fair, the team was professional, and the results exceeded every expectation.',
    service: 'Pressure Washing',
  },
  {
    name: 'Marcus & Tina W.',
    location: 'Red Lion, PA',
    rating: 5,
    date: 'September 2023',
    text: 'We hired Powell for a full basement finishing project — 1,200 square feet from bare concrete to a beautiful livable space. The communication throughout was exceptional. They flagged a potential issue with our HVAC early on and saved us thousands. The finished result looks like something out of a magazine.',
    service: 'Basement Finishing',
  },
  {
    name: 'Robert L.',
    location: 'Dallastown, PA',
    rating: 5,
    date: 'July 2023',
    text: 'Couldn\'t be happier with the deck Powell built for us. We showed them a few photos of what we were imagining and they came back with a design that was even better. The composite decking, the cable railing, the built-in lighting — it\'s the best investment we\'ve made in this house in 20 years.',
    service: 'Deck Construction',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < count ? 'text-gold-400 fill-gold-400' : 'text-dark-600'} />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  const go = (next: number, dir: number) => {
    setDirection(dir)
    setCurrent((next + reviews.length) % reviews.length)
  }

  useEffect(() => {
    timerRef.current = setInterval(() => go(current + 1, 1), 6000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [current])

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 30 : -30 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -30 : 30 }),
  }

  return (
    <section id="testimonials" className="py-24 bg-dark-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase mb-3">Reviews</p>
          <h2 className="font-display text-display text-white mb-4">Heard Straight From Our Clients</h2>
          <div className="flex items-center justify-center gap-2">
            <Stars count={5} />
            <span className="text-white font-semibold">5.0</span>
            <span className="text-dark-400 text-sm">· 98%+ satisfaction across 350+ projects</span>
          </div>
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-3xl mx-auto overflow-hidden">
          <div className="overflow-hidden rounded-sm border border-dark-800 bg-dark-950 p-5 sm:p-10 min-h-[280px]">
            <Quote size={40} className="text-gold-500/20 mb-6" />
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-dark-200 text-base leading-relaxed mb-6 text-pretty italic break-words">
                  &ldquo;{reviews[current].text}&rdquo;
                </p>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <Stars count={reviews[current].rating} />
                    <p className="mt-2 font-semibold text-white">{reviews[current].name}</p>
                    <p className="text-sm text-dark-400">{reviews[current].location} · {reviews[current].date}</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium text-gold-400 border border-gold-500/30 rounded-sm bg-gold-500/5">
                    {reviews[current].service}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i, i > current ? 1 : -1)}
                  className={`w-6 h-1 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-gold-500 w-8' : 'bg-dark-700 hover:bg-dark-500'
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => go(current - 1, -1)}
                className="w-10 h-10 flex items-center justify-center border border-dark-700 rounded-sm hover:border-gold-500/50 hover:text-gold-400 text-dark-400 transition-all"
                aria-label="Previous review"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => go(current + 1, 1)}
                className="w-10 h-10 flex items-center justify-center border border-dark-700 rounded-sm hover:border-gold-500/50 hover:text-gold-400 text-dark-400 transition-all"
                aria-label="Next review"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
