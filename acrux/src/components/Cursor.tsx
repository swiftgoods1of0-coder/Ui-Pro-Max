'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

type CursorVariant = 'default' | 'pointer' | 'view'

export function Cursor() {
  const [visible, setVisible]   = useState(false)
  const [variant, setVariant]   = useState<CursorVariant>('default')
  const [clicking, setClicking] = useState(false)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const dotX  = useSpring(rawX, { stiffness: 750, damping: 34 })
  const dotY  = useSpring(rawY, { stiffness: 750, damping: 34 })
  const ringX = useSpring(rawX, { stiffness: 165, damping: 22 })
  const ringY = useSpring(rawY, { stiffness: 165, damping: 22 })
  // Spotlight — very slow/lazy
  const spotX = useSpring(rawX, { stiffness: 42, damping: 14 })
  const spotY = useSpring(rawY, { stiffness: 42, damping: 14 })

  const activeMagnetic = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      setVisible(true)

      const target = e.target as Element
      const magnetEl  = target.closest<HTMLElement>('[data-magnetic]')
      const isView    = !!target.closest('[data-cursor-view]')
      const isPointer = !!target.closest('a, button, [data-magnetic], [role="button"]')
      setVariant(isView ? 'view' : isPointer ? 'pointer' : 'default')

      if (activeMagnetic.current && activeMagnetic.current !== magnetEl) {
        activeMagnetic.current.style.transform  = 'translate(0px,0px)'
        activeMagnetic.current.style.transition = 'transform 0.65s cubic-bezier(0.22,1,0.36,1)'
        activeMagnetic.current = null
      }
      if (magnetEl) {
        activeMagnetic.current = magnetEl
        const r  = magnetEl.getBoundingClientRect()
        const dx = (e.clientX - (r.left + r.width  / 2)) * 0.3
        const dy = (e.clientY - (r.top  + r.height / 2)) * 0.3
        magnetEl.style.transform  = `translate(${dx}px,${dy}px)`
        magnetEl.style.transition = 'transform 0.12s ease-out'
      }
    }

    const resetMagnetic = () => {
      if (activeMagnetic.current) {
        activeMagnetic.current.style.transform  = 'translate(0px,0px)'
        activeMagnetic.current.style.transition = 'transform 0.65s cubic-bezier(0.22,1,0.36,1)'
        activeMagnetic.current = null
      }
    }

    const onLeave  = () => { setVisible(false); resetMagnetic() }
    const onEnter  = () => setVisible(true)
    const onDown   = () => setClicking(true)
    const onUp     = () => setClicking(false)

    window.addEventListener('mousemove',    onMove,  { passive: true })
    window.addEventListener('mousedown',    onDown)
    window.addEventListener('mouseup',      onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('mousemove',    onMove)
      window.removeEventListener('mousedown',    onDown)
      window.removeEventListener('mouseup',      onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [rawX, rawY])

  const ringD = variant === 'view' ? 88 : variant === 'pointer' ? 52 : 28

  return (
    <>
      {/* ── Page spotlight — large lazy ambient light ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          x: spotX,
          y: spotY,
          translateX: '-50%',
          translateY: '-50%',
          zIndex: 2,
          mixBlendMode: 'screen',
        }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 1.2 }}
      >
        <div
          style={{
            width: 900,
            height: 900,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20,60,220,0.09) 0%, rgba(0,30,120,0.03) 45%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* ── Outer ring ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          zIndex: 9997,
          mixBlendMode: variant === 'view' ? 'normal' : 'difference',
        }}
        animate={{ opacity: visible ? 1 : 0, width: ringD, height: ringD, scale: clicking ? 0.72 : 1 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        {variant === 'view' ? (
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <span style={{ fontSize: 9, letterSpacing: '0.18em', color: '#020508', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
              View
            </span>
          </div>
        ) : (
          <div className="w-full h-full rounded-full border border-white" />
        )}
      </motion.div>

      {/* ── Inner dot ── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%', zIndex: 9998 }}
        animate={{ opacity: visible && variant !== 'view' ? 1 : 0, scale: clicking ? 0.35 : 1 }}
        transition={{ duration: 0.15 }}
      >
        <div className="w-[5px] h-[5px] rounded-full bg-white" />
      </motion.div>
    </>
  )
}
