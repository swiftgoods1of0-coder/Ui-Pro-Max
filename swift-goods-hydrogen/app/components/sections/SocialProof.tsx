

import SplitTextReveal from '@/components/ui/SplitTextReveal'

interface Testimonial {
  quote: string
  name: string
  location: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "The quality is insane. I've bought from every luxury brand and Swift Goods hits different. The fabric, the fit — everything.",
    name: 'Marcus T.',
    location: 'Los Angeles, CA',
  },
  {
    quote:
      "Wore the hoodie set to Art Basel. Got stopped six times asking where it's from. That's never happened with any other brand.",
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

const STATS = [
  { value: '10K+', label: 'Community Members' },
  { value: '3X', label: 'Sold Out Drops' },
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


export default function SocialProof() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'var(--sg-frost, #F7F6F3)' }}
    >
      {/* Warm ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(201,168,76,0.04) 0%, transparent 60%)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: '10%', right: '-5%', width: '35%', height: '35%', background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.03) 0%, transparent 65%)', filter: 'blur(80px)' }} />

      {/* Frost texture */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.025, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 3px)', backgroundSize: '100% 4px' }} />

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
              fontSize: '13px',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#a08535',
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
              color: '#1a1a1a',
              lineHeight: 1,
              letterSpacing: '0.04em',
            }}
          />
        </div>

        {/* Testimonial Cards — white on frost */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.name}
              className="group"
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.06)',
                padding: '2.5rem',
                transition: 'border-color 0.5s ease, box-shadow 0.5s ease, transform 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'scale(1.02)'
                el.style.borderColor = 'rgba(201,168,76,0.3)'
                el.style.boxShadow = '0 12px 50px rgba(0,0,0,0.1), 0 0 30px rgba(201,168,76,0.06)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'scale(1)'
                el.style.borderColor = 'rgba(0,0,0,0.06)'
                el.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'
              }}
            >
              {/* Gold accent line — left edge */}
              <div
                className="absolute left-0 top-0 bottom-0 w-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.5), transparent)' }}
              />

              {/* Opening quote mark */}
              <span
                aria-hidden="true"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                  fontSize: '4rem',
                  lineHeight: 0.8,
                  color: 'rgba(201,168,76,0.35)',
                  marginBottom: '0.75rem',
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
                  color: '#555',
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
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: '#1a1a1a',
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
                  fontSize: '0.8rem',
                  color: '#9a9590',
                  letterSpacing: '0.1em',
                }}
              >
                {testimonial.location}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 mb-16">
          <div style={{ width: 60, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.35))' }} />
          <div style={{ width: 5, height: 5, background: 'rgba(201,168,76,0.6)', transform: 'rotate(45deg)', boxShadow: '0 0 10px rgba(201,168,76,0.2)' }} />
          <div style={{ width: 60, height: 1, background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.35))' }} />
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
                  textShadow: '0 0 40px rgba(201,168,76,0.15)',
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#9a9590',
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Brand signature */}
        <div className="mt-16 flex justify-center">
          <p
            style={{
              fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
              fontSize: '1rem',
              letterSpacing: '0.4em',
              color: 'rgba(201,168,76,0.25)',
              textTransform: 'uppercase',
            }}
          >
            SWIFT GOODS CLOTHING BRAND
          </p>
        </div>
      </div>
    </section>
  )
}
