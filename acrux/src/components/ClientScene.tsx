'use client'

import dynamic from 'next/dynamic'
import { SceneErrorBoundary } from './SceneErrorBoundary'

const WorldCanvas = dynamic(
  () => import('./WorldCanvas').then((m) => m.WorldCanvas),
  { ssr: false, loading: () => null }
)

export function ClientScene() {
  return (
    <SceneErrorBoundary>
      <WorldCanvas />
    </SceneErrorBoundary>
  )
}
