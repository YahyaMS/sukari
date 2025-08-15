import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

interface AnalyticsRequest {
  timeframe?: "week" | "month" | "quarter" | "year" | "all"
  includeHealthMetrics?: boolean
  includePredictions?: boolean
  includeGoalProgress?: boolean
}

interface AnalyticsOptions {
  includeHealthMetrics?: boolean
  includePredictions?: boolean
  includeGoalProgress?: boolean
}

interface FastingAnalytics {
  overview: {
    totalSessions: number
    completedSessions: number
    averageDuration: number
    longestFast: number
    currentStreak: number
    totalFastingHours: number
    successRate: number
  }
  patterns: {
    preferredFastingTypes: Array<{ type: string; count: number; successRate: number }>
    bestPerformingDays: Array<{ day: string; successRate: number; averageDuration: number }>
    optimalStartTimes: Array<{ hour: number; successRate: number; count: number }>
    seasonalTrends: Array<{ month: string; averageDuration: number; successRate: number }>
  }
  healthImpacts: {
    glucoseImprovement: {
      averageReduction: number
      trend: "improving" | "stable" | "declining"
      sessions: Array<{ date: string; start: number; end: number; reduction: number }>
    }
    weightProgress: {
      totalChange: number
      trend: "losing" | "stable" | "gaining"
      sessions: Array<{ date: string; weight: number }>
    }
    energyLevels: {
      averageStart: number
      averageEnd: number
      improvement: number
      trend: "improving" | "stable" | "declining"
    }
  }
  predictions: {
    nextFastSuccess: {
      probability: number
      factors: string[]
      recommendations: string[]
    }
    optimalSchedule: {
      recommendedType: string
      recommendedStartTime: string
      expectedDuration: number
      confidence: number
    }
    goalProjections: {
      weightLossProjection: { timeframe: string; expectedLoss: number; confidence: number }
      glucoseControlProjection: { timeframe: string; expectedImprovement: number; confidence: number }
    }
  }
  achievements: Array<{
    id: string
    name: string
    description: string
    earnedAt: string
    category: "consistency" | "duration" | "health" | "milestone"
  }>
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const timeframe = (searchParams.get("timeframe") as "week" | "month" | "quarter" | "year" | "all") || "month"
    const includeHealthMetrics = searchParams.get("includeHealthMetrics") === "true"
    const includePredictions = searchParams.get("includePredictions") === "true"
    const includeGoalProgress = searchParams.get("includeGoalProgress") === "true"

    // Get fasting sessions data
    const { data: sessions, error } = await supabase
      .from("fasting_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching sessions:", error)
      return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
    }

    // Get fasting logs for detailed analysis
    const { data: logs } = await supabase
      .from("fasting_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    // Get achievements
    const { data: achievements } = await supabase
      .from("fasting_achievements")
      .select("*")
      .eq("user_id", user.id)
      .order("earned_at", { ascending: false })

    // Generate analytics
    const analytics = await generateFastingAnalytics(sessions || [], logs || [], achievements || [], timeframe, {
      includeHealthMetrics,
      includePredictions,
      includeGoalProgress,
    })

    return NextResponse.json({ analytics })
  } catch (error) {
    console.error("Error generating analytics:", error)
    return NextResponse.json({ error: "Failed to generate analytics" }, { status: 500 })
  }
}

