'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Moon, Sun, Scissors, Footprints, ArrowRight } from 'lucide-react'

const services = [
  {
    icon: Moon,
    title: 'Pet Boarding',
    tagline: 'Luxury overnight stays your pet will dream about.',
    description: 'Spacious, climate-controlled accommodations with cozy bedding, individual attention, and group playtime. Your pet stays safe, active, and loved while you\'re away.',
    highlights: ['Private sleeping areas', 'Daily group play', 'Feeding per your routine', 'Bedtime care & comfort'],
    image: '/images/boarding-bg.svg',
    accent: 'from-forest-700 to-forest-500',
    badge: 'Most Popular',
  },
  {
    icon: Sun,
    title: 'Doggy Daycare',
    tagline: 'A full day of fun, friends, and fresh air.',
    description: 'Supervised socialization, structured play sessions, and enrichment activities designed to burn energy and build confidence. Drop off a dog, pick up a happy pup.',
    highlights: ['Supervised socialization', 'Enrichment activities', 'Midday report updates', 'Separate small/large dog areas'],
    image: '/images/dogs-playing.jpg',
    accent: 'from-sage-700 to-sage-500',
    badge: null,
  },
  {
    icon: Scissors,
    title: 'Pet Grooming',
    tagline: 'Looking good, feeling great.',
    description: 'Professional grooming services tailored to your pet\'s breed and coat type. Baths, trims, nail care, ear cleaning, and full spa treatments available.',
    highlights: ['Bath & full groom', 'Breed-specific styling', 'Nail trim & file', 'Ear & eye cleaning'],
    image: '/images/pomeranian.jpg',
    accent: 'from-tan-700 to-tan-500',
    badge: null,
  },
  {
    icon: Footprints,
    title: 'Dog Walking',
    tagline: 'Adventures tailored to your dog\'s energy.',
    description: 'Reliable, professional walkers who know dog behavior. Solo and group walks available, with real-time updates so you always know where your pup is exploring.',
    highlights: ['Solo or group walks', 'GPS-tracked routes', 'Post-walk report', 'Flexible scheduling'],
    image: '/images/walk-bg.svg',
    accent: 'from-forest-600 to-sage-500',
    badge: null,
  },
]

export default function Services() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="services" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-forest-100 text-forest-700 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            What We Offer
          </span>
          <h2 className="font-display text-display text-forest-900 mb-4">
            Services Built Around Your Pet
          </h2>
          <p className="text-forest-600 max-w-xl mx-auto text-lg leading-relaxed">
            One destination. Everything your pet needs to thrive — whether for a night, a day, or just a fresh haircut.
          </p>
        </motion.div>

        {/* Service cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {services.map((svc, i) => {
            const Icon = svc.icon
            return (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-cream-50 rounded-3xl overflow-hidden border border-cream-200 hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${svc.image}')` }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${svc.accent} opacity-60`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {/* Icon badge */}
                  <div className="absolute bottom-4 left-5 p-3 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30">
                    <Icon size={22} className="text-white" />
                  </div>
                  {/* Popular badge */}
                  {svc.badge && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-tan-400 text-white text-xs font-semibold">
                      {svc.badge}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-7">
                  <h3 className="font-display text-2xl font-semibold text-forest-900 mb-1">{svc.title}</h3>
                  <p className="text-sage-600 text-sm font-medium mb-3">{svc.tagline}</p>
                  <p className="text-forest-600 text-sm leading-relaxed mb-5">{svc.description}</p>

                  {/* Highlights */}
                  <ul className="grid grid-cols-2 gap-1.5 mb-6">
                    {svc.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-xs text-forest-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-sage-500 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-forest-700 hover:text-sage-600 transition-colors group/link"
                  >
                    Learn More
                    <ArrowRight size={15} className="transition-transform group-hover/link:translate-x-1" />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
