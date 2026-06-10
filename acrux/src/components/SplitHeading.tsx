'use client'

import { motion } from 'framer-motion'
import { CSSProperties } from 'react'

interface Props {
  text: string
  className?: string
  style?: CSSProperties
  baseDelay?: number
  stagger?: number
  as?: 'h1' | 'h2' | 'h3'
  viewport?: { margin?: string }
}

export function SplitHeading({
  text,
  className = '',
  style,
  baseDelay = 0,
  stagger = 0.1,
  as: Tag = 'h2',
  viewport = { margin: '-30px' },
}: Props) {
  const words = text.split(' ')

  return (
    <Tag className={className} style={style}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden', lineHeight: 'inherit' }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '108%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, ...viewport }}
            transition={{
              duration: 0.9,
              delay: baseDelay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  )
}