async function generateFastingAnalytics(
  sessions: Array<Record<string, any>>,
  logs: Array<Record<string, any>>,
  achievements: Array<Record<string, any>>,
  timeframe: string,
  options: AnalyticsOptions,
): Promise<FastingAnalytics> {
  // Filter sessions by timeframe
  const filteredSessions = filterSessionsByTimeframe(sessions, timeframe)
  const completedSessions = filteredSessions.filter((s) => s.status === "completed")

  // Generate overview statistics
  const overview = generateOverviewStats(filteredSessions, completedSessions)

  // Analyze patterns
  const patterns = analyzePatterns(completedSessions)

  // Analyze health impacts
  const healthImpacts = options.includeHealthMetrics ? analyzeHealthImpacts(completedSessions, logs) : null

  // Generate predictions
  const predictions = options.includePredictions ? generatePredictions(completedSessions, logs) : null

  // Process achievements
  const processedAchievements = achievements.map((a) => ({
    id: a.id,
    name: a.achievement_name,
    description: a.description,
    earnedAt: a.earned_at,
    category: a.achievement_type,
  }))

  return {
    overview,
    patterns,
    healthImpacts: healthImpacts || {
      glucoseImprovement: { averageReduction: 0, trend: "stable", sessions: [] },
      weightProgress: { totalChange: 0, trend: "stable", sessions: [] },
      energyLevels: { averageStart: 5, averageEnd: 5, improvement: 0, trend: "stable" },
    },
    predictions: predictions || {
      nextFastSuccess: { probability: 0.7, factors: [], recommendations: [] },
      optimalSchedule: {
        recommendedType: "16:8",
        recommendedStartTime: "8:00 PM",
        expectedDuration: 16,
        confidence: 0.8,
      },
      goalProjections: {
        weightLossProjection: { timeframe: "month", expectedLoss: 0, confidence: 0.5 },
        glucoseControlProjection: { timeframe: "month", expectedImprovement: 0, confidence: 0.5 },
      },
    },
    achievements: processedAchievements,
  }
}

function filterSessionsByTimeframe(
  sessions: Array<Record<string, any>>,
  timeframe: string,
): Array<Record<string, any>> {
  const now = new Date()
  let cutoffDate: Date

  switch (timeframe) {
    case "week":
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case "month":
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case "quarter":
      cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    case "year":
      cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      break
    default:
      return sessions
  }

  return sessions.filter((session) => new Date(session.created_at) >= cutoffDate)
}

