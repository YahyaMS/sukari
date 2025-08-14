"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  ArrowLeft,
  Calendar,
  Activity,
} from "lucide-react"
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
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-600"
      case "Medium":
        return "text-yellow-600"
      case "High":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/analytics">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">AI Health Insights</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Insights */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  <span>Personalized Insights</span>
                </CardTitle>
                <CardDescription>AI-powered analysis of your health patterns and trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {insights.map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium">{insight.title}</h3>
                          <Badge variant="secondary" className={getPriorityColor(insight.priority)}>
                            {insight.priority} priority
                          </Badge>
                          {insight.actionable && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Actionable
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{insight.description}</p>
                        <div className="bg-blue-50 p-3 rounded-lg mb-3">
                          <p className="text-sm text-blue-800">
                            <strong>Recommendation:</strong> {insight.recommendation}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
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
              </CardContent>
            </Card>

            {/* Predictive Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Predictive Analytics</CardTitle>
                <CardDescription>Forecasts based on your current health trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingDown className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-green-900">HbA1c Prediction</h4>
                    </div>
                    <p className="text-2xl font-bold text-green-600">6.9%</p>
                    <p className="text-sm text-green-800">Expected by March 2024</p>
                    <p className="text-xs text-green-700 mt-1">89% confidence</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingDown className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium text-blue-900">Weight Goal</h4>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">165 lbs</p>
                    <p className="text-sm text-blue-800">Expected by June 2024</p>
                    <p className="text-xs text-blue-700 mt-1">76% confidence</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Assessment Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span>Risk Assessment</span>
                </CardTitle>
                <CardDescription>Current health risk factors and trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {riskFactors.map((factor, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{factor.factor}</span>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(factor.trend)}
                        <span className={`text-sm font-medium ${getRiskColor(factor.risk)}`}>{factor.risk}</span>
                      </div>
                    </div>
                    <Progress value={factor.score} className="h-2" />
                    <p className="text-xs text-gray-600">{factor.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Based on your insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Coach Check-in
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Activity className="h-4 w-4 mr-2" />
                  Update Exercise Plan
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Insight as Applied
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Insight Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Total Insights:</span>
                    <span className="font-medium">{insights.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>High Priority:</span>
                    <span className="font-medium text-red-600">
                      {insights.filter((i) => i.priority === "high").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Actionable:</span>
                    <span className="font-medium text-green-600">{insights.filter((i) => i.actionable).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Confidence:</span>
                    <span className="font-medium">
                      {Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
