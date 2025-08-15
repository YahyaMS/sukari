import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

interface HealthData {
  sessionId: string
  vitalSigns?: {
    heartRate?: number
    bloodPressure?: { systolic: number; diastolic: number }
    oxygenSaturation?: number
    bodyTemperature?: number
  }
  symptoms?: string[]
  glucoseLevel?: number
  hydrationLevel?: number
  energyLevel?: number
  moodLevel?: number
  painLevel?: number
  timestamp?: string
}

interface RiskAssessment {
  level: "low" | "medium" | "high" | "critical"
  factors: string[]
  recommendations: string[]
  interventions: string[]
  escalationRequired: boolean
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const healthData: HealthData = await request.json()

    // Get current fasting session
    const { data: session } = await supabase
      .from("fasting_sessions")
      .select("*")
      .eq("id", healthData.sessionId)
      .eq("user_id", user.id)
      .single()

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Calculate time into fast
    const timeIntoFast = Math.floor((new Date().getTime() - new Date(session.start_time).getTime()) / (1000 * 60 * 60))

    // Perform risk assessment
    const riskAssessment = assessHealthRisk(healthData, timeIntoFast, session)

    // Log health data
    await supabase.from("fasting_logs").insert({
      session_id: healthData.sessionId,
      user_id: user.id,
      log_type: "health_monitoring",
      value: {
        ...healthData,
        risk_assessment: riskAssessment,
        time_into_fast: timeIntoFast,
      },
    })

    // Handle critical situations
    if (riskAssessment.level === "critical") {
      // Auto-break fast for critical situations
      await supabase
        .from("fasting_sessions")
        .update({
          status: "broken",
          actual_end_time: new Date().toISOString(),
          notes: "Auto-terminated due to critical health risk",
        })
        .eq("id", healthData.sessionId)

      // Log emergency intervention
      await supabase.from("fasting_logs").insert({
        session_id: healthData.sessionId,
        user_id: user.id,
        log_type: "emergency",
        value: {
          action: "auto_break_fast",
          reason: "critical_health_risk",
          risk_factors: riskAssessment.factors,
        },
      })
    }

    return NextResponse.json({
      riskAssessment,
      recommendations: generateHealthRecommendations(healthData, riskAssessment, timeIntoFast),
      interventions: riskAssessment.interventions,
      emergencyBreak: riskAssessment.level === "critical",
    })
  } catch (error) {
    console.error("Error in health monitoring:", error)
    return NextResponse.json({ error: "Failed to process health data" }, { status: 500 })
  }
}

type RiskLevel = "low" | "medium" | "high" | "critical"

