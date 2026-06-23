'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const PANELS = [
  {
    image: '/brand/sg-supra-duo.jpeg',
    label: 'GOLDEN HOUR',
    heading: 'BUILT FOR\nTHE MOMENT',
    body: 'When the sun dips and the streets empty — that\'s when presence speaks loudest.',
  },
  {
    image: '/brand/sg-wall-duo.jpeg',
    label: 'STREET ARCHITECTURE',
    heading: 'RAW\nUNCUT',
    body: 'Concrete walls. Clean lines. No filter necessary when the fit speaks for itself.',
  },
]

export default function CampaignEditorial() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const panels = sectionRef.current?.querySelectorAll<HTMLElement>('.editorial-panel')
      if (!panels) return

      panels.forEach((panel) => {
        const img = panel.querySelector('.editorial-img')
        const content = panel.querySelector('.editorial-content')
        const label = panel.querySelector('.editorial-label')
        const heading = panel.querySelector('.editorial-heading')
        const body = panel.querySelector('.editorial-body')
        const rule = panel.querySelector('.editorial-rule')

        if (img) {
          gsap.fromTo(img,
            { scale: 1.15, opacity: 0 },
            {
              scale: 1, opacity: 1, duration: 1.4, ease: 'power2.out',
              scrollTrigger: { trigger: panel, start: 'top 80%', toggleActions: 'play none none none' },
            }
          )
        }

        if (content) {
          const elements = [label, heading, rule, body].filter(Boolean) as HTMLElement[]
          gsap.fromTo(elements,
            { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
            {
              clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 0.85, ease: 'power3.out',
              stagger: 0.12,
              scrollTrigger: { trigger: panel, start: 'top 70%', toggleActions: 'play none none none' },
            }
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative" style={{ background: '#050505' }}>
      {PANELS.map((panel, idx) => (
        <div
          key={panel.label}
          className={`editorial-panel grid grid-cols-1 lg:grid-cols-2 ${
            idx % 2 === 1 ? 'lg:direction-rtl' : ''
          }`}
          style={{ direction: idx % 2 === 1 ? 'rtl' : 'ltr' }}
        >
          <div
            className="editorial-img relative overflow-hidden"
            style={{ minHeight: '60vh', direction: 'ltr' }}
          >
            <Image
              src={panel.image}
              alt={panel.label}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              quality={90}
            />
            <div
              className="absolute inset-0"
              style={{
                background: idx % 2 === 0
                  ? 'linear-gradient(to right, transparent 60%, #050505 100%)'
                  : 'linear-gradient(to left, transparent 60%, #050505 100%)',
              }}
            />
            <div
              className="absolute inset-0 lg:hidden"
              style={{ background: 'linear-gradient(to bottom, transparent 40%, #050505 100%)' }}
            />
          </div>

          <div
            className="editorial-content flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-16 lg:py-0"
            style={{ direction: 'ltr' }}
          >
            <div className="editorial-label inline-flex items-center gap-3 mb-8 opacity-0">
              <span
                className="block w-10 h-px"
                style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }}
              />
              <span
                className="text-[10px] tracking-[0.4em] uppercase"
                style={{
                  color: '#c9a84c',
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontWeight: 500,
                }}
              >
                {panel.label}
              </span>
            </div>

            <h2
              className="editorial-heading mb-8 opacity-0 leading-none"
              style={{
                fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
                fontSize: 'clamp(3rem, 7vw, 6.5rem)',
                letterSpacing: '0.04em',
                color: '#f5f5f5',
                whiteSpace: 'pre-line',
              }}
            >
              {panel.heading}
            </h2>

            <div
              className="editorial-rule mb-8 h-px w-16 opacity-0"
              style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }}
            />

            <p
              className="editorial-body max-w-md opacity-0"
              style={{
                fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                fontStyle: 'italic',
                color: '#888888',
                lineHeight: 1.7,
              }}
            >
              {panel.body}
            </p>
          </div>
        </div>
      ))}
    </section>
  )
}
