'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Send, Phone, Mail, Clock, CheckCircle } from 'lucide-react'

const schema = z.object({
  name:    z.string().min(2, 'Please enter your name'),
  email:   z.string().email('Please enter a valid email'),
  phone:   z.string().min(10, 'Please enter your phone number'),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Tell us a bit about your project'),
})

type FormData = z.infer<typeof schema>

export default function CTA() {
  const [submitted, setSubmitted] = useState(false)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 1200))
    console.log('Form data:', data)
    setSubmitted(true)
  }

  return (
    <section id="contact" className="py-24 bg-dark-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase mb-3">Get In Touch</p>
            <h2 className="font-display text-display text-white mb-5 text-balance">
              Ready to Upgrade Your Property?
            </h2>
            <p className="text-dark-300 text-lg leading-relaxed mb-10 text-pretty">
              Your dream home is one conversation away. Fill out the form and we'll
              get back to you within 24 hours — usually faster.
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-sm bg-gold-500/10 border border-gold-500/20">
                  <Phone size={17} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-xs text-dark-400 uppercase tracking-wider">Call Us</p>
                  <a href="tel:+17175550100" className="text-white font-semibold hover:text-gold-400 transition-colors">
                    (717) 555-0100
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-sm bg-gold-500/10 border border-gold-500/20">
                  <Mail size={17} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-xs text-dark-400 uppercase tracking-wider">Email</p>
                  <a href="mailto:info@powellrenovations.com" className="text-white font-semibold hover:text-gold-400 transition-colors">
                    info@powellrenovations.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-sm bg-gold-500/10 border border-gold-500/20">
                  <Clock size={17} className="text-gold-400" />
                </div>
                <div>
                  <p className="text-xs text-dark-400 uppercase tracking-wider">Hours</p>
                  <p className="text-white font-semibold">Mon–Fri 7am–6pm · Sat 8am–2pm</p>
                </div>
              </div>
            </div>

            <div className="mt-10 p-5 bg-dark-950 border border-gold-500/20 rounded-sm">
              <p className="text-sm text-gold-300 font-semibold mb-1">Fast Response Guarantee</p>
              <p className="text-dark-400 text-sm">
                We respond to every estimate request within 24 hours — often same day.
                Emergency plumbing? We're available 24/7.
              </p>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-16 px-8 bg-dark-950 border border-gold-500/30 rounded-sm"
              >
                <CheckCircle size={48} className="text-gold-400 mb-4" />
                <h3 className="font-display text-2xl font-bold text-white mb-2">Request Received</h3>
                <p className="text-dark-300">
                  We'll be in touch within 24 hours to schedule your free consultation.
                  Talk soon.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-dark-950 border border-dark-800 rounded-sm p-8 space-y-5"
                noValidate
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-dark-300 uppercase tracking-wider mb-2">
                      Your Name *
                    </label>
                    <input
                      {...register('name')}
                      placeholder="John Smith"
                      className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-sm text-white placeholder-dark-500 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-dark-300 uppercase tracking-wider mb-2">
                      Phone *
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      placeholder="(717) 000-0000"
                      className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-sm text-white placeholder-dark-500 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-dark-300 uppercase tracking-wider mb-2">
                    Email *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="john@email.com"
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-sm text-white placeholder-dark-500 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-dark-300 uppercase tracking-wider mb-2">
                    Service Needed *
                  </label>
                  <select
                    {...register('service')}
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-sm text-white text-sm focus:outline-none focus:border-gold-500 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select a service…</option>
                    <option value="general">General Contracting / Renovation</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="pressure">Pressure Washing</option>
                    <option value="multiple">Multiple Services</option>
                    <option value="other">Other / Not Sure</option>
                  </select>
                  {errors.service && <p className="mt-1 text-xs text-red-400">{errors.service.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-dark-300 uppercase tracking-wider mb-2">
                    Tell Us About Your Project *
                  </label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    placeholder="What are you looking to have done? (location, scope, timeline, etc.)"
                    className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-sm text-white placeholder-dark-500 text-sm focus:outline-none focus:border-gold-500 transition-colors resize-none"
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 py-4 font-semibold text-dark-950 rounded-sm transition-all duration-300 hover:shadow-gold-lg hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #C4922A, #E8C547)' }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-dark-950/30 border-t-dark-950 rounded-full"
                      />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      Request Free Estimate
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-dark-500">
                  No spam. No commitment. Just a friendly conversation.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
