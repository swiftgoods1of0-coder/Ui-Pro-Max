'use client'

import { motion } from 'framer-motion'
import {
  Cookie,
  Thermometer,
  UtensilsCrossed,
  Zap,
  Heart,
  Building2,
  Droplets,
  Landmark,
  Flame,
  Factory,
  Wind,
  Shirt,
  Radio,
  Boxes,
  Package,
  Hammer,
  HardHat,
  Globe,
  Truck,
  Plug,
} from 'lucide-react'

interface Industry {
  icon: React.ElementType
  label: string
}

const industries: Industry[] = [
  { icon: Cookie, label: 'Snack Food' },
  { icon: Thermometer, label: 'Refrigerated' },
  { icon: UtensilsCrossed, label: 'Food Service' },
  { icon: Zap, label: 'Electrical' },
  { icon: Heart, label: 'Health Care' },
  { icon: Building2, label: 'Hospitals' },
  { icon: Droplets, label: 'Plumbing' },
  { icon: Landmark, label: 'Government' },
  { icon: Flame, label: 'Fuel Delivery' },
  { icon: Factory, label: 'Manufacturing' },
  { icon: Wind, label: 'HVAC' },
  { icon: Shirt, label: 'Uniform Delivery' },
  { icon: Radio, label: 'Communications' },
  { icon: Boxes, label: 'Yard / Jockey' },
  { icon: Package, label: 'Package Delivery' },
  { icon: Hammer, label: 'Restoration' },
  { icon: HardHat, label: 'Construction' },
  { icon: Globe, label: 'Logistics' },
  { icon: Truck, label: 'Municipal Fleets' },
  { icon: Plug, label: 'Utility Fleets' },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Industries() {
  return (
    <section id="industries" className="py-24 bg-charcoal-950" aria-label="Industries we serve">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div className="section-eyebrow mb-3">Trusted By Businesses Across Central PA</div>
          <div className="brand-line-lg mx-auto mb-6" />
          <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5">
            Industries We Serve
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            From food distribution to municipal fleets, OTC Fleet Services supports businesses of
            every size across nearly every industry in Central Pennsylvania.
          </p>
        </motion.div>

        {/* Industries Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-4"
        >
          {industries.map(({ icon: Icon, label }) => (
            <motion.div
              key={label}
              variants={itemVariants}
              className="group flex flex-col items-center gap-3 p-5 bg-charcoal-800 border border-charcoal-700 rounded-xl
                cursor-default transition-all duration-300
                hover:bg-brand/10 hover:border-brand/50 hover:-translate-y-1
                hover:shadow-[0_12px_40px_rgba(255,212,0,0.12)]"
            >
              <div className="w-11 h-11 rounded-lg bg-charcoal-700 group-hover:bg-brand/20 flex items-center justify-center transition-all duration-300 border border-charcoal-600 group-hover:border-brand/40">
                <Icon className="w-5 h-5 text-slate-400 group-hover:text-brand transition-colors duration-300" />
              </div>
              <span className="text-slate-300 group-hover:text-white text-xs font-semibold text-center leading-tight transition-colors duration-300">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-500 text-sm">
            Don&rsquo;t see your industry?{' '}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="text-brand hover:text-brand-light font-medium transition-colors"
            >
              Contact us — we likely serve you.
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
