'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => setVisible(v > 0.01))
    return unsub
  }, [scrollYProgress])

  if (!visible) return null

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[9999] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #C4922A, #E8C547, #C4922A)',
      }}
    />
  )
}