function assessHealthRisk(healthData: HealthData, timeIntoFast: number, session: any): RiskAssessment {
  const riskFactors: string[] = []
  let riskLevel: RiskLevel = "low"
  const recommendations: string[] = []
  const interventions: string[] = []

  // Glucose level assessment
  if (healthData.glucoseLevel) {
    if (healthData.glucoseLevel < 60) {
      riskFactors.push("Severe hypoglycemia (glucose < 60 mg/dL)")
      riskLevel = "critical"
      interventions.push("Break fast immediately")
      interventions.push("Consume 15-20g fast-acting carbohydrates")
      interventions.push("Contact healthcare provider")
    } else if (healthData.glucoseLevel < 70) {
      riskFactors.push("Hypoglycemia (glucose < 70 mg/dL)")
      riskLevel = riskLevel === "low" ? "high" : riskLevel === "medium" ? "high" : riskLevel
      recommendations.push("Monitor closely and consider breaking fast")
      recommendations.push("Have glucose tablets readily available")
    } else if (healthData.glucoseLevel < 80) {
      riskFactors.push("Low glucose (glucose < 80 mg/dL)")
      riskLevel = riskLevel === "low" ? "medium" : riskLevel
      recommendations.push("Monitor glucose levels more frequently")
    }
  }

  // Vital signs assessment
  if (healthData.vitalSigns) {
    const { heartRate, bloodPressure, oxygenSaturation, bodyTemperature } = healthData.vitalSigns

    // Heart rate assessment
    if (heartRate) {
      if (heartRate < 50 || heartRate > 120) {
        riskFactors.push(`Abnormal heart rate: ${heartRate} bpm`)
        riskLevel = riskLevel === "low" ? "high" : riskLevel === "medium" ? "high" : riskLevel
        recommendations.push("Monitor heart rate closely")
        if (heartRate < 40 || heartRate > 140) {
          riskLevel = "critical"
          interventions.push("Seek immediate medical attention")
        }
      }
    }

    // Blood pressure assessment
    if (bloodPressure) {
      if (bloodPressure.systolic < 90 || bloodPressure.diastolic < 60) {
        riskFactors.push("Hypotension detected")
        riskLevel = riskLevel === "low" ? "medium" : riskLevel
        recommendations.push("Increase fluid and electrolyte intake")
      }
      if (bloodPressure.systolic > 180 || bloodPressure.diastolic > 110) {
        riskFactors.push("Severe hypertension detected")
        riskLevel = "critical"
        interventions.push("Break fast and seek medical attention")
      }
    }

    // Oxygen saturation assessment
    if (oxygenSaturation && oxygenSaturation < 95) {
      riskFactors.push("Low oxygen saturation")
      riskLevel = "critical"
      interventions.push("Seek immediate medical attention")
    }

    // Body temperature assessment
    if (bodyTemperature) {
      if (bodyTemperature < 96 || bodyTemperature > 100.4) {
        riskFactors.push("Abnormal body temperature")
        riskLevel = riskLevel === "low" ? "medium" : riskLevel
        recommendations.push("Monitor temperature and hydration")
      }
    }
  }

  // Symptom assessment
  if (healthData.symptoms && healthData.symptoms.length > 0) {
    const criticalSymptoms = [
      "chest pain",
      "difficulty breathing",
      "severe dizziness",
      "fainting",
      "severe nausea",
      "vomiting",
      "confusion",
    ]
    const moderateSymptoms = ["dizziness", "headache", "fatigue", "nausea", "irritability"]

    const hasCriticalSymptoms = healthData.symptoms.some((symptom) =>
      criticalSymptoms.some((critical) => symptom.toLowerCase().includes(critical)),
    )

    const hasModerateSymptoms = healthData.symptoms.some((symptom) =>
      moderateSymptoms.some((moderate) => symptom.toLowerCase().includes(moderate)),
    )

    if (hasCriticalSymptoms) {
      riskFactors.push("Critical symptoms reported")
      riskLevel = "critical"
      interventions.push("Break fast immediately")
      interventions.push("Seek medical attention")
    } else if (hasModerateSymptoms) {
      riskFactors.push("Moderate symptoms reported")
      riskLevel = riskLevel === "low" ? "medium" : riskLevel
      recommendations.push("Monitor symptoms closely")
      recommendations.push("Consider shortening fast")
    }
  }

  // Energy and mood assessment
  if (healthData.energyLevel && healthData.energyLevel <= 2) {
    riskFactors.push("Very low energy levels")
    riskLevel = riskLevel === "low" ? "medium" : riskLevel
    recommendations.push("Consider breaking fast if energy doesn't improve")
  }

  if (healthData.moodLevel && healthData.moodLevel <= 2) {
    riskFactors.push("Very low mood levels")
    recommendations.push("Focus on mental well-being and consider support")
  }

  // Extended fasting duration assessment
  if (timeIntoFast > 24) {
    riskFactors.push("Extended fasting duration (>24 hours)")
    riskLevel = riskLevel === "low" ? "medium" : riskLevel
    recommendations.push("Enhanced monitoring required for extended fasting")
    recommendations.push("Consider medical supervision")
  }

  if (timeIntoFast > 48) {
    riskFactors.push("Very extended fasting duration (>48 hours)")
    riskLevel = riskLevel === "low" ? "high" : riskLevel === "medium" ? "high" : riskLevel
    interventions.push("Medical supervision strongly recommended")
  }

  // Hydration assessment
  if (healthData.hydrationLevel && healthData.hydrationLevel <= 3) {
    riskFactors.push("Poor hydration levels")
    riskLevel = riskLevel === "low" ? "medium" : riskLevel
    recommendations.push("Increase water and electrolyte intake immediately")
  }

  return {
    level: riskLevel,
    factors: riskFactors,
    recommendations,
    interventions,
    escalationRequired: riskLevel === "critical" || riskLevel === "high",
  }
}

function generateHealthRecommendations(
  healthData: HealthData,
  riskAssessment: RiskAssessment,
  timeIntoFast: number,
): string[] {
  const recommendations: string[] = []

  // General recommendations based on time into fast
  if (timeIntoFast < 6) {
    recommendations.push("Stay hydrated with water and electrolytes")
    recommendations.push("Light movement can help with any discomfort")
  } else if (timeIntoFast < 16) {
    recommendations.push("You're in the fat-burning zone - stay strong!")
    recommendations.push("Monitor for any unusual symptoms")
  } else if (timeIntoFast < 24) {
    recommendations.push("Autophagy processes are likely active")
    recommendations.push("Enhanced monitoring is important at this stage")
  } else {
    recommendations.push("Extended fasting requires careful monitoring")
    recommendations.push("Consider medical supervision for safety")
  }

  // Specific recommendations based on current data
  if (healthData.glucoseLevel && healthData.glucoseLevel > 80 && healthData.glucoseLevel < 120) {
    recommendations.push("Your glucose levels look good for fasting")
  }

  if (healthData.energyLevel && healthData.energyLevel >= 6) {
    recommendations.push("Great energy levels - your body is adapting well")
  }

  if (healthData.hydrationLevel && healthData.hydrationLevel >= 7) {
    recommendations.push("Excellent hydration - keep it up!")
  }

  // Risk-specific recommendations
  if (riskAssessment.level === "low") {
    recommendations.push("All indicators look good - continue your fast safely")
  } else if (riskAssessment.level === "medium") {
    recommendations.push("Some areas need attention - monitor closely")
  } else if (riskAssessment.level === "high") {
    recommendations.push("Several risk factors present - consider professional guidance")
  }

  return recommendations
}
