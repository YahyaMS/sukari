import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "@/components/ui/toaster"
import { SkipNavigation } from "@/components/accessibility/skip-nav"
import { LazyParticles } from "@/components/performance/lazy-particles"

export const metadata: Metadata = {
  title: "MetaReverse - AI-Powered Health Management",
  description: "Medical-grade coaching for diabetes and obesity reversal",
  generator: "v0.app",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  keywords: "diabetes management, health tracking, AI coaching, glucose monitoring",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.className}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//blob.vercel-storage.com" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="relative min-h-screen text-foreground bg-mesh">
        <SkipNavigation />

        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 opacity-60"
          style={{
            background: "radial-gradient(50rem 40rem at 60% 30%, rgba(139,92,246,.15), transparent 70%)",
          }}
        />

        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
            {/* Main app content */}
            <main id="main-content" className="relative z-10">
              {children}
            </main>
            <Toaster />
          </ThemeProvider>
        </ErrorBoundary>

        <LazyParticles />
      </body>
    </html>
  )
}
