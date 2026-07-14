

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Link } from '@remix-run/react';

import TextScramble from '@/components/ui/TextScramble';
import { useCart } from '@/context/CartContext';

// ---------------------------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------------------------

interface NavLink {
  label: string;
  href: string;
}

interface NavigationProps {
  cartCount?: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const NAV_LINKS: NavLink[] = [
  { label: 'SHOP', href: '/collections' },
  { label: 'NEW ARRIVALS', href: '/collections/new-arrivals' },
  { label: 'LOOKBOOK', href: '/collections' },
  { label: 'THE BRAND', href: '#craftsmanship' },
];

const COLORS = {
  black: '#0a0a0a',
  gold: '#c9a84c',
  goldLight: '#e8d28a',
  platinum: '#e0e0e0',
  graphite: '#1e1e1e',
  text: '#f5f5f5',
} as const;

// 400ms luxury easing consistent across all transitions
const LUXURY_EASE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
const LUXURY_EASE_OUT = 'cubic-bezier(0.76, 0, 0.24, 1)';

// ---------------------------------------------------------------------------
// SVG Icons
// ---------------------------------------------------------------------------

function CartIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
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
}

function SearchIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
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
}

function HamburgerIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// LogoText — Emblem + "SWIFT GOODS" wordmark with gold gradient on hover
// ---------------------------------------------------------------------------

