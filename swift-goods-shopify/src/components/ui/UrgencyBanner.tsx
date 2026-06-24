'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

const INITIAL_PERCENT = 68;
const MAX_PERCENT = 89;
const INCREMENT_INTERVAL_MS = 3000;
const MOUNT_DELAY_MS = 3000;
const PRODUCT_NAME = 'THE SHORTS';

function FlameIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M12 23C7.58 23 4 19.42 4 15c0-3.17 1.86-6.04 3.47-8.03a.75.75 0 0 1 1.26.2c.54 1.3 1.45 2.4 2.56 3.2C11.74 7.52 12 4.25 12 2a.75.75 0 0 1 1.3-.52C16.08 4.27 20 9.05 20 15c0 4.42-3.58 8-8 8z"
        fill="#e8842c"
      />
      <path
        d="M12 23c-2.21 0-4-2.24-4-5 0-2.05 1.12-3.55 2.23-4.52a.5.5 0 0 1 .84.32c.08.71.38 1.37.83 1.9.14-1.24.55-2.93 1.6-4.2a.5.5 0 0 1 .87.13C15.21 13.72 16 15.26 16 18c0 2.76-1.79 5-4 5z"
        fill="#f5b731"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function UrgencyBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [shown, setShown] = useState(false);
  const [percent, setPercent] = useState(INITIAL_PERCENT);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Slide-up after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      // Small delay so the transition triggers after the element is in the DOM
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setShown(true);
        });
      });
    }, MOUNT_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  // Percentage increment
  useEffect(() => {
    if (!shown) return;

    intervalRef.current = setInterval(() => {
      setPercent((prev) => {
        if (prev >= MAX_PERCENT) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return MAX_PERCENT;
        }
        return prev + 1;
      });
    }, INCREMENT_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [shown]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  // Don't render at all until it's time, and not after dismissed
  if (!visible || dismissed) return null;

  return (
    <div
      role="complementary"
      aria-label="Limited stock notification"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        height: 48,
        background: 'rgba(10,10,10,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(201,168,76,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        pointerEvents: 'auto',
        transform: shown ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          maxWidth: 1200,
          padding: '0 16px',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Pulsing gold dot */}
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#c9a84c',
            flexShrink: 0,
            animation: 'pulse-gold 2s ease-in-out infinite',
          }}
          aria-hidden="true"
        />

        {/* Message text */}
        <span
          style={{
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {/* Full text for desktop */}
          <span className="urgency-banner-full">
            <FlameIcon />{' '}
            {PRODUCT_NAME} just dropped &mdash;{' '}
            <span style={{ color: '#c9a84c', fontWeight: 600 }}>
              {percent}% claimed
            </span>
          </span>
          {/* Short text for mobile */}
          <span className="urgency-banner-short">
            {PRODUCT_NAME} &mdash;{' '}
            <span style={{ color: '#c9a84c', fontWeight: 600 }}>
              {percent}% claimed
            </span>
          </span>
        </span>

        {/* Shop Now CTA */}
        <Link
          href="/collections/shorts"
          style={{
            color: '#c9a84c',
            fontSize: '0.6875rem',
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = '0.75';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = '1';
          }}
        >
          SHOP NOW &rarr;
        </Link>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          aria-label="Dismiss notification"
          style={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer',
            padding: 4,
            lineHeight: 1,
            fontSize: '1rem',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)';
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
