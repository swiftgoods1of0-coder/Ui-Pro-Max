'use client'

import { Suspense, lazy, useState } from 'react'
import { motion } from 'framer-motion'

// Lazy-load Spline — it's heavy and browser-only
const Spline = lazy(() => import('@splinetool/react-spline'))

const SCENE_URL =
  'https://prod.spline.design/Iobizn1wNkpBGBlOS0K6xMEe/scene.splinecode'

export function SplineScene() {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  if (errored) {
    // Fallback: iframe embed — always works with the public viewer URL
    return (
      <iframe
        src="https://my.spline.design/untitled-Iobizn1wNkpBGBlOS0K6xMEe/"
        className="absolute inset-0 w-full h-full border-0 pointer-events-none"
        title="ACRUX 3D Scene"
        allow="autoplay"
      />
    )
  }

  return (
    <>
      {/* Loading shimmer */}
      {!loaded && (
        <div className="absolute inset-0 bg-[#020508] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#0066ff] animate-pulse" />
        </div>
      )}

      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 1.2 }}
      >
        <Suspense fallback={null}>
          <Spline
            scene={SCENE_URL}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            style={{ width: '100%', height: '100%' }}
          />
        </Suspense>
      </motion.div>
    </>
  )
}
