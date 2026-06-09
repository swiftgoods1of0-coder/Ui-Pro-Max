'use client'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Thermometer, Snowflake, Droplets, Zap, Settings, AlertTriangle, Calendar, Wind, ArrowRight } from 'lucide-react'

const services = [
  {
    icon: Wind,
    title: 'HVAC',
    desc: 'Complete heating, ventilation, and air conditioning solutions for residential and commercial properties. Installation, repair, and maintenance.',
    color: '#0066ff',
  },
  {
    icon: Thermometer,
    title: 'Heating',
    desc: 'Furnace repair, boiler service, heat pump installation, and full heating system diagnostics to keep your space warm all season.',
    color: '#0052cc',
  },
  {
    icon: Snowflake,
    title: 'Air Conditioning',
    desc: 'AC installation, tune-ups, refrigerant recharge, and emergency cooling system repair. Fast response when it matters most.',
    color: '#3385ff',
  },
  {
    icon: Droplets,
    title: 'Plumbing',
    desc: 'Full-service plumbing including pipe repair, drain cleaning, water heater service, fixture installation, and leak detection.',
    color: '#0066ff',
  },
  {
    icon: Zap,
    title: 'Electrical',
    desc: 'Panel upgrades, wiring, outlets, lighting, and electrical diagnostics by licensed electricians for residential and commercial work.',
    color: '#0052cc',
  },
  {
    icon: Settings,
    title: 'Mechanical Contracting',
    desc: 'Large-scale commercial and industrial mechanical systems — design, installation, and ongoing management by certified contractors.',
    color: '#3385ff',
  },
  {
    icon: AlertTriangle,
    title: 'Emergency Service',
    desc: 'When systems fail, we respond. 24/7 emergency dispatch for HVAC, plumbing, and electrical breakdowns — no extra charge to call.',
    color: '#0066ff',
    featured: true,
  },
  {
    icon: Calendar,
    title: 'Maintenance Plans',
    desc: 'Preventative maintenance agreements to keep your systems running efficiently year-round and avoid costly emergency repairs.',
    color: '#0052cc',
  },
]

export default function Services() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="services" className="py-24 bg-navy-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="section-label mb-3">What We Do</p>
          <div className="divider-blue mx-auto mb-5" />
          <h2 className="font-display text-display text-white mb-4">
            Comprehensive Mechanical Services
          </h2>
          <p className="text-steel-400 max-w-xl mx-auto text-lg leading-relaxed">
            One company. Every mechanical system in your home or building.
            Residential, commercial, and industrial.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((svc, i) => {
            const Icon = svc.icon
            return (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.05 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative p-6 rounded-2xl border transition-all duration-300 cursor-default ${
                  svc.featured
                    ? 'bg-electric-500/10 border-electric-500/40 hover:border-electric-400/70 hover:bg-electric-500/15'
                    : 'bg-navy-800/60 border-navy-600/40 hover:border-electric-600/40 hover:bg-navy-700/70'
                }`}
              >
                {svc.featured && (
                  <div className="absolute -top-3 left-5 px-3 py-1 bg-electric-500 rounded-full text-white text-[10px] font-bold tracking-widest uppercase">
                    24/7
                  </div>
                )}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-electric-500/10 group-hover:bg-electric-500/20 transition-colors">
                  <Icon size={22} className="text-electric-400" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{svc.title}</h3>
                <p className="text-steel-400 text-sm leading-relaxed mb-4">{svc.desc}</p>
                <button className="flex items-center gap-1.5 text-electric-400 text-xs font-semibold hover:text-electric-300 transition-colors">
                  Learn More <ArrowRight size={12} />
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
