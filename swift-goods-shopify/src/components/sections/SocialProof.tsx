'use client'

import { motion } from 'framer-motion'
import SplitTextReveal from '@/components/ui/SplitTextReveal'

interface Testimonial {
  quote: string
  name: string
  location: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "The quality is insane. I’ve bought from every luxury brand and Swift Goods hits different. The fabric, the fit — everything.",
    name: 'Marcus T.',
    location: 'Los Angeles, CA',
  },
  {
    quote:
      "Wore the hoodie set to Art Basel. Got stopped six times asking where it’s from. That’s never happened with any other brand.",
    name: 'Jasmine K.',
    location: 'Miami, FL',
  },
  {
    quote:
      "I returned my Essentials order after this arrived. Not even close. Swift Goods is the real deal.",
    name: 'Devon R.',
    location: 'Atlanta, GA',
  },
]

const PRESS_NAMES = ['HYPEBEAST', 'COMPLEX', 'GQ', 'HIGHSNOBIETY']

const STATS = [
  { value: '10K+', label: 'Members' },
  { value: '3X', label: 'Sold Out' },
  { value: '4.9', label: 'Average Rating' },
]

function StarIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="#c9a84c"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 0l1.76 3.58L12 4.16 8.88 7.1l.74 4.32L6 9.42 2.38 11.42l.74-4.32L0 4.16l4.24-.58L6 0z" />
    </svg>
  )
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

export default function SocialProof() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: '#050505' }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-28 md:py-36 w-full">
        {/* Label */}
        <div className="mb-6 flex items-center gap-4">
          <span
            className="block w-10 h-px"
            style={{
              background: 'linear-gradient(to right, #c9a84c, transparent)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-body, Inter, sans-serif)',
              fontSize: '10px',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#c9a84c',
              fontWeight: 500,
            }}
          >
            WHAT THEY&apos;RE SAYING
          </span>
        </div>

        {/* Heading */}
        <div className="mb-16">
          <SplitTextReveal
            text="THE MOVEMENT IS REAL"
            tag="h2"
            className="font-impact"
            style={{
              fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              color: '#f5f5f5',
              lineHeight: 1,
              letterSpacing: '0.04em',
            }}
          />
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={cardVariants}
              style={{
                background: '#111',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '2rem',
              }}
            >
              {/* Opening quote mark */}
              <span
                aria-hidden="true"
                style={{
                  display: 'block',
                  fontFamily: 'Georgia, serif',
                  fontSize: '3rem',
                  lineHeight: 1,
                  color: 'rgba(201,168,76,0.3)',
                  marginBottom: '0.5rem',
                  userSelect: 'none',
                }}
              >
                &ldquo;
              </span>

              {/* Quote text */}
              <p
                style={{
                  fontFamily:
                    'var(--font-display, "Cormorant Garamond", serif)',
                  fontSize: '1.1rem',
                  fontStyle: 'italic',
                  color: '#ccc',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem',
                }}
              >
                {testimonial.quote}
              </p>

              {/* Stars */}
              <div
                className="flex gap-1 mb-4"
                aria-label="5 out of 5 stars"
              >
                {Array.from({ length: 5 }).map((_, idx) => (
                  <StarIcon key={idx} />
                ))}
              </div>

              {/* Customer name */}
              <p
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: '#f5f5f5',
                  marginBottom: '0.25rem',
                  fontWeight: 500,
                }}
              >
                {testimonial.name}
              </p>

              {/* City/state */}
              <p
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.625rem',
                  color: '#555',
                  letterSpacing: '0.1em',
                }}
              >
                {testimonial.location}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Press / As Seen In Bar */}
        <div className="mb-16">
          <p
            className="text-center mb-6"
            style={{
              fontFamily: 'var(--font-body, Inter, sans-serif)',
              fontSize: '0.625rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#555',
            }}
          >
            As seen in
          </p>
          <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-2">
            {PRESS_NAMES.map((name, i) => (
              <span key={name} className="flex items-center gap-2">
                <span
                  style={{
                    fontFamily:
                      'var(--font-impact, "Bebas Neue", sans-serif)',
                    fontSize: '1.2rem',
                    letterSpacing: '0.2em',
                    color: '#333',
                  }}
                >
                  {name}
                </span>
                {i < PRESS_NAMES.length - 1 && (
                  <span
                    style={{
                      color: '#333',
                      fontSize: '0.5rem',
                      lineHeight: 1,
                    }}
                  >
                    &bull;
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Stat Counters */}
        <div className="grid grid-cols-3 max-w-xl mx-auto text-center gap-8">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p
                style={{
                  fontFamily:
                    'var(--font-impact, "Bebas Neue", sans-serif)',
                  fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
                  color: '#c9a84c',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#888',
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
