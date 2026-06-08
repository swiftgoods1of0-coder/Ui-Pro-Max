'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Heart, Star, Sparkles, ShieldCheck, Users, Clock } from 'lucide-react'

const features = [
  {
    icon: Heart,
    title: 'Gentle Handling',
    body: 'Every pet is handled with patience and care. We take the time to keep your pet calm and comfortable throughout the entire grooming process.',
  },
  {
    icon: Star,
    title: 'Personalized Attention',
    body: "No cookie-cutter cuts here. We tailor each groom to your pet's breed, coat type, and your personal preferences.",
  },
  {
    icon: Sparkles,
    title: 'Spotless Facility',
    body: 'Our grooming space is cleaned and sanitized between every appointment. Your pet deserves a fresh, safe environment.',
  },
  {
    icon: ShieldCheck,
    title: 'Professional Groomers',
    body: 'Experienced professionals who know breed standards, coat textures, and the best tools for every type of pet.',
  },
  {
    icon: Users,
    title: 'Friendly Team',
    body: "We genuinely love animals — it shows. From the moment you walk in to pick-up, you'll feel the difference.",
  },
  {
    icon: Clock,
    title: 'Reliable Scheduling',
    body: 'We respect your time. Appointments run on schedule so you can plan your day without long waits or surprises.',
  },
]

export default function WhyUs() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="why-us" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 text-rose-600 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            Why Pupparazzi
          </span>
          <h2 className="font-display text-display text-warm-950 mb-4">
            The Grooming Experience{' '}
            <span className="rose-text">Your Pet Deserves</span>
          </h2>
          <p className="text-warm-500 max-w-xl mx-auto text-lg leading-relaxed">
            We&apos;re more than a grooming salon — we&apos;re a place where pets feel safe
            and owners feel confident.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group p-7 rounded-3xl border border-warm-100 hover:border-rose-200 bg-warm-50 hover:bg-white transition-all duration-400 hover:shadow-soft"
              >
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5 bg-rose-100 group-hover:bg-rose-500 transition-colors duration-300">
                  <Icon size={20} className="text-rose-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-display text-lg font-semibold text-warm-950 mb-2">{f.title}</h3>
                <p className="text-warm-500 text-sm leading-relaxed">{f.body}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
