'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Droplets, Scissors, CropIcon, Phone, MessageSquare } from 'lucide-react'

const services = [
  {
    icon: Droplets,
    title: 'Bath & Groom',
    tagline: 'Clean, fresh, and pampered.',
    description: 'A thorough bath with premium shampoo, blow-dry, brush-out, nail trim, ear cleaning, and a spritz of cologne. Your pet leaves smelling amazing and feeling great.',
    highlights: ['Premium shampoo & conditioner', 'Full blow-dry & brush-out', 'Nail trim & filing', 'Ear cleaning', 'Spritz & bandana'],
    image: '/images/cat-black.jpg',
    bgPos: '50% 45%',
    badge: null,
  },
  {
    icon: Scissors,
    title: 'Full Grooming',
    tagline: 'The complete experience.',
    description: 'Everything in the Bath & Groom plus a full body trim and sanitary trim tailored to your breed and style preference. Walk out looking like a show dog.',
    highlights: ['Full bath & dry', 'Full body trim', 'Sanitary trim', 'Breed-specific styling', 'Finishing touches'],
    image: '/images/sheltie.jpg',
    bgPos: '50% 25%',
    badge: 'Most Popular',
  },
  {
    icon: CropIcon,
    title: 'Pet Haircuts',
    tagline: 'Custom cuts, every time.',
    description: 'Precision haircuts designed around your pet\'s coat type and your style wishes. Includes a full body trim and sanitary trim to keep your pet looking polished.',
    highlights: ['Full body trim', 'Sanitary trim', 'Breed or custom style', 'Face & paw shaping', 'Finishing bow or bandana'],
    image: '/images/poodles-duo.jpg',
    bgPos: '50% 35%',
    badge: null,
  },
]

export default function Services() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="services" className="py-24 bg-warm-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 text-rose-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            Our Services
          </span>
          <h2 className="font-display text-display text-warm-950 mb-4">
            Grooming Services Built for{' '}
            <span className="rose-text">Every Pet</span>
          </h2>
          <p className="text-warm-500 max-w-xl mx-auto text-lg leading-relaxed">
            Dogs and cats of all breeds, sizes, and coat types welcome.
            Call or text to find the right service for your furry friend.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((svc, i) => {
            const Icon = svc.icon
            return (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-500 hover:-translate-y-1 border border-warm-100"
              >
                {/* Photo */}
                <div className="relative h-52 overflow-hidden">
                  <div className="absolute inset-0 bg-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${svc.image}')`, backgroundPosition: svc.bgPos }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 p-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                    <Icon size={20} className="text-white" />
                  </div>
                  {svc.badge && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-white text-xs font-semibold"
                      style={{ background: 'linear-gradient(135deg,#b02456,#d4607e)' }}>
                      {svc.badge}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-warm-950 mb-1">{svc.title}</h3>
                  <p className="text-rose-500 text-sm font-medium mb-3">{svc.tagline}</p>
                  <p className="text-warm-500 text-sm leading-relaxed mb-5">{svc.description}</p>
                  <ul className="space-y-1.5 mb-6">
                    {svc.highlights.map(h => (
                      <li key={h} className="flex items-center gap-2 text-xs text-warm-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <a href="tel:+17042678982"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-xl border border-warm-200 text-warm-700 hover:border-rose-300 hover:text-rose-600 transition-colors">
                      <Phone size={13} /> Call
                    </a>
                    <a href="sms:+17042678982"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-white rounded-xl transition-all hover:shadow-rose"
                      style={{ background: 'linear-gradient(135deg,#b02456,#d4607e)' }}>
                      <MessageSquare size={13} /> Text to Book
                    </a>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
