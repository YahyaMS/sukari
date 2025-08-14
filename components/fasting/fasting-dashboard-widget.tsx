"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { EnhancedFastingService, type FastingSession } from "@/lib/enhanced-fasting"
import { Calendar, Clock, Droplets, Brain, Play } from "lucide-react"
import Link from "next/link"

export function FastingDashboardWidget() {
  const [fastingService] = useState(() => new EnhancedFastingService())
  const [currentSession, setCurrentSession] = useState<FastingSession | null>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCurrentSession()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (currentSession && currentSession.status === "active") {
      interval = setInterval(() => {
        const now = new Date()
        const start = new Date(currentSession.start_time)
        const plannedEnd = new Date(currentSession.planned_end_time)

        const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000)
        const remaining = Math.max(0, Math.floor((plannedEnd.getTime() - now.getTime()) / 1000))

        setTimeElapsed(elapsed)
        setTimeRemaining(remaining)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [currentSession])

  const loadCurrentSession = async () => {
    try {
      const session = await fastingService.getCurrentSession()
      setCurrentSession(session)
    } catch (error) {
      console.error("Error loading fasting session:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "preparation":
        return "bg-gray-100 text-gray-800"
      case "early":
        return "bg-yellow-100 text-yellow-800"
      case "adaptation":
        return "bg-blue-100 text-blue-800"
      case "deep":
        return "bg-green-100 text-green-800"
      case "extended":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-purple-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-purple-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentSession || currentSession.status !== "active") {
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Calendar className="h-5 w-5" />
            Ready to Start Fasting?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-purple-700 mb-4">
            Begin your AI-guided intermittent fasting journey for optimal diabetes management.
          </p>
          <div className="flex gap-3">
            <Link href="/ai/fasting-coach">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Play className="h-4 w-4 mr-2" />
                Start Fasting
              </Button>
            </Link>
            <Link href="/fasting/history">
              <Button variant="outline" className="border-purple-300 text-purple-700 bg-transparent">
                <Clock className="h-4 w-4 mr-2" />
                View History
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  const hoursElapsed = timeElapsed / 3600
  const totalHours =
    (new Date(currentSession.planned_end_time).getTime() - new Date(currentSession.start_time).getTime()) /
    (1000 * 3600)
  const progressPercentage = (hoursElapsed / totalHours) * 100

  return (
    <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Active Fast: {currentSession.fasting_type}
          </div>
          <Badge className={getPhaseColor(currentSession.current_phase)}>
            {currentSession.current_phase.charAt(0).toUpperCase() + currentSession.current_phase.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-2xl font-bold">{formatTime(timeElapsed)}</div>
            <div className="text-purple-200 text-sm">Elapsed</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{formatTime(timeRemaining)}</div>
            <div className="text-purple-200 text-sm">Remaining</div>
          </div>
        </div>

        <Progress value={progressPercentage} className="mb-4 bg-purple-400" />

        <div className="flex items-center justify-between text-sm text-purple-200 mb-4">
          <span>{Math.round(progressPercentage)}% Complete</span>
          <span>
            {Math.round(hoursElapsed * 10) / 10}h / {totalHours}h
          </span>
        </div>

        <div className="flex gap-2">
          <Link href="/ai/fasting-coach">
            <Button variant="secondary" size="sm">
              <Brain className="h-4 w-4 mr-2" />
              AI Guidance
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="border-white text-white hover:bg-white hover:text-purple-600 bg-transparent"
            onClick={() => {
              /* Add hydration logging */
            }}
          >
            <Droplets className="h-4 w-4 mr-2" />
            Log Water
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
