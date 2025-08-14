"use client"
import { useEffect, useState } from "react"

type Props = { selector?: string; count?: number }

export default function Particles({ selector = "#particles-canvas", count = 25 }: Props) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const canvas = document.querySelector(selector) as HTMLCanvasElement | null
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const onResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", onResize)

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.2 + 0.4,
    }))

    let mouseX = width / 2
    let mouseY = height / 2
    const onMouse = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener("mousemove", onMouse)

    let raf = 0
    let frameCount = 0
    const draw = () => {
      frameCount++
      ctx.clearRect(0, 0, width, height)

      if (frameCount % 3 === 0) {
        const grd = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 200)
        grd.addColorStop(0, "rgba(139,92,246,0.08)")
        grd.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, width, height)
      }

      // particles
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        // wrap
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139,92,246,${0.25 + Math.random() * 0.1})`
        ctx.fill()
      }

      ctx.strokeStyle = "rgba(59,130,246,0.06)"
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < Math.min(i + 5, particles.length); j++) {
          const a = particles[i],
            b = particles[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 80) {
            ctx.globalAlpha = 1 - d / 80
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("mousemove", onMouse)
    }
  }, [selector, count, isVisible])

  return null
}
