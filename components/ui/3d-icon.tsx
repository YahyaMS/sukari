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
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  }

  const colorClasses = {
    purple: "bg-gradient-to-br from-accent-purple to-accent-purple-secondary",
    blue: "bg-gradient-to-br from-accent-blue to-accent-blue-secondary",
    green: "bg-gradient-to-br from-accent-green to-accent-green-secondary",
    orange: "bg-gradient-to-br from-accent-orange to-accent-orange-secondary",
    gradient: "gradient-primary",
  }

  const shapeClasses = {
    sphere: "rounded-full",
    cube: "rounded-lg",
    capsule: "rounded-full",
    torus: "rounded-full border-4 border-white/20",
    cylinder: "rounded-lg",
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center shadow-medium transition-all duration-200 hover:scale-110",
        sizeClasses[size],
        colorClasses[color],
        shapeClasses[shape],
        glow && "glow-purple",
        className,
      )}
      {...props}
    >
      <div className="w-2 h-2 bg-white/30 rounded-full" />
    </div>
  )
}

export { Icon3D }
