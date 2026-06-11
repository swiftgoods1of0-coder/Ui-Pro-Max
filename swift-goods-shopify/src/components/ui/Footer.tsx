'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// Social icon SVGs (inline, 20x20)
// ---------------------------------------------------------------------------

const InstagramIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="14.5" cy="5.5" r="1" fill="currentColor" />
  </svg>
);

const TwitterXIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M3 3.5L8.5 10.3M8.5 10.3L3 17H6L10.5 11.5M8.5 10.3L17 3.5H14L10.5 11.5M10.5 11.5L15.5 17H18.5L11.5 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="3" y1="3.5" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const PinterestIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M7.5 8.5C7.5 6.8 8.8 5.5 10.5 5.5C12.2 5.5 13.5 6.8 13.5 8.5C13.5 10.8 12 12 10.5 12C10 12 9.5 11.8 9.2 11.5L8.5 14.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TikTokIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 2.5C12.3 4.5 13.5 5.5 15.5 5.7V8.2C14.2 8.1 13 7.6 12 6.8V13C12 15.8 9.8 18 7 18C4.2 18 2 15.8 2 13C2 10.2 4.2 8 7 8C7.3 8 7.6 8 7.9 8.1V10.7C7.6 10.6 7.3 10.5 7 10.5C5.6 10.5 4.5 11.6 4.5 13C4.5 14.4 5.6 15.5 7 15.5C8.4 15.5 9.5 14.4 9.5 13V2.5H12Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface NavLink {
  label: string;
  href: string;
}

interface FooterColumn {
  heading: string;
  links: NavLink[];
}

const footerColumns: FooterColumn[] = [
  {
    heading: 'Collection',
    links: [
      { label: 'New Arrivals', href: '/collections/new-arrivals' },
      { label: 'Essentials', href: '/collections/essentials' },
      { label: 'Outerwear', href: '/collections/outerwear' },
      { label: 'Accessories', href: '/collections/accessories' },
      { label: 'Sale', href: '/collections/sale' },
    ],
  },
  {
    heading: 'Brand',
    links: [
      { label: 'Our Story', href: '/pages/our-story' },
      { label: 'Sustainability', href: '/pages/sustainability' },
      { label: 'Careers', href: '/pages/careers' },
      { label: 'Press', href: '/pages/press' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'FAQ', href: '/pages/faq' },
      { label: 'Shipping & Returns', href: '/pages/shipping-returns' },
      { label: 'Size Guide', href: '/pages/size-guide' },
      { label: 'Contact Us', href: '/pages/contact' },
      { label: 'Track Order', href: '/pages/track-order' },
    ],
  },
];

interface SocialLink {
  label: string;
  href: string;
  Icon: () => JSX.Element;
}

const socialLinks: SocialLink[] = [
  { label: 'Instagram', href: 'https://instagram.com/swiftgoods', Icon: InstagramIcon },
  { label: 'Twitter / X', href: 'https://x.com/swiftgoods', Icon: TwitterXIcon },
  { label: 'Pinterest', href: 'https://pinterest.com/swiftgoods', Icon: PinterestIcon },
  { label: 'TikTok', href: 'https://tiktok.com/@swiftgoods', Icon: TikTokIcon },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const ColumnHeading = ({ children }: { children: React.ReactNode }) => (
  <h3
    style={{
      fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
      letterSpacing: '0.25em',
      color: '#c9a84c',
      borderLeft: '2px solid #c9a84c',
      paddingLeft: '0.625rem',
      marginBottom: '1.25rem',
      fontSize: '0.8125rem',
      textTransform: 'uppercase',
    }}
  >
    {children}
  </h3>
);

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <a
      href={href}
      className="footer-nav-link"
      style={{
        display: 'inline-block',
        color: '#f5f5f5',
        textDecoration: 'none',
        fontSize: '0.875rem',
        lineHeight: '1.6',
        transition: 'color 300ms ease, transform 300ms ease',
        fontFamily: 'var(--font-body, Inter, sans-serif)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.color = '#c9a84c';
        el.style.transform = 'translateX(4px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.color = '#f5f5f5';
        el.style.transform = 'translateX(0)';
      }}
    >
      {children}
    </a>
  </li>
);

// ---------------------------------------------------------------------------
// Main Footer component
// ---------------------------------------------------------------------------

