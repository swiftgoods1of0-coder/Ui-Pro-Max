import Link from 'next/link'
import Hero from './components/Hero'
import StatsBar from './components/StatsBar'
import WhyOTC from './components/WhyOTC'
import Industries from './components/Industries'
import Testimonials from './components/Testimonials'
import SectionDivider from './components/SectionDivider'
import { ArrowRight, Phone } from 'lucide-react'

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <SectionDivider number="01" label="Why OTC" dark />
      <WhyOTC />
      <SectionDivider number="02" label="Industries We Serve" />
      <Industries />
      <SectionDivider number="03" label="Testimonials" dark />
      <Testimonials />

      {/* CTA Banner */}
      <section className="py-20 bg-charcoal-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,212,0,0.07) 0, rgba(255,212,0,0.07) 1px, transparent 0, transparent 50%)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="section-eyebrow mb-3">Ready to Get Started?</div>
          <div className="brand-line-lg mx-auto mb-6" />
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-5">
            Keep Your Fleet <span className="gradient-text">Moving Forward</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            From routine maintenance to full fleet programs, we handle it all. Two locations in Lancaster and Berks County, plus mobile service throughout Central PA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-brand text-base py-3.5 px-8">
              Schedule Service
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/services" className="btn-outline-white text-base py-3.5 px-8">
              View All Services
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-6 justify-center text-sm text-slate-500">
            <a href="tel:7172083600" className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
              <Phone className="w-4 h-4 text-brand" /> Lancaster: 717-208-3600
            </a>
            <a href="tel:6103744077" className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
              <Phone className="w-4 h-4 text-brand" /> Berks: 610-374-4077
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
