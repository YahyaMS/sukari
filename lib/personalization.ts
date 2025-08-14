import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export interface UserBehavior {
  id: string
  user_id: string
  action_type: string
  context: any
  timestamp: string
  session_id?: string
  device_info?: any
}

export interface SmartNudge {
  id: string
  user_id: string
  nudge_type: string
  title: string
  message: string
  action_url?: string
  priority: number
  scheduled_for?: string
  status: string
}

export interface EngagementInsight {
  id: string
  user_id: string
  insight_type: string
  title: string
  description: string
  confidence_score: number
  data_points: any
  action_recommendations: any
  viewed_at?: string
  acted_on: boolean
}

export class PersonalizationEngine {
  private supabase = createServerComponentClient({ cookies })

  // Track user behavior
  async trackBehavior(userId: string, actionType: string, context: any = {}) {
    const { error } = await this.supabase.from("user_behaviors").insert({
      user_id: userId,
      action_type: actionType,
      context,
      session_id: this.generateSessionId(),
      device_info: this.getDeviceInfo(),
    })

    if (error) {
      console.error("Error tracking behavior:", error)
    }
  }

  // Generate personalized nudges
  async generateSmartNudges(userId: string): Promise<SmartNudge[]> {
    // Get user behavior patterns
    const { data: behaviors } = await this.supabase
      .from("user_behaviors")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false })
      .limit(100)

    // Get user personalization settings
    const { data: prefs } = await this.supabase.from("user_personalization").select("*").eq("user_id", userId).single()

    const nudges: Partial<SmartNudge>[] = []

    if (behaviors) {
      // Analyze patterns and generate nudges
      const recentGlucoseLogs = behaviors.filter((b) => b.action_type === "glucose_log")
      const recentMealLogs = behaviors.filter((b) => b.action_type === "meal_log")

      // Missing glucose logs nudge
      if (recentGlucoseLogs.length === 0) {
        nudges.push({
          nudge_type: "reminder",
          title: "Time for your glucose check! 🩸",
          message:
            "You haven't logged your glucose today. Staying on top of your readings helps you understand your patterns better.",
          action_url: "/tracking/glucose",
          priority: 4,
        })
      }

      // Meal logging streak nudge
      if (recentMealLogs.length >= 3) {
        nudges.push({
          nudge_type: "encouragement",
          title: "Amazing meal tracking! 🍽️",
          message:
            "You're building a fantastic habit! Your consistent meal logging is helping you understand your nutrition patterns.",
          action_url: "/tracking/meals",
          priority: 2,
        })
      }

      // Challenge participation nudge
      const challengeActions = behaviors.filter((b) => b.action_type === "challenge_join")
      if (challengeActions.length === 0 && prefs?.engagement_style === "competitive") {
        nudges.push({
          nudge_type: "challenge",
          title: "Ready for a challenge? 🏆",
          message: "Join this week's Glucose Stability Challenge and compete with friends while improving your health!",
          action_url: "/challenges",
          priority: 3,
        })
      }
    }

    // Insert nudges into database
    if (nudges.length > 0) {
      const { data, error } = await this.supabase
        .from("smart_nudges")
        .insert(
          nudges.map((nudge) => ({
            ...nudge,
            user_id: userId,
            scheduled_for: new Date().toISOString(),
          })),
        )
        .select()

      if (error) {
        console.error("Error creating nudges:", error)
        return []
      }

      return data || []
    }

    return []
  }

  // Generate engagement insights
  async generateEngagementInsights(userId: string): Promise<EngagementInsight[]> {
    const { data: behaviors } = await this.supabase
      .from("user_behaviors")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false })
      .limit(200)

    if (!behaviors) return []

    const insights: Partial<EngagementInsight>[] = []

    // Analyze logging patterns
    const glucoseLogs = behaviors.filter((b) => b.action_type === "glucose_log")
    const mealLogs = behaviors.filter((b) => b.action_type === "meal_log")

    // Most active time insight
    const hourCounts = behaviors.reduce(
      (acc, b) => {
        const hour = new Date(b.timestamp).getHours()
        acc[hour] = (acc[hour] || 0) + 1
        return acc
      },
      {} as Record<number, number>,
    )

    const mostActiveHour = Object.entries(hourCounts).sort(([, a], [, b]) => b - a)[0]

    if (mostActiveHour) {
      const hour = Number.parseInt(mostActiveHour[0])
      const timeString = hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`

      insights.push({
        insight_type: "pattern",
        title: "Your Peak Activity Time",
        description: `You're most active on MetaReverse around ${timeString}. Consider scheduling important health tasks during this time for better consistency.`,
        confidence_score: 0.85,
        data_points: { most_active_hour: hour, activity_count: mostActiveHour[1] },
        action_recommendations: {
          suggestions: [
            "Set reminders for glucose checks during your peak time",
            "Schedule meal planning sessions when you're most engaged",
          ],
        },
      })
    }

    // Consistency insight
    const last7Days = behaviors.filter((b) => {
      const behaviorDate = new Date(b.timestamp)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return behaviorDate >= weekAgo
    })

    const dailyActivity = last7Days.reduce(
      (acc, b) => {
        const day = new Date(b.timestamp).toDateString()
        acc[day] = (acc[day] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const activeDays = Object.keys(dailyActivity).length
    const consistencyScore = activeDays / 7

    if (consistencyScore >= 0.8) {
      insights.push({
        insight_type: "achievement_prediction",
        title: "Consistency Champion in the Making!",
        description: `You've been active ${activeDays} out of 7 days this week. Keep this up and you'll unlock the "Consistency Champion" achievement!`,
        confidence_score: 0.92,
        data_points: { active_days: activeDays, consistency_score: consistencyScore },
        action_recommendations: {
          suggestions: ["Maintain your current routine", "Set a daily reminder to keep the streak going"],
        },
      })
    }

    // Insert insights into database
    if (insights.length > 0) {
      const { data, error } = await this.supabase
        .from("engagement_insights")
        .insert(
          insights.map((insight) => ({
            ...insight,
            user_id: userId,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          })),
        )
        .select()

      if (error) {
        console.error("Error creating insights:", error)
        return []
      }

      return data || []
    }

    return []
  }

  // Adaptive difficulty adjustment
  async adjustDifficulty(userId: string, featureType: string, successRate: number) {
    const { data: current } = await this.supabase
      .from("adaptive_difficulty")
      .select("*")
      .eq("user_id", userId)
      .eq("feature_type", featureType)
      .single()

    let newDifficulty = 0.5 // Default medium difficulty

    if (current) {
      // Adjust based on success rate
      if (successRate > 0.8) {
        newDifficulty = Math.min(1.0, current.current_difficulty + 0.1)
      } else if (successRate < 0.4) {
        newDifficulty = Math.max(0.1, current.current_difficulty - 0.1)
      } else {
        newDifficulty = current.current_difficulty
      }

      // Update existing record
      await this.supabase
        .from("adaptive_difficulty")
        .update({
          current_difficulty: newDifficulty,
          success_rate: successRate,
          adjustment_history: [
            ...(current.adjustment_history || []),
            {
              from: current.current_difficulty,
              to: newDifficulty,
              reason: successRate > 0.8 ? "increase_difficulty" : "decrease_difficulty",
              timestamp: new Date().toISOString(),
            },
          ],
          last_adjusted: new Date().toISOString(),
        })
        .eq("id", current.id)
    } else {
      // Create new record
      await this.supabase.from("adaptive_difficulty").insert({
        user_id: userId,
        feature_type: featureType,
        current_difficulty: newDifficulty,
        success_rate: successRate,
      })
    }

    return newDifficulty
  }

  // Get personalized recommendations
  async getPersonalizedRecommendations(userId: string) {
    const [nudges, insights] = await Promise.all([
      this.supabase
        .from("smart_nudges")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "pending")
        .order("priority", { ascending: false })
        .limit(5),
      this.supabase
        .from("engagement_insights")
        .select("*")
        .eq("user_id", userId)
        .is("viewed_at", null)
        .order("confidence_score", { ascending: false })
        .limit(3),
    ])

    return {
      nudges: nudges.data || [],
      insights: insights.data || [],
    }
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15)
  }

  private getDeviceInfo() {
    return {
      user_agent: typeof window !== "undefined" ? window.navigator.userAgent : "server",
      timestamp: new Date().toISOString(),
    }
  }
}

export const personalizationEngine = new PersonalizationEngine()