export default function Footer() {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const headline = headlineRef.current;
    if (!headline) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headline,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headline,
            start: 'top 90%',
            end: 'top 50%',
            toggleActions: 'play none none none',
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer
      style={{
        backgroundColor: '#050505',
        color: '#f5f5f5',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* 1. Thin gold gradient top line                                       */}
      {/* ------------------------------------------------------------------ */}
      <div
        aria-hidden="true"
        style={{
          height: '2px',
          width: '100%',
          background:
            'linear-gradient(to right, transparent 0%, #c9a84c 35%, #c9a84c 65%, transparent 100%)',
        }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* 2. Brand statement / hero section                                   */}
      {/* ------------------------------------------------------------------ */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          paddingTop: '5rem',
          paddingBottom: '3.5rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
        }}
      >
        {/* Est. label */}
        <span
          style={{
            fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
            fontSize: '0.75rem',
            letterSpacing: '0.35em',
            color: '#c9a84c',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
          }}
        >
          Est. 2024
        </span>

        {/* Massive headline */}
        <h2
          ref={headlineRef}
          style={{
            fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
            fontSize: 'clamp(3rem, 5vw, 8rem)',
            color: '#f5f5f5',
            letterSpacing: '0.04em',
            lineHeight: 1,
            margin: 0,
            marginBottom: '2rem',
            willChange: 'transform, opacity',
          }}
        >
          COMFORT IS LUXURY.
        </h2>

        {/* Gold divider */}
        <div
          aria-hidden="true"
          style={{
            height: '1px',
            width: '60%',
            background:
              'linear-gradient(to right, transparent 0%, #c9a84c 30%, #c9a84c 70%, transparent 100%)',
          }}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. 4-column grid                                                    */}
      {/* ------------------------------------------------------------------ */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingLeft: '2rem',
          paddingRight: '2rem',
          paddingTop: '2.5rem',
          paddingBottom: '4rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '3rem',
        }}
      >
        {/* -- Column 1: Brand / Wordmark + Socials -- */}
        <div>
          {/* Wordmark */}
          <p
            style={{
              fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
              fontSize: '1.75rem',
              letterSpacing: '0.15em',
              color: '#f5f5f5',
              margin: 0,
              marginBottom: '0.5rem',
            }}
          >
            SWIFT GOODS
          </p>

          {/* Tagline */}
          <p
            style={{
              fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
              fontStyle: 'italic',
              fontSize: '1rem',
              color: '#c9a84c',
              margin: 0,
              marginBottom: '1.75rem',
            }}
          >
            Comfort Is Luxury.
          </p>

          {/* Social icons */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  color: '#666',
                  transition: 'color 300ms ease, transform 300ms ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.color = '#c9a84c';
                  el.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.color = '#666';
                  el.style.transform = 'translateY(0)';
                }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* -- Columns 2-4: Nav columns -- */}
        {footerColumns.map((col) => (
          <div key={col.heading}>
            <ColumnHeading>{col.heading}</ColumnHeading>
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              {col.links.map((link) => (
                <NavLink key={link.label} href={link.href}>
                  {link.label}
                </NavLink>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 4. Bottom bar                                                       */}
      {/* ------------------------------------------------------------------ */}
      <div
        style={{
          borderTop: '1px solid #1e1e1e',
          paddingTop: '1.25rem',
          paddingBottom: '1.25rem',
          paddingLeft: '2rem',
          paddingRight: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}
      >
        {/* Left: copyright */}
        <p
          style={{
            margin: 0,
            fontSize: '0.75rem',
            color: '#666',
            fontFamily: 'var(--font-body, Inter, sans-serif)',
          }}
        >
          &copy; 2024 Swift Goods. All rights reserved.
        </p>

        {/* Right: legal links */}
        <nav aria-label="Legal navigation">
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {[
              { label: 'Privacy Policy', href: '/pages/privacy-policy' },
              { label: 'Terms of Service', href: '/pages/terms-of-service' },
              { label: 'Cookies', href: '/pages/cookies' },
            ].map((item, idx, arr) => (
              <li
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <a
                  href={item.href}
                  style={{
                    fontSize: '0.75rem',
                    color: '#666',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-body, Inter, sans-serif)',
                    transition: 'color 300ms ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#c9a84c';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = '#666';
                  }}
                >
                  {item.label}
                </a>
                {idx < arr.length - 1 && (
                  <span
                    aria-hidden="true"
                    style={{ color: '#333', fontSize: '0.75rem', userSelect: 'none' }}
                  >
                    |
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