function generateOverviewStats(allSessions: Array<Record<string, any>>, completedSessions: Array<Record<string, any>>) {
  const totalSessions = allSessions.length
  const completedCount = completedSessions.length
  const successRate = totalSessions > 0 ? (completedCount / totalSessions) * 100 : 0

  const durations = completedSessions
    .map((session) => {
      if (session.actual_end_time) {
        return (new Date(session.actual_end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60 * 60)
      }
      return 0
    })
    .filter((d) => d > 0)

  const averageDuration = durations.length > 0 ? durations.reduce((sum, d) => sum + d, 0) / durations.length : 0
  const longestFast = durations.length > 0 ? Math.max(...durations) : 0
  const totalFastingHours = durations.reduce((sum, d) => sum + d, 0)

  // Calculate current streak
  const currentStreak = calculateCurrentStreak(allSessions)

  return {
    totalSessions,
    completedSessions: completedCount,
    averageDuration: Math.round(averageDuration * 10) / 10,
    longestFast: Math.round(longestFast * 10) / 10,
    currentStreak,
    totalFastingHours: Math.round(totalFastingHours),
    successRate: Math.round(successRate),
  }
}

function calculateCurrentStreak(sessions: Array<Record<string, any>>): number {
  const sortedSessions = sessions
    .filter((s) => s.status === "completed")
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  let streak = 0
  let lastDate: Date | null = null

  for (const session of sortedSessions) {
    const sessionDate = new Date(session.created_at)
    sessionDate.setHours(0, 0, 0, 0)

    if (lastDate === null) {
      streak = 1
      lastDate = sessionDate
    } else {
      const daysDiff = (lastDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
      if (daysDiff <= 2) {
        // Allow for 1 day gap
        streak++
        lastDate = sessionDate
      } else {
        break
      }
    }
  }

  return streak
}

function analyzePatterns(completedSessions: Array<Record<string, any>>) {
  // Analyze fasting types
  const typeStats = new Map<string, { count: number; successful: number }>()
  completedSessions.forEach((session) => {
    const type = session.fasting_type
    const current = typeStats.get(type) || { count: 0, successful: 0 }
    typeStats.set(type, {
      count: current.count + 1,
      successful: current.successful + (session.status === "completed" ? 1 : 0),
    })
  })

  const preferredFastingTypes = Array.from(typeStats.entries()).map(([type, stats]) => ({
    type,
    count: stats.count,
    successRate: Math.round((stats.successful / stats.count) * 100),
  }))

  // Analyze day patterns
  const dayStats = new Map<string, { count: number; totalDuration: number; successful: number }>()
  completedSessions.forEach((session) => {
    const day = new Date(session.start_time).toLocaleDateString("en-US", { weekday: "long" })
    const duration = session.actual_end_time
      ? (new Date(session.actual_end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60 * 60)
      : 0

    const current = dayStats.get(day) || { count: 0, totalDuration: 0, successful: 0 }
    dayStats.set(day, {
      count: current.count + 1,
      totalDuration: current.totalDuration + duration,
      successful: current.successful + 1,
    })
  })

  const bestPerformingDays = Array.from(dayStats.entries()).map(([day, stats]) => ({
    day,
    successRate: Math.round((stats.successful / stats.count) * 100),
    averageDuration: Math.round((stats.totalDuration / stats.count) * 10) / 10,
  }))

  // Analyze start time patterns
  const hourStats = new Map<number, { count: number; successful: number }>()
  completedSessions.forEach((session) => {
    const hour = new Date(session.start_time).getHours()
    const current = hourStats.get(hour) || { count: 0, successful: 0 }
    hourStats.set(hour, {
      count: current.count + 1,
      successful: current.successful + 1,
    })
  })

  const optimalStartTimes = Array.from(hourStats.entries())
    .map(([hour, stats]) => ({
      hour,
      successRate: Math.round((stats.successful / stats.count) * 100),
      count: stats.count,
    }))
    .filter((item) => item.count >= 2) // Only include hours with at least 2 sessions

  // Analyze seasonal trends (simplified)
  const monthStats = new Map<string, { count: number; totalDuration: number; successful: number }>()
  completedSessions.forEach((session) => {
    const month = new Date(session.start_time).toLocaleDateString("en-US", { month: "long" })
    const duration = session.actual_end_time
      ? (new Date(session.actual_end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60 * 60)
      : 0

    const current = monthStats.get(month) || { count: 0, totalDuration: 0, successful: 0 }
    monthStats.set(month, {
      count: current.count + 1,
      totalDuration: current.totalDuration + duration,
      successful: current.successful + 1,
    })
  })

  const seasonalTrends = Array.from(monthStats.entries()).map(([month, stats]) => ({
    month,
    averageDuration: Math.round((stats.totalDuration / stats.count) * 10) / 10,
    successRate: Math.round((stats.successful / stats.count) * 100),
  }))

  return {
    preferredFastingTypes,
    bestPerformingDays,
    optimalStartTimes,
    seasonalTrends,
  }
}

function analyzeHealthImpacts(completedSessions: Array<Record<string, any>>, logs: Array<Record<string, any>>) {
  // Analyze glucose improvements
  const glucoseSessions = completedSessions.filter((s) => s.glucose_start && s.glucose_end)
  const glucoseReductions = glucoseSessions.map((s) => ({
    date: s.start_time,
    start: s.glucose_start,
    end: s.glucose_end,
    reduction: s.glucose_start - s.glucose_end,
  }))

  const averageGlucoseReduction =
    glucoseReductions.length > 0
      ? glucoseReductions.reduce((sum, r) => sum + r.reduction, 0) / glucoseReductions.length
      : 0

  const glucoseTrend = determineHealthTrend(glucoseReductions.map((r) => r.reduction))

  // Analyze weight progress
  const weightSessions = completedSessions.filter((s) => s.weight_start)
  const weightData = weightSessions.map((s) => ({
    date: s.start_time,
    weight: s.weight_start,
  }))

  const totalWeightChange = weightData.length > 1 ? weightData[0].weight - weightData[weightData.length - 1].weight : 0

  const weightTrend = totalWeightChange > 1 ? "losing" : totalWeightChange < -1 ? "gaining" : "stable"

  // Analyze energy levels
  const energySessions = completedSessions.filter((s) => s.energy_level_start && s.energy_level_end)
  const averageEnergyStart =
    energySessions.length > 0
      ? energySessions.reduce((sum, s) => sum + s.energy_level_start, 0) / energySessions.length
      : 5

  const averageEnergyEnd =
    energySessions.length > 0
      ? energySessions.reduce((sum, s) => sum + (s.energy_level_end || s.energy_level_start), 0) / energySessions.length
      : 5

  const energyImprovement = averageEnergyEnd - averageEnergyStart
  const energyTrend = energyImprovement > 0.5 ? "improving" : energyImprovement < -0.5 ? "declining" : "stable"

  return {
    glucoseImprovement: {
      averageReduction: Math.round(averageGlucoseReduction),
      trend: glucoseTrend,
      sessions: glucoseReductions,
    },
    weightProgress: {
      totalChange: Math.round(totalWeightChange * 10) / 10,
      trend: weightTrend,
      sessions: weightData,
    },
    energyLevels: {
      averageStart: Math.round(averageEnergyStart * 10) / 10,
      averageEnd: Math.round(averageEnergyEnd * 10) / 10,
      improvement: Math.round(energyImprovement * 10) / 10,
      trend: energyTrend,
    },
  }
}

function determineHealthTrend(values: number[]): "improving" | "stable" | "declining" {
  if (values.length < 3) return "stable"

  const recent = values.slice(-3)
  const earlier = values.slice(0, -3)

  if (earlier.length === 0) return "stable"

  const recentAvg = recent.reduce((sum, v) => sum + v, 0) / recent.length
  const earlierAvg = earlier.reduce((sum, v) => sum + v, 0) / earlier.length

  const improvement = recentAvg - earlierAvg
  return improvement > 2 ? "improving" : improvement < -2 ? "declining" : "stable"
}

function generatePredictions(completedSessions: Array<Record<string, any>>, logs: Array<Record<string, any>>) {
  const recentSessions = completedSessions.slice(0, 10)
  const successRate =
    recentSessions.length > 0
      ? recentSessions.filter((s) => s.status === "completed").length / recentSessions.length
      : 0.7

  // Simple prediction based on recent success rate and patterns
  const nextFastSuccess = {
    probability: Math.min(0.95, Math.max(0.3, successRate + 0.1)),
    factors: [
      successRate > 0.8 ? "High recent success rate" : "Moderate recent success rate",
      "Consistent fasting schedule",
      "Good health monitoring",
    ],
    recommendations: [
      "Maintain your current fasting schedule",
      "Continue monitoring glucose levels",
      "Stay well hydrated",
    ],
  }

  // Recommend optimal schedule based on most successful pattern
  const mostSuccessfulType = completedSessions.reduce(
    (acc, session) => {
      acc[session.fasting_type] = (acc[session.fasting_type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const recommendedType = Object.entries(mostSuccessfulType).sort(([, a], [, b]) => b - a)[0]?.[0] || "16:8"

  const optimalSchedule = {
    recommendedType,
    recommendedStartTime: "8:00 PM",
    expectedDuration: recommendedType === "16:8" ? 16 : recommendedType === "18:6" ? 18 : 20,
    confidence: 0.8,
  }

  const goalProjections = {
    weightLossProjection: {
      timeframe: "month",
      expectedLoss: 2.5,
      confidence: 0.7,
    },
    glucoseControlProjection: {
      timeframe: "month",
      expectedImprovement: 15,
      confidence: 0.8,
    },
  }

  return {
    nextFastSuccess,
    optimalSchedule,
    goalProjections,
  }
}
