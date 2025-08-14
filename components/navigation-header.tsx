"use client"

import Link from "next/link"
import { Heart, Bell, MessageCircle, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"

interface NavigationHeaderProps {
  unreadNotifications?: number
  unreadMessages?: number
  showBackButton?: boolean
  backHref?: string
  title?: string
  subtitle?: string
}

export default function NavigationHeader({
  unreadNotifications = 0,
  unreadMessages = 0,
  showBackButton = false,
  backHref = "/dashboard",
  title,
  subtitle,
}: NavigationHeaderProps) {
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {showBackButton && (
              <Link href={backHref}>
                <Button variant="ghost" size="sm">
                  ←
                </Button>
              </Link>
            )}
            <Heart className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">{title || "MetaReverse"}</h1>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link href="/notifications">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/messages">
              <Button variant="ghost" size="sm" className="relative">
                <MessageCircle className="h-5 w-5" />
                {unreadMessages > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {unreadMessages}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
