'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Award, Clock, Users, Wrench, ThumbsUp, Shield } from 'lucide-react'

const reasons = [
  {
    icon: Clock,
    title: 'True 24/7 Response',
    desc: 'We actually answer the phone at 2 AM. No answering machine, no callback queue — a live technician dispatched to your location.',
  },
  {
    icon: Award,
    title: 'Licensed & Certified',
    desc: 'All technicians hold current state licensure for HVAC, plumbing, and electrical work. Fully bonded and insured on every job.',
  },
  {
    icon: Wrench,
    title: 'All Trades, One Call',
    desc: 'HVAC, plumbing, electrical, and mechanical contracting under one roof. No coordinating multiple contractors on the same project.',
  },
  {
    icon: Users,
    title: 'Experienced Team',
    desc: 'Our technicians average over a decade of field experience. We hire for skill and train for excellence — no apprentices on solo calls.',
  },
  {
    icon: ThumbsUp,
    title: 'Transparent Pricing',
    desc: 'Upfront quotes before any work begins. No hidden fees, no surprise charges. You approve every dollar before we turn a wrench.',
  },
  {
    icon: Shield,
    title: 'Workmanship Guarantee',
    desc: 'Every repair and installation backed by our workmanship warranty. If it fails due to our work, we come back and fix it. Period.',
  },
]

export default function WhyUs() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="why-us" className="py-24 bg-navy-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — headline block */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="section-label mb-3">Why Shissler</p>
            <div className="divider-blue mb-5" />
            <h2 className="font-display text-display text-white mb-6 leading-tight">
              The Contractor<br />
              <span className="text-gradient-blue">You Can Count On</span>
            </h2>
            <p className="text-steel-400 text-lg leading-relaxed mb-8">
              We built Shissler Mechanical on a simple premise: do the work right,
              show up when promised, and charge a fair price. That reputation has
              kept our customers calling back for years — and referring their neighbors.
            </p>

            {/* Stat row */}
            <div className="flex flex-wrap gap-8">
              {[
                { val: '24/7', label: 'Live Dispatch' },
                { val: '100%', label: 'Licensed Techs' },
                { val: '1-Call', label: 'All Trades' },
              ].map(({ val, label }) => (
                <div key={label}>
                  <div className="text-3xl font-black text-gradient-blue leading-none mb-1">{val}</div>
                  <div className="text-steel-400 text-sm font-medium uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — reason cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {reasons.map((r, i) => {
              const Icon = r.icon
              return (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="group p-5 rounded-2xl bg-navy-800/60 border border-navy-600/40 hover:border-electric-600/40 hover:bg-navy-700/70 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-electric-500/10 group-hover:bg-electric-500/20 flex items-center justify-center mb-3 transition-colors">
                    <Icon size={20} className="text-electric-400" />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1.5">{r.title}</h3>
                  <p className="text-steel-400 text-xs leading-relaxed">{r.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
