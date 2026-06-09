'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const reviews = [
  {
    name: 'David R.',
    location: 'Homeowner',
    rating: 5,
    text: 'Our furnace quit at 11 PM on a Friday in January. Shissler had a tech at our door within the hour. He diagnosed the problem, had the part on his truck, and we had heat again by 1 AM. Unbelievable service. These guys are the real deal.',
  },
  {
    name: 'Jennifer M.',
    location: 'Property Manager',
    rating: 5,
    text: 'I manage 14 rental units and Shissler handles all of our HVAC and plumbing work. Their response time is unmatched and every technician is professional and clean. I&apos;ve tried other contractors — none come close.',
  },
  {
    name: 'Tom K.',
    location: 'Business Owner',
    rating: 5,
    text: 'Had Shissler do a complete mechanical overhaul of our commercial building — new HVAC system, updated plumbing, electrical panel upgrade. The project came in on time and on budget. The crew was professional from start to finish.',
  },
  {
    name: 'Sarah W.',
    location: 'Homeowner',
    rating: 5,
    text: 'Called on a Sunday about a water heater leak. They were there in two hours, fixed the leak and replaced a failing valve they spotted while they were at it. They flagged it before it became a bigger problem. That&apos;s the kind of service I want.',
  },
  {
    name: 'Mike T.',
    location: 'Facilities Director',
    rating: 5,
    text: 'We put Shissler on a maintenance contract for our facility three years ago. Breakdowns have gone from a monthly headache to almost zero. The preventative work they do actually prevents problems. Highly recommend their maintenance plans.',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  const prev = () => setCurrent(c => (c - 1 + reviews.length) % reviews.length)
  const next = () => setCurrent(c => (c + 1) % reviews.length)

  return (
    <section id="testimonials" className="py-24 bg-navy-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="section-label mb-3">Customer Reviews</p>
          <div className="divider-blue mx-auto mb-5" />
          <h2 className="font-display text-display text-white mb-4">
            What Our Customers Say
          </h2>
          <p className="text-steel-400 max-w-xl mx-auto text-lg leading-relaxed">
            Don&apos;t take our word for it. Here&apos;s what homeowners and businesses
            say after working with Shissler Mechanical.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          {/* Main review card */}
          <div className="relative bg-navy-800/70 border border-navy-600/50 rounded-3xl p-8 sm:p-10 mb-6">
            <Quote size={40} className="text-electric-500/20 absolute top-6 left-7" />
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                <Stars count={reviews[current].rating} />
                <p className="text-steel-200 text-lg leading-relaxed mt-5 mb-7">
                  &ldquo;{reviews[current].text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-electric-500/15 border border-electric-500/30 flex items-center justify-center">
                    <span className="text-electric-400 font-bold text-sm">
                      {reviews[current].name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{reviews[current].name}</div>
                    <div className="text-steel-500 text-xs">{reviews[current].location}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav */}
          <div className="flex items-center justify-between">
            <button onClick={prev} className="w-11 h-11 rounded-full border border-navy-600/60 hover:border-electric-600/60 bg-navy-800/60 hover:bg-navy-700 flex items-center justify-center text-steel-300 hover:text-white transition-all">
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2.5 bg-electric-500' : 'w-2.5 h-2.5 bg-navy-600 hover:bg-navy-500'}`}
                />
              ))}
            </div>

            <button onClick={next} className="w-11 h-11 rounded-full border border-navy-600/60 hover:border-electric-600/60 bg-navy-800/60 hover:bg-navy-700 flex items-center justify-center text-steel-300 hover:text-white transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
