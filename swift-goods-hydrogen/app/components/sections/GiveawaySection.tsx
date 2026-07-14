import { useEffect, useRef, useState } from 'react'
import { Link } from '@remix-run/react'
import gsap from 'gsap'

const GOLD = '#c9a84c'
const GOLD_LIGHT = '#e6c870'

const DEADLINE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
      <span style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: 'clamp(2.4rem, 6vw, 3.5rem)', lineHeight: 1, color: GOLD, minWidth: '2.5ch', textAlign: 'center', textShadow: '0 0 30px rgba(201,168,76,0.4)' }}>
        {String(value).padStart(2, '0')}
      </span>
      <span style={{ fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)' }}>
        {label}
      </span>
    </div>
  )
}

function Sep() {
  return (
    <span style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'rgba(201,168,76,0.35)', lineHeight: 1, marginBottom: '1.4rem', alignSelf: 'flex-end' }}>
      :
    </span>
  )
}

function useCountdown(target: Date) {
  const calc = () => {
    const d = Math.max(0, target.getTime() - Date.now())
    return {
      days:    Math.floor(d / 86400000),
      hours:   Math.floor((d % 86400000) / 3600000),
      minutes: Math.floor((d % 3600000) / 60000),
      seconds: Math.floor((d % 60000) / 1000),
    }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

export default function GiveawaySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [entries, setEntries] = useState(1)
  const cd = useCountdown(DEADLINE)
  const total = (9.99 * entries).toFixed(2)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.gw-badge',   { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.8)', delay: 0.2 })
      gsap.fromTo('.gw-h1',      { y: 60, opacity: 0 },      { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', delay: 0.35 })
      gsap.fromTo('.gw-sub',     { y: 30, opacity: 0 },      { y: 0, opacity: 1, duration: 0.65, ease: 'power2.out', delay: 0.5 })
      gsap.fromTo('.gw-winners', { x: -40, opacity: 0 },     { x: 0, opacity: 1, duration: 0.6,  ease: 'power2.out', delay: 0.55 })
      gsap.fromTo('.gw-price',   { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)', delay: 0.65 })
      gsap.fromTo('.gw-cta',     { y: 25, opacity: 0 },      { y: 0, opacity: 1, duration: 0.6,  ease: 'power2.out', delay: 0.8 })
      gsap.fromTo('.gw-right',   { opacity: 0 },             { opacity: 1, duration: 0.6, delay: 0.9 })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', width: '100%', minHeight: '100vh', background: '#050505', overflow: 'hidden', display: 'flex', alignItems: 'center' }}
    >
      {/* Background */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <img
          src="/brand/sg-challenger-shorts.jpeg"
          alt="Swift Goods Brown Shorts Giveaway"
          fetchPriority="high"
          decoding="async"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', filter: 'brightness(0.38) contrast(1.1)' }}
        />
      </div>

      {/* Vignettes */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, background: 'linear-gradient(to right, rgba(5,5,5,0.96) 0%, rgba(5,5,5,0.7) 50%, rgba(5,5,5,0.25) 100%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, background: 'linear-gradient(to top, rgba(5,5,5,1) 0%, transparent 50%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, background: 'radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.07) 0%, transparent 60%)' }} />

      {/* Film grain */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, opacity: 0.02, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 3px)', backgroundSize: '100% 4px' }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto" style={{ padding: '7rem 1.5rem 5rem', paddingLeft: 'max(1.5rem, env(safe-area-inset-left))', paddingRight: 'max(1.5rem, env(safe-area-inset-right))' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* ── LEFT ── */}
          <div>
            {/* Badge */}
            <div className="gw-badge inline-flex items-center gap-3 mb-6" style={{ opacity: 0 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.1rem', background: 'linear-gradient(135deg, rgba(201,168,76,0.18), rgba(201,168,76,0.06))', border: '1px solid rgba(201,168,76,0.45)', fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: GOLD, backdropFilter: 'blur(10px)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: GOLD, boxShadow: `0 0 10px ${GOLD}`, flexShrink: 0, animation: 'gw-pulse 1.8s ease-in-out infinite' }} />
                LIMITED TIME GIVEAWAY
              </span>
            </div>

            {/* Headline */}
            <div className="gw-h1" style={{ opacity: 0 }}>
              <h2 style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: 'clamp(3.8rem, 10vw, 7.5rem)', lineHeight: 0.9, letterSpacing: '0.04em', color: '#f5f5f5', margin: 0, textShadow: '0 4px 60px rgba(0,0,0,0.5)' }}>
                WIN THE
              </h2>
              <h2 style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: 'clamp(3.8rem, 10vw, 7.5rem)', lineHeight: 0.9, letterSpacing: '0.04em', background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT}, #c8aa8a)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, marginBottom: '1.5rem' }}>
                BROWN SHORTS.
              </h2>
            </div>

            {/* Sub */}
            <p className="gw-sub" style={{ opacity: 0, fontFamily: 'var(--font-display, "Cormorant Garamond", serif)', fontStyle: 'italic', fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', color: 'rgba(245,245,245,0.55)', lineHeight: 1.7, maxWidth: 480, marginBottom: '2rem' }}>
              Our most exclusive colorway — ultra-soft premium stretch fabric. Already on the site, now yours to win.
            </p>

            {/* 3 Winners */}
            <div className="gw-winners" style={{ opacity: 0, display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3].map((n) => (
                  <div key={n} style={{ width: 42, height: 42, borderRadius: '50%', background: n === 1 ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` : 'rgba(201,168,76,0.1)', border: `1px solid ${n === 1 ? GOLD : 'rgba(201,168,76,0.22)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: '1.1rem', color: n === 1 ? '#050505' : GOLD, boxShadow: n === 1 ? '0 0 20px rgba(201,168,76,0.3)' : 'none' }}>
                    {n}
                  </div>
                ))}
              </div>
              <div>
                <p style={{ margin: 0, fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: '1.2rem', letterSpacing: '0.1em', color: '#f5f5f5' }}>3 WINNERS ANNOUNCED</p>
                <p style={{ margin: 0, fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.8rem', letterSpacing: '0.15em', color: 'rgba(245,245,245,0.4)', textTransform: 'uppercase' }}>Selected at random · announced publicly</p>
              </div>
            </div>

            <div style={{ width: '4rem', height: 1, background: `linear-gradient(to right, ${GOLD}, transparent)`, marginBottom: '2rem' }} />

            {/* Price + entry picker */}
            <div className="gw-price" style={{ opacity: 0, marginBottom: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.75rem', background: 'rgba(5,5,5,0.75)', border: '1px solid rgba(201,168,76,0.22)', backdropFilter: 'blur(20px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  {/* Per-entry price */}
                  <div>
                    <p style={{ margin: 0, fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.8rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.55)', marginBottom: '0.2rem' }}>PER ENTRY</p>
                    <span style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: '3rem', lineHeight: 1, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>$9.99</span>
                  </div>
                  <div style={{ width: 1, height: 50, background: 'rgba(201,168,76,0.15)', flexShrink: 0 }} />

                  {/* Qty */}
                  <div>
                    <p style={{ margin: 0, fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.8rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.55)', marginBottom: '0.4rem' }}>ENTRIES</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <button type="button" onClick={() => setEntries((e) => Math.max(1, e - 1))} style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.2)', color: GOLD, cursor: 'pointer', fontSize: '1.25rem', transition: 'all 200ms ease' }}>−</button>
                      <span style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: '1.8rem', color: '#f5f5f5', minWidth: '1.8ch', textAlign: 'center' }}>{entries}</span>
                      <button type="button" onClick={() => setEntries((e) => Math.min(10, e + 1))} style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.2)', color: GOLD, cursor: 'pointer', fontSize: '1.25rem', transition: 'all 200ms ease' }}>+</button>
                    </div>
                  </div>
                  <div style={{ width: 1, height: 50, background: 'rgba(201,168,76,0.15)', flexShrink: 0 }} />

                  {/* Total */}
                  <div>
                    <p style={{ margin: 0, fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.8rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.55)', marginBottom: '0.2rem' }}>TOTAL</p>
                    <span style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: '2.2rem', lineHeight: 1, color: '#f5f5f5' }}>${total}</span>
                  </div>
                </div>

                {entries > 1 && (
                  <p style={{ margin: 0, fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.85rem', color: 'rgba(201,168,76,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {entries}× entries = {entries}× chance of winning
                  </p>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="gw-cta" style={{ opacity: 0 }}>
              <Link
                to={`/products/giveaway-entry?qty=${entries}`}
                style={{
                  display: 'block',
                  width: '100%',
                  maxWidth: 420,
                  padding: '1.35rem 2rem',
                  textAlign: 'center',
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '1rem', fontWeight: 700,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  textDecoration: 'none',
                  color: '#050505',
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                  boxShadow: '0 8px 40px rgba(201,168,76,0.35)',
                  transition: 'transform 200ms ease, box-shadow 200ms ease',
                  marginBottom: '1rem',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 14px 50px rgba(201,168,76,0.5)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(201,168,76,0.35)' }}
              >
                ENTER NOW — ${total}
              </Link>

              <p style={{ margin: 0, fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.8rem', color: 'rgba(245,245,245,0.3)', letterSpacing: '0.08em' }}>
                Each entry = $9.99 · Max 10 entries per person · Winners announced publicly
              </p>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="gw-right flex flex-col items-stretch lg:items-end gap-8" style={{ opacity: 0 }}>

            {/* Countdown */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, marginBottom: '1.1rem', fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.85rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)' }}>
                GIVEAWAY ENDS IN
              </p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '1.75rem 2rem', background: 'rgba(5,5,5,0.78)', border: '1px solid rgba(201,168,76,0.16)', backdropFilter: 'blur(20px)', justifyContent: 'center' }}>
                <CountdownUnit value={cd.days}    label="Days"  />
                <Sep />
                <CountdownUnit value={cd.hours}   label="Hours" />
                <Sep />
                <CountdownUnit value={cd.minutes} label="Mins"  />
                <Sep />
                <CountdownUnit value={cd.seconds} label="Secs"  />
              </div>
            </div>

            {/* Prize card */}
            <div style={{ padding: '2rem', background: 'rgba(5,5,5,0.78)', border: '1px solid rgba(201,168,76,0.18)', backdropFilter: 'blur(20px)', width: '100%' }}>
              <p style={{ margin: 0, marginBottom: '1.25rem', fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.85rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.55)' }}>
                PRIZE DETAILS
              </p>
              {[
                { label: 'Item',    value: 'Swift Goods Brown Shorts' },
                { label: 'Edition', value: 'Limited — Brown Colorway' },
                { label: 'Winners', value: '3 Selected at Random' },
                { label: 'Entry',   value: '$9.99 per entry' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.9rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.35)' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '1rem', color: '#f5f5f5', fontWeight: 500 }}>{value}</span>
                </div>
              ))}
              <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, boxShadow: `0 0 8px ${GOLD}`, flexShrink: 0, animation: 'gw-pulse 1.8s ease-in-out infinite' }} />
                <span style={{ fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.78rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)' }}>
                  AVAILABLE WHILE SUPPLIES LAST
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: '10rem', background: 'linear-gradient(to bottom, transparent, #050505)', zIndex: 5 }} />

      <style>{`
        @keyframes gw-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
      `}</style>
    </section>
  )
}
