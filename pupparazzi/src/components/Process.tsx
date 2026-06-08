'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { MessageSquare, CalendarCheck, Scissors, Sparkles } from 'lucide-react'

const steps = [
  {
    icon: MessageSquare,
    step: '01',
    title: 'Call or Text Us',
    body: 'Reach out by phone or text at (704) 267-8982. Let us know your pet\'s breed, coat type, and what service you\'re looking for.',
  },
  {
    icon: CalendarCheck,
    step: '02',
    title: 'Book Your Appointment',
    body: "We'll find a time that works for your schedule, Monday through Friday. Appointments are easy, quick, and confirmed right away.",
  },
  {
    icon: Scissors,
    step: '03',
    title: 'Drop Off & Relax',
    body: "Bring your pet in and leave the rest to us. We'll handle everything from the bath to the finishing touches with care.",
  },
  {
    icon: Sparkles,
    step: '04',
    title: 'Pick Up & Admire',
    body: 'Your pet leaves looking and smelling amazing. We notify you when they\'re ready so you can breeze in and show them off.',
  },
]

export default function Process() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="py-24 overflow-hidden" style={{ background: 'linear-gradient(160deg,#1a0810 0%,#3d0f20 50%,#6b1535 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-rose-300 text-xs font-semibold tracking-[0.2em] uppercase mb-4 border border-white/10">
            How It Works
          </span>
          <h2 className="font-display text-display text-white mb-4">
            From Booking to{' '}
            <span style={{ background: 'linear-gradient(135deg,#e090a8,#d4607e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Beautiful
            </span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-lg leading-relaxed font-light">
            Getting your pet groomed at Pupparazzi is simple, stress-free, and always worth it.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line — desktop only */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-white/10 z-0" />

          {steps.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 text-center"
              >
                {/* Circle */}
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 border border-white/10"
                  style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)' }}>
                  <Icon size={26} className="text-rose-300" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#b02456,#d4607e)' }}>
                    {s.step}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{s.body}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
