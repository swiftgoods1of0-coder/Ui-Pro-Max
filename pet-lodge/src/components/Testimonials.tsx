'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const reviews = [
  {
    name: 'Ashley M.',
    location: 'Leonardtown, MD',
    rating: 5,
    date: 'April 2024',
    text: 'I was so nervous dropping off my rescue pup for the first time. The staff immediately put both of us at ease. When I picked him up, his tail was wagging so hard. He clearly had the best time. We\'ll never board anywhere else.',
    service: 'Boarding',
    avatar: 'A',
    color: 'bg-sage-500',
  },
  {
    name: 'James & Lisa K.',
    location: 'California, MD',
    rating: 5,
    date: 'February 2024',
    text: 'Our two labs have been coming to The Pet Lodge for daycare twice a week for over a year. They literally sprint to the gate when we pull in. The staff knows them by name, knows their personalities. It\'s exactly like leaving them with family.',
    service: 'Doggy Daycare',
    avatar: 'J',
    color: 'bg-forest-600',
  },
  {
    name: 'Priya S.',
    location: 'Waldorf, MD',
    rating: 5,
    date: 'December 2023',
    text: 'The grooming here is unreal. My golden came back looking like she stepped out of a show ring. They handled her anxiety so gently — didn\'t rush her, gave her breaks. Best grooming experience she\'s ever had.',
    service: 'Grooming',
    avatar: 'P',
    color: 'bg-tan-600',
  },
  {
    name: 'Tom R.',
    location: 'Lexington Park, MD',
    rating: 5,
    date: 'October 2023',
    text: 'Left our senior beagle for a week while we traveled. I was worried because he\'s 12 and has some quirks. They tracked his meals, gave him his supplements, and sent us updates. He came home relaxed and healthy. Couldn\'t ask for more.',
    service: 'Boarding',
    avatar: 'T',
    color: 'bg-sage-700',
  },
  {
    name: 'Maria L.',
    location: 'St. Mary\'s County, MD',
    rating: 5,
    date: 'August 2023',
    text: 'My dog used to come back from other boarding places stressed and lethargic. After The Pet Lodge? She came back tired from playing — the good kind of tired. Huge difference. The space, the care, the people — everything is top tier.',
    service: 'Boarding',
    avatar: 'M',
    color: 'bg-forest-500',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} className={i < count ? 'text-tan-500 fill-tan-500' : 'text-cream-400'} />
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
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  }

  return (
    <section id="testimonials" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-tan-100 text-tan-700 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            Reviews
          </span>
          <h2 className="font-display text-display text-forest-900 mb-4">
            Heard Straight From Pet Parents
          </h2>
          <div className="flex items-center justify-center gap-2">
            <Stars count={5} />
            <span className="font-semibold text-forest-900">5.0</span>
            <span className="text-forest-500 text-sm">· Loved by hundreds of families in Southern Maryland</span>
          </div>
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-cream-50 border border-cream-200 p-6 sm:p-12 min-h-[280px]">
            <Quote size={48} className="text-sage-200 mb-6" />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-forest-700 text-base sm:text-lg leading-relaxed mb-8 italic font-light break-words text-pretty">
                  &ldquo;{reviews[current].text}&rdquo;
                </p>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white text-sm shrink-0 ${reviews[current].color}`}>
                      {reviews[current].avatar}
                    </div>
                    <div>
                      <Stars count={reviews[current].rating} />
                      <p className="mt-1 font-semibold text-forest-900 text-sm">{reviews[current].name}</p>
                      <p className="text-xs text-forest-500">{reviews[current].location} · {reviews[current].date}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium text-sage-700 bg-sage-100 rounded-full">
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
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-forest-500 w-6' : 'bg-cream-300 w-3 hover:bg-sage-300'
                  }`}
                  aria-label={`Review ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => go(current - 1, -1)}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-cream-300 hover:border-sage-400 hover:text-sage-600 text-forest-400 transition-all"
                aria-label="Previous"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => go(current + 1, 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-cream-300 hover:border-sage-400 hover:text-sage-600 text-forest-400 transition-all"
                aria-label="Next"
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
