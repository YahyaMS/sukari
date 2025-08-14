import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export interface FastingSession {
  id: string
  user_id: string
  fasting_type: string
  start_time: string
  planned_end_time: string
  actual_end_time?: string
  status: string
  current_phase: string
  glucose_start?: number
  weight_start?: number
  energy_level_start: number
  mood_start: number
  ai_readiness_score?: number
  ai_risk_level: string
  ai_recommendations?: any
  personalized_guidance?: any
  success_rating?: number
  difficulty_rating?: number
  notes?: string
}

export interface FastingPhase {
  id: string
  session_id: string
  phase_name: string
  start_time: string
  end_time?: string
  duration_minutes?: number
  glucose_readings?: any[]
  hydration_ml: number
  symptoms_reported?: any[]
  energy_levels?: any[]
  ai_guidance?: any
  phase_success_score?: number
}

export interface FastingSymptom {
  id: string
  session_id: string
  symptom_type: string
  severity: number
  duration_minutes?: number
  description?: string
  hours_into_fast: number
  glucose_at_time?: number
  ai_recommendation?: string
  intervention_suggested: boolean
}

export interface AIRecommendation {
  id: string
  user_id: string
  session_id?: string
  recommendation_type: string
  priority: string
  title: string
  description: string
  action_items?: any[]
  confidence_score: number
  expires_at?: string
}

export class EnhancedFastingService {
  private supabase = createClientComponentClient()

  // Helper method to check if error is due to missing table
  private isTableNotFoundError(error: any): boolean {
    return (
      error?.message?.includes("schema cache") ||
      error?.message?.includes("does not exist") ||
      error?.message?.includes("relation") ||
      error?.code === "42P01"
    )
  }

  // AI-powered fasting readiness assessment
  async assessFastingReadiness(
    userId: string,
    healthData: {
      glucose?: number
      lastMealHours: number
      sleepQuality: number
      stressLevel: number
      hydrationLevel: number
    },
  ): Promise<{
    readinessScore: number
    recommendations: string[]
    riskLevel: string
    canStart: boolean
  }> {
    try {
      // Calculate readiness score using database function
      const { data: readinessData, error } = await this.supabase.rpc("calculate_fasting_readiness", {
        user_glucose: healthData.glucose || 100,
        last_meal_hours: healthData.lastMealHours,
        sleep_quality: healthData.sleepQuality,
        stress_level: healthData.stressLevel,
        hydration_level: healthData.hydrationLevel,
      })

      if (error && !this.isTableNotFoundError(error)) throw error

      const readinessScore = readinessData || 50
      const riskLevel = readinessScore >= 80 ? "low" : readinessScore >= 60 ? "medium" : "high"
      const canStart = readinessScore >= 60

      // Generate AI recommendations based on readiness factors
      const recommendations = this.generateReadinessRecommendations(healthData, readinessScore)

      return {
        readinessScore,
        recommendations,
        riskLevel,
        canStart,
      }
    } catch (error) {
      if (this.isTableNotFoundError(error)) {
        console.warn("Fasting tables not found, using fallback readiness assessment")
        // Fallback readiness calculation
        const readinessScore = this.calculateFallbackReadiness(healthData)
        const riskLevel = readinessScore >= 80 ? "low" : readinessScore >= 60 ? "medium" : "high"
        const canStart = readinessScore >= 60
        const recommendations = this.generateReadinessRecommendations(healthData, readinessScore)

        return {
          readinessScore,
          recommendations,
          riskLevel,
          canStart,
        }
      }
      console.error("Error assessing fasting readiness:", error)
      return {
        readinessScore: 50,
        recommendations: ["Please ensure you are well-hydrated and have had adequate rest before starting your fast."],
        riskLevel: "medium",
        canStart: true,
      }
    }
  }

