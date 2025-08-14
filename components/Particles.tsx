"use client"
import { useEffect } from "react"

type Props = { selector?: string; count?: number }

export default function Particles({ selector = "#particles-canvas", count = 80 }: Props) {
  useEffect(() => {
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
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.6,
    }))

    let mouseX = width / 2
    let mouseY = height / 2
    const onMouse = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener("mousemove", onMouse)

    let raf = 0
    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      // background soft glow
      const grd = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 240)
      grd.addColorStop(0, "rgba(139,92,246,0.12)")
      grd.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, width, height)

      // particles
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        // wrap
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        // slight mouse attraction
        const dx = mouseX - p.x,
          dy = mouseY - p.y
        const dist = Math.hypot(dx, dy)
        const force = Math.max(0, 120 - dist) / 1200
        p.vx += dx * force * 0.002
        p.vy += dy * force * 0.002

        // color varies
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139,92,246,${0.35 + Math.random() * 0.15})`
        ctx.fill()
      }

      // linking lines
      ctx.strokeStyle = "rgba(59,130,246,0.10)"
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i],
            b = particles[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 120) {
            ctx.globalAlpha = 1 - d / 120
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
  }, [selector, count])

  return null
}
