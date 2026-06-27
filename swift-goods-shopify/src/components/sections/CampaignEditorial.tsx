'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LuxuryButton from '@/components/ui/LuxuryButton'
import MagneticElement from '@/components/ui/MagneticElement'

const PANELS = [
  {
    image: '/brand/sg-supra-brown-black.jpeg',
    label: 'THE DROP',
    heading: 'BUILT FOR\nTHE MOMENT',
    body: 'When the sun dips and the streets empty — that\'s when presence speaks loudest. Premium fabrics that move with you.',
    cta: 'SHOP THE DROP',
    href: '/collections/new-arrivals',
  },
  {
    image: '/brand/sg-fountain-night.jpeg',
    label: 'STREET LUXURY',
    heading: 'RAW\nUNCUT',
    body: 'Concrete walls. Clean lines. No filter necessary when the fit speaks for itself. This is what luxury looks like in motion.',
    cta: 'EXPLORE COLLECTION',
    href: '/collections',
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
            { scale: 1.08, clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
            {
              scale: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 0.9, ease: 'power3.inOut',
              scrollTrigger: { trigger: panel, start: 'top 85%', toggleActions: 'play none none none' },
            }
          )
        }

        if (content) {
          const cta = panel.querySelector('.editorial-cta')
          const elements = [label, heading, rule, body, cta].filter(Boolean) as HTMLElement[]
          gsap.fromTo(elements,
            { opacity: 0, y: 20 },
            {
              opacity: 1, y: 0, duration: 0.5, ease: 'power3.out',
              stagger: 0.08,
              scrollTrigger: { trigger: panel, start: 'top 75%', toggleActions: 'play none none none' },
            }
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ background: 'var(--sg-frost, #F7F6F3)' }}>
      {/* Subtle warm ambient glow */}
      <div className="absolute pointer-events-none" style={{ top: '20%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 65%)', filter: 'blur(100px)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: '10%', right: '-5%', width: '35%', height: '35%', background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.03) 0%, transparent 65%)', filter: 'blur(80px)' }} />

      {/* Subtle noise texture for frost feel */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 3px)', backgroundSize: '100% 4px' }} />

      {PANELS.map((panel, idx) => (
        <div
          key={panel.label}
          className={`editorial-panel group grid grid-cols-1 lg:grid-cols-2 ${
            idx % 2 === 1 ? 'lg:direction-rtl' : ''
          }`}
          style={{ direction: idx % 2 === 1 ? 'rtl' : 'ltr' }}
        >
          <div
            className="editorial-img relative overflow-hidden"
            style={{ minHeight: 'clamp(280px, 40vh, 500px)', direction: 'ltr' }}
          >
            <Image
              src={panel.image}
              alt={panel.label}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              quality={90}
            />
            {/* Gradient blends image into frost bg */}
            <div
              className="absolute inset-0 hidden lg:block"
              style={{
                background: idx % 2 === 0
                  ? 'linear-gradient(to right, transparent 55%, var(--sg-frost, #F7F6F3) 100%)'
                  : 'linear-gradient(to left, transparent 55%, var(--sg-frost, #F7F6F3) 100%)',
              }}
            />
            <div
              className="absolute inset-0 lg:hidden"
              style={{ background: 'linear-gradient(to bottom, transparent 40%, var(--sg-frost, #F7F6F3) 100%)' }}
            />
            {/* Gold border accent on hover */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ border: '1px solid rgba(201,168,76,0.25)' }} />
          </div>

          <div
            className="editorial-content flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-16 lg:py-0"
            style={{ direction: 'ltr' }}
          >
            <div className="editorial-label inline-flex items-center gap-3 mb-8 opacity-0">
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#c9a84c', flexShrink: 0, animation: 'pulse-gold 2s ease-in-out infinite' }} />
              <span
                className="block w-10 h-px"
                style={{ background: 'linear-gradient(to right, #c9a84c, transparent)' }}
              />
              <span
                className="text-[10px] tracking-[0.4em] uppercase"
                style={{
                  color: '#a08535',
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
                fontSize: 'clamp(2.5rem, 7vw, 7rem)',
                letterSpacing: '0.04em',
                color: '#1a1a1a',
                whiteSpace: 'pre-line',
                textShadow: '0 4px 30px rgba(0,0,0,0.06)',
              }}
            >
              {panel.heading}
            </h2>

            <div className="editorial-rule flex items-center gap-3 mb-8 opacity-0">
              <div className="h-px w-16" style={{ background: 'linear-gradient(to right, #c9a84c, rgba(201,168,76,0.2))' }} />
              <div style={{ width: 4, height: 4, background: 'rgba(201,168,76,0.6)', transform: 'rotate(45deg)' }} />
            </div>

            <p
              className="editorial-body max-w-md opacity-0"
              style={{
                fontFamily: 'var(--font-display, "Cormorant Garamond", serif)',
                fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                fontStyle: 'italic',
                color: '#6b6560',
                lineHeight: 1.7,
              }}
            >
              {panel.body}
            </p>

            <div className="editorial-cta mt-10 opacity-0">
              <MagneticElement strength={0.25} radius={140}>
                <LuxuryButton variant="ghost" href={panel.href}>
                  {panel.cta}
                </LuxuryButton>
              </MagneticElement>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
