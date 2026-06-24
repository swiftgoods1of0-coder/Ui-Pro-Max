'use client'

import { useEffect, useRef } from 'react'

interface SplitTextRevealProps {
  text: string
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  style?: React.CSSProperties
  stagger?: number
  duration?: number
  trigger?: 'scroll' | 'load'
  delay?: number
}

export default function SplitTextReveal({
  text,
  tag: Tag = 'h2',
  className,
  style,
  stagger = 0.03,
  duration = 0.6,
  trigger = 'scroll',
  delay = 0,
}: SplitTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let ctx: ReturnType<typeof import('gsap')['gsap']['context']> | undefined

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')

      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const chars = container.querySelectorAll<HTMLSpanElement>('.split-char')

        gsap.set(chars, {
          opacity: 0,
          y: '100%',
          clipPath: 'inset(0 0 100% 0)',
        })

        const tweenVars: gsap.TweenVars = {
          opacity: 1,
          y: '0%',
          clipPath: 'inset(0 0 0% 0)',
          duration,
          stagger,
          ease: 'power3.out',
          delay: trigger === 'load' ? delay : 0,
        }

        if (trigger === 'scroll') {
          gsap.to(chars, {
            ...tweenVars,
            scrollTrigger: {
              trigger: container,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          })
        } else {
          gsap.to(chars, tweenVars)
        }
      }, container)
    }

    init()

    return () => {
      ctx?.revert()
    }
  }, [text, stagger, duration, trigger, delay])

  const characters = text.split('').map((char, i) => {
    const isSpace = char === ' '
    return (
      <span
        key={i}
        style={{ display: 'inline-block', overflow: 'hidden' }}
      >
        <span
          className="split-char"
          style={{
            display: 'inline-block',
            whiteSpace: 'pre',
            willChange: 'transform, opacity, clip-path',
          }}
        >
          {isSpace ? ' ' : char}
        </span>
      </span>
    )
  })

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLHeadingElement & HTMLParagraphElement & HTMLSpanElement & HTMLDivElement>}
      className={className}
      style={style}
    >
      {characters}
    </Tag>
  )
}
