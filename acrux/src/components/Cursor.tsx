'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export function Cursor() {
  const [visible, setVisible] = useState(false)
  const [isPointer, setIsPointer] = useState(false)
  const [clicking, setClicking] = useState(false)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  // Cursor dot — snappy
  const dotX = useSpring(rawX, { stiffness: 700, damping: 32 })
  const dotY = useSpring(rawY, { stiffness: 700, damping: 32 })

  // Ring — laggy for trail effect
  const ringX = useSpring(rawX, { stiffness: 180, damping: 22 })
  const ringY = useSpring(rawY, { stiffness: 180, damping: 22 })

  // Light source — very laggy
  const lightX = useSpring(rawX, { stiffness: 80, damping: 18 })
  const lightY = useSpring(rawY, { stiffness: 80, damping: 18 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      setVisible(true)

      const el = e.target as Element
      setIsPointer(!!el.closest('a, button, [data-magnetic], [role="button"]'))
    }
    const onLeave  = () => setVisible(false)
    const onDown   = () => setClicking(true)
    const onUp     = () => setClicking(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', () => setVisible(true))
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [rawX, rawY])

  return (
    <>
      {/* Ambient light halo — follows lazily */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[1]"
        style={{ x: lightX, y: lightY, translateX: '-50%', translateY: '-50%', opacity: visible ? 1 : 0 }}
      >
        <div className="w-[360px] h-[360px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,102,255,0.055) 0%, transparent 72%)' }} />
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997] mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: isPointer ? 2 : clicking ? 0.6 : 1,
          width: isPointer ? 44 : 28,
          height: isPointer ? 44 : 28,
        }}
        transition={{ duration: 0.25 }}
      >
        <div
          className="rounded-full border border-white"
          style={{ width: '100%', height: '100%' }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible ? 1 : 0, scale: clicking ? 0.4 : 1 }}
      >
        <div className="w-[5px] h-[5px] rounded-full bg-white" />
      </motion.div>
    </>
  )
}
