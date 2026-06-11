'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from 'react'
import gsap from 'gsap'
// Type-only import — no runtime module evaluation during SSR
import type Lenis from 'lenis'

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
  const rafRef   = useRef<number | null>(null)

  useEffect(() => {
    // Dynamic import keeps Lenis out of the SSR bundle entirely —
    // Lenis 1.3.x throws when evaluated in a Node.js context.
    let lenis: Lenis | null = null
    let mqList: MediaQueryList | null = null
    let mqHandler: ((e: MediaQueryListEvent) => void) | null = null
    let gsapTickerFn: ((time: number) => void) | null = null

    import('lenis')
      .then(({ default: LenisClass }) => {
        lenis = new (LenisClass as unknown as new (opts: Record<string, unknown>) => Lenis)({
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

        // GSAP ticker integration — save ref for cleanup
        gsapTickerFn = (time: number) => lenis?.raf(time * 1000)
        gsap.ticker.add(gsapTickerFn)
        gsap.ticker.lagSmoothing(0)

        // Accessibility: pause on reduced motion
        mqList = window.matchMedia('(prefers-reduced-motion: reduce)')
        if (mqList.matches) lenis.stop()

        mqHandler = (e: MediaQueryListEvent) => {
          if (e.matches) lenis?.stop()
          else           lenis?.start()
        }
        mqList.addEventListener('change', mqHandler)

        if (process.env.NODE_ENV === 'development') {
          ;(window as unknown as Record<string, unknown>).lenis = lenis
        }
      })
      .catch((err) => {
        console.warn('[Swift Goods] Lenis failed to initialise:', err)
      })

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (gsapTickerFn)   gsap.ticker.remove(gsapTickerFn)
      if (mqList && mqHandler) mqList.removeEventListener('change', mqHandler)
      lenisRef.current?.destroy()
      lenisRef.current = null
    }
  }, [])

  const scrollTo = useCallback(
    (target: string | number | HTMLElement, options?: LenisScrollToOptions) => {
      lenisRef.current?.scrollTo(target as string | number | HTMLElement, options)
    },
    []
  )

  const stop  = useCallback(() => { lenisRef.current?.stop()  }, [])
  const start = useCallback(() => { lenisRef.current?.start() }, [])

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current, scrollTo, stop, start }}>
      {children}
    </LenisContext.Provider>
  )
}

// ============================================================
// HOOKS
// ============================================================
export function useLenis() {
  const context = useContext(LenisContext)
  if (!context) throw new Error('useLenis must be used within a SmoothScrollProvider')
  return context
}

export function useScrollTo() {
  const { scrollTo } = useLenis()
  return scrollTo
}
