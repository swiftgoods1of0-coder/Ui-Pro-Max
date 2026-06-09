'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { CheckCircle } from 'lucide-react'

const highlights = [
  'Family-owned and locally operated',
  'Residential, commercial, and industrial capability',
  'Comprehensive service across all mechanical trades',
  'Continuous technician training and certification',
  'Community-focused business practices',
  'Long-term relationships over one-time transactions',
]

export default function About() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="about" className="py-24 bg-navy-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — visual block */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* 2x2 photo grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { src: '/photos/plumbing.jpg', label: 'Plumbing' },
                { src: '/photos/hvac.jpg', label: 'HVAC' },
                { src: '/photos/remodel.jpg', label: 'Remodeling' },
                { src: '/photos/basement.jpg', label: 'Mechanical' },
              ].map((photo, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden bg-navy-800 border border-navy-700/60 aspect-square">
                  <img
                    src={photo.src}
                    alt={`Shissler Mechanical ${photo.label} work`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-3 text-white text-xs font-semibold tracking-wide opacity-90">{photo.label}</span>
                </div>
              ))}
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-5 -right-4 bg-electric-500 rounded-2xl px-5 py-4 shadow-blue-glow"
            >
              <div className="text-white text-xs font-bold uppercase tracking-widest mb-0.5">Real Work</div>
              <div className="text-electric-100 text-[10px]">Actual job photos</div>
            </motion.div>
          </motion.div>

          {/* Right — copy block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="section-label mb-3">About Us</p>
            <div className="divider-blue mb-5" />
            <h2 className="font-display text-display text-white mb-6 leading-tight">
              Mechanical Expertise<br />
              <span className="text-gradient-blue">You Can Rely On</span>
            </h2>
            <p className="text-steel-400 text-lg leading-relaxed mb-4">
              Shissler Mechanical LLC was founded with a clear mission: deliver expert mechanical
              services to homeowners and businesses with the kind of professionalism and
              integrity that was once standard in every trade.
            </p>
            <p className="text-steel-400 text-lg leading-relaxed mb-8">
              We cover every mechanical system under your roof — HVAC, heating, cooling,
              plumbing, electrical, and water conditioning — so you never need to juggle
              multiple contractors. One call handles everything, one team stands behind it all.
            </p>

            <ul className="space-y-3">
              {highlights.map((h, i) => (
                <motion.li
                  key={h}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.35 + i * 0.06 }}
                  className="flex items-center gap-3 text-steel-300 text-sm"
                >
                  <CheckCircle size={16} className="text-electric-400 shrink-0" />
                  {h}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
