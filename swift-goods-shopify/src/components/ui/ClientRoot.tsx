'use client'

import React, { useState, useEffect, Component } from 'react'
import type { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { SmoothScrollProvider } from '@/lib/smooth-scroll'
import { CartProvider } from '@/context/CartContext'

const CartDrawer = dynamic(
  () => import('./CartDrawer'),
  { ssr: false }
)

const Preloader = dynamic(
  () => import('./Preloader'),
  { ssr: false }
)

const LiquidBackground = dynamic(
  () => import('./LiquidBackground'),
  { ssr: false }
)

const CursorTrail = dynamic(
  () => import('./CursorTrail'),
  { ssr: false }
)

const CustomCursor = dynamic(
  () => import('./CustomCursor'),
  { ssr: false }
)

const GoldParticleField = dynamic(
  () => import('./GoldParticleField'),
  { ssr: false }
)

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
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

export default function ClientRoot({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh()
      })
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div id="sg-app">
      <ErrorBoundary>
        <CartProvider>
          <SmoothScrollProvider>
            {mounted && <LiquidBackground />}
            {mounted && <CursorTrail />}
            {mounted && <CustomCursor />}
            {mounted && <GoldParticleField />}
            {mounted && <CartDrawer />}
            {!done && <Preloader onComplete={() => setDone(true)} />}
            {children}
          </SmoothScrollProvider>
        </CartProvider>
      </ErrorBoundary>
    </div>
  )
}
