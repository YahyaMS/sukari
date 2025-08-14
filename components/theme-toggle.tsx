"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface ThemeToggleProps {
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg"
  showLabel?: boolean
}

export function ThemeToggle({ variant = "ghost", size = "sm", showLabel = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant={variant} size={size} disabled>
        <Sun className="h-4 w-4" />
        {showLabel && <span className="ml-2">Theme</span>}
      </Button>
    )
  }

  const isDark = theme === "dark"

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="transition-all duration-200"
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-transform duration-200" />
      ) : (
        <Moon className="h-4 w-4 transition-transform duration-200" />
      )}
      {showLabel && <span className="ml-2">{isDark ? "Light" : "Dark"}</span>}
    </Button>
  )
}
