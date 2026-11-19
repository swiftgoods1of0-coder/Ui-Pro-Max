'use client'

const ITEMS = [
  { text: 'HOLIDAY COLLECTION NOW LIVE', accent: false },
  { text: '◆', accent: true },
  { text: 'NEW ARRIVALS — SHOP NOW', accent: false },
  { text: '◆', accent: true },
  { text: 'SWIFT GOODS — EST. 2025', accent: false },
  { text: '◆', accent: true },
  { text: 'GIFT THE SEASON IN STYLE', accent: false },
  { text: '◆', accent: true },
  { text: 'FREE SHIPPING ON ORDERS $100+', accent: false },
  { text: '◆', accent: true },
]

export default function AnnouncementBar() {
  return (
    <div
      className="relative w-full overflow-hidden z-50"
      style={{
        background: 'linear-gradient(90deg, #050505 0%, #120808 40%, #0a0505 60%, #050505 100%)',
        borderBottom: '1px solid rgba(140,26,26,0.3)',
        height: '36px',
      }}
    >
      {/* Left fade */}
      <div
        className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
        style={{ width: 48, background: 'linear-gradient(to right, #050505, transparent)' }}
      />
      {/* Right fade */}
      <div
        className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
        style={{ width: 48, background: 'linear-gradient(to left, #050505, transparent)' }}
      />

      {/* Scrolling track — duplicated for seamless loop */}
      <div
        className="flex items-center h-full"
        style={{
          width: 'max-content',
          animation: 'sg-marquee 28s linear infinite',
          gap: '2.5rem',
        }}
      >
        {[0, 1].map((pass) => (
          <span key={pass} className="flex items-center gap-10 pr-10">
            {ITEMS.map((item, i) => (
              <span
                key={i}
                style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: item.accent ? '0.4rem' : '0.6rem',
                  letterSpacing: item.accent ? '0' : '0.38em',
                  textTransform: 'uppercase',
                  color: item.accent ? '#8C1A1A' : 'rgba(201,168,76,0.75)',
                  whiteSpace: 'nowrap',
                  fontWeight: 500,
                }}
              >
                {item.text}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}
