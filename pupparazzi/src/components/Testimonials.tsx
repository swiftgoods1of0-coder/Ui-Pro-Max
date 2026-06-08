'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const reviews = [
  {
    name: 'Sarah M.',
    pet: 'Golden Retriever mom',
    initials: 'SM',
    color: '#c4365f',
    rating: 5,
    text: "Pupparazzi is the only place I trust with my golden. Bella always comes home looking absolutely beautiful — and she's actually excited to go, which says everything. The team is so patient and kind.",
  },
  {
    name: 'James R.',
    pet: 'Poodle owner',
    initials: 'JR',
    color: '#b02456',
    rating: 5,
    text: "Best groomer in the area, hands down. My poodle looks like he just stepped out of a show ring every single time. They really understand poodle coats and styling. Highly, highly recommend.",
  },
  {
    name: 'Monica T.',
    pet: 'Two cats, regular client',
    initials: 'MT',
    color: '#8f1d44',
    rating: 5,
    text: "I was nervous about grooming my cats but the team at Pupparazzi put us all at ease. My cats came back calm, clean, and looking amazing. Now it's a regular appointment for us!",
  },
  {
    name: 'David & Lisa K.',
    pet: 'Sheltie parents',
    initials: 'DK',
    color: '#6b1535',
    rating: 5,
    text: "We've been coming here for over a year with our Sheltie, Max. The consistency is remarkable — every groom is perfect. The staff remembers Max's preferences and always greet him by name.",
  },
  {
    name: 'Priya N.',
    pet: 'Doodle mom',
    initials: 'PN',
    color: '#b02456',
    rating: 5,
    text: "The facility is spotless, the staff are amazing, and the results speak for themselves. My doodle went from a matted mess to a fluffy cloud. Couldn't be happier with Pupparazzi!",
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  const prev = () => setCurrent(c => (c - 1 + reviews.length) % reviews.length)
  const next = () => setCurrent(c => (c + 1) % reviews.length)

  const review = reviews[current]

  return (
    <section id="testimonials" className="py-24 bg-warm-50 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 text-rose-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            Client Reviews
          </span>
          <h2 className="font-display text-display text-warm-950 mb-4">
            Pets & Owners{' '}
            <span className="rose-text">Love Us</span>
          </h2>
          <p className="text-warm-500 text-lg leading-relaxed">
            Don&apos;t take our word for it — hear from our happy clients.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-soft border border-warm-100 min-h-[260px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-rose-400 fill-rose-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-warm-700 text-lg leading-relaxed mb-8 font-light italic">
                  &ldquo;{review.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background: review.color }}>
                    {review.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-warm-900 text-sm">{review.name}</p>
                    <p className="text-warm-400 text-xs">{review.pet}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6">
            <button onClick={prev}
              className="w-10 h-10 rounded-full border border-warm-200 flex items-center justify-center text-warm-500 hover:border-rose-300 hover:text-rose-500 transition-colors">
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-rose-400' : 'w-2 bg-warm-200'}`} />
              ))}
            </div>

            <button onClick={next}
              className="w-10 h-10 rounded-full border border-warm-200 flex items-center justify-center text-warm-500 hover:border-rose-300 hover:text-rose-500 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
