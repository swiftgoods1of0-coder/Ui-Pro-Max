import { Phone, MessageSquare, Scissors, Clock, Instagram, Facebook } from 'lucide-react'

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#why-us', label: 'Why Us' },
  { href: '#testimonials', label: 'Reviews' },
  { href: '#faq', label: 'FAQ' },
]

const services = ['Bath & Groom', 'Full Grooming', 'Pet Haircuts', 'Cat Grooming', 'Nail Trim & Filing']

export default function Footer() {
  return (
    <footer style={{ background: '#140610' }} className="text-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg,#b02456,#d4607e)' }}>
                <Scissors size={18} className="text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-base text-white leading-none block">Pupparazzi</span>
                <span className="text-[9px] font-medium tracking-[0.18em] uppercase text-rose-400">Dog & Cat Grooming</span>
              </div>
            </a>
            <p className="text-sm leading-relaxed mb-5">
              Premium boutique grooming for dogs and cats. Expert groomers, personalized care,
              and a clean, calm environment your pet will love.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram"
                className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 hover:border-rose-500/50 hover:bg-rose-500/10 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" aria-label="Facebook"
                className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 hover:border-rose-500/50 hover:bg-rose-500/10 transition-colors">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 tracking-wide uppercase">Quick Links</h4>
            <ul className="space-y-3">
              {navLinks.map(l => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm hover:text-rose-300 transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 tracking-wide uppercase">Services</h4>
            <ul className="space-y-3">
              {services.map(s => (
                <li key={s} className="text-sm">{s}</li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 tracking-wide uppercase">Contact & Hours</h4>
            <div className="space-y-4">
              <a href="tel:+17042678982"
                className="flex items-center gap-2.5 text-sm hover:text-rose-300 transition-colors">
                <Phone size={15} className="text-rose-400 shrink-0" />
                (704) 267-8982
              </a>
              <a href="sms:+17042678982"
                className="flex items-center gap-2.5 text-sm hover:text-rose-300 transition-colors">
                <MessageSquare size={15} className="text-rose-400 shrink-0" />
                Text to book
              </a>
              <div className="flex items-start gap-2.5 text-sm">
                <Clock size={15} className="text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p>Mon – Fri</p>
                  <p>7:30 AM – 5:30 PM</p>
                  <p className="text-white/35 mt-1">Sat & Sun: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>&copy; {new Date().getFullYear()} Pupparazzi Dog &amp; Cat Grooming. All rights reserved.</p>
          <p className="text-white/30">Women-Owned · Military Discounts · Charlotte Area</p>
        </div>
      </div>
    </footer>
  )
}