function LogoText() {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to="/"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Swift Goods — Home"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Winged S emblem — transparent PNG, no background */}
      <img
        src="/brand/sg-winged-s-transparent.png"
        alt=""
        width={28}
        height={28}
        style={{
          objectFit: 'contain',
          opacity: hovered ? 0.9 : 0.85,
          transition: `opacity 400ms ${LUXURY_EASE}`,
        }}
      />
      {/* Wordmark text */}
      <span
        style={{
          fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
          fontSize: '1.4rem',
          letterSpacing: '0.3em',
          color: hovered ? COLORS.gold : COLORS.text,
          transition: `color 400ms ${LUXURY_EASE}`,
        }}
      >
        SWIFT GOODS
      </span>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// DesktopNavLink — with gold underline slide-in animation on hover
// ---------------------------------------------------------------------------

function DesktopNavLink({ link }: { link: NavLink }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={link.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        textDecoration: 'none',
        paddingBottom: '4px',
        cursor: 'pointer',
        display: 'inline-block',
      }}
    >
      <TextScramble
        speed={25}
        revealDelay={40}
        style={{
          fontFamily: 'var(--font-body, Inter, sans-serif)',
          fontSize: '0.8rem',
          fontWeight: 500,
          letterSpacing: '0.18em',
          color: hovered ? COLORS.gold : COLORS.platinum,
          whiteSpace: 'nowrap',
          transition: `color 400ms ${LUXURY_EASE}`,
        }}
      >
        {link.label}
      </TextScramble>
      {/* Underline slide animation */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '1px',
          display: 'block',
          width: hovered ? '100%' : '0%',
          background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight}, ${COLORS.gold})`,
          transition: `width 400ms ${LUXURY_EASE_OUT}`,
        }}
      />
    </Link>
  );
}

// ---------------------------------------------------------------------------
// IconButton — icon wrapper with gold hover
// ---------------------------------------------------------------------------

interface IconButtonProps {
  onClick?: () => void;
  href?: string;
  ariaLabel: string;
  children: React.ReactNode;
}

function IconButton({ onClick, href, ariaLabel, children }: IconButtonProps) {
  const [hovered, setHovered] = useState(false);

  const sharedStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    color: hovered ? COLORS.gold : COLORS.text,
    transition: `color 400ms ${LUXURY_EASE}`,
    position: 'relative',
    flexShrink: 0,
  };

  if (href) {
    return (
      <Link
        to={href}
        aria-label={ariaLabel}
        style={{ ...sharedStyle, textDecoration: 'none' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      style={sharedStyle}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// CartButton — icon button with badge overlay
// ---------------------------------------------------------------------------

function CartButton({ count, onClick }: { count: number; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Cart, ${count} item${count !== 1 ? 's' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        position: 'relative',
        color: hovered ? COLORS.gold : COLORS.text,
        transition: `color 400ms ${LUXURY_EASE}`,
        flexShrink: 0,
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CartIcon />
      {/* Badge only rendered when cart has items */}
      {count > 0 && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            backgroundColor: COLORS.gold,
            color: COLORS.black,
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontFamily: 'var(--font-body, Inter, sans-serif)',
            fontWeight: 700,
            lineHeight: 1,
            pointerEvents: 'none',
            letterSpacing: 0,
          }}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// framer-motion variants for mobile overlay
// ---------------------------------------------------------------------------

const overlayVariants = {
  hidden: {
    opacity: 0,
    clipPath: 'inset(0 0 100% 0)',
    transition: {
      duration: 0.45,
      ease: [0.76, 0, 0.24, 1],
    },
  },
  visible: {
    opacity: 1,
    clipPath: 'inset(0 0 0% 0)',
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    clipPath: 'inset(0 0 100% 0)',
    transition: {
      duration: 0.45,
      ease: [0.76, 0, 0.24, 1],
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

const mobileLinkVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.25, ease: [0.76, 0, 0.24, 1] },
  },
};

// ---------------------------------------------------------------------------
// MobileLinkItem — large stacked link for overlay
// ---------------------------------------------------------------------------

function MobileLinkItem({ link, onClose }: { link: NavLink; onClose: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div variants={mobileLinkVariants} style={{ textAlign: 'center' }}>
      <Link
        to={link.href}
        onClick={onClose}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onTouchStart={() => setHovered(true)}
        onTouchEnd={() => setHovered(false)}
        style={{
          display: 'inline-block',
          fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          letterSpacing: '0.25em',
          textDecoration: 'none',
          cursor: 'pointer',
          userSelect: 'none',
          color: hovered ? COLORS.gold : COLORS.text,
          transition: `color 300ms ease`,
        }}
      >
        {link.label}
      </Link>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// MobileMenu — framer-motion fullscreen overlay
// ---------------------------------------------------------------------------

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount: number;
}

function MobileMenu({ isOpen, onClose, cartCount }: MobileMenuProps) {
  // Lock body scroll while menu is open.
  // Delay the unlock by the exit animation duration (450ms) so scroll
  // doesn't re-enable while the overlay is still visually covering the screen.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      // Delay re-enabling scroll until after the exit animation (450ms)
      setTimeout(() => { document.body.style.overflow = prev; }, 450);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            backgroundColor: COLORS.black,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2.5rem',
          }}
        >
          {/* Top gold accent line */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
            }}
          />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '2rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: COLORS.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.25rem',
              transition: `color 400ms ${LUXURY_EASE}`,
            }}
          >
            <CloseIcon />
          </button>

          {/* Logo in overlay */}
          <motion.div variants={mobileLinkVariants}>
            <span
              style={{
                fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                fontSize: '1.1rem',
                letterSpacing: '0.3em',
                color: COLORS.gold,
                userSelect: 'none',
                display: 'block',
              }}
            >
              SWIFT GOODS
            </span>
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={mobileLinkVariants}
            style={{
              width: '36px',
              height: '1px',
              backgroundColor: `rgba(201,168,76,0.4)`,
            }}
          />

          {/* Nav links stacked vertically */}
          {NAV_LINKS.map((link) => (
            <MobileLinkItem key={link.label} link={link} onClose={onClose} />
          ))}

          {/* Cart row */}
          <motion.div variants={mobileLinkVariants}>
            <button
              type="button"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                color: COLORS.platinum,
                fontFamily: 'var(--font-body, Inter, sans-serif)',
                fontSize: '0.875rem',
                letterSpacing: '0.18em',
                transition: `color 400ms ${LUXURY_EASE}`,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <CartIcon size={18} />
              <span>CART {cartCount > 0 ? `(${cartCount})` : '(0)'}</span>
            </button>
          </motion.div>

          {/* Brand tagline */}
          <p
            style={{
              position: 'absolute',
              bottom: '3rem',
              fontFamily: 'var(--font-body, Inter, sans-serif)',
              fontSize: '0.75rem',
              letterSpacing: '0.3em',
              color: 'rgba(245,245,245,0.25)',
              margin: 0,
              userSelect: 'none',
            }}
          >
            COMFORT IS LUXURY.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Navigation — main exported component
// ---------------------------------------------------------------------------

export default function Navigation({ cartCount: cartCountProp }: NavigationProps) {
  const cart = useCart();
  const cartCount = cartCountProp ?? cart.totalQuantity;
  const navRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ticking = useRef(false);

  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  // ---- Scroll tracking (RAF-throttled) -------------------------------------
  const handleScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 20);
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${docH > 0 ? Math.min(100, (y / docH) * 100) : 0}%`;
      }

      // Smart hide: hide on scroll down past 200px, show on scroll up
      if (y > 200 && y > lastScrollY.current + 5) {
        setNavHidden(true);
      } else if (y < lastScrollY.current - 5) {
        setNavHidden(false);
      }
      lastScrollY.current = y;

      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Nav fades in via CSS — no GSAP dependency, works on all devices instantly

  // ---- Close mobile menu on desktop resize ---------------------------------
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024 && mobileOpen) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const openMobile = useCallback(() => setMobileOpen(true), []);

  // ---- Render --------------------------------------------------------------
  return (
    <>
      <nav
        ref={navRef}
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          width: '100%',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          transform: navHidden ? 'translateY(-100%)' : 'translateY(0)',
          backgroundColor: scrolled ? 'rgba(10,10,10,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(200%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(200%)' : 'none',
          borderBottom: scrolled
            ? `1px solid rgba(201,168,76,0.13)`
            : '1px solid transparent',
          transition: `background-color 400ms ${LUXURY_EASE}, backdrop-filter 400ms ${LUXURY_EASE}, border-color 400ms ${LUXURY_EASE}, transform 400ms ${LUXURY_EASE}`,
          animation: 'sg-nav-fadein 0.4s ease both',
        }}
      >
        {/* ---- LEFT: Logo -------------------------------------------------- */}
        <div style={{ flex: '1 1 0', display: 'flex', alignItems: 'center' }}>
          <LogoText />
        </div>

        {/* ---- CENTER: Desktop nav links (hidden on mobile via media query) - */}
        <div
          className="nav-links-desktop"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2.5rem',
          }}
        >
          {NAV_LINKS.map((link) => (
            <DesktopNavLink key={link.href} link={link} />
          ))}
        </div>

        {/* ---- RIGHT: Actions ---------------------------------------------- */}
        <div
          style={{
            flex: '1 1 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
          }}
        >
          {/* Search */}
          <IconButton ariaLabel="Search">
            <SearchIcon />
          </IconButton>

          {/* Cart with badge */}
          <CartButton count={cartCount} onClick={cart.openCart} />

          {/* Hamburger — visible on mobile only */}
          <div className="hamburger-btn">
            <IconButton
              ariaLabel={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={openMobile}
            >
              <HamburgerIcon />
            </IconButton>
          </div>
        </div>

        {/* ---- Scroll progress bar (2px gold line at bottom of nav) -------- */}
        <div
          ref={progressBarRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '2px',
            pointerEvents: 'none',
            width: '0%',
            background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight}, ${COLORS.gold})`,
            boxShadow: '0 0 10px rgba(201,168,76,0.3)',
            transition: 'width 80ms linear',
          }}
        />
      </nav>

      {/* ---- Mobile fullscreen overlay (framer-motion) -------------------- */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={closeMobile}
        cartCount={cartCount}
      />
    </>
  );
}