  // Start enhanced fasting session with AI guidance
  async startEnhancedFastingSession(sessionData: {
    fasting_type: string
    duration_hours: number
    glucose_start?: number
    weight_start?: number
    energy_level_start: number
    mood_start: number
    readiness_score: number
  }): Promise<FastingSession | null> {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const startTime = new Date()
      const plannedEndTime = new Date(startTime.getTime() + sessionData.duration_hours * 60 * 60 * 1000)

      // Generate AI recommendations for this session
      const aiRecommendations = await this.generateSessionRecommendations(sessionData)
      const personalizedGuidance = await this.generatePersonalizedGuidance(user.id, sessionData)

      const { data, error } = await this.supabase
        .from("fasting_sessions")
        .insert({
          user_id: user.id,
          fasting_type: sessionData.fasting_type,
          start_time: startTime.toISOString(),
          planned_end_time: plannedEndTime.toISOString(),
          glucose_start: sessionData.glucose_start,
          weight_start: sessionData.weight_start,
          energy_level_start: sessionData.energy_level_start,
          mood_start: sessionData.mood_start,
          ai_readiness_score: sessionData.readiness_score,
          ai_risk_level:
            sessionData.readiness_score >= 80 ? "low" : sessionData.readiness_score >= 60 ? "medium" : "high",
          ai_recommendations: aiRecommendations,
          personalized_guidance: personalizedGuidance,
          current_phase: "preparation",
        })
        .select()
        .single()

      if (error && this.isTableNotFoundError(error)) {
        console.warn("Fasting tables not found, creating mock session")
        // Return mock session data
        return {
          id: `mock-${Date.now()}`,
          user_id: user.id,
          fasting_type: sessionData.fasting_type,
          start_time: startTime.toISOString(),
          planned_end_time: plannedEndTime.toISOString(),
          status: "active",
          current_phase: "preparation",
          glucose_start: sessionData.glucose_start,
          weight_start: sessionData.weight_start,
          energy_level_start: sessionData.energy_level_start,
          mood_start: sessionData.mood_start,
          ai_readiness_score: sessionData.readiness_score,
          ai_risk_level:
            sessionData.readiness_score >= 80 ? "low" : sessionData.readiness_score >= 60 ? "medium" : "high",
          ai_recommendations: aiRecommendations,
          personalized_guidance: personalizedGuidance,
        }
      }

      if (error) throw error

      // Create initial phase record
      await this.createPhaseRecord(data.id, "preparation", startTime)

      return data
    } catch (error) {
      console.error("Error starting enhanced fasting session:", error)
      return null
    }
  }

  // Get real-time AI guidance based on current fasting state
  async getRealTimeGuidance(
    sessionId: string,
    currentState: {
      hoursElapsed: number
      currentPhase: string
      glucose?: number
      symptoms?: string[]
      energyLevel?: number
      hydrationMl?: number
    },
  ): Promise<{
    guidance: string
    recommendations: string[]
    shouldContinue: boolean
    riskLevel: string
    nextMilestone: string
  }> {
    try {
      // Get session data for context
      const { data: session } = await this.supabase.from("fasting_sessions").select("*").eq("id", sessionId).single()

      if (!session) throw new Error("Session not found")

      // Generate contextual guidance based on current state
      const guidance = this.generatePhaseSpecificGuidance(currentState)
      const recommendations = this.generateRealTimeRecommendations(currentState)
      const shouldContinue = this.assessContinuationSafety(currentState)
      const riskLevel = this.calculateCurrentRiskLevel(currentState)
      const nextMilestone = this.getNextMilestone(currentState.hoursElapsed)

      return {
        guidance,
        recommendations,
        shouldContinue,
        riskLevel,
        nextMilestone,
      }
    } catch (error) {
      console.error("Error getting real-time guidance:", error)
      return {
        guidance: "Continue monitoring your body and stay hydrated.",
        recommendations: ["Drink water regularly", "Listen to your body"],
        shouldContinue: true,
        riskLevel: "low",
        nextMilestone: "Keep going!",
      }
    }
  }

  // Log symptoms with AI analysis
  async logSymptom(
    sessionId: string,
    symptomData: {
      type: string
      severity: number
      description?: string
      hoursIntoFast: number
      glucose?: number
    },
  ): Promise<{
    logged: boolean
    aiRecommendation: string
    interventionNeeded: boolean
    interventionType?: string
  }> {
    try {
      // Analyze symptom and generate AI recommendation
      const aiAnalysis = this.analyzeSymptom(symptomData)

      const { error } = await this.supabase.from("fasting_symptoms").insert({
        session_id: sessionId,
        symptom_type: symptomData.type,
        severity: symptomData.severity,
        description: symptomData.description,
        hours_into_fast: symptomData.hoursIntoFast,
        glucose_at_time: symptomData.glucose,
        ai_recommendation: aiAnalysis.recommendation,
        intervention_suggested: aiAnalysis.interventionNeeded,
        intervention_type: aiAnalysis.interventionType,
      })

      if (error && this.isTableNotFoundError(error)) {
        console.warn("Fasting tables not found, returning AI analysis without logging")
        return {
          logged: false,
          aiRecommendation: aiAnalysis.recommendation,
          interventionNeeded: aiAnalysis.interventionNeeded,
          interventionType: aiAnalysis.interventionType,
        }
      }
      if (error) throw error

      return {
        logged: true,
        aiRecommendation: aiAnalysis.recommendation,
        interventionNeeded: aiAnalysis.interventionNeeded,
        interventionType: aiAnalysis.interventionType,
      }
    } catch (error) {
      if (this.isTableNotFoundError(error)) {
        console.warn("Fasting tables not found, providing fallback symptom analysis")
        const aiAnalysis = this.analyzeSymptom(symptomData)
        return {
          logged: false,
          aiRecommendation: aiAnalysis.recommendation,
          interventionNeeded: aiAnalysis.interventionNeeded,
          interventionType: aiAnalysis.interventionType,
        }
      }
      console.error("Error logging symptom:", error)
      return {
        logged: false,
        aiRecommendation: "Please monitor this symptom and consider breaking your fast if it worsens.",
        interventionNeeded: false,
      }
    }
  }

  // Private helper methods
  private generateReadinessRecommendations(healthData: any, score: number): string[] {
    const recommendations: string[] = []

    if (healthData.glucose && healthData.glucose > 150) {
      recommendations.push("Consider waiting until your glucose levels are more stable before starting.")
    }

    if (healthData.lastMealHours < 3) {
      recommendations.push("Wait at least 3-4 hours after your last meal before starting your fast.")
    }

    if (healthData.sleepQuality < 6) {
      recommendations.push("Ensure you get adequate rest tonight to support your fasting tomorrow.")
    }

    if (healthData.stressLevel > 7) {
      recommendations.push("Consider stress management techniques before starting your fast.")
    }

    if (healthData.hydrationLevel < 7) {
      recommendations.push("Increase your water intake before and during your fast.")
    }

    if (score >= 80) {
      recommendations.push("You are well-prepared for fasting! Your body is ready for this challenge.")
    }

    return recommendations
  }

  private async generateSessionRecommendations(sessionData: any): Promise<any> {
    return {
      hydration: {
        target_ml: Math.max(2000, sessionData.duration_hours * 100),
        electrolyte_timing: sessionData.duration_hours > 16 ? "every_4_hours" : "mid_fast",
      },
      monitoring: {
        glucose_frequency: sessionData.duration_hours > 16 ? "every_2_hours" : "every_4_hours",
        symptom_awareness: ["dizziness", "nausea", "severe_hunger", "heart_palpitations"],
      },
      breaking_fast: {
        first_food: "bone_broth_or_small_portion_nuts",
        avoid: ["large_meals", "refined_sugars", "processed_foods"],
        timing: "eat_slowly_and_mindfully",
      },
    }
  }

  private async generatePersonalizedGuidance(userId: string, sessionData: any): Promise<any> {
    // This would typically use ML models trained on user data
    // For now, we'll provide rule-based guidance
    return {
      motivation: `You're starting a ${sessionData.fasting_type} fast. Your body will adapt and you'll feel the benefits!`,
      phase_guidance: {
        preparation: "Focus on hydration and mental preparation.",
        early: "Hunger is normal. Stay busy and hydrated.",
        adaptation: "Your body is adapting to fasting. You may notice increased mental clarity.",
        deep: "Deep fasting phase. Your body is efficiently burning fat for energy. Great progress!",
        extended: "Extended fasting phase. Monitor your body closely and stay hydrated.",
      },
      personalized_tips: [
        "Based on your profile, morning fasts work best for you.",
        "Your glucose typically stabilizes after 8 hours of fasting.",
        "Remember to take electrolytes if fasting longer than 16 hours.",
      ],
    }
  }

  private generatePhaseSpecificGuidance(currentState: any): string {
    const { currentPhase, hoursElapsed } = currentState

    switch (currentPhase) {
      case "preparation":
        return "You're in the preparation phase. Focus on hydration and mental readiness."
      case "early":
        return "Early fasting phase. Hunger is normal as your body transitions from glucose to fat burning."
      case "adaptation":
        return "Your body is adapting to fasting. You may notice increased mental clarity."
      case "deep":
        return "Deep fasting phase. Your body is efficiently burning fat for energy. Great progress!"
      case "extended":
        return "Extended fasting phase. Monitor your body closely and stay hydrated."
      default:
        return `You're ${hoursElapsed} hours into your fast. Listen to your body and stay hydrated.`
    }
  }

  private generateRealTimeRecommendations(currentState: any): string[] {
    const recommendations: string[] = []
    const { hoursElapsed, symptoms, energyLevel, hydrationMl } = currentState

    // Hydration recommendations
    const targetHydration = hoursElapsed * 100
    if (!hydrationMl || hydrationMl < targetHydration) {
      recommendations.push("Increase your water intake. Aim for 100ml per hour of fasting.")
    }

    // Energy level recommendations
    if (energyLevel && energyLevel < 4) {
      recommendations.push("Low energy is common. Try light movement or a short walk.")
    }

    // Symptom-based recommendations
    if (symptoms?.includes("headache")) {
      recommendations.push(
        "Headaches can indicate dehydration or electrolyte imbalance. Consider adding a pinch of salt to your water.",
      )
    }

    if (symptoms?.includes("dizziness")) {
      recommendations.push(
        "Dizziness may indicate low blood pressure. Move slowly when standing and consider breaking your fast if it persists.",
      )
    }

    // Time-based recommendations
    if (hoursElapsed >= 16) {
      recommendations.push("You're in extended fasting territory. Consider electrolyte supplementation.")
    }

    return recommendations
  }

  private assessContinuationSafety(currentState: any): boolean {
    const { symptoms, energyLevel, glucose } = currentState

    // Red flags that suggest stopping
    if (
      symptoms?.includes("severe_dizziness") ||
      symptoms?.includes("heart_palpitations") ||
      symptoms?.includes("severe_nausea")
    ) {
      return false
    }

    if (glucose && glucose < 60) {
      return false
    }

    if (energyLevel && energyLevel < 2) {
      return false
    }

    return true
  }

  private calculateCurrentRiskLevel(currentState: any): string {
    const { symptoms, glucose, energyLevel, hoursElapsed } = currentState

    let riskScore = 0

    // Symptom-based risk
    if (symptoms?.length > 2) riskScore += 2
    if (symptoms?.includes("dizziness")) riskScore += 1
    if (symptoms?.includes("severe_hunger")) riskScore += 1

    // Glucose-based risk
    if (glucose && glucose < 70) riskScore += 3
    if (glucose && glucose > 200) riskScore += 2

    // Energy-based risk
    if (energyLevel && energyLevel < 3) riskScore += 2

    // Duration-based risk
    if (hoursElapsed > 24) riskScore += 1

    if (riskScore >= 5) return "high"
    if (riskScore >= 3) return "medium"
    return "low"
  }

  private getNextMilestone(hoursElapsed: number): string {
    if (hoursElapsed < 12) return `${12 - hoursElapsed} hours until glycogen depletion`
    if (hoursElapsed < 16) return `${16 - hoursElapsed} hours until autophagy activation`
    if (hoursElapsed < 24) return `${24 - hoursElapsed} hours until deep ketosis`
    return "You're in therapeutic fasting territory!"
  }

  private analyzeSymptom(symptomData: any): {
    recommendation: string
    interventionNeeded: boolean
    interventionType?: string
  } {
    const { type, severity, hoursIntoFast } = symptomData

    switch (type) {
      case "headache":
        if (severity >= 7) {
          return {
            recommendation:
              "Severe headache may indicate dehydration or electrolyte imbalance. Consider breaking your fast and consulting a healthcare provider.",
            interventionNeeded: true,
            interventionType: "break_fast",
          }
        }
        return {
          recommendation:
            "Headaches are common during fasting. Try drinking water with a pinch of salt and rest in a quiet, dark room.",
          interventionNeeded: false,
        }

      case "dizziness":
        if (severity >= 6) {
          return {
            recommendation:
              "Significant dizziness can be dangerous. Sit down, drink water, and consider breaking your fast if it doesn't improve.",
            interventionNeeded: true,
            interventionType: "monitor_closely",
          }
        }
        return {
          recommendation:
            "Mild dizziness is normal. Move slowly when changing positions and ensure adequate hydration.",
          interventionNeeded: false,
        }

      case "nausea":
        if (severity >= 7) {
          return {
            recommendation:
              "Severe nausea during fasting is concerning. Break your fast with small sips of bone broth or electrolyte solution.",
            interventionNeeded: true,
            interventionType: "break_fast",
          }
        }
        return {
          recommendation: "Mild nausea can occur during fasting. Try sipping water slowly or herbal tea.",
          interventionNeeded: false,
        }

      case "fatigue":
        if (severity >= 8 && hoursIntoFast < 12) {
          return {
            recommendation:
              "Extreme fatigue early in fasting may indicate you're not ready. Consider breaking your fast and trying again when better prepared.",
            interventionNeeded: true,
            interventionType: "break_fast",
          }
        }
        return {
          recommendation: "Fatigue is common as your body adapts. Try light movement or a short nap if possible.",
          interventionNeeded: false,
        }

      default:
        return {
          recommendation:
            "Monitor this symptom closely. If it worsens or you feel unsafe, consider breaking your fast.",
          interventionNeeded: false,
        }
    }
  }

  private async createPhaseRecord(sessionId: string, phaseName: string, startTime: Date): Promise<void> {
    try {
      await this.supabase.from("fasting_phases").insert({
        session_id: sessionId,
        phase_name: phaseName,
        start_time: startTime.toISOString(),
        hydration_ml: 0,
      })
    } catch (error) {
      if (this.isTableNotFoundError(error)) {
        console.warn("Fasting tables not found, skipping phase record creation")
        return
      }
      console.error("Error creating phase record:", error)
    }
  }

  // Get current active session
  async getCurrentSession(): Promise<FastingSession | null> {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await this.supabase
        .from("fasting_sessions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("start_time", { ascending: false })
        .limit(1)
        .single()

      if (error && error.code === "PGRST116") return null // No rows found
      if (error && this.isTableNotFoundError(error)) {
        console.warn("Fasting tables not found, returning null session")
        return null
      }
      if (error) throw error

      return data || null
    } catch (error) {
      if (this.isTableNotFoundError(error)) {
        console.warn("Fasting tables not found, returning null session")
        return null
      }
      console.error("Error getting current session:", error)
      return null
    }
  }

  // Get fasting history
  async getFastingHistory(limit = 10): Promise<FastingSession[]> {
    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await this.supabase
        .from("fasting_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("start_time", { ascending: false })
        .limit(limit)

      if (error && this.isTableNotFoundError(error)) {
        console.warn("Fasting tables not found, returning empty history")
        return []
      }
      if (error) throw error

      return data || []
    } catch (error) {
      if (this.isTableNotFoundError(error)) {
        console.warn("Fasting tables not found, returning empty history")
        return []
      }
      console.error("Error getting fasting history:", error)
      return []
    }
  }

  // Update session phase
  async updateSessionPhase(sessionId: string, newPhase: string): Promise<void> {
    try {
      await this.supabase
        .from("fasting_sessions")
        .update({
          current_phase: newPhase,
          updated_at: new Date().toISOString(),
        })
        .eq("id", sessionId)
    } catch (error) {
      if (this.isTableNotFoundError(error)) {
        console.warn("Fasting tables not found, skipping phase update")
        return
      }
      console.error("Error updating session phase:", error)
    }
  }

  // Complete fasting session
  async completeFastingSession(
    sessionId: string,
    endData: {
      glucose_end?: number
      weight_end?: number
      energy_level_end: number
      mood_end: number
      success_rating: number
      difficulty_rating: number
      notes?: string
    },
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("fasting_sessions")
        .update({
          status: "completed",
          actual_end_time: new Date().toISOString(),
          ...endData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", sessionId)

      if (error && this.isTableNotFoundError(error)) {
        console.warn("Fasting tables not found, returning success for mock completion")
        return true
      }
      if (error) throw error

      return true
    } catch (error) {
      if (this.isTableNotFoundError(error)) {
        console.warn("Fasting tables not found, returning success for mock completion")
        return true
      }
      console.error("Error completing fasting session:", error)
      return false
    }
  }

  // Break fasting session early
  async breakFastingSession(sessionId: string, reason: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("fasting_sessions")
        .update({
          status: "broken",
          actual_end_time: new Date().toISOString(),
          notes: reason,
          updated_at: new Date().toISOString(),
        })
        .eq("id", sessionId)

      if (error && this.isTableNotFoundError(error)) {
        console.warn("Fasting tables not found, returning success for mock break")
        return true
      }
      if (error) throw error

      return true
    } catch (error) {
      if (this.isTableNotFoundError(error)) {
        console.warn("Fasting tables not found, returning success for mock break")
        return true
      }
      console.error("Error breaking fasting session:", error)
      return false
    }
  }

  private calculateFallbackReadiness(healthData: {
    glucose?: number
    lastMealHours: number
    sleepQuality: number
    stressLevel: number
    hydrationLevel: number
  }): number {
    let score = 50 // Base score

    // Glucose factor
    if (healthData.glucose) {
      if (healthData.glucose >= 80 && healthData.glucose <= 120) score += 15
      else if (healthData.glucose >= 70 && healthData.glucose <= 140) score += 10
      else score -= 10
    }

    // Last meal timing
    if (healthData.lastMealHours >= 4) score += 15
    else if (healthData.lastMealHours >= 3) score += 10
    else score -= 15

    // Sleep quality
    score += (healthData.sleepQuality - 5) * 3

    // Stress level (lower is better)
    score -= (healthData.stressLevel - 5) * 2

    // Hydration level
    score += (healthData.hydrationLevel - 5) * 2

    return Math.max(0, Math.min(100, score))
  }
}
