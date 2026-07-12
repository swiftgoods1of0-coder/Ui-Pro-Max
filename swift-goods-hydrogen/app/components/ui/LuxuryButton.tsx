

import React, { useRef, useCallback, useEffect } from 'react';
import { Link } from '@remix-run/react';
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
): gsap.core.Tween {
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

  return gsap.to(ripple, {
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
  const containerRef = useRef<HTMLElement>(null);
  // Track in-flight ripple tweens so we can kill them on unmount
  const rippleTweens = useRef<gsap.core.Tween[]>([]);
  useEffect(() => () => { rippleTweens.current.forEach((t) => t.kill()); }, []);

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
        const tween = triggerRipple(el, e.clientX, e.clientY);
        rippleTweens.current.push(tween);
        // Prune completed tweens to prevent unbounded growth
        rippleTweens.current = rippleTweens.current.filter((t) => t.isActive());
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
