'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { SplitHeading } from './SplitHeading'

const LINKS: Record<string, { label: string; href: string }[]> = {
  Services: [
    { label: 'Web Design',     href: '#services' },
    { label: 'Development',    href: '#services' },
    { label: 'Branding',       href: '#services' },
    { label: 'SEO',            href: '#services' },
    { label: 'AI Integration', href: '#services' },
  ],
  Company: [
    { label: 'About',     href: '#why-acrux' },
    { label: 'Portfolio', href: '#portfolio'  },
    { label: 'Process',   href: '#process'   },
    { label: 'Careers',   href: '#contact'   },
    { label: 'Blog',      href: '#contact'   },
  ],
  Connect: [
    { label: 'acruxwebsitebuilding@gmail.com', href: 'mailto:acruxwebsitebuilding@gmail.com' },
    { label: 'Twitter / X', href: '#' },
    { label: 'LinkedIn',    href: '#' },
    { label: 'Instagram',   href: '#' },
    { label: 'Dribbble',    href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="relative bg-[#010305]" id="footer">

      {/* ── Mega statement ───────────────────────────────────────── */}
      <div className="relative overflow-hidden border-t border-[rgba(0,102,255,0.1)]">

        {/* Ambient orb */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ width: 900, height: 500, background: 'radial-gradient(ellipse at center, rgba(0,55,200,0.13) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        {/* Top glow line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-px bg-gradient-to-r from-transparent via-[rgba(0,120,255,0.55)] to-transparent" />

        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 pt-20 pb-10 relative">
          {/* Big type */}
          <SplitHeading
            text="BUILT TO BE"
            as="h2"
            className="font-heading font-bold text-white leading-none tracking-[-0.03em]"
            style={{ fontSize: 'clamp(3.5rem, 13vw, 11.5rem)' }}
            stagger={0.07}
            baseDelay={0}
          />
          <SplitHeading
            text="REMEMBERED."
            as="h2"
            className="font-heading font-bold shimmer-text leading-none tracking-[-0.03em] mt-[-0.06em]"
            style={{ fontSize: 'clamp(3.5rem, 13vw, 11.5rem)' }}
            stagger={0.07}
            baseDelay={0.14}
          />

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <motion.a
              href="#contact"
              className="btn-primary inline-flex items-center gap-3 px-9 py-4 rounded-full font-semibold text-base tracking-wide relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              data-magnetic
            >
              <span className="relative z-10">Start a Project</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
              <span className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </motion.a>
            <span className="font-body text-sm" style={{ color: 'rgba(130,165,200,0.65)' }}>
              We&apos;re accepting new projects — let&apos;s build something legendary.
            </span>
          </motion.div>
        </div>
      </div>

      {/* ── Nav grid ─────────────────────────────────────────────── */}
      <div className="border-t border-[rgba(0,102,255,0.08)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative">
                <div className="absolute inset-0 rounded blur-md opacity-40" style={{ background: 'rgba(0,102,255,0.5)' }} />
                <Image src="/logo.png" alt="ACRUX" width={30} height={30} className="relative rounded" />
              </div>
              <span className="font-heading font-bold text-base tracking-[0.32em] text-white uppercase">Acrux</span>
            </div>
            <p className="text-[var(--color-muted)] text-sm leading-relaxed max-w-[260px] mb-6">
              The North Star for modern businesses online. Digital experiences that become competitive advantages.
            </p>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-emerald-400 text-xs font-medium">Accepting new projects</span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-white text-[10px] font-semibold tracking-[0.28em] uppercase mb-5">
                {title}
              </h4>
              <ul className="space-y-3">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="text-[var(--color-muted)] text-sm hover:text-white transition-colors duration-200 break-all">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────── */}
      <div className="border-t border-[rgba(0,102,255,0.07)]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[var(--color-muted)] text-xs tracking-wide">
            © {new Date().getFullYear()} ACRUX Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Service'].map(l => (
              <a key={l} href="#" className="text-[var(--color-muted)] text-xs hover:text-white transition-colors duration-200">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
