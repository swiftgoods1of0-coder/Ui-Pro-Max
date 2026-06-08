'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Award, Users, TreePine, Star } from 'lucide-react'

function Counter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true })
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(ease * end))
      if (progress < 1) requestAnimationFrame(tick)
      else setCount(end)
    }
    requestAnimationFrame(tick)
  }, [inView, end, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const stats = [
  { icon: Users, end: 10000, suffix: '+', label: 'Happy Visits', sub: 'and counting' },
  { icon: Star, end: 5, suffix: '★', label: 'Average Rating', sub: 'across all platforms' },
  { icon: TreePine, end: 3, suffix: ' acres', label: 'Outdoor Play Space', sub: 'for dogs to explore' },
  { icon: Award, end: 10, suffix: '+', label: 'Years in Business', sub: 'trusted by families' },
]

export default function Experience() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="experience" className="py-24 overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 bg-green-gradient" />
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #82bb8a 0%, transparent 50%), radial-gradient(circle at 80% 20%, #e0b848 0%, transparent 40%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — text + photos */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 text-sage-200 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
              The Lodge Experience
            </span>
            <h2 className="font-display text-display text-white mb-6 leading-tight">
              More Than Pet Care.
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #82bb8a, #e0b848)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                A Home Away From Home.
              </span>
            </h2>
            <p className="text-sage-200 text-lg leading-relaxed mb-8 font-light">
              At The Pet Lodge, every stay is designed to feel like a mini-vacation.
              Wide open spaces, caring staff, enrichment activities, and a routine
              that keeps your pet comfortable and confident.
            </p>
            <p className="text-sage-300 leading-relaxed mb-10">
              We believe pets thrive when they feel safe, stimulated, and surrounded
              by people who genuinely care. That&apos;s why families come back again and
              again — and why their dogs pull toward our gate on arrival.
            </p>

            {/* Photo grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl overflow-hidden h-44">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: "url('/images/yard-play.jpg')" }}
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-44">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: "url('/images/boarding-dog.jpg')" }}
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-36 col-span-2">
                <div
                  className="w-full h-full bg-cover bg-top"
                  style={{ backgroundImage: "url('/images/facility-building.jpg')" }}
                />
              </div>
            </div>
          </motion.div>

          {/* Right — stats */}
          <div className="grid grid-cols-2 gap-5">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/15 hover:bg-white/15 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-sage-200" />
                  </div>
                  <div className="font-display text-4xl font-bold text-white mb-1">
                    <Counter end={stat.end} suffix={stat.suffix} />
                  </div>
                  <div className="font-semibold text-sage-200 text-sm mb-0.5">{stat.label}</div>
                  <div className="text-sage-400 text-xs">{stat.sub}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
