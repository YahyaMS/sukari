import { createClient } from "./supabase/client"

export interface Challenge {
  id: string
  title: string
  description: string
  challenge_type: string
  duration_type: string
  start_date: string
  end_date: string
  max_participants: number
  reward_hp: number
  reward_badge: string
  challenge_rules: any
  target_metrics: any
  is_team_challenge: boolean
  is_public: boolean
  created_by: string
  created_at: string
  participant_count?: number
  user_participating?: boolean
  user_rank?: number
  user_score?: number
  days_remaining?: number
}

export interface ChallengeParticipant {
  id: string
  challenge_id: string
  user_id: string
  team_name?: string
  joined_at: string
  progress: any
  current_score: number
  rank: number
  completed: boolean
  completion_date?: string
  user_profiles: {
    first_name: string
    last_name: string
  }
}

export interface ChallengeLeaderboard {
  user_id: string
  rank: number
  score: number
  progress_percentage: number
  first_name: string
  last_name: string
}

export class ChallengeService {
  private supabase

  constructor() {
    this.supabase = createClient()
  }

  private isTableNotFoundError(error: any): boolean {
    return (
      error?.code === "PGRST116" || error?.message?.includes("relation") || error?.message?.includes("does not exist")
    )
  }

  async getActiveChallenges(userId?: string): Promise<Challenge[]> {
    try {
      const query = this.supabase
        .from("challenges")
        .select(`
          *,
          challenge_participants!left(count)
        `)
        .eq("is_active", true)
        .eq("is_public", true)
        .gte("end_date", new Date().toISOString())

      const { data, error } = await query

      if (error) {
        if (this.isTableNotFoundError(error)) {
          return []
        }
        console.error("Error fetching challenges:", error)
        return []
      }

      const challenges = await Promise.all(
        (data || []).map(async (challenge) => {
          const participantCount = challenge.challenge_participants?.[0]?.count || 0

          let userParticipating = false
          let userRank = null
          let userScore = null

          if (userId) {
            const { data: participation } = await this.supabase
              .from("challenge_participants")
              .select("rank, current_score")
              .eq("challenge_id", challenge.id)
              .eq("user_id", userId)
              .single()

            if (participation) {
              userParticipating = true
              userRank = participation.rank
              userScore = participation.current_score
            }
          }

          const daysRemaining = Math.ceil(
            (new Date(challenge.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
          )

          return {
            ...challenge,
            participant_count: participantCount,
            user_participating: userParticipating,
            user_rank: userRank,
            user_score: userScore,
            days_remaining: Math.max(0, daysRemaining),
          }
        }),
      )

      return challenges
    } catch (error) {
      console.error("Error in getActiveChallenges:", error)
      return []
    }
  }

  async getChallengeById(challengeId: string, userId?: string): Promise<Challenge | null> {
    const { data, error } = await this.supabase.from("challenges").select("*").eq("id", challengeId).single()

    if (error || !data) {
      console.error("Error fetching challenge:", error)
      return null
    }

    const { data: participantCount } = await this.supabase
      .from("challenge_participants")
      .select("id", { count: "exact" })
      .eq("challenge_id", challengeId)

    let userParticipating = false
    let userRank = null
    let userScore = null

    if (userId) {
      const { data: participation } = await this.supabase
        .from("challenge_participants")
        .select("rank, current_score")
        .eq("challenge_id", challengeId)
        .eq("user_id", userId)
        .single()

      if (participation) {
        userParticipating = true
        userRank = participation.rank
        userScore = participation.current_score
      }
    }

    const daysRemaining = Math.ceil((new Date(data.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

    return {
      ...data,
      participant_count: participantCount?.length || 0,
      user_participating: userParticipating,
      user_rank: userRank,
      user_score: userScore,
      days_remaining: Math.max(0, daysRemaining),
    }
  }

  async joinChallenge(challengeId: string, userId: string, teamName?: string): Promise<boolean> {
    const { data, error } = await this.supabase.rpc("join_challenge", {
      challenge_id: challengeId,
      user_id: userId,
      team_name: teamName,
    })

    if (error) {
      console.error("Error joining challenge:", error)
      return false
    }

    return data
  }

  async getChallengeLeaderboard(challengeId: string, limit = 50): Promise<ChallengeLeaderboard[]> {
    const { data, error } = await this.supabase
      .from("challenge_leaderboards")
      .select(`
        user_id,
        rank,
        score,
        progress_percentage,
        user_profiles!inner(first_name, last_name)
      `)
      .eq("challenge_id", challengeId)
      .order("rank", { ascending: true })
      .limit(limit)

    if (error) {
      console.error("Error fetching leaderboard:", error)
      return []
    }

    return (
      data?.map((entry) => ({
        user_id: entry.user_id,
        rank: entry.rank,
        score: entry.score,
        progress_percentage: entry.progress_percentage,
        first_name: entry.user_profiles.first_name,
        last_name: entry.user_profiles.last_name,
      })) || []
    )
  }

  async getUserChallenges(userId: string): Promise<Challenge[]> {
    const { data, error } = await this.supabase
      .from("challenge_participants")
      .select(`
        *,
        challenges(*)
      `)
      .eq("user_id", userId)
      .order("joined_at", { ascending: false })

    if (error) {
      console.error("Error fetching user challenges:", error)
      return []
    }

    return (
      data?.map((participation) => ({
        ...participation.challenges,
        user_participating: true,
        user_rank: participation.rank,
        user_score: participation.current_score,
        days_remaining: Math.max(
          0,
          Math.ceil(
            (new Date(participation.challenges.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
          ),
        ),
      })) || []
    )
  }

  async logChallengeProgress(
    challengeId: string,
    userId: string,
    activityType: string,
    activityData: any,
    pointsEarned = 0,
  ): Promise<boolean> {
    const { error } = await this.supabase.rpc("log_challenge_progress", {
      challenge_id: challengeId,
      user_id: userId,
      activity_type: activityType,
      activity_data: activityData,
      points_earned: pointsEarned,
    })

    if (error) {
      console.error("Error logging challenge progress:", error)
      return false
    }

    return true
  }

  getChallengeTypeDisplay(challengeType: string): { title: string; icon: string; color: string } {
    switch (challengeType) {
      case "glucose_stability":
        return { title: "Glucose Stability", icon: "🩸", color: "text-red-600" }
      case "step_master":
        return { title: "Step Master", icon: "👟", color: "text-blue-600" }
      case "meal_prep":
        return { title: "Meal Prep", icon: "🍽️", color: "text-green-600" }
      case "exercise_consistency":
        return { title: "Exercise Consistency", icon: "💪", color: "text-orange-600" }
      case "weight_loss":
        return { title: "Weight Loss", icon: "⚖️", color: "text-purple-600" }
      case "streak_building":
        return { title: "Streak Building", icon: "🔥", color: "text-yellow-600" }
      case "transformation":
        return { title: "Transformation", icon: "🦋", color: "text-pink-600" }
      default:
        return { title: "Health Challenge", icon: "🎯", color: "text-gray-600" }
    }
  }

  getDurationDisplay(durationType: string): string {
    switch (durationType) {
      case "daily":
        return "Daily"
      case "weekly":
        return "Weekly"
      case "monthly":
        return "Monthly"
      case "seasonal":
        return "Seasonal"
      default:
        return "Custom"
    }
  }

  calculateProgress(challenge: Challenge, userProgress: any): number {
    if (!challenge.target_metrics || !userProgress) return 0

    const targetMetrics = challenge.target_metrics
    let totalProgress = 0
    let metricCount = 0

    Object.keys(targetMetrics).forEach((metric) => {
      const target = targetMetrics[metric]
      const current = userProgress[metric] || 0
      const progress = Math.min((current / target) * 100, 100)
      totalProgress += progress
      metricCount++
    })

    return metricCount > 0 ? totalProgress / metricCount : 0
  }
}
