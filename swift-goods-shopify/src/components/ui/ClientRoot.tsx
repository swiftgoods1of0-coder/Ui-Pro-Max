'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { SmoothScrollProvider } from '@/lib/smooth-scroll'

const Preloader        = dynamic(() => import('./Preloader'),        { ssr: false })
const LiquidBackground = dynamic(() => import('./LiquidBackground'), { ssr: false })
const CursorTrail      = dynamic(() => import('./CursorTrail'),      { ssr: false })

export default function ClientRoot({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(false)

  return (
    <SmoothScrollProvider>
      <LiquidBackground />
      <CursorTrail />
      {!done && <Preloader onComplete={() => setDone(true)} />}
      {children}
    </SmoothScrollProvider>
  )
}
