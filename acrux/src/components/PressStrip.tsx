'use client'

import { motion } from 'framer-motion'

const PRESS = [
  { name: 'Awwwards',          detail: 'Site of the Day Nominee'  },
  { name: 'Smashing Magazine', detail: 'Featured Resource'        },
  { name: 'CSS Design Awards', detail: 'Special Kudos'            },
  { name: 'Clutch',            detail: '5.0 · Top Agency 2024'   },
  { name: 'Webflow Showcase',  detail: 'Featured Project'         },
  { name: '.net Magazine',     detail: 'Agency to Watch'          },
]

export function PressStrip() {
  return (
    <section className="py-14 border-y border-[rgba(0,102,255,0.08)] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_100%_at_50%_50%,rgba(0,30,100,0.06)_0%,transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-[rgba(0,102,255,0.5)]" />
          <span className="text-[var(--color-muted)] text-[10px] font-semibold tracking-[0.45em] uppercase">
            Featured In &amp; Recognised By
          </span>
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-[rgba(0,102,255,0.5)]" />
        </motion.div>

        {/* Logos grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {PRESS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card rounded-xl p-4 flex flex-col items-center text-center gap-2 group hover:border-[rgba(0,102,255,0.25)] transition-colors duration-300"
            >
              <div className="font-heading font-bold text-sm text-white group-hover:text-gradient-blue transition-colors leading-tight">
                {p.name}
              </div>
              <div className="text-[var(--color-muted)] text-[10px] leading-snug">{p.detail}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
