'use client';

import React, { useRef, useCallback } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LuxuryButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  'data-cursor'?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SIZE_CLASSES: Record<NonNullable<LuxuryButtonProps['size']>, string> = {
  sm: 'px-6 py-2 text-sm',
  md: 'px-10 py-4 text-base',
  lg: 'px-14 py-5 text-lg',
};

// ---------------------------------------------------------------------------
// Inline styles injected once into the document <head>
// We use a deterministic id so multiple mounts don't duplicate the tag.
// ---------------------------------------------------------------------------

const STYLE_ID = 'luxury-button-styles';

const BUTTON_CSS = `
/* ── Shared reset ─────────────────────────────────────────────── */
.lb-root {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  outline: none;
  white-space: nowrap;
  font-family: var(--font-impact, 'Bebas Neue', sans-serif);
  font-weight: 400;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  text-decoration: none;
  -webkit-font-smoothing: antialiased;
  transition: color 400ms cubic-bezier(0.25, 0.1, 0.25, 1),
              background-color 400ms cubic-bezier(0.25, 0.1, 0.25, 1),
              border-color 400ms cubic-bezier(0.25, 0.1, 0.25, 1),
              opacity 400ms cubic-bezier(0.25, 0.1, 0.25, 1);
  -webkit-tap-highlight-color: transparent;
}

/* ── Shimmer pseudo-element (primary & secondary) ─────────────── */
.lb-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    transparent 25%,
    rgba(201, 168, 76, 0.35) 45%,
    rgba(255, 235, 150, 0.55) 50%,
    rgba(201, 168, 76, 0.35) 55%,
    transparent 75%
  );
  background-size: 250% 100%;
  background-position: -200% center;
  transition: background-position 0ms;
  pointer-events: none;
  z-index: 1;
}
.lb-shimmer:hover::after,
.lb-shimmer:focus-visible::after {
  background-position: 200% center;
  transition: background-position 700ms cubic-bezier(0.25, 0.1, 0.25, 1);
}

/* ── Primary ──────────────────────────────────────────────────── */
.lb-primary {
  background-color: #0a0a0a;
  border: 1px solid #c9a84c;
  color: #c9a84c;
}
.lb-primary:hover,
.lb-primary:focus-visible {
  background-color: #c9a84c;
  color: #0a0a0a;
}

/* ── Secondary ────────────────────────────────────────────────── */
.lb-secondary {
  background-color: transparent;
  border: 1px solid #c9a84c;
  color: #c9a84c;
}
.lb-secondary:hover,
.lb-secondary:focus-visible {
  background-color: #c9a84c;
  color: #0a0a0a;
}

/* ── Ghost ────────────────────────────────────────────────────── */
.lb-ghost {
  background-color: transparent;
  border: none;
  color: #c9a84c;
}
/* Underline slide-in span */
.lb-ghost-inner {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.lb-ghost-inner::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: #c9a84c;
  transition: width 400ms cubic-bezier(0.25, 0.1, 0.25, 1);
}
.lb-ghost:hover .lb-ghost-inner::after,
.lb-ghost:focus-visible .lb-ghost-inner::after {
  width: 100%;
}

/* ── Outline ──────────────────────────────────────────────────── */
.lb-outline {
  background-color: transparent;
  border: 1px solid #e0e0e0;
  color: #f5f5f5;
}
.lb-outline:hover,
.lb-outline:focus-visible {
  background-color: #f5f5f5;
  color: #0a0a0a;
}

/* ── States ───────────────────────────────────────────────────── */
.lb-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
.lb-loading {
  pointer-events: none;
}

/* ── GSAP ripple ──────────────────────────────────────────────── */
.lb-ripple {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 2;
  transform: scale(0);
  opacity: 0.3;
  background: radial-gradient(circle, rgba(201, 168, 76, 0.6) 0%, transparent 70%);
}

/* ── Spinner ──────────────────────────────────────────────────── */
@keyframes lb-spin {
  to { transform: rotate(360deg); }
}
.lb-spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: lb-spin 0.7s linear infinite;
  flex-shrink: 0;
}

/* ── Content layer (above shimmer) ───────────────────────────── */
.lb-content {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
`;

