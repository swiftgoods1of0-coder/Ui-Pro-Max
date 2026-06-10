'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, CheckCircle } from 'lucide-react'

const schema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  email:   z.string().email('Please enter a valid email'),
  company: z.string().optional(),
  budget:  z.string().min(1, 'Please select a budget range'),
  message: z.string().min(20, 'Tell us a bit more (20+ characters)'),
})

type FormData = z.infer<typeof schema>

const BUDGETS = [
  '$5,000 – $15,000',
  '$15,000 – $35,000',
  '$35,000 – $75,000',
  '$75,000 – $150,000',
  '$150,000+',
]

const INFO = [
  { label: 'Response Time', value: 'Within 24 hours' },
  { label: 'Availability',  value: 'Currently accepting projects' },
  { label: 'Base Location', value: 'Global · Remote-First' },
]

export function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const selectedBudget = watch('budget')

  const onSubmit = async (data: FormData) => {
    setSubmitError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to send')
      setSubmitted(true)
    } catch {
      setSubmitError('Something went wrong. Please email us directly at acruxwebsitebuilding@gmail.com')
    }
  }

  return (
    <section className="section relative overflow-hidden" id="contact">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_30%,rgba(0,102,255,0.1)_0%,transparent_70%)]" />
        <div className="divider absolute top-0 left-0 right-0" />
      </div>

      {/* Orbit particles (CSS) */}
      {[80, 120, 160].map((r, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 rounded-full border border-[rgba(0,102,255,0.08)] pointer-events-none"
          style={{
            width: r * 2,
            height: r * 2,
            marginLeft: -r,
            marginTop: -r,
            animation: `spin ${20 + i * 10}s linear infinite ${i % 2 ? 'reverse' : ''}`,
          }}
        />
      ))}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#0066ff]" />
            <span className="text-[#0099ff] text-[10px] font-semibold tracking-[0.4em] uppercase">Get In Touch</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#0066ff]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading font-bold text-gradient leading-tight"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)' }}
          >
            Let&apos;s Build Something<br />Extraordinary.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[var(--color-muted)] text-base mt-4 max-w-lg mx-auto"
          >
            Tell us about your project. We respond within 24 hours with a tailored strategy.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
          {/* Left panel — info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            {INFO.map(({ label, value }) => (
              <div key={label} className="glass-card rounded-xl px-5 py-4">
                <div className="text-[10px] tracking-[0.3em] text-[var(--color-muted)] uppercase mb-1">{label}</div>
                <div className="text-white text-sm font-medium">{value}</div>
              </div>
            ))}

            {/* Star orb decoration */}
            <div className="glass-card rounded-xl p-6 flex flex-col items-center gap-4 mt-2">
              <div className="relative">
                <div className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: 'radial-gradient(circle, rgba(0,102,255,0.2) 0%, transparent 70%)', border: '1px solid rgba(0,102,255,0.15)' }}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4488ff] to-[#0033cc] animate-pulse"
                    style={{ boxShadow: '0 0 30px rgba(0,102,255,0.6)' }} />
                </div>
                {[60, 90, 120].map((r, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 rounded-full border border-[rgba(0,102,255,0.12)] -translate-x-1/2 -translate-y-1/2"
                    style={{
                      width: r,
                      height: r,
                      animation: `spin ${15 + i * 8}s linear infinite ${i % 2 ? 'reverse' : ''}`,
                    }}
                  />
                ))}
              </div>
              <div className="text-center">
                <a href="mailto:acruxwebsitebuilding@gmail.com" className="text-white text-sm font-semibold hover:text-[#4488ff] transition-colors block mb-1">acruxwebsitebuilding@gmail.com</a>
                <div className="text-[var(--color-muted)] text-xs">Or just fill in the form →</div>
              </div>
            </div>
          </motion.div>

          {/* Right panel — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {submitted ? (
              <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-center h-full min-h-[480px]">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <CheckCircle size={52} className="text-[#00aaff] mb-6" />
                </motion.div>
                <h3 className="font-heading font-bold text-white text-2xl mb-3">Message Received!</h3>
                <p className="text-[var(--color-muted)] text-sm max-w-xs">
                  We&apos;ll review your project details and get back to you within 24 hours with a tailored strategy.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="glass-card rounded-2xl p-8 space-y-5"
              >
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium tracking-wider text-[var(--color-muted)] uppercase mb-2">
                      Name *
                    </label>
                    <input
                      {...register('name')}
                      placeholder="Alex Johnson"
                      className="w-full bg-[rgba(0,0,0,0.3)] border border-[var(--color-border)] rounded-lg px-4 py-3 text-white text-sm placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[rgba(0,102,255,0.5)] transition-colors"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium tracking-wider text-[var(--color-muted)] uppercase mb-2">
                      Email *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="alex@company.com"
                      className="w-full bg-[rgba(0,0,0,0.3)] border border-[var(--color-border)] rounded-lg px-4 py-3 text-white text-sm placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[rgba(0,102,255,0.5)] transition-colors"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label className="block text-xs font-medium tracking-wider text-[var(--color-muted)] uppercase mb-2">
                    Company
                  </label>
                  <input
                    {...register('company')}
                    placeholder="Your Company Name"
                    className="w-full bg-[rgba(0,0,0,0.3)] border border-[var(--color-border)] rounded-lg px-4 py-3 text-white text-sm placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[rgba(0,102,255,0.5)] transition-colors"
                  />
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-xs font-medium tracking-wider text-[var(--color-muted)] uppercase mb-2">
                    Budget Range *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {BUDGETS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setValue('budget', b, { shouldValidate: true })}
                        className={`text-xs px-3 py-2 rounded-full border transition-all duration-200 ${
                          selectedBudget === b
                            ? 'border-[#0066ff] bg-[rgba(0,102,255,0.15)] text-white'
                            : 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[rgba(0,102,255,0.3)] hover:text-white'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                  {errors.budget && <p className="text-red-400 text-xs mt-1">{errors.budget.message}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium tracking-wider text-[var(--color-muted)] uppercase mb-2">
                    Tell Us About Your Project *
                  </label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    placeholder="We're looking to build a premium website that positions us as the leading provider in our space..."
                    className="w-full bg-[rgba(0,0,0,0.3)] border border-[var(--color-border)] rounded-lg px-4 py-3 text-white text-sm placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[rgba(0,102,255,0.5)] transition-colors resize-none"
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                </div>

                {submitError && (
                  <p className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                    {submitError}
                  </p>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-4 rounded-xl font-semibold text-base tracking-wide flex items-center justify-center gap-3 relative overflow-hidden disabled:opacity-70"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">{isSubmitting ? 'Sending...' : 'Send Project Brief'}</span>
                  {!isSubmitting && <Send size={16} className="relative z-10" />}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
