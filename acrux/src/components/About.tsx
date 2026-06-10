'use client'

import { motion } from 'framer-motion'
import { SplitHeading } from './SplitHeading'

export function About() {
  return (
    <section className="section relative overflow-hidden" id="about">
      {/* Mesh orbs + dividers */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(0,80,200,0.07)_0%,transparent_70%)]" />
        <div className="absolute top-[-60px] right-[-80px] rounded-full"
          style={{ width: 550, height: 550, background: 'radial-gradient(circle, rgba(0,60,220,0.11) 0%, transparent 70%)', filter: 'blur(90px)' }} />
        <div className="absolute bottom-[-60px] left-[-80px] rounded-full"
          style={{ width: 450, height: 450, background: 'radial-gradient(circle, rgba(0,40,180,0.1) 0%, transparent 70%)', filter: 'blur(100px)' }} />
        <div className="divider absolute top-0 left-0 right-0" />
        <div className="divider absolute bottom-0 left-0 right-0" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#0066ff]" />
          <span className="label-tag">About Us</span>
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#0066ff]" />
        </motion.div>

        {/* Headline — word-by-word reveal */}
        <SplitHeading
          text="Welcome to Acrux."
          className="font-heading font-bold text-gradient leading-tight mb-10"
          style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)' }}
          baseDelay={0.1}
          stagger={0.12}
        />

        {/* Dividing rule */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="w-16 h-px mx-auto mb-10 bg-gradient-to-r from-transparent via-[rgba(0,153,255,0.7)] to-transparent"
        />

        {/* Body copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          <p className="text-[var(--color-text)] text-lg sm:text-xl leading-[1.85] font-body">
            At Acrux, we specialize in crafting stunning websites tailored to your unique vision.
            Our team of experienced designers and developers is dedicated to delivering high-quality,
            user-friendly sites that make a lasting impression.
          </p>
          <p className="text-[var(--color-muted)] text-base sm:text-lg leading-[1.85] font-body">
            We understand that a great website is more than just aesthetics — it&apos;s about creating
            an engaging experience for your audience. We work closely with our clients to understand
            their goals, ensuring that each website reflects their brand and effectively meets their needs.
          </p>
          <p className="text-[var(--color-muted)] text-base sm:text-lg leading-[1.85] font-body">
            Let us help you shine online with a website that stands out and drives results.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-12"
        >
          <a
            href="#contact"
            className="btn-primary inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-base tracking-wide"
            data-magnetic
          >
            <span>Start Your Project</span>
            <span className="text-[rgba(255,255,255,0.7)]">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
