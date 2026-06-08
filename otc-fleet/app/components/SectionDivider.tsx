'use client'

import { motion } from 'framer-motion'

interface Props {
  number: string
  label: string
  dark?: boolean
}

export default function SectionDivider({ number, label, dark = false }: Props) {
  return (
    <div style={{ backgroundColor: dark ? '#111111' : '#0a0a0a' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-5">

        {/* Section number */}
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-black tabular-nums flex-shrink-0"
          style={{ color: '#FFD400', letterSpacing: '0.2em', opacity: 0.6 }}
        >
          {number}
        </motion.span>

        {/* Line left */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 h-px origin-left"
          style={{ backgroundColor: 'rgba(255,212,0,0.15)' }}
        />

        {/* Label */}
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-xs font-bold uppercase tracking-[0.25em] flex-shrink-0"
          style={{ color: '#475569' }}
        >
          {label}
        </motion.span>

        {/* Line right short */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-10 h-px origin-left flex-shrink-0"
          style={{ backgroundColor: 'rgba(255,212,0,0.15)' }}
        />

        {/* Gold dot */}
        <div
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: '#FFD400' }}
        />
      </div>
    </div>
  )
}
