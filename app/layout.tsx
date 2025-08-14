import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Particles from "@/components/Particles"

export const metadata: Metadata = {
  title: "MetaReverse - AI-Powered Health Management",
  description: "Medical-grade coaching for diabetes and obesity reversal",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.className}`}>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="relative min-h-screen text-foreground bg-mesh">
        {/* Atmospheric glow layers */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background: "radial-gradient(40rem 30rem at 70% 20%, rgba(139,92,246,.22), transparent 70%)",
          }}
        />
        <canvas id="particles-canvas" />

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          {/* Main app content */}
          <div className="relative z-10">{children}</div>
        </ThemeProvider>

        <Particles selector="#particles-canvas" />
      </body>
    </html>
  )
}
