"use client"

import { Loader2 } from "lucide-react"

interface LoadingFallbackProps {
  message?: string
  size?: "sm" | "md" | "lg"
  fullScreen?: boolean
}

export function LoadingFallback({ message = "Loading...", size = "md", fullScreen = false }: LoadingFallbackProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const containerClasses = fullScreen
    ? "min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#21262D]"
    : "flex items-center justify-center p-8"

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-purple-400 mx-auto mb-3`} />
        <p className="text-text-secondary text-sm">{message}</p>
      </div>
    </div>
  )
}

// Skeleton loading components
export function SkeletonCard() {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="h-4 bg-white/10 rounded mb-3"></div>
      <div className="h-3 bg-white/10 rounded mb-2"></div>
      <div className="h-3 bg-white/10 rounded w-2/3"></div>
    </div>
  )
}

export function SkeletonChart() {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="h-6 bg-white/10 rounded mb-4"></div>
      <div className="h-48 bg-white/10 rounded"></div>
    </div>
  )
}
