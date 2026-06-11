'use client'

import { useEffect } from 'react'
import { useScroll, useVelocity } from 'framer-motion'

export function ScrollVelocityBlur() {
  const { scrollY } = useScroll()
  const velocity    = useVelocity(scrollY)

  useEffect(() => {
    const unsub = velocity.on('change', v => {
      const blur = Math.min(Math.abs(v) / 800, 1) * 2.5 // max 2.5px blur
      document.documentElement.style.setProperty('--scroll-blur', `${blur.toFixed(2)}px`)
    })
    return unsub
  }, [velocity])

  return null
}
