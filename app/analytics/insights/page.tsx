"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, CheckCircle, ArrowLeft, Calendar, Activity } from "lucide-react"
import { Icon3D } from "@/components/ui/3d-icon"
import Link from "next/link"

const insights = [
  {
    id: 1,
    type: "pattern",
    priority: "high",
    title: "Optimal Exercise Timing Discovered",
    description:
      "Walking for 15-20 minutes after dinner consistently reduces your post-meal glucose by 22 mg/dL on average.",
    impact: "High",
    confidence: 92,
    actionable: true,
    recommendation: "Continue evening walks and consider extending to 25 minutes for even better results.",
    data: "Based on 45 post-dinner walks over 6 weeks",
  },
  {
    id: 2,
    type: "correlation",
    priority: "medium",
    title: "Sleep Quality Affects Morning Glucose",
    description: "When you sleep less than 6 hours, your fasting glucose averages 15% higher the next morning.",
    impact: "Medium",
    confidence: 87,
    actionable: true,
    recommendation: "Aim for 7-8 hours of sleep nightly. Consider a consistent bedtime routine.",
    data: "Analysis of 30 nights of sleep and glucose data",
  },
  {
    id: 3,
    type: "prediction",
    priority: "high",
    title: "HbA1c Improvement Trajectory",
    description: "Based on your current trends, you're on track to reach your HbA1c goal of 6.5% by March 2024.",
    impact: "High",
    confidence: 89,
    actionable: false,
    recommendation: "Maintain current diet and exercise routine to stay on track.",
    data: "Predictive model using 3 months of glucose data",
  },
  {
    id: 4,
    type: "anomaly",
    priority: "low",
    title: "Weekend Glucose Variability",
    description: "Your glucose levels show 18% more variability on weekends compared to weekdays.",
    impact: "Low",
    confidence: 78,
    actionable: true,
    recommendation: "Try to maintain consistent meal timing on weekends.",
    data: "Comparison of 8 weekends vs weekdays",
  },
]

const riskFactors = [
  {
    factor: "Medication Adherence",
    risk: "Low",
    score: 95,
    trend: "stable",
    description: "Excellent medication compliance",
  },
  {
    factor: "Glucose Variability",
    risk: "Medium",
    score: 72,
    trend: "improving",
    description: "Moderate day-to-day variation",
  },
  {
    factor: "Exercise Consistency",
    risk: "Low",
    score: 88,
    trend: "improving",
    description: "Regular activity pattern established",
  },
  {
    factor: "Dietary Adherence",
    risk: "Medium",
    score: 76,
    trend: "stable",
    description: "Good carb control, room for improvement",
  },
]

export default function InsightsPage() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-accent-red/20 text-accent-red border-accent-red/30"
      case "medium":
        return "bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30"
      case "low":
        return "bg-accent-blue/20 text-accent-blue border-accent-blue/30"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-accent-green"
      case "Medium":
        return "text-accent-yellow"
      case "High":
        return "text-accent-red"
      default:
        return "text-text-secondary"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-accent-green" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-accent-red" />
      default:
        return <Activity className="h-4 w-4 text-text-secondary" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#21262D] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <header className="glass-card border-b border-white/10 relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/analytics">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Icon3D type="cube" color="purple" size="sm" />
              <h1 className="text-2xl font-bold text-white">AI Health Insights</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Insights */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 ring-gradient animate-fade-in-up">
              <div className="flex items-center space-x-2 mb-2">
                <Icon3D type="sphere" color="yellow" size="sm" />
                <h2 className="text-xl font-bold text-white">Personalized Insights</h2>
              </div>
              <p className="text-text-secondary mb-6">AI-powered analysis of your health patterns and trends</p>

              <div className="space-y-6">
                {insights.map((insight) => (
                  <div key={insight.id} className="glass-card p-4 border border-white/10 hover-glow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-white">{insight.title}</h3>
                          <Badge className={getPriorityColor(insight.priority)}>{insight.priority} priority</Badge>
                          {insight.actionable && (
                            <Badge className="bg-accent-green/20 text-accent-green border-accent-green/30">
                              Actionable
                            </Badge>
                          )}
                        </div>
                        <p className="text-text-secondary text-sm mb-3">{insight.description}</p>
                        <div className="glass-card p-3 border border-accent-blue/20 mb-3">
                          <p className="text-sm text-accent-blue">
                            <strong>Recommendation:</strong> {insight.recommendation}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-text-muted">
                          <span>{insight.data}</span>
                          <div className="flex items-center space-x-2">
                            <span>Confidence:</span>
                            <Progress value={insight.confidence} className="w-16 h-1" />
                            <span>{insight.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 ring-gradient animate-fade-in-up">
              <h2 className="text-xl font-bold text-white mb-2">Predictive Analytics</h2>
              <p className="text-text-secondary mb-6">Forecasts based on your current health trends</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-card p-4 border border-accent-green/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingDown className="h-5 w-5 text-accent-green" />
                    <h4 className="font-medium text-white">HbA1c Prediction</h4>
                  </div>
                  <p className="text-2xl font-bold text-accent-green">6.9%</p>
                  <p className="text-sm text-text-secondary">Expected by March 2024</p>
                  <p className="text-xs text-text-muted mt-1">89% confidence</p>
                </div>
                <div className="glass-card p-4 border border-accent-blue/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingDown className="h-5 w-5 text-accent-blue" />
                    <h4 className="font-medium text-white">Weight Goal</h4>
                  </div>
                  <p className="text-2xl font-bold text-accent-blue">165 lbs</p>
                  <p className="text-sm text-text-secondary">Expected by June 2024</p>
                  <p className="text-xs text-text-muted mt-1">76% confidence</p>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Assessment Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6 ring-gradient animate-fade-in-up">
              <div className="flex items-center space-x-2 mb-2">
                <Icon3D type="triangle" color="orange" size="sm" />
                <h2 className="text-xl font-bold text-white">Risk Assessment</h2>
              </div>
              <p className="text-text-secondary mb-6">Current health risk factors and trends</p>

              <div className="space-y-4">
                {riskFactors.map((factor, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{factor.factor}</span>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(factor.trend)}
                        <span className={`text-sm font-medium ${getRiskColor(factor.risk)}`}>{factor.risk}</span>
                      </div>
                    </div>
                    <Progress value={factor.score} className="h-2" />
                    <p className="text-xs text-text-secondary">{factor.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 ring-gradient animate-fade-in-up">
              <h2 className="text-xl font-bold text-white mb-2">Quick Actions</h2>
              <p className="text-text-secondary mb-6">Based on your insights</p>

              <div className="space-y-3">
                <Button className="btn btn-primary w-full justify-start" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Coach Check-in
                </Button>
                <Button className="btn btn-secondary w-full justify-start" size="sm">
                  <Activity className="h-4 w-4 mr-2" />
                  Update Exercise Plan
                </Button>
                <Button className="btn btn-secondary w-full justify-start" size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Insight as Applied
                </Button>
              </div>
            </div>

            <div className="glass-card p-6 ring-gradient animate-fade-in-up">
              <h2 className="text-xl font-bold text-white mb-4">Insight Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Insights:</span>
                  <span className="font-medium text-white">{insights.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">High Priority:</span>
                  <span className="font-medium text-accent-red">
                    {insights.filter((i) => i.priority === "high").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Actionable:</span>
                  <span className="font-medium text-accent-green">{insights.filter((i) => i.actionable).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Avg Confidence:</span>
                  <span className="font-medium text-white">
                    {Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
