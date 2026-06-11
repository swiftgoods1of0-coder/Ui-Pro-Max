import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#020508' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,60,200,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Top dot-grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(100,160,255,1) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 text-center px-6">
        {/* Giant 404 */}
        <div
          className="font-heading font-bold leading-none select-none mb-6"
          style={{
            fontSize: 'clamp(8rem, 25vw, 20rem)',
            background:
              'linear-gradient(130deg, rgba(255,255,255,0.06) 0%, rgba(0,80,255,0.08) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.04em',
          }}
        >
          404
        </div>

        <div className="w-32 h-px mx-auto mb-8 bg-gradient-to-r from-transparent via-[rgba(0,102,255,0.5)] to-transparent" />

        <h1
          className="font-heading font-bold text-white mb-4 leading-tight"
          style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)' }}
        >
          This page got lost in space.
        </h1>

        <p className="text-[var(--color-muted)] text-base max-w-sm mx-auto mb-10 leading-relaxed">
          Whatever you were looking for, it&apos;s not here. Head back — the good
          stuff is on the homepage.
        </p>

        <Link
          href="/"
          className="btn-primary inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-sm tracking-wide relative overflow-hidden group"
        >
          <span className="relative z-10">← Back to ACRUX</span>
          <span className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
        </Link>
      </div>
    </main>
  )
}
