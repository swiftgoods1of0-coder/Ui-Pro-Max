import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from '@remix-run/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitTextReveal from '@/components/ui/SplitTextReveal'
import MagneticElement from '@/components/ui/MagneticElement'

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="2" y="2" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="14.5" cy="5.5" r="1" fill="currentColor" />
  </svg>
)

const TwitterXIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 3.5L8.5 10.3M8.5 10.3L3 17H6L10.5 11.5M8.5 10.3L17 3.5H14L10.5 11.5M10.5 11.5L15.5 17H18.5L11.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="3" y1="3.5" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const PinterestIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7.5 8.5C7.5 6.8 8.8 5.5 10.5 5.5C12.2 5.5 13.5 6.8 13.5 8.5C13.5 10.8 12 12 10.5 12C10 12 9.5 11.8 9.2 11.5L8.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 2.5C12.3 4.5 13.5 5.5 15.5 5.7V8.2C14.2 8.1 13 7.6 12 6.8V13C12 15.8 9.8 18 7 18C4.2 18 2 15.8 2 13C2 10.2 4.2 8 7 8C7.3 8 7.6 8 7.9 8.1V10.7C7.6 10.6 7.3 10.5 7 10.5C5.6 10.5 4.5 11.6 4.5 13C4.5 14.4 5.6 15.5 7 15.5C8.4 15.5 9.5 14.4 9.5 13V2.5H12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ShippingIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M2 7h15v12H2V7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M17 11h5l4 4v4h-9V11z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="7" cy="21" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="21" cy="21" r="2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const QualityIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M14 2l3.5 7 7.5 1-5.5 5.5 1.3 7.5L14 19.5 7.2 23l1.3-7.5L3 10l7.5-1L14 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
)

const ReturnsIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4 14a10 10 0 0118-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M24 14a10 10 0 01-18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M22 4v4h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 24v-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const SecureIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="5" y="12" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 12V8a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="14" cy="18.5" r="1.5" fill="currentColor" />
    <line x1="14" y1="20" x2="14" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

interface FooterNavLink {
  label: string
  href: string
}

interface FooterColumn {
  heading: string
  links: FooterNavLink[]
}

const footerColumns: FooterColumn[] = [
  {
    heading: 'SHOP',
    links: [
      { label: 'New Arrivals', href: '/collections/new-arrivals' },
      { label: 'Hoodies', href: '/collections/hoodies' },
      { label: 'Joggers', href: '/collections/joggers' },
      { label: 'Sets', href: '/collections/sets' },
      { label: 'All Collections', href: '/collections' },
    ],
  },
  {
    heading: 'BRAND',
    links: [
      { label: 'Our Story', href: '#craftsmanship' },
      { label: 'The Inner Circle', href: '#inner-circle' },
      { label: 'Lookbook', href: '/collections' },
    ],
  },
  {
    heading: 'SUPPORT',
    links: [
      { label: 'Shipping & Returns', href: 'mailto:support@swiftgoodsclothing.com' },
      { label: 'Contact Us', href: 'mailto:support@swiftgoodsclothing.com' },
    ],
  },
]

interface SocialLink {
  label: string
  href: string
  Icon: () => JSX.Element
}

const socialLinks: SocialLink[] = [
  { label: 'Instagram', href: 'https://instagram.com/swiftgoodsclothing', Icon: InstagramIcon },
  { label: 'TikTok', href: 'https://tiktok.com/@swiftgoodsclothing', Icon: TikTokIcon },
  { label: 'Twitter / X', href: 'https://x.com/swiftgoodsco', Icon: TwitterXIcon },
  { label: 'Pinterest', href: 'https://pinterest.com/swiftgoodsclothing', Icon: PinterestIcon },
]

interface TrustSignal {
  Icon: () => JSX.Element
  title: string
  subtitle: string
}

const trustSignals: TrustSignal[] = [
  { Icon: ShippingIcon, title: 'COMPLIMENTARY SHIPPING', subtitle: 'Worldwide on all orders' },
  { Icon: QualityIcon, title: 'AUTHENTICITY GUARANTEED', subtitle: 'Certificate of authenticity' },
  { Icon: ReturnsIcon, title: 'CONCIERGE RETURNS', subtitle: '30-day white-glove returns' },
  { Icon: SecureIcon, title: 'SECURE CHECKOUT', subtitle: 'Encrypted & protected' },
]