// Inject styles exactly once (safe in SSR: runs only on client via useEffect substitute)
function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = BUTTON_CSS;
  document.head.appendChild(style);
}

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------

function Spinner() {
  return <span className="lb-spinner" aria-hidden="true" />;
}

// ---------------------------------------------------------------------------
// GSAP ripple helper
// ---------------------------------------------------------------------------

function triggerRipple(
  container: HTMLElement,
  clientX: number,
  clientY: number
) {
  const rect = container.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const diameter = Math.max(rect.width, rect.height) * 2;

  const ripple = document.createElement('span');
  ripple.className = 'lb-ripple';
  ripple.style.width = `${diameter}px`;
  ripple.style.height = `${diameter}px`;
  ripple.style.left = `${x - diameter / 2}px`;
  ripple.style.top = `${y - diameter / 2}px`;

  container.appendChild(ripple);

  gsap.to(ripple, {
    scale: 3,
    opacity: 0,
    duration: 0.7,
    ease: 'power2.out',
    onComplete: () => {
      ripple.parentNode?.removeChild(ripple);
    },
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LuxuryButton({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  'data-cursor': dataCursor,
}: LuxuryButtonProps) {
  // Inject CSS on first render (client-only, idempotent)
  const stylesInjected = useRef(false);
  if (!stylesInjected.current) {
    injectStyles();
    stylesInjected.current = true;
  }

  const containerRef = useRef<HTMLElement>(null);

  // ── Class composition ────────────────────────────────────────────────────
  const variantClass = `lb-${variant}`;
  const shimmerClass = variant === 'primary' || variant === 'secondary' ? 'lb-shimmer' : '';
  const sizeClass = SIZE_CLASSES[size];
  const stateClass = disabled ? 'lb-disabled' : loading ? 'lb-loading' : '';

  const rootClass = [
    'lb-root',
    variantClass,
    shimmerClass,
    sizeClass,
    stateClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // ── Click handler ────────────────────────────────────────────────────────
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || loading) return;

      const el = containerRef.current;
      if (el) {
        triggerRipple(el, e.clientX, e.clientY);
      }

      onClick?.(e);
    },
    [disabled, loading, onClick]
  );

  // ── Inner content ────────────────────────────────────────────────────────
  const iconLeft = icon && iconPosition === 'left' && !loading && (
    <span aria-hidden="true">{icon}</span>
  );
  const iconRight = icon && iconPosition === 'right' && !loading && (
    <span aria-hidden="true">{icon}</span>
  );
  const spinnerEl = loading && <Spinner />;

  // For ghost we use the special .lb-ghost-inner wrapper to animate the underline
  const innerContent =
    variant === 'ghost' ? (
      <span className="lb-ghost-inner">
        {spinnerEl || iconLeft}
        {children}
        {iconRight}
      </span>
    ) : (
      <span className="lb-content">
        {spinnerEl || iconLeft}
        {children}
        {iconRight}
      </span>
    );

  // ── Shared props ─────────────────────────────────────────────────────────
  const sharedProps = {
    className: rootClass,
    onClick: handleClick,
    'data-cursor': dataCursor,
  } as const;

  // ── Render as Link or button ─────────────────────────────────────────────
  if (href && !disabled && !loading) {
    return (
      <Link
        href={href}
        {...sharedProps}
        ref={containerRef as React.Ref<HTMLAnchorElement>}
        aria-disabled={disabled}
      >
        {innerContent}
      </Link>
    );
  }

  return (
    <button
      {...sharedProps}
      ref={containerRef as React.Ref<HTMLButtonElement>}
      type="button"
      disabled={disabled || loading}
      aria-busy={loading}
      aria-disabled={disabled}
    >
      {innerContent}
    </button>
  );
}

export default LuxuryButton;
