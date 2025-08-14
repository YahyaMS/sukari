import type * as React from "react"
import { cn } from "@/lib/utils"
import {
  Activity,
  BarChart3,
  Bot,
  Flame,
  Heart,
  MessageCircle,
  Scale,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
  Utensils,
  Zap,
} from "lucide-react"

interface Icon3DProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?:
    | "sphere"
    | "cube"
    | "capsule"
    | "torus"
    | "cylinder"
    | "scale"
    | "utensils"
    | "heart"
    | "trending-up"
    | "flame"
    | "users"
    | "bar-chart"
    | "sparkles"
    | "message-circle"
    | "trophy"
    | "activity"
    | "zap"
    | "bot"
  color?: "purple" | "blue" | "green" | "orange" | "gradient" | "red" | "white" | "gray"
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

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-10 h-10",
  }

  const colorClasses = {
    purple: "bg-gradient-to-br from-purple-500 to-purple-700",
    blue: "bg-gradient-to-br from-blue-500 to-blue-700",
    green: "bg-gradient-to-br from-green-500 to-green-700",
    orange: "bg-gradient-to-br from-orange-500 to-orange-700",
    red: "bg-gradient-to-br from-red-500 to-red-700",
    white: "bg-gradient-to-br from-gray-300 to-gray-500",
    gray: "bg-gradient-to-br from-gray-400 to-gray-600",
    gradient: "bg-gradient-to-br from-purple-500 via-blue-500 to-green-500",
  }

  const getIcon = () => {
    const iconClass = cn("text-white/90 drop-shadow-sm", iconSizeClasses[size])

    switch (shape) {
      case "scale":
        return <Scale className={iconClass} />
      case "utensils":
        return <Utensils className={iconClass} />
      case "heart":
        return <Heart className={iconClass} />
      case "trending-up":
        return <TrendingUp className={iconClass} />
      case "flame":
        return <Flame className={iconClass} />
      case "users":
        return <Users className={iconClass} />
      case "bar-chart":
        return <BarChart3 className={iconClass} />
      case "sparkles":
        return <Sparkles className={iconClass} />
      case "message-circle":
        return <MessageCircle className={iconClass} />
      case "trophy":
        return <Trophy className={iconClass} />
      case "activity":
        return <Activity className={iconClass} />
      case "zap":
        return <Zap className={iconClass} />
      case "bot":
        return <Bot className={iconClass} />
      default:
        return <Sparkles className={iconClass} />
    }
  }

  const renderShape = () => {
    const baseClasses = cn(
      "w-full h-full transition-all duration-300 hover:scale-110 relative flex items-center justify-center",
      colorClasses[color],
      glow && "shadow-lg shadow-purple-500/25",
    )

    const icon = getIcon()

    switch (shape) {
      case "sphere":
      case "scale":
      case "utensils":
      case "heart":
      case "users":
      case "sparkles":
      case "activity":
      case "zap":
      case "bot":
        return (
          <div className={cn(baseClasses, "rounded-full shadow-lg")}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 to-transparent" />
            {icon}
          </div>
        )

      case "cube":
      case "bar-chart":
      case "trophy":
        return (
          <div className={cn(baseClasses, "rounded-lg shadow-lg transform rotate-12")}>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-white/30 to-transparent" />
            <div className="absolute inset-0 rounded-lg border border-white/20" />
            {icon}
          </div>
        )

      case "capsule":
      case "trending-up":
      case "flame":
      case "message-circle":
        return (
          <div className={cn(baseClasses, "rounded-full shadow-lg")}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/30 via-transparent to-white/10" />
            {icon}
          </div>
        )

      case "torus":
        return (
          <div className={cn(baseClasses, "rounded-full shadow-lg border-4 border-white/20")}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/10 to-transparent" />
            {icon}
          </div>
        )

      case "cylinder":
        return (
          <div className={cn(baseClasses, "rounded-lg shadow-lg")}>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/30 to-white/10" />
            <div className="absolute top-0 left-0 w-full h-2 rounded-t-lg bg-white/40" />
            {icon}
          </div>
        )

      default:
        return (
          <div className={cn(baseClasses, "rounded-full shadow-lg")}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 to-transparent" />
            {icon}
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
