import type * as React from "react"
import { cn } from "@/lib/utils"

interface Icon3DProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: "sphere" | "cube" | "capsule" | "torus" | "cylinder"
  color?: "purple" | "blue" | "green" | "orange" | "gradient"
  size?: "sm" | "md" | "lg" | "xl"
  glow?: boolean
}

function Icon3D({ className, shape = "sphere", color = "purple", size = "md", glow = false, ...props }: Icon3DProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  }

  const colorClasses = {
    purple: "bg-gradient-to-br from-accent-purple to-accent-purple-secondary",
    blue: "bg-gradient-to-br from-accent-blue to-accent-blue-secondary",
    green: "bg-gradient-to-br from-accent-green to-accent-green-secondary",
    orange: "bg-gradient-to-br from-accent-orange to-accent-orange-secondary",
    gradient: "gradient-primary",
  }

  const renderShape = () => {
    const baseClasses = cn(
      "w-full h-full transition-all duration-300 hover:scale-110",
      colorClasses[color],
      glow && "glow-purple",
    )

    switch (shape) {
      case "sphere":
        return (
          <div className={cn(baseClasses, "rounded-full shadow-lg")}>
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-white/30 to-transparent" />
          </div>
        )

      case "cube":
        return (
          <div className={cn(baseClasses, "rounded-lg shadow-lg transform rotate-12")}>
            <div className="w-full h-full rounded-lg bg-gradient-to-tr from-white/30 to-transparent" />
            <div className="absolute inset-0 rounded-lg border border-white/20" />
          </div>
        )

      case "capsule":
        return (
          <div className={cn(baseClasses, "rounded-full shadow-lg")}>
            <div className="w-full h-full rounded-full bg-gradient-to-r from-white/30 via-transparent to-white/10" />
          </div>
        )

      case "torus":
        return (
          <div className={cn(baseClasses, "rounded-full shadow-lg border-4 border-white/20")}>
            <div className="w-full h-full rounded-full bg-gradient-to-br from-transparent via-white/10 to-transparent" />
          </div>
        )

      case "cylinder":
        return (
          <div className={cn(baseClasses, "rounded-lg shadow-lg")}>
            <div className="w-full h-full rounded-lg bg-gradient-to-b from-white/30 to-white/10" />
            <div className="absolute top-0 left-0 w-full h-2 rounded-t-lg bg-white/40" />
          </div>
        )

      default:
        return (
          <div className={cn(baseClasses, "rounded-full shadow-lg")}>
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-white/30 to-transparent" />
          </div>
        )
    }
  }

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)} {...props}>
      {renderShape()}
    </div>
  )
}

export { Icon3D }
