"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Bell, Target, TrendingUp, Trophy } from "lucide-react"
import { createClientComponentClient } from "@supabase/ssr"

interface SmartNudge {
  id: string
  nudge_type: string
  title: string
  message: string
  action_url?: string
  priority: number
}

export function SmartNudgeBanner() {
  const [nudges, setNudges] = useState<SmartNudge[]>([])
  const [dismissedNudges, setDismissedNudges] = useState<Set<string>>(new Set())
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchNudges()
  }, [])

  const fetchNudges = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("smart_nudges")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .order("priority", { ascending: false })
        .limit(3)

      if (error) {
        console.error("Error fetching nudges:", error)
        return
      }

      if (data) {
        setNudges(data)
      }
    } catch (error) {
      console.error("Error in fetchNudges:", error)
    }
  }

  const dismissNudge = async (nudgeId: string) => {
    setDismissedNudges((prev) => new Set([...prev, nudgeId]))

    try {
      const { error } = await supabase.from("smart_nudges").update({ status: "dismissed" }).eq("id", nudgeId)

      if (error) {
        console.error("Error dismissing nudge:", error)
        setDismissedNudges((prev) => {
          const newSet = new Set(prev)
          newSet.delete(nudgeId)
          return newSet
        })
      }
    } catch (error) {
      console.error("Error in dismissNudge:", error)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return <Bell className="h-4 w-4" />
      case "encouragement":
        return <TrendingUp className="h-4 w-4" />
      case "challenge":
        return <Trophy className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const visibleNudges = nudges.filter((nudge) => !dismissedNudges.has(nudge.id))

  if (visibleNudges.length === 0) return null

  return (
    <div className="space-y-3">
      {visibleNudges.map((nudge) => (
        <Card key={nudge.id} className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-lg">{getIcon(nudge.nudge_type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{nudge.title}</h4>
                    <Badge variant={nudge.priority >= 4 ? "destructive" : "secondary"} className="text-xs">
                      {nudge.nudge_type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{nudge.message}</p>
                  {nudge.action_url && (
                    <Button asChild size="sm" className="h-8">
                      <a href={nudge.action_url}>Take Action</a>
                    </Button>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => dismissNudge(nudge.id)} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
