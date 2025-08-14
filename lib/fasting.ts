import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export interface FastingSession {
  id: string
  user_id: string
  fasting_type: string
  start_time: string
  planned_end_time: string
  actual_end_time?: string
  status: "active" | "paused" | "completed" | "broken"
  current_phase: "preparation" | "early" | "deep" | "extended" | "refeeding"
  glucose_start?: number
  glucose_end?: number
  weight_start?: number
  weight_end?: number
  energy_level_start?: number
  energy_level_end?: number
  difficulty_rating?: number
  notes?: string
  ai_recommendations?: any
  created_at: string
  updated_at: string
}

export interface FastingLog {
  id: string
  session_id: string
  user_id: string
  log_time: string
  log_type: "symptom" | "glucose" | "hydration" | "energy" | "mood" | "emergency"
  value: any
  ai_response?: string
  created_at: string
}

export class FastingService {
  private supabase = createClientComponentClient()

  async startFastingSession(data: {
    fasting_type: string
    planned_duration_hours: number
    glucose_start?: number
    weight_start?: number
    energy_level_start?: number
  }): Promise<FastingSession | null> {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()
      if (!user) return null

      const start_time = new Date()
      const planned_end_time = new Date(start_time.getTime() + data.planned_duration_hours * 60 * 60 * 1000)

      const { data: session, error } = await this.supabase
        .from("fasting_sessions")
        .insert({
          user_id: user.id,
          fasting_type: data.fasting_type,
          start_time: start_time.toISOString(),
          planned_end_time: planned_end_time.toISOString(),
          glucose_start: data.glucose_start,
          weight_start: data.weight_start,
          energy_level_start: data.energy_level_start,
          status: "active",
          current_phase: "early",
        })
        .select()
        .single()

      if (error) {
        console.error("Error starting fasting session:", error)
        return null
      }

      return session
    } catch (error) {
      console.error("Error starting fasting session:", error)
      return null
    }
  }

  async getCurrentSession(): Promise<FastingSession | null> {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()
      if (!user) return null

      const { data: session, error } = await this.supabase
        .from("fasting_sessions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("Error getting current session:", error)
        return null
      }

      return session || null
    } catch (error) {
      console.error("Error getting current session:", error)
      return null
    }
  }

  async updateSessionPhase(sessionId: string, phase: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("fasting_sessions")
        .update({
          current_phase: phase,
          updated_at: new Date().toISOString(),
        })
        .eq("id", sessionId)

      return !error
    } catch (error) {
      console.error("Error updating session phase:", error)
      return false
    }
  }

  async logFastingEvent(data: {
    session_id: string
    log_type: string
    value: any
  }): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()
      if (!user) return false

      const { error } = await this.supabase.from("fasting_logs").insert({
        session_id: data.session_id,
        user_id: user.id,
        log_type: data.log_type,
        value: data.value,
      })

      return !error
    } catch (error) {
      console.error("Error logging fasting event:", error)
      return false
    }
  }

  async endFastingSession(
    sessionId: string,
    data: {
      glucose_end?: number
      weight_end?: number
      energy_level_end?: number
      difficulty_rating?: number
      notes?: string
    },
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("fasting_sessions")
        .update({
          status: "completed",
          actual_end_time: new Date().toISOString(),
          glucose_end: data.glucose_end,
          weight_end: data.weight_end,
          energy_level_end: data.energy_level_end,
          difficulty_rating: data.difficulty_rating,
          notes: data.notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", sessionId)

      return !error
    } catch (error) {
      console.error("Error ending fasting session:", error)
      return false
    }
  }

  async getFastingHistory(limit = 10): Promise<FastingSession[]> {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()
      if (!user) return []

      const { data: sessions, error } = await this.supabase
        .from("fasting_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) {
        console.error("Error getting fasting history:", error)
        return []
      }

      return sessions || []
    } catch (error) {
      console.error("Error getting fasting history:", error)
      return []
    }
  }

  calculateFastingPhase(startTime: string, currentTime: Date): string {
    const start = new Date(startTime)
    const hoursElapsed = (currentTime.getTime() - start.getTime()) / (1000 * 60 * 60)

    if (hoursElapsed < 4) return "early"
    if (hoursElapsed < 12) return "deep"
    if (hoursElapsed < 16) return "extended"
    return "therapeutic"
  }

  getPhaseInfo(phase: string) {
    const phases = {
      early: {
        name: "Early Fasting",
        description: "Your body is using stored glucose",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        benefits: ["Digestive rest begins", "Blood sugar stabilizes"],
      },
      deep: {
        name: "Deep Fasting",
        description: "Transitioning to fat burning",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        benefits: ["Fat burning increases", "Ketone production starts"],
      },
      extended: {
        name: "Extended Fasting",
        description: "Optimal fat burning and autophagy",
        color: "text-green-600",
        bgColor: "bg-green-50",
        benefits: ["Peak fat burning", "Autophagy activated", "Mental clarity"],
      },
      therapeutic: {
        name: "Therapeutic Zone",
        description: "Maximum metabolic benefits",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        benefits: ["Deep autophagy", "Stem cell regeneration", "Maximum insulin sensitivity"],
      },
    }

    return phases[phase as keyof typeof phases] || phases.early
  }
}
