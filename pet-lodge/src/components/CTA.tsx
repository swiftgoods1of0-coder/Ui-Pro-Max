'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Send, Phone, Mail, Clock, CheckCircle, MapPin } from 'lucide-react'

const schema = z.object({
  name:    z.string().min(2, 'Please enter your name'),
  email:   z.string().email('Please enter a valid email'),
  phone:   z.string().min(10, 'Please enter your phone number'),
  service: z.string().min(1, 'Please select a service'),
  petName: z.string().min(1, 'Tell us your pet\'s name'),
  message: z.string().min(5, 'Tell us a bit about your pet'),
})

type FormData = z.infer<typeof schema>

function FloatingPawBg() {
  const paws = [
    { x: 5, y: 10, s: 30, r: -20 }, { x: 15, y: 70, s: 22, r: 15 },
    { x: 25, y: 35, s: 18, r: 5 }, { x: 75, y: 15, s: 28, r: -10 },
    { x: 85, y: 55, s: 20, r: 20 }, { x: 92, y: 30, s: 24, r: -5 },
    { x: 50, y: 80, s: 16, r: 10 }, { x: 60, y: 20, s: 26, r: -15 },
    { x: 38, y: 60, s: 14, r: 8 }, { x: 72, y: 75, s: 18, r: -12 },
  ]
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {paws.map((p, i) => (
        <motion.div
          key={i}
          className="absolute opacity-10"
          style={{ left: `${p.x}%`, top: `${p.y}%`, rotate: p.r }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5 + i * 0.4, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
        >
          <svg width={p.s} height={p.s} viewBox="0 0 24 24" fill="white">
            <ellipse cx="9" cy="7" rx="2.5" ry="3.2"/>
            <ellipse cx="15" cy="7" rx="2.5" ry="3.2"/>
            <ellipse cx="5.5" cy="12" rx="2" ry="2.8"/>
            <ellipse cx="18.5" cy="12" rx="2" ry="2.8"/>
            <path d="M12 10c-4.5 0-7 2.5-7 5.5s2 4.5 7 4.5 7-1.5 7-4.5-2.5-5.5-7-5.5z"/>
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

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
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-green-gradient" />
      <FloatingPawBg />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top headline */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 text-sage-200 text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            Get In Touch
          </span>
          <h2 className="font-display text-display text-white mb-4">
            Ready to Give Your Pet Their Best Stay Yet?
          </h2>
          <p className="text-sage-200 text-lg max-w-xl mx-auto leading-relaxed font-light">
            Fill out the form and we&apos;ll reach out within a few hours to confirm availability
            and answer any questions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-14 items-start">
          {/* Left — contact info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="space-y-5 mb-10">
              {[
                { icon: Phone, label: 'Call Us', value: '(301) 475-2142', href: 'tel:+13014752142' },
                { icon: Mail, label: 'Email', value: 'info@thepetlodge.com', href: 'mailto:info@thepetlodge.com' },
                { icon: MapPin, label: 'Location', value: 'Leonardtown, Maryland', href: null },
                { icon: Clock, label: 'Hours', value: 'Mon–Fri 7am–6pm · Sat 8am–5pm', href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/15 border border-white/20 shrink-0">
                    <Icon size={18} className="text-sage-300" />
                  </div>
                  <div>
                    <p className="text-xs text-sage-400 uppercase tracking-wider mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="text-white font-semibold hover:text-sage-300 transition-colors">{value}</a>
                    ) : (
                      <p className="text-white font-semibold">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Van photo */}
            <div className="rounded-3xl overflow-hidden h-52 border border-white/10">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: "url('/images/transport-van.jpg')" }}
              />
            </div>
            <p className="mt-3 text-sage-400 text-xs text-center">Our pet transport van — available for pick-up & drop-off</p>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-16 px-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20"
              >
                <div className="w-16 h-16 rounded-full bg-sage-400 flex items-center justify-center mb-5">
                  <CheckCircle size={32} className="text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-3">Booking Request Received!</h3>
                <p className="text-sage-200 leading-relaxed">
                  We&apos;ll be in touch within a few hours to confirm your pet&apos;s stay.
                  We can&apos;t wait to meet them!
                </p>
                <div className="mt-6 text-4xl">🐾</div>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white rounded-3xl p-8 shadow-lodge-lg space-y-5"
                noValidate
              >
                <h3 className="font-display text-xl font-semibold text-forest-900 mb-2">Book Your Pet&apos;s Stay</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">Your Name *</label>
                    <input
                      {...register('name')}
                      placeholder="Jane Smith"
                      className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-forest-900 placeholder-forest-400 text-sm focus:outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-100 transition-all"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">Pet&apos;s Name *</label>
                    <input
                      {...register('petName')}
                      placeholder="Buddy"
                      className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-forest-900 placeholder-forest-400 text-sm focus:outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-100 transition-all"
                    />
                    {errors.petName && <p className="mt-1 text-xs text-red-500">{errors.petName.message}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">Phone *</label>
                    <input
                      {...register('phone')}
                      type="tel"
                      placeholder="(301) 000-0000"
                      className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-forest-900 placeholder-forest-400 text-sm focus:outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-100 transition-all"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">Email *</label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="jane@email.com"
                      className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-forest-900 placeholder-forest-400 text-sm focus:outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-100 transition-all"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">Service *</label>
                  <select
                    {...register('service')}
                    className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-forest-900 text-sm focus:outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-100 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select a service…</option>
                    <option value="boarding">Pet Boarding</option>
                    <option value="daycare">Doggy Daycare</option>
                    <option value="grooming">Grooming</option>
                    <option value="walking">Dog Walking</option>
                    <option value="multiple">Multiple Services</option>
                  </select>
                  {errors.service && <p className="mt-1 text-xs text-red-500">{errors.service.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-700 uppercase tracking-wider mb-2">Tell Us About Your Pet *</label>
                  <textarea
                    {...register('message')}
                    rows={3}
                    placeholder="Breed, age, any special needs, dates needed…"
                    className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-forest-900 placeholder-forest-400 text-sm focus:outline-none focus:border-sage-500 focus:ring-2 focus:ring-sage-100 transition-all resize-none"
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 py-4 font-semibold text-white rounded-xl transition-all duration-300 hover:shadow-lodge-lg hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #2d6035, #5a9a65)' }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      Book Your Pet&apos;s Stay
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-forest-400">
                  No commitment. We&apos;ll confirm availability within a few hours.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
