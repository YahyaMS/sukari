"use client"

export interface PatientData {
  id: string
  name: string
  email: string
  age: number
  diabetesType: "1" | "2" | "gestational" | "prediabetes"
  lastActive: Date
  riskLevel: "low" | "medium" | "high"
  currentFastingSession?: {
    type: string
    startTime: Date
    duration: number
    progress: number
  }
  recentMetrics: {
    avgGlucose: number
    weightChange: number
    fastingStreak: number
    adherenceRate: number
  }
}

export interface AnalyticsData {
  totalPatients: number
  activePatients: number
  avgGlucoseImprovement: number
  avgWeightLoss: number
  successRate: number
  riskDistribution: {
    low: number
    medium: number
    high: number
  }
  fastingTypeDistribution: {
    "16:8": number
    "18:6": number
    "20:4": number
    OMAD: number
  }
  monthlyTrends: {
    month: string
    patients: number
    avgGlucose: number
    avgWeight: number
    completionRate: number
  }[]
}

export interface PredictiveInsight {
  patientId: string
  type: "risk_increase" | "plateau" | "success_prediction" | "intervention_needed"
  confidence: number
  message: string
  recommendations: string[]
  urgency: "low" | "medium" | "high"
}

export class CoachAnalyticsService {
  async getPatientList(): Promise<PatientData[]> {
    try {
      // In a real implementation, this would fetch from your database
      // For now, return mock data with error handling for missing tables
      return this.getMockPatientData()
    } catch (error) {
      console.warn("Coach analytics tables not available, using mock data")
      return this.getMockPatientData()
    }
  }

  async getAnalyticsDashboard(): Promise<AnalyticsData> {
    try {
      // In a real implementation, this would calculate from database
      return this.getMockAnalyticsData()
    } catch (error) {
      console.warn("Analytics tables not available, using mock data")
      return this.getMockAnalyticsData()
    }
  }

  async getPredictiveInsights(): Promise<PredictiveInsight[]> {
    try {
      // AI-powered predictive analysis would go here
      return this.getMockPredictiveInsights()
    } catch (error) {
      console.warn("Predictive analytics not available, using mock insights")
      return this.getMockPredictiveInsights()
    }
  }

  async getPatientDetails(patientId: string): Promise<PatientData | null> {
    const patients = await this.getPatientList()
    return patients.find((p) => p.id === patientId) || null
  }

  async updatePatientRisk(patientId: string, riskLevel: "low" | "medium" | "high"): Promise<boolean> {
    try {
      // Update patient risk level in database
      console.log(`Updated patient ${patientId} risk level to ${riskLevel}`)
      return true
    } catch (error) {
      console.error("Failed to update patient risk level:", error)
      return false
    }
  }

  async generatePatientReport(patientId: string): Promise<{
    summary: string
    recommendations: string[]
    metrics: any
  }> {
    const patient = await this.getPatientDetails(patientId)
    if (!patient) throw new Error("Patient not found")

    return {
      summary: `${patient.name} has shown ${patient.recentMetrics.avgGlucose < 140 ? "excellent" : "moderate"} glucose control with ${patient.recentMetrics.adherenceRate}% fasting adherence.`,
      recommendations: [
        "Continue current fasting protocol",
        "Monitor glucose levels more frequently",
        "Consider adjusting meal timing",
      ],
      metrics: patient.recentMetrics,
    }
  }

  private getMockPatientData(): PatientData[] {
    return [
      {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        age: 45,
        diabetesType: "2",
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        riskLevel: "low",
        currentFastingSession: {
          type: "16:8",
          startTime: new Date(Date.now() - 8 * 60 * 60 * 1000),
          duration: 16,
          progress: 50,
        },
        recentMetrics: {
          avgGlucose: 125,
          weightChange: -8.5,
          fastingStreak: 12,
          adherenceRate: 89,
        },
      },
      {
        id: "2",
        name: "Michael Chen",
        email: "michael.c@email.com",
        age: 52,
        diabetesType: "2",
        lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        riskLevel: "medium",
        recentMetrics: {
          avgGlucose: 165,
          weightChange: -3.2,
          fastingStreak: 5,
          adherenceRate: 67,
        },
      },
      {
        id: "3",
        name: "Emily Rodriguez",
        email: "emily.r@email.com",
        age: 38,
        diabetesType: "1",
        lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        riskLevel: "high",
        currentFastingSession: {
          type: "18:6",
          startTime: new Date(Date.now() - 12 * 60 * 60 * 1000),
          duration: 18,
          progress: 67,
        },
        recentMetrics: {
          avgGlucose: 180,
          weightChange: 1.2,
          fastingStreak: 2,
          adherenceRate: 45,
        },
      },
    ]
  }

  private getMockAnalyticsData(): AnalyticsData {
    return {
      totalPatients: 156,
      activePatients: 89,
      avgGlucoseImprovement: 23.5,
      avgWeightLoss: 12.8,
      successRate: 78.2,
      riskDistribution: {
        low: 45,
        medium: 32,
        high: 23,
      },
      fastingTypeDistribution: {
        "16:8": 65,
        "18:6": 25,
        "20:4": 8,
        OMAD: 2,
      },
      monthlyTrends: [
        { month: "Jan", patients: 120, avgGlucose: 145, avgWeight: 185, completionRate: 72 },
        { month: "Feb", patients: 135, avgGlucose: 142, avgWeight: 182, completionRate: 75 },
        { month: "Mar", patients: 156, avgGlucose: 138, avgWeight: 179, completionRate: 78 },
      ],
    }
  }

  private getMockPredictiveInsights(): PredictiveInsight[] {
    return [
      {
        patientId: "2",
        type: "risk_increase",
        confidence: 85,
        message: "Michael Chen shows declining adherence and rising glucose levels",
        recommendations: [
          "Schedule immediate check-in call",
          "Review current fasting protocol",
          "Consider shorter fasting windows initially",
        ],
        urgency: "high",
      },
      {
        patientId: "1",
        type: "success_prediction",
        confidence: 92,
        message: "Sarah Johnson is likely to achieve target glucose levels within 2 weeks",
        recommendations: ["Continue current protocol", "Prepare for maintenance phase transition"],
        urgency: "low",
      },
    ]
  }
}
