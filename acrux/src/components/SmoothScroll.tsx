'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const tickerFn = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    // Smooth anchor-link scroll via Lenis
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!anchor) return
      const id = anchor.getAttribute('href')!.slice(1)
      const target = document.getElementById(id)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: -64, duration: 1.4 })
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(tickerFn)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
