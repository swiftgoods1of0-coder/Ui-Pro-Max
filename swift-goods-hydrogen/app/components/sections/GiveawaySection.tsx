import { useEffect, useRef, useState } from 'react'
import { Link } from '@remix-run/react'
import gsap from 'gsap'

const GOLD = '#c9a84c'
const GOLD_LIGHT = '#e6c870'

// Swap for a real fixed date in Shopify Admin once the giveaway is live
const DEADLINE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
      <span style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1, color: GOLD, minWidth: '2.5ch', textAlign: 'center', textShadow: '0 0 30px rgba(201,168,76,0.4)' }}>
        {String(value).padStart(2, '0')}
      </span>
      <span style={{ fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.4rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)' }}>
        {label}
      </span>
    </div>
  )
}

function Sep() {
  return (
    <span style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', color: 'rgba(201,168,76,0.35)', lineHeight: 1, marginBottom: '1.2rem', alignSelf: 'flex-end' }}>
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
      gsap.fromTo('.gw-badge',    { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.8)', delay: 0.2 })
      gsap.fromTo('.gw-h1',       { y: 60,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', delay: 0.35 })
      gsap.fromTo('.gw-sub',      { y: 30,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: 'power2.out', delay: 0.5  })
      gsap.fromTo('.gw-winners',  { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6,  ease: 'power2.out', delay: 0.55 })
      gsap.fromTo('.gw-price',    { scale: 0.82, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)', delay: 0.65 })
      gsap.fromTo('.gw-cta',      { y: 25,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.6,  ease: 'power2.out', delay: 0.8  })
      gsap.fromTo('.gw-right',    { opacity: 0 },          { opacity: 1, duration: 0.6,  delay: 0.9 })
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
          src="/brand/sg-giveaway-shorts.jpeg"
          alt="Swift Goods Brown Shorts Giveaway"
          fetchPriority="high"
          decoding="async"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', filter: 'brightness(0.5) contrast(1.1)' }}
        />
      </div>

      {/* Vignettes */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, background: 'linear-gradient(to right, rgba(5,5,5,0.94) 0%, rgba(5,5,5,0.65) 55%, rgba(5,5,5,0.3) 100%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, background: 'linear-gradient(to top, rgba(5,5,5,1) 0%, transparent 45%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, background: 'radial-gradient(ellipse at 25% 50%, rgba(201,168,76,0.06) 0%, transparent 60%)' }} />

      {/* Film grain */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, opacity: 0.022, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 3px)', backgroundSize: '100% 4px' }} />

      {/* Corner marks */}
      {[{ s: { top: '6%', left: '3%' }, t: true, l: true }, { s: { bottom: '6%', right: '3%' }, b: true, r: true }].map((c, i) => (
        <div key={i} className="absolute hidden lg:block" style={{ ...c.s, zIndex: 3 }}>
          <div style={{ width: 40, height: 40, position: 'relative' }}>
            {(c as any).t && <div style={{ position: 'absolute', top: 0, left: 0, width: 22, height: 1, background: 'rgba(201,168,76,0.3)' }} />}
            {(c as any).l && <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 22, background: 'rgba(201,168,76,0.3)' }} />}
            {(c as any).b && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 22, height: 1, background: 'rgba(201,168,76,0.3)' }} />}
            {(c as any).r && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 1, height: 22, background: 'rgba(201,168,76,0.3)' }} />}
          </div>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16" style={{ paddingTop: '6rem', paddingBottom: '5rem' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── LEFT ── */}
          <div>
            {/* Badge */}
            <div className="gw-badge inline-flex items-center gap-3 mb-7" style={{ opacity: 0 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'linear-gradient(135deg, rgba(201,168,76,0.18), rgba(201,168,76,0.06))', border: '1px solid rgba(201,168,76,0.45)', fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: GOLD, backdropFilter: 'blur(10px)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, boxShadow: `0 0 10px ${GOLD}`, animation: 'gw-pulse 1.8s ease-in-out infinite' }} />
                LIMITED TIME GIVEAWAY
              </span>
            </div>

            {/* Headline */}
            <div className="gw-h1" style={{ opacity: 0 }}>
              <h2 style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: 'clamp(3.2rem, 8.5vw, 7rem)', lineHeight: 0.92, letterSpacing: '0.04em', color: '#f5f5f5', margin: 0, textShadow: '0 4px 60px rgba(0,0,0,0.5)' }}>
                WIN THE
              </h2>
              <h2 style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: 'clamp(3.2rem, 8.5vw, 7rem)', lineHeight: 0.92, letterSpacing: '0.04em', background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT}, #c8aa8a)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, marginBottom: '1.5rem' }}>
                BROWN SHORTS.
              </h2>
            </div>

            {/* Sub */}
            <p className="gw-sub" style={{ opacity: 0, fontFamily: 'var(--font-display, "Cormorant Garamond", serif)', fontStyle: 'italic', fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(245,245,245,0.5)', lineHeight: 1.75, maxWidth: 440, marginBottom: '2rem' }}>
              Our most exclusive colorway — ultra-soft premium stretch fabric. Already on the site, now yours to win.
            </p>

            {/* 3 Winners */}
            <div className="gw-winners" style={{ opacity: 0, display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {[1, 2, 3].map((n) => (
                  <div key={n} style={{ width: 36, height: 36, borderRadius: '50%', background: n === 1 ? `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` : 'rgba(201,168,76,0.1)', border: `1px solid ${n === 1 ? GOLD : 'rgba(201,168,76,0.22)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: '0.9rem', color: n === 1 ? '#050505' : GOLD, boxShadow: n === 1 ? '0 0 20px rgba(201,168,76,0.3)' : 'none' }}>
                    {n}
                  </div>
                ))}
              </div>
              <div>
                <p style={{ margin: 0, fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: '1.05rem', letterSpacing: '0.12em', color: '#f5f5f5' }}>3 WINNERS ANNOUNCED</p>
                <p style={{ margin: 0, fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.55rem', letterSpacing: '0.2em', color: 'rgba(245,245,245,0.35)', textTransform: 'uppercase' }}>Selected at random · announced publicly</p>
              </div>
            </div>

            <div style={{ width: '4rem', height: 1, background: `linear-gradient(to right, ${GOLD}, transparent)`, marginBottom: '2rem' }} />

            {/* Price + entry picker */}
            <div className="gw-price" style={{ opacity: 0, marginBottom: '2rem' }}>
              <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem 1.75rem', background: 'rgba(5,5,5,0.72)', border: '1px solid rgba(201,168,76,0.22)', backdropFilter: 'blur(20px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                  {/* Per-entry price */}
                  <div>
                    <p style={{ margin: 0, fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.45rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', marginBottom: '0.15rem' }}>PER ENTRY</p>
                    <span style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: '2.8rem', lineHeight: 1, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>$9.99</span>
                  </div>
                  <div style={{ width: 1, height: 44, background: 'rgba(201,168,76,0.15)' }} />

                  {/* Qty */}
                  <div>
                    <p style={{ margin: 0, fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.45rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', marginBottom: '0.35rem' }}>ENTRIES</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {[
                        { label: '−', fn: () => setEntries((e) => Math.max(1, e - 1)) },
                        { label: '+', fn: () => setEntries((e) => Math.min(10, e + 1)) },
                      ].map((btn, i) => (
                        <>
                          {i === 1 && (
                            <span key="qty" style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: '1.5rem', color: '#f5f5f5', minWidth: '1.5ch', textAlign: 'center' }}>{entries}</span>
                          )}
                          <button key={btn.label} type="button" onClick={btn.fn} style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.2)', color: GOLD, cursor: 'pointer', fontSize: '1rem', transition: 'all 200ms ease' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}>
                            {btn.label}
                          </button>
                        </>
                      ))}
                    </div>
                  </div>
                  <div style={{ width: 1, height: 44, background: 'rgba(201,168,76,0.15)' }} />

                  {/* Total */}
                  <div>
                    <p style={{ margin: 0, fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.45rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', marginBottom: '0.15rem' }}>TOTAL</p>
                    <span style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: '1.9rem', lineHeight: 1, color: '#f5f5f5' }}>${total}</span>
                  </div>
                </div>

                {entries > 1 && (
                  <p style={{ margin: 0, fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.52rem', color: 'rgba(201,168,76,0.55)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    {entries}× entries = {entries}× chance of winning
                  </p>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="gw-cta" style={{ opacity: 0 }}>
              {/* ENTER NOW links to the Shopify giveaway-entry product */}
              <Link
                to={`/products/giveaway-entry?qty=${entries}`}
                style={{
                  display: 'inline-block',
                  padding: '1.1rem 3rem',
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.75rem', fontWeight: 700,
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  textDecoration: 'none',
                  color: '#050505',
                  background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                  boxShadow: '0 8px 40px rgba(201,168,76,0.3)',
                  transition: 'transform 200ms ease, box-shadow 200ms ease',
                  marginBottom: '0.75rem',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 50px rgba(201,168,76,0.45)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(201,168,76,0.3)' }}
              >
                ENTER NOW — ${total}
              </Link>

              <p style={{ margin: 0, fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.52rem', color: 'rgba(245,245,245,0.25)', letterSpacing: '0.12em' }}>
                Each entry = $9.99. Max 10 entries per person. Winners announced publicly.
              </p>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="gw-right flex flex-col items-center lg:items-end gap-8" style={{ opacity: 0 }}>

            {/* Countdown */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, marginBottom: '1rem', fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.5rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.4)' }}>
                GIVEAWAY ENDS IN
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'flex-end', gap: '0.75rem', padding: '1.5rem 2rem', background: 'rgba(5,5,5,0.75)', border: '1px solid rgba(201,168,76,0.14)', backdropFilter: 'blur(20px)' }}>
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
            <div style={{ padding: '2rem', background: 'rgba(5,5,5,0.75)', border: '1px solid rgba(201,168,76,0.18)', backdropFilter: 'blur(20px)', maxWidth: 360, width: '100%' }}>
              <p style={{ margin: 0, marginBottom: '1.25rem', fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.5rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)' }}>
                PRIZE DETAILS
              </p>
              {[
                { label: 'Item',    value: 'Swift Goods Brown Shorts' },
                { label: 'Edition', value: 'Limited — Brown Colorway' },
                { label: 'Winners', value: '3 Selected at Random' },
                { label: 'Entry',   value: '$9.99 per entry' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.3)' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.62rem', color: '#f5f5f5', fontWeight: 500 }}>{value}</span>
                </div>
              ))}
              <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: GOLD, boxShadow: `0 0 8px ${GOLD}`, animation: 'gw-pulse 1.8s ease-in-out infinite' }} />
                <span style={{ fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.48rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.45)' }}>
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
