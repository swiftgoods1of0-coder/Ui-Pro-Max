'use client'

import { useEffect, useRef } from 'react'

// Each section gets a colour; the ambient blob tracks the active section.
const SECTION_COLORS: Record<string, string> = {
  hero:      '0,60,220',
  'logo-strip': '0,50,180',
  about:     '0,70,200',
  services:  '0,80,255',
  process:   '0,55,210',
  portfolio: '0,40,180',
  stats:     '0,65,220',
  'why-acrux': '0,75,240',
  faq:       '0,50,200',
  contact:   '0,90,255',
}

export function SectionGlow() {
  const blobRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sections = Object.keys(SECTION_COLORS)
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const color = SECTION_COLORS[entry.target.id] ?? '0,60,220'
          const blob = blobRef.current
          if (!blob) continue
          blob.style.background = `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(${color},0.09) 0%, transparent 70%)`
        }
      },
      { rootMargin: '-30% 0px -30% 0px', threshold: 0 }
    )

    sections.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={blobRef}
      className="fixed inset-0 pointer-events-none transition-all duration-[1400ms] ease-in-out"
      style={{
        zIndex: 1,
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,60,220,0.09) 0%, transparent 70%)',
      }}
    />
  )
}
