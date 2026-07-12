import { useEffect, lazy, Suspense } from 'react'

const CustomCursor = lazy(() => import('@/components/ui/CustomCursor'))
const CursorTrail = lazy(() => import('@/components/ui/CursorTrail'))
const GoldParticleField = lazy(() => import('@/components/ui/GoldParticleField'))
const LiquidBackground = lazy(() => import('@/components/ui/LiquidBackground'))
const Preloader = lazy(() => import('@/components/ui/Preloader'))
const CartDrawer = lazy(() => import('@/components/ui/CartDrawer'))
const MouseSpotlight = lazy(() => import('@/components/ui/MouseSpotlight'))
const ScrollProgressBar = lazy(() => import('@/components/ui/ScrollProgressBar'))
const UrgencyBanner = lazy(() => import('@/components/ui/UrgencyBanner'))

export default function ClientEffects() {
  useEffect(() => {
    // Remove no-js class if present
    document.documentElement.classList.remove('no-js')
  }, [])

  return (
    <Suspense fallback={null}>
      <Preloader />
      <UrgencyBanner />
      <ScrollProgressBar />
      <CustomCursor />
      <CursorTrail />
      <MouseSpotlight />
      <LiquidBackground />
      <GoldParticleField />
      <CartDrawer />
    </Suspense>
  )
}
