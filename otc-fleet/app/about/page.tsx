import Link from 'next/link'
import PageHero from '../components/PageHero'
import WhyOTC from '../components/WhyOTC'
import Industries from '../components/Industries'
import StatsBar from '../components/StatsBar'
import SectionDivider from '../components/SectionDivider'
import { ArrowRight, MapPin, Phone, Mail, ExternalLink } from 'lucide-react'

export const metadata = {
  title: 'About | OTC Fleet Services',
  description: 'Learn about OTC Fleet Services — two locations in Lancaster and Berks County PA, serving commercial fleets with repair, maintenance, trailer service, and more.',
}

const timeline = [
  { year: 'Founded', label: 'Lancaster, PA', body: 'OTC Fleet Services opened its doors in Lancaster, PA, built around the idea that fleet customers deserve a single, reliable partner for all of their maintenance and repair needs.' },
  { year: 'Expanded', label: 'Berks County', body: 'Growing demand across Central Pennsylvania led to the opening of the Berks County location, bringing the same high-standard service to a broader region.' },
  { year: 'Fleet Graphix', label: 'New Division', body: 'Fleet Graphix was launched as an in-house division, giving fleet customers a faster, more convenient way to brand vehicles without a separate vendor.' },
  { year: 'Today', label: 'Still Growing', body: 'Two full-service locations, mobile service units, a trailer department, and snow equipment sales — all backed by the same team and the same commitment to keeping fleets moving.' },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Who We Are"
        title="About OTC Fleet"
        subtitle="Two locations. One team. Complete fleet support across Lancaster, Berks County, and Central Pennsylvania."
      />

      {/* Company Story */}
      <section className="py-20 bg-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left: copy */}
            <div>
              <div className="section-eyebrow mb-3">Our Story</div>
              <div className="brand-line mb-6" />
              <h2 className="text-4xl font-black text-white tracking-tight mb-6 leading-tight">
                Built for Fleets.<br />
                <span className="gradient-text">Built to Last.</span>
              </h2>
              <div className="space-y-4 text-slate-400 leading-relaxed">
                <p>
                  OTC Fleet Services was founded with a clear mission: give commercial fleet operators a single, dependable partner for every aspect of vehicle maintenance and repair. Too many businesses waste time coordinating between multiple vendors — we solve that by handling everything in-house.
                </p>
                <p>
                  From light and medium duty repairs to Class 8 trucks, DOT inspections, trailer service, mobile units, and vehicle graphics, our team brings decades of hands-on commercial experience to every job. We don&apos;t just fix vehicles — we build relationships with fleet managers who need a partner they can count on.
                </p>
                <p>
                  Proudly part of the Mobiltech Companies family, OTC Fleet Services operates two full-service locations in Lancaster and Berks County, with mobile service reaching fleets across Central Pennsylvania.
                </p>
              </div>
            </div>

            {/* Right: location cards */}
            <div className="space-y-4">
              <div className="bg-charcoal-700/50 border border-charcoal-600 rounded-2xl p-6">
                <div className="h-1 w-12 bg-brand rounded-full mb-4" />
                <div className="text-brand text-xs font-bold tracking-widest uppercase mb-3">Lancaster Location</div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">480 Running Pump Road</div>
                      <div className="text-slate-400">Lancaster, PA 17601</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-brand flex-shrink-0" />
                    <a href="tel:7172083600" className="text-white font-semibold hover:text-brand transition-colors">717-208-3600</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-brand flex-shrink-0" />
                    <a href="mailto:info@otcfleet.com" className="text-slate-300 hover:text-brand transition-colors">info@otcfleet.com</a>
                  </div>
                  <div className="text-slate-500 text-xs pt-1">Mon–Fri: 7:00 AM – 4:30 PM · Sat: By appointment</div>
                </div>
              </div>

              <div className="bg-charcoal-700/50 border border-charcoal-600 rounded-2xl p-6">
                <div className="h-1 w-12 bg-brand/50 rounded-full mb-4" />
                <div className="text-brand text-xs font-bold tracking-widest uppercase mb-3">Berks County Location</div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-brand flex-shrink-0" />
                    <a href="tel:6103744077" className="text-white font-semibold hover:text-brand transition-colors">610-374-4077</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-brand flex-shrink-0" />
                    <a href="mailto:info@otcfleet.com" className="text-slate-300 hover:text-brand transition-colors">info@otcfleet.com</a>
                  </div>
                  <div className="text-slate-500 text-xs pt-1">Mon–Fri: 7:00 AM – 4:30 PM · Sat: By appointment</div>
                </div>
              </div>

              {/* Divisions */}
              <div className="bg-charcoal-700/50 border border-charcoal-600 rounded-2xl p-6">
                <div className="text-white font-bold text-sm mb-3">Our Divisions</div>
                <div className="space-y-2">
                  {[
                    { label: 'Fleet Graphix PA', href: 'https://www.fleetgraphixpa.com/' },
                    { label: 'Keystone Trailers', href: 'https://keystonetrailers.com/' },
                  ].map(({ label, href }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-brand text-sm transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" /> {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatsBar />

      {/* Timeline */}
      <section className="py-20 bg-charcoal-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="section-eyebrow mb-3">Our Journey</div>
            <div className="brand-line-lg mx-auto mb-5" />
            <h2 className="text-4xl font-black text-white tracking-tight">How We Got Here</h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand/60 via-brand/20 to-transparent" />
            <div className="space-y-10">
              {timeline.map((item, i) => (
                <div key={i} className={`relative flex gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-start`}>
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-brand border-2 border-charcoal-900 -translate-x-1/2 mt-1.5" />
                  <div className={`pl-12 md:pl-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="text-brand text-xs font-bold tracking-widest uppercase mb-1">{item.year}</div>
                    <div className="text-white font-bold mb-2">{item.label}</div>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider number="01" label="Why Choose OTC" dark />
      <WhyOTC />
      <SectionDivider number="02" label="Industries We Serve" />
      <Industries />

      {/* CTA */}
      <section className="py-20 bg-charcoal-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black text-white tracking-tight mb-4">
            Ready to Work <span className="gradient-text">Together?</span>
          </h2>
          <p className="text-slate-400 text-lg mb-8">Put your fleet in hands you can trust. Contact us today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-brand text-base py-3.5 px-8">
              Get In Touch <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/services" className="btn-outline-white text-base py-3.5 px-8">
              View Services <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
