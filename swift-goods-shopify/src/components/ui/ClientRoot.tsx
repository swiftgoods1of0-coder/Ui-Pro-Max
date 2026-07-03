'use client'

import React, { useState, useEffect, Component } from 'react'
import type { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { CartProvider } from '@/context/CartContext'

const CartDrawer = dynamic(() => import('./CartDrawer'), { ssr: false })
const Preloader  = dynamic(() => import('./Preloader'),  { ssr: false })

// Heavy effects — loaded only after the page content is visible
const LiquidBackground  = dynamic(() => import('./LiquidBackground'),  { ssr: false })
const CursorTrail       = dynamic(() => import('./CursorTrail'),       { ssr: false })
const CustomCursor      = dynamic(() => import('./CustomCursor'),       { ssr: false })
const GoldParticleField = dynamic(() => import('./GoldParticleField'),  { ssr: false })

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: '#0a0a0a', color: '#c9a84c',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '2rem', fontFamily: 'monospace',
        }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Swift Goods — Error</h1>
          <pre style={{
            color: '#f5f5f5', fontSize: '0.8rem',
            maxWidth: '90vw', overflow: 'auto',
            background: '#111', padding: '1rem',
            borderRadius: '4px', whiteSpace: 'pre-wrap',
          }}>
            {this.state.error?.message}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

export default function ClientRoot({ children }: { children: ReactNode }) {
  const [preloaderDone, setPreloaderDone] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [effectsReady, setEffectsReady] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mount visual effects after preloader exits so they never compete
  // with first-paint — the page is fully visible before these start
  useEffect(() => {
    if (!preloaderDone) return
    const id = setTimeout(() => setEffectsReady(true), 300)
    return () => clearTimeout(id)
  }, [preloaderDone])

  return (
    <div id="sg-app">
      <ErrorBoundary>
        <CartProvider>
          {/* Cart is critical — load it once mounted */}
          {mounted && <CartDrawer />}

          {/* Preloader — show first, then reveal page */}
          {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}

          {/* Page content renders under preloader, paints instantly after it exits */}
          {children}

          {/* Visual effects — deferred until after page is visible */}
          {effectsReady && <LiquidBackground />}
          {effectsReady && <CursorTrail />}
          {effectsReady && <CustomCursor />}
          {effectsReady && <GoldParticleField />}
        </CartProvider>
      </ErrorBoundary>
    </div>
  )
}
