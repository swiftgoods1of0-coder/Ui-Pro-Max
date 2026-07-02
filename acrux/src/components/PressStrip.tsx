'use client'

import { motion } from 'framer-motion'

const STACK = [
  { name: 'Next.js',        note: 'App Router · RSC'     },
  { name: 'React',          note: 'v19 · Server + Client' },
  { name: 'TypeScript',     note: 'Strict mode'           },
  { name: 'Three.js',       note: 'WebGL · GLSL shaders'  },
  { name: 'Framer Motion',  note: 'Animations'            },
  { name: 'GSAP',           note: 'ScrollTrigger'         },
  { name: 'Tailwind CSS',   note: 'Utility-first'         },
  { name: 'Shopify',        note: 'Custom themes'         },
  { name: 'Vercel',         note: 'Edge + CDN'            },
  { name: 'Figma',          note: 'Design → handoff'      },
]

export function PressStrip() {
  // Duplicate for seamless marquee
  const items = [...STACK, ...STACK]

  return (
    <section className="py-12 border-y border-[rgba(0,102,255,0.08)] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_100%_at_50%_50%,rgba(0,30,100,0.05)_0%,transparent_70%)]" />

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-center gap-3 mb-8"
      >
        <div className="w-8 h-px bg-gradient-to-r from-transparent to-[rgba(0,102,255,0.5)]" />
        <span className="text-[var(--color-muted)] text-[10px] font-semibold tracking-[0.45em] uppercase">
          Built With
        </span>
        <div className="w-8 h-px bg-gradient-to-l from-transparent to-[rgba(0,102,255,0.5)]" />
      </motion.div>

      {/* Scrolling marquee */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg,var(--color-bg),transparent)' }} />
        <div className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(-90deg,var(--color-bg),transparent)' }} />

        <div className="flex" style={{ animation: 'marquee 36s linear infinite' }}>
          {items.map((item, i) => (
            <div
              key={i}
              className="shrink-0 flex items-center gap-3 mx-4 px-5 py-3 rounded-full border border-[var(--color-border)] bg-[rgba(4,16,36,0.5)]"
            >
              <span className="font-heading font-semibold text-white text-sm whitespace-nowrap">
                {item.name}
              </span>
              <span className="text-[var(--color-muted)] text-[10px] whitespace-nowrap hidden sm:block">
                {item.note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
