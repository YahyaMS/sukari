"use client"

import { lazy, Suspense } from "react"

const Particles = lazy(() => import("@/components/Particles"))

export function LazyParticles() {
  return (
    <Suspense fallback={null}>
      <canvas id="particles-canvas" className="fixed inset-0 -z-5" />
      <Particles selector="#particles-canvas" count={20} />
    </Suspense>
  )
}
