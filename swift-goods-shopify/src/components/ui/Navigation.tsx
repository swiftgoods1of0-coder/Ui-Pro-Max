'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'COLLECTION', href: '/collection' },
  { label: 'LOOKBOOK', href: '/lookbook' },
  { label: 'BRAND', href: '/brand' },
  { label: 'EXCLUSIVE', href: '/exclusive' },
];

// SVG Icons
const CartIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const HamburgerIcon = ({ open }: { open: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <line
      x1="3"
      y1="6"
      x2="21"
      y2="6"
      style={{
        transformOrigin: 'center',
        transform: open ? 'translateY(6px) rotate(45deg)' : 'none',
        transition: 'transform 400ms cubic-bezier(0.76, 0, 0.24, 1)',
      }}
    />
    <line
      x1="3"
      y1="12"
      x2="21"
      y2="12"
      style={{
        opacity: open ? 0 : 1,
        transition: 'opacity 200ms ease',
      }}
    />
    <line
      x1="3"
      y1="18"
      x2="21"
      y2="18"
      style={{
        transformOrigin: 'center',
        transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none',
        transition: 'transform 400ms cubic-bezier(0.76, 0, 0.24, 1)',
      }}
    />
  </svg>
);

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const mobileOverlayRef = useRef<HTMLDivElement>(null);
  const mobileLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cartCount] = useState(0);
  const [activeLink, setActiveLink] = useState<string | null>(null);

  // Scroll handler
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    setScrolled(scrollY > 20);
    setScrollProgress(Math.min(progress, 100));
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // GSAP mount reveal
  useEffect(() => {
    if (!navRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Slide nav down from top
    tl.fromTo(
      navRef.current,
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, delay: 0.2 }
    );

    if (logoRef.current) {
      tl.fromTo(
        logoRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6 },
        '-=0.5'
      );
    }

    if (linksRef.current) {
      const linkItems = linksRef.current.querySelectorAll('li');
      tl.fromTo(
        linkItems,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
        '-=0.4'
      );
    }

    if (actionsRef.current) {
      tl.fromTo(
        actionsRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.6 },
        '-=0.5'
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  // Mobile overlay animation
  useEffect(() => {
    if (!mobileOverlayRef.current) return;

    if (mobileOpen) {
      gsap.fromTo(
        mobileOverlayRef.current,
        { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
        {
          opacity: 1,
          clipPath: 'inset(0 0 0% 0)',
          duration: 0.6,
          ease: 'power3.inOut',
        }
      );

      const validLinks = mobileLinksRef.current.filter(Boolean);
      gsap.fromTo(
        validLinks,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out', delay: 0.2 }
      );

      document.body.style.overflow = 'hidden';
    } else {
      gsap.to(mobileOverlayRef.current, {
        opacity: 0,
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.45,
        ease: 'power3.inOut',
      });

      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  // Cleanup overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav
        ref={navRef}
        role="navigation"
        aria-label="Main navigation"
        className={[
          'fixed top-0 left-0 right-0 z-[100]',
          'transition-all duration-500',
          scrolled
            ? 'bg-[rgba(10,10,10,0.88)] backdrop-blur-[18px] border-b border-[rgba(201,168,76,0.12)]'
            : 'bg-transparent',
        ].join(' ')}
        style={{ opacity: 0 /* GSAP will animate this in */ }}
      >
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex items-center justify-between h-[72px] md:h-[80px]">

            {/* LEFT: Wordmark */}
            <Link
              ref={logoRef}
              href="/"
              aria-label="Swift Goods — Home"
              className="group relative flex-shrink-0"
              style={{ opacity: 0 }}
            >
              <span
                className={[
                  'text-xl md:text-2xl tracking-[0.3em] font-bold select-none',
                  'transition-all duration-400',
                  'bg-clip-text text-transparent',
                  'bg-gradient-to-r from-[#f5f5f5] via-[#f5f5f5] to-[#f5f5f5]',
                  'group-hover:from-[#c9a84c] group-hover:via-[#e8d28a] group-hover:to-[#c9a84c]',
                ].join(' ')}
                style={{
                  fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                }}
              >
                SWIFT GOODS
              </span>
              <span
                className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-400 ease-[cubic-bezier(0.76,0,0.24,1)]"
                style={{ background: 'linear-gradient(90deg, #c9a84c, #e8d28a, #c9a84c)' }}
              />
            </Link>

            {/* CENTER: Nav links (desktop) */}
            <ul
              ref={linksRef}
              className="hidden lg:flex items-center gap-8 xl:gap-12 list-none m-0 p-0"
              role="list"
            >
              {NAV_LINKS.map((link) => (
                <li key={link.href} role="listitem">
                  <Link
                    href={link.href}
                    className="group relative flex flex-col items-center"
                    onMouseEnter={() => setActiveLink(link.href)}
                    onMouseLeave={() => setActiveLink(null)}
                    onClick={closeMobile}
                  >
                    <span
                      className={[
                        'text-xs tracking-[0.22em] transition-colors duration-300',
                        activeLink === link.href ? 'text-[#c9a84c]' : 'text-[#f5f5f5]',
                      ].join(' ')}
                      style={{
                        fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                      }}
                    >
                      {link.label}
                    </span>
                    {/* Underline slide animation */}
                    <span
                      className="absolute -bottom-1 left-0 h-px transition-all duration-400 ease-[cubic-bezier(0.76,0,0.24,1)]"
                      style={{
                        background: 'linear-gradient(90deg, #c9a84c, #e8d28a)',
                        width: activeLink === link.href ? '100%' : '0%',
                      }}
                    />
                  </Link>
                </li>
              ))}
            </ul>

            {/* RIGHT: Actions */}
            <div
              ref={actionsRef}
              className="flex items-center gap-5"
              style={{ opacity: 0 }}
            >
              {/* Search */}
              <button
                aria-label="Search"
                className={[
                  'hidden sm:flex items-center justify-center w-9 h-9',
                  'text-[#f5f5f5] hover:text-[#c9a84c]',
                  'transition-colors duration-300',
                  'cursor-pointer',
                ].join(' ')}
              >
                <SearchIcon />
              </button>

              {/* Cart */}
              <button
                aria-label={`Cart — ${cartCount} items`}
                className={[
                  'relative flex items-center justify-center w-9 h-9',
                  'text-[#f5f5f5] hover:text-[#c9a84c]',
                  'transition-colors duration-300',
                  'cursor-pointer',
                ].join(' ')}
              >
                <CartIcon />
                {cartCount >= 0 && (
                  <span
                    className={[
                      'absolute -top-1.5 -right-1.5',
                      'flex items-center justify-center',
                      'w-4 h-4 rounded-full',
                      'text-[10px] font-semibold text-[#0a0a0a]',
                      'bg-[#c9a84c]',
                    ].join(' ')}
                    aria-hidden="true"
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Hamburger (mobile) */}
              <button
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                className={[
                  'flex lg:hidden items-center justify-center w-9 h-9',
                  'text-[#f5f5f5] hover:text-[#c9a84c]',
                  'transition-colors duration-300',
                  'cursor-pointer',
                ].join(' ')}
                onClick={() => setMobileOpen((prev) => !prev)}
              >
                <HamburgerIcon open={mobileOpen} />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll progress bar */}
        <div
          className="absolute bottom-0 left-0 h-[2px] pointer-events-none"
          style={{
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, #c9a84c, #e8d28a, #c9a84c)',
            transition: 'width 80ms linear',
            opacity: scrolled ? 1 : 0,
          }}
          ref={progressRef}
          aria-hidden="true"
        />
      </nav>

      {/* Mobile fullscreen overlay */}
      <div
        id="mobile-menu"
        ref={mobileOverlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className={[
          'fixed inset-0 z-[99] flex flex-col items-center justify-center',
          'lg:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
        ].join(' ')}
        style={{
          background: 'rgba(10,10,10,0.97)',
          backdropFilter: 'blur(24px)',
          opacity: 0,
          clipPath: 'inset(0 0 100% 0)',
        }}
      >
        {/* Gold top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)' }}
          aria-hidden="true"
        />

        <ul
          className="flex flex-col items-center gap-10 list-none m-0 p-0"
          role="list"
        >
          {NAV_LINKS.map((link, i) => (
            <li key={link.href} role="listitem">
              <Link
                href={link.href}
                ref={(el) => { mobileLinksRef.current[i] = el; }}
                onClick={closeMobile}
                className="group relative flex flex-col items-center"
              >
                <span
                  className="text-4xl sm:text-5xl tracking-[0.25em] text-[#f5f5f5] group-hover:text-[#c9a84c] transition-colors duration-300"
                  style={{
                    fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                  }}
                >
                  {link.label}
                </span>
                <span
                  className="mt-1 h-px w-0 group-hover:w-full transition-all duration-400 ease-[cubic-bezier(0.76,0,0.24,1)]"
                  style={{ background: 'linear-gradient(90deg, #c9a84c, #e8d28a, #c9a84c)' }}
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* Bottom brand statement */}
        <p
          className="absolute bottom-12 text-xs tracking-[0.3em] text-[rgba(245,245,245,0.3)]"
          style={{ fontFamily: 'var(--font-body, Inter, sans-serif)' }}
        >
          COMFORT IS LUXURY.
        </p>
      </div>
    </>
  );
}
