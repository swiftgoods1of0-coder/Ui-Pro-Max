'use client'

import { Component, type ReactNode } from 'react'

interface Props  { children: ReactNode }
interface State  { crashed: boolean }

export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { crashed: false }

  static getDerivedStateFromError() {
    return { crashed: true }
  }

  componentDidCatch(err: unknown) {
    console.warn('[ACRUX 3D] Scene error, falling back to static background:', err)
  }

  render() {
    if (this.state.crashed) {
      // Fallback: just keep the CSS dark background — no white screen
      return null
    }
    return this.props.children
  }
}
