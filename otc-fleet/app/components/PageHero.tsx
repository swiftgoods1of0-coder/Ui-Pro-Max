'use client'
import { motion } from 'framer-motion'

interface PageHeroProps {
  eyebrow: string
  title: string
  subtitle?: string
}

export default function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  return (
    <section className="pt-32 pb-16 relative overflow-hidden bg-gradient-to-br from-charcoal-900 via-charcoal-900 to-charcoal-950">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand to-transparent opacity-60" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-brand/5 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="section-eyebrow mb-3">{eyebrow}</div>
          <div className="brand-line mb-5" />
          <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 leading-none">{title}</h1>
          {subtitle && <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">{subtitle}</p>}
        </motion.div>
      </div>
    </section>
  )
}
