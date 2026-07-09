

import { useEffect, useRef, useCallback } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'

interface TextScrambleProps extends React.HTMLAttributes<HTMLElement> {
  children: string
  className?: string
  style?: React.CSSProperties
  as?: 'span' | 'a' | 'p'
  speed?: number
  revealDelay?: number
}

export default function TextScramble({
  children,
  className,
  style,
  as: Tag = 'span',
  speed = 30,
  revealDelay = 50,
  ...rest
}: TextScrambleProps) {
  const containerRef = useRef<HTMLElement | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const resolvedRef = useRef<boolean[]>([])

  const clearTimers = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    for (const t of timeoutsRef.current) {
      clearTimeout(t)
    }
    timeoutsRef.current = []
  }, [])

  const setText = useCallback((text: string) => {
    const el = containerRef.current
    if (!el) return
    const spans = el.querySelectorAll<HTMLSpanElement>('[data-scramble-char]')
    for (let i = 0; i < spans.length && i < text.length; i++) {
      spans[i].textContent = text[i]
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    const original = children
    if (!original) return

    clearTimers()

    resolvedRef.current = original.split('').map((ch) => ch === ' ')

    intervalRef.current = setInterval(() => {
      const next = original
        .split('')
        .map((ch, i) => {
          if (resolvedRef.current[i]) return ch
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join('')
      setText(next)
    }, speed)

    for (let i = 0; i < original.length; i++) {
      if (original[i] === ' ') continue
      const timeout = setTimeout(() => {
        resolvedRef.current[i] = true
      }, revealDelay * (i + 1))
      timeoutsRef.current.push(timeout)
    }

    const totalTime = revealDelay * original.length + speed * 2
    const finalTimeout = setTimeout(() => {
      clearTimers()
      setText(original)
    }, totalTime)
    timeoutsRef.current.push(finalTimeout)
  }, [children, speed, revealDelay, clearTimers, setText])

  const handleMouseLeave = useCallback(() => {
    clearTimers()
    setText(children)
  }, [children, clearTimers, setText])

  useEffect(() => {
    return () => {
      clearTimers()
    }
  }, [clearTimers])

  const chars = children.split('').map((char, i) => (
    <span
      key={i}
      data-scramble-char=""
      style={{ display: 'inline', whiteSpace: 'pre' }}
    >
      {char}
    </span>
  ))

  const setRef = useCallback((node: HTMLSpanElement & HTMLAnchorElement & HTMLParagraphElement | null) => {
    containerRef.current = node
  }, [])

  return (
    <Tag
      ref={setRef}
      className={className}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {chars}
    </Tag>
  )
}
