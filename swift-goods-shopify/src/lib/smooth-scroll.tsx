'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'

// ============================================================
// LENIS CONTEXT
// ============================================================
interface LenisContextValue {
  lenis: Lenis | null
  scrollTo: (target: string | number | HTMLElement, options?: LenisScrollToOptions) => void
  stop: () => void
  start: () => void
}

interface LenisScrollToOptions {
  offset?: number
  immediate?: boolean
  duration?: number
  easing?: (t: number) => number
  lock?: boolean
  force?: boolean
  onComplete?: () => void
}

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
})

// ============================================================
// SMOOTH SCROLL PROVIDER
// ============================================================
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis

    // GSAP ticker integration for synchronized animations
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    // RAF loop
    function raf(time: number) {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }

    // We use GSAP ticker as the primary loop, but keep RAF as fallback
    // Comment the line below if you want pure RAF without GSAP
    // rafRef.current = requestAnimationFrame(raf)

    // Accessibility: pause on reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      lenis.stop()
    }

    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        lenis.stop()
      } else {
        lenis.start()
      }
    }

    mediaQuery.addEventListener('change', handleMediaChange)

    // Expose lenis on window for debugging
    if (process.env.NODE_ENV === 'development') {
      ;(window as unknown as Record<string, unknown>).lenis = lenis
    }

    return () => {
      // Cleanup
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000)
      })
      mediaQuery.removeEventListener('change', handleMediaChange)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const scrollTo = useCallback(
    (
      target: string | number | HTMLElement,
      options?: LenisScrollToOptions
    ) => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target as string | number | HTMLElement, options)
      }
    },
    []
  )

  const stop = useCallback(() => {
    lenisRef.current?.stop()
  }, [])

  const start = useCallback(() => {
    lenisRef.current?.start()
  }, [])

  return (
    <LenisContext.Provider
      value={{
        lenis: lenisRef.current,
        scrollTo,
        stop,
        start,
      }}
    >
      {children}
    </LenisContext.Provider>
  )
}

// ============================================================
// USE LENIS HOOK
// ============================================================
export function useLenis() {
  const context = useContext(LenisContext)
  if (!context) {
    throw new Error('useLenis must be used within a SmoothScrollProvider')
  }
  return context
}

// ============================================================
// USE SCROLL TO HOOK (convenience)
// ============================================================
export function useScrollTo() {
  const { scrollTo } = useLenis()
  return scrollTo
}
