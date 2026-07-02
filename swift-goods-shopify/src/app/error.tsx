'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Swift Goods] Page error:', error)
  }, [error])

  return (
    <main
      style={{
        background: '#050505',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 40,
          height: 1,
          background: 'linear-gradient(to right, transparent, #c9a84c, transparent)',
          marginBottom: '2rem',
        }}
      />

      <span
        style={{
          fontFamily: 'var(--font-body, Inter, sans-serif)',
          fontSize: '0.6875rem',
          letterSpacing: '0.42em',
          textTransform: 'uppercase',
          color: '#c9a84c',
          fontWeight: 500,
          display: 'block',
          marginBottom: '1.5rem',
        }}
      >
        SOMETHING WENT WRONG
      </span>

      <h1
        style={{
          fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
          fontSize: 'clamp(3.5rem, 10vw, 7rem)',
          color: '#f5f5f5',
          lineHeight: 0.9,
          letterSpacing: '0.06em',
          margin: '0 0 1.5rem',
        }}
      >
        WE HIT A
        <br />
        SNAG
      </h1>

      <p
        style={{
          fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          fontStyle: 'italic',
          color: 'rgba(245,245,245,0.4)',
          maxWidth: 380,
          lineHeight: 1.6,
          marginBottom: '3rem',
        }}
      >
        An unexpected error occurred. Try refreshing or head back home.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <button
          type="button"
          onClick={reset}
          style={{
            fontFamily: 'var(--font-body, Inter, sans-serif)',
            fontSize: '0.6875rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: '#050505',
            background: 'linear-gradient(135deg, #c9a84c, #e6c870)',
            padding: '1rem 2.5rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          TRY AGAIN
        </button>

        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-body, Inter, sans-serif)',
            fontSize: '0.6875rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(245,245,245,0.5)',
            border: '1px solid rgba(255,255,255,0.12)',
            padding: '0.875rem 2.5rem',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          GO HOME
        </Link>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '3rem',
          fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
          fontSize: '0.75rem',
          letterSpacing: '0.35em',
          color: 'rgba(201,168,76,0.15)',
          textTransform: 'uppercase',
        }}
      >
        SWIFT GOODS — COMFORT IS LUXURY
      </div>
    </main>
  )
}