const ColumnHeading = ({ children }: { children: ReactNode }) => (
  <h3
    style={{
      fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
      letterSpacing: '0.25em',
      color: '#c9a84c',
      borderLeft: '2px solid #c9a84c',
      paddingLeft: '0.625rem',
      marginBottom: '1.25rem',
      fontSize: '0.9rem',
      textTransform: 'uppercase',
      marginTop: 0,
    }}
  >
    {children}
  </h3>
)

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
  const sharedStyle = {
    display: 'inline-block',
    color: '#999',
    textDecoration: 'none',
    fontSize: '0.875rem',
    lineHeight: '1.6',
    transition: 'color 300ms ease, transform 300ms ease',
    fontFamily: 'var(--font-body, Inter, sans-serif)',
  }
  const handlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget as HTMLElement
      el.style.color = '#c9a84c'
      el.style.transform = 'translateX(4px)'
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget as HTMLElement
      el.style.color = '#999'
      el.style.transform = 'translateX(0)'
    },
  }

  return (
    <li>
      {isExternal ? (
        <a href={href} style={sharedStyle} {...handlers}>
          {children}
        </a>
      ) : (
        <Link to={href} style={sharedStyle} {...handlers}>
          {children}
        </Link>
      )}
    </li>
  )
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const emailSectionRef = useRef<HTMLDivElement>(null)
  const trustBarRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const emailSection = emailSectionRef.current
      if (emailSection) {
        const logo = emailSection.querySelector('[data-animate="logo"]')
        const heading = emailSection.querySelector('[data-animate="heading"]')
        const subtitle = emailSection.querySelector('[data-animate="subtitle"]')
        const form = emailSection.querySelector('[data-animate="form"]')

        if (logo) {
          gsap.fromTo(logo, { opacity: 0, scale: 0.9 }, {
            opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: emailSection, start: 'top 85%', toggleActions: 'play none none none' },
          })
        }
        if (heading) {
          gsap.fromTo(heading, { opacity: 0, y: 30 }, {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.2,
            scrollTrigger: { trigger: emailSection, start: 'top 85%', toggleActions: 'play none none none' },
          })
        }
        if (subtitle) {
          gsap.fromTo(subtitle, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.35,
            scrollTrigger: { trigger: emailSection, start: 'top 85%', toggleActions: 'play none none none' },
          })
        }
        if (form) {
          gsap.fromTo(form, { opacity: 0, y: 20 }, {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5,
            scrollTrigger: { trigger: emailSection, start: 'top 85%', toggleActions: 'play none none none' },
          })
        }
      }

      const trustBar = trustBarRef.current
      if (trustBar) {
        const items = trustBar.querySelectorAll('[data-animate="trust-item"]')
        gsap.fromTo(items, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1,
          scrollTrigger: { trigger: trustBar, start: 'top 90%', toggleActions: 'play none none none' },
        })
      }
    }, footerRef)

    return () => ctx.revert()
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setEmail('')
  }

  return (
    <footer ref={footerRef} style={{ backgroundColor: '#0a0a0a', color: '#f5f5f5', position: 'relative', overflow: 'hidden' }}>
      {/* Email Capture Section */}
      <div
        ref={emailSectionRef}
        style={{
          backgroundColor: '#0a0a0a',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          paddingTop: '5rem',
          paddingBottom: '4rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          position: 'relative',
        }}
      >
        <div className="absolute pointer-events-none" style={{ top: '20%', left: '30%', width: '40%', height: '40%', background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 65%)', filter: 'blur(80px)' }} />

        <div data-animate="logo" style={{ maxWidth: '400px', width: '100%', marginBottom: '2.5rem' }}>
          <img
            src="/brand/sg-signature-logo.png"
            alt="Swift Goods Signature"
            style={{ width: '100%', height: 'auto', objectFit: 'contain', filter: 'grayscale(1) brightness(1.8)' }}
          />
        </div>

        <div data-animate="heading">
          <SplitTextReveal
            text="JOIN THE MOVEMENT"
            tag="h2"
            style={{
              fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              letterSpacing: '0.2em',
              color: '#f5f5f5',
              margin: 0,
              marginBottom: '1rem',
              textShadow: '0 4px 40px rgba(0,0,0,0.3)',
            }}
          />
        </div>

        <p
          data-animate="subtitle"
          style={{
            fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            color: '#888',
            margin: 0,
            marginBottom: '2.5rem',
            maxWidth: '540px',
            lineHeight: 1.6,
          }}
        >
          Be the first to know about exclusive drops, limited releases, and members-only offers.
        </p>

        <form
          data-animate="form"
          onSubmit={handleSubscribe}
          style={{ display: 'flex', gap: '0', width: '100%', maxWidth: '480px', marginBottom: '1rem' }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            style={{
              flex: 1,
              padding: '0.875rem 1.25rem',
              backgroundColor: '#111',
              border: '1px solid #c9a84c',
              borderRight: 'none',
              borderRadius: '0',
              color: '#fff',
              fontSize: '0.875rem',
              fontFamily: 'var(--font-body, Inter, sans-serif)',
              outline: 'none',
              transition: 'border-color 300ms ease, box-shadow 300ms ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#d4b65a'
              e.currentTarget.style.boxShadow = '0 0 0 1px rgba(201, 168, 76, 0.3)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#c9a84c'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.875rem 2rem',
              backgroundColor: '#c9a84c',
              color: '#0a0a0a',
              border: '1px solid #c9a84c',
              borderRadius: '0',
              fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
              fontSize: '0.875rem',
              letterSpacing: '0.15em',
              cursor: 'pointer',
              transition: 'background-color 300ms ease, color 300ms ease',
              whiteSpace: 'nowrap',
              fontWeight: 600,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d4b65a'
              e.currentTarget.style.color = '#000'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#c9a84c'
              e.currentTarget.style.color = '#0a0a0a'
            }}
          >
            SUBSCRIBE
          </button>
        </form>

        <p style={{ fontSize: '0.875rem', color: '#555', margin: 0, fontFamily: 'var(--font-body, Inter, sans-serif)' }}>
          Unsubscribe anytime.
        </p>
      </div>

      {/* Gold gradient divider */}
      <div aria-hidden="true" style={{ height: '2px', width: '100%', background: 'linear-gradient(to right, transparent 0%, #c9a84c 30%, #d4b65a 50%, #c9a84c 70%, transparent 100%)' }} />

      {/* Footer Grid */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingLeft: '2rem',
          paddingRight: '2rem',
          paddingTop: '4rem',
          paddingBottom: '4rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
        }}
      >
        <div>
          <p style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: '1.75rem', letterSpacing: '0.15em', color: '#f5f5f5', margin: 0, marginBottom: '0.5rem', textShadow: '0 0 30px rgba(201,168,76,0.1)' }}>
            SWIFT GOODS
          </p>
          <p style={{ fontFamily: 'var(--font-display, "Cormorant Garamond", serif)', fontStyle: 'italic', fontSize: '1rem', color: '#c9a84c', margin: 0, marginBottom: '1.75rem' }}>
            Comfort Is Luxury.
          </p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{ color: '#666', transition: 'color 300ms ease, transform 300ms ease, filter 300ms ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.color = '#c9a84c'
                  el.style.transform = 'translateY(-3px) scale(1.15)'
                  el.style.filter = 'drop-shadow(0 0 8px rgba(201,168,76,0.4))'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.color = '#666'
                  el.style.transform = 'translateY(0) scale(1)'
                  el.style.filter = 'none'
                }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {footerColumns.map((col) => (
          <div key={col.heading}>
            <ColumnHeading>{col.heading}</ColumnHeading>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {col.links.map((link) => (
                <FooterLink key={link.label} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Trust Bar */}
      <div style={{ borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', backgroundColor: '#0d0d0d' }}>
        <div
          ref={trustBarRef}
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            paddingTop: '2.5rem',
            paddingBottom: '2.5rem',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '2rem',
          }}
        >
          {trustSignals.map(({ Icon, title, subtitle }) => (
            <div key={title} data-animate="trust-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem' }}>
              <div style={{ color: '#c9a84c', filter: 'drop-shadow(0 0 6px rgba(201,168,76,0.3))' }}>
                <Icon />
              </div>
              <p style={{ fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)', fontSize: '0.9rem', letterSpacing: '0.15em', color: '#f5f5f5', margin: 0 }}>
                {title}
              </p>
              <p style={{ fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.875rem', color: '#777', margin: 0, lineHeight: 1.4 }}>
                {subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Back to Top */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0 0' }}>
        <MagneticElement strength={0.3} radius={120}>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#555',
              transition: 'color 300ms ease, transform 300ms ease',
              padding: '0.5rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#c9a84c'
              e.currentTarget.style.transform = 'translateY(-3px)'
              e.currentTarget.style.filter = 'drop-shadow(0 0 10px rgba(201,168,76,0.3))'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#555'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.filter = 'none'
            }}
            aria-label="Back to top"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            <span style={{ fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
              BACK TO TOP
            </span>
          </button>
        </MagneticElement>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingTop: '1.5rem',
          paddingBottom: '1.5rem',
          paddingLeft: '2rem',
          paddingRight: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#555', fontFamily: 'var(--font-body, Inter, sans-serif)' }}>
          &copy; {new Date().getFullYear()} Swift Goods. All rights reserved.
        </p>

        <nav aria-label="Legal navigation">
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Privacy Policy', href: '/policies/privacy-policy' },
              { label: 'Terms of Service', href: '/policies/terms-of-service' },
            ].map((item, idx, arr) => (
              <li key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link
                  to={item.href}
                  style={{ fontSize: '0.875rem', color: '#555', textDecoration: 'none', fontFamily: 'var(--font-body, Inter, sans-serif)', transition: 'color 300ms ease', whiteSpace: 'nowrap' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#c9a84c' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#555' }}
                >
                  {item.label}
                </Link>
                {idx < arr.length - 1 && (
                  <span aria-hidden="true" style={{ color: '#333', fontSize: '0.875rem', userSelect: 'none' }}>|</span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay'].map((method) => (
            <span
              key={method}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.25rem 0.5rem',
                backgroundColor: '#151515',
                borderRadius: '3px',
                fontSize: '0.75rem',
                color: '#666',
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                border: '1px solid #222',
              }}
            >
              {method}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
