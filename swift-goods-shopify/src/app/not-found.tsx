import Link from 'next/link'

export default function NotFound() {
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
      {/* Gold accent line */}
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
        ERROR 404
      </span>

      <h1
        style={{
          fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
          fontSize: 'clamp(4rem, 12vw, 9rem)',
          color: '#f5f5f5',
          lineHeight: 0.9,
          letterSpacing: '0.06em',
          margin: '0 0 1.5rem',
          textShadow: '0 4px 60px rgba(201,168,76,0.08)',
        }}
      >
        PAGE NOT
        <br />
        FOUND
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
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-body, Inter, sans-serif)',
            fontSize: '0.6875rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: '#050505',
            background: 'linear-gradient(135deg, #c9a84c, #e6c870)',
            padding: '1rem 2.5rem',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          GO HOME
        </Link>

        <Link
          href="/collections"
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
            transition: 'border-color 0.3s',
          }}
        >
          SHOP ALL
        </Link>
      </div>

      {/* Bottom accent */}
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
