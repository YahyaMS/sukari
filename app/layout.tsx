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
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 opacity-60"
          style={{
            background: "radial-gradient(50rem 40rem at 60% 30%, rgba(139,92,246,.15), transparent 70%)",
          }}
        />

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          {/* Main app content */}
          <div className="relative z-10">{children}</div>
        </ThemeProvider>

        <canvas id="particles-canvas" className="fixed inset-0 -z-5" />
        <Particles selector="#particles-canvas" count={20} />
      </body>
    </html>
  )
}
