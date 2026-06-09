import Link from 'next/link'
import PageHero from '../components/PageHero'
import Services from '../components/Services'
import FleetPrograms from '../components/FleetPrograms'
import FleetGraphix from '../components/FleetGraphix'
import TrailerDepartment from '../components/TrailerDepartment'
import SnowEquipment from '../components/SnowEquipment'
import SectionDivider from '../components/SectionDivider'
import { ArrowRight, Phone } from 'lucide-react'

export const metadata = {
  title: 'Services | OTC Fleet Services',
  description: 'Fleet repair, DOT inspections, preventative maintenance, mobile service, trailer service, Fleet Graphix, and snow equipment — OTC Fleet Services in Lancaster & Berks County PA.',
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What We Do"
        title="Our Services"
        subtitle="Complete fleet care under one roof — from a single DOT inspection to a full managed fleet program."
      />

      <SectionDivider number="01" label="Fleet Repair & Maintenance" />
      <Services />

      <SectionDivider number="02" label="Fleet Programs" dark />
      <FleetPrograms />

      <SectionDivider number="03" label="Fleet Graphix" />
      <FleetGraphix />

      <SectionDivider number="04" label="Trailer Department" dark />
      <TrailerDepartment />

      <SectionDivider number="05" label="Snow Equipment" />
      <SnowEquipment />

      {/* Bottom CTA */}
      <section className="py-20 bg-charcoal-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,212,0,0.07) 0, rgba(255,212,0,0.07) 1px, transparent 0, transparent 50%)', backgroundSize: '24px 24px' }} />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="section-eyebrow mb-3">Let&apos;s Talk</div>
          <div className="brand-line-lg mx-auto mb-6" />
          <h2 className="text-4xl font-black text-white tracking-tight mb-4">
            Ready to Schedule <span className="gradient-text">Service?</span>
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Call us, send us a message, or stop by either location. We&apos;ll get your fleet taken care of.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-brand text-base py-3.5 px-8">
              Contact Us <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="tel:7172083600" className="btn-outline-white text-base py-3.5 px-8">
              <Phone className="w-5 h-5" /> 717-208-3600
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
