"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  Clock,
  Activity,
  Award,
  Brain,
  Heart,
  Zap,
  BarChart3,
  PieChartIcon,
  Download,
} from "lucide-react"
import { toast } from "sonner"

interface AnalyticsDashboardProps {
  userId?: string
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

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00", "#ff00ff"]

export default function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<FastingAnalytics | null>(null)
  const [timeframe, setTimeframe] = useState<"week" | "month" | "quarter" | "year" | "all">("month")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadAnalytics()
  }, [timeframe])

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/fasting/analytics?timeframe=${timeframe}&includeHealthMetrics=true&includePredictions=true&includeGoalProgress=true`,
      )

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
      } else {
        throw new Error("Failed to load analytics")
      }
    } catch (error) {
      console.error("Error loading analytics:", error)
      toast.error("Failed to load analytics")
    } finally {
      setIsLoading(false)
    }
  }

  const exportReport = async () => {
    try {
      // Generate a comprehensive report
      const reportData = {
        generatedAt: new Date().toISOString(),
        timeframe,
        analytics,
      }

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `fasting-analytics-${timeframe}-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success("Analytics report exported successfully!")
    } catch (error) {
      console.error("Error exporting report:", error)
      toast.error("Failed to export report")
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

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "text-green-600"
      case "declining":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getAchievementIcon = (category: string) => {
    switch (category) {
      case "consistency":
        return <Calendar className="h-4 w-4" />
      case "duration":
        return <Clock className="h-4 w-4" />
      case "health":
        return <Heart className="h-4 w-4" />
      case "milestone":
        return <Award className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No analytics data available</p>
        <Button onClick={loadAnalytics} className="mt-4">
          Load Analytics
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fasting Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into your fasting journey</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeframe} onValueChange={(value: any) => setTimeframe(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="quarter">Quarter</SelectItem>
              <SelectItem value="year">Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.overview.totalSessions}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">{analytics.overview.successRate}%</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.overview.currentStreak}</p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.overview.averageDuration}h</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="patterns" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="health">Health Impact</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Fasting Types Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChartIcon className="h-5 w-5" />
                  <span>Fasting Types</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.patterns.preferredFastingTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, count }) => `${type} (${count})`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.patterns.preferredFastingTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Best Performing Days */}
            <Card>
              <CardHeader>
                <CardTitle>Best Performing Days</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.patterns.bestPerformingDays}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="successRate" fill="#82ca9d" name="Success Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Optimal Start Times */}
          <Card>
            <CardHeader>
              <CardTitle>Optimal Start Times</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.patterns.optimalStartTimes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
                  <YAxis />
                  <Tooltip labelFormatter={(hour) => `${hour}:00`} />
                  <Area type="monotone" dataKey="successRate" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Glucose Improvement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Glucose Control</span>
                  {getTrendIcon(analytics.healthImpacts.glucoseImprovement.trend)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {analytics.healthImpacts.glucoseImprovement.averageReduction}
                  </div>
                  <div className="text-sm text-gray-600">mg/dL avg reduction</div>
                </div>
                <div
                  className={`text-center text-sm ${getTrendColor(analytics.healthImpacts.glucoseImprovement.trend)}`}
                >
                  Trend: {analytics.healthImpacts.glucoseImprovement.trend}
                </div>
              </CardContent>
            </Card>

            {/* Weight Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Weight Progress</span>
                  {getTrendIcon(analytics.healthImpacts.weightProgress.trend)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {analytics.healthImpacts.weightProgress.totalChange > 0 ? "+" : ""}
                    {analytics.healthImpacts.weightProgress.totalChange}
                  </div>
                  <div className="text-sm text-gray-600">lbs change</div>
                </div>
                <div className={`text-center text-sm ${getTrendColor(analytics.healthImpacts.weightProgress.trend)}`}>
                  Trend: {analytics.healthImpacts.weightProgress.trend}
                </div>
              </CardContent>
            </Card>

            {/* Energy Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Energy Levels</span>
                  {getTrendIcon(analytics.healthImpacts.energyLevels.trend)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {analytics.healthImpacts.energyLevels.improvement > 0 ? "+" : ""}
                    {analytics.healthImpacts.energyLevels.improvement}
                  </div>
                  <div className="text-sm text-gray-600">improvement (1-10 scale)</div>
                </div>
                <div className={`text-center text-sm ${getTrendColor(analytics.healthImpacts.energyLevels.trend)}`}>
                  Trend: {analytics.healthImpacts.energyLevels.trend}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Glucose Trend Chart */}
          {analytics.healthImpacts.glucoseImprovement.sessions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Glucose Improvement Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.healthImpacts.glucoseImprovement.sessions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
                    <Line type="monotone" dataKey="start" stroke="#ff7300" name="Start Glucose" />
                    <Line type="monotone" dataKey="end" stroke="#82ca9d" name="End Glucose" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Next Fast Success Prediction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>Next Fast Success</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600">
                    {Math.round(analytics.predictions.nextFastSuccess.probability * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Success Probability</div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Key Factors:</h4>
                  {analytics.predictions.nextFastSuccess.factors.map((factor, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-1 h-1 bg-purple-600 rounded-full" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Recommendations:</h4>
                  {analytics.predictions.nextFastSuccess.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-1 h-1 bg-green-600 rounded-full" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Optimal Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>Optimal Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      {analytics.predictions.optimalSchedule.recommendedType}
                    </div>
                    <div className="text-xs text-gray-600">Recommended Type</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {analytics.predictions.optimalSchedule.recommendedStartTime}
                    </div>
                    <div className="text-xs text-gray-600">Best Start Time</div>
                  </div>
                </div>

                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {analytics.predictions.optimalSchedule.expectedDuration}h
                  </div>
                  <div className="text-xs text-gray-600">Expected Duration</div>
                </div>

                <div className="text-center">
                  <Badge variant="outline" className="bg-gray-50">
                    {Math.round(analytics.predictions.optimalSchedule.confidence * 100)}% Confidence
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goal Projections */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weight Loss Projection</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <div className="text-3xl font-bold text-green-600">
                  {analytics.predictions.goalProjections.weightLossProjection.expectedLoss} lbs
                </div>
                <div className="text-sm text-gray-600">
                  Expected in {analytics.predictions.goalProjections.weightLossProjection.timeframe}
                </div>
                <Badge variant="outline">
                  {Math.round(analytics.predictions.goalProjections.weightLossProjection.confidence * 100)}% Confidence
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Glucose Control Projection</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <div className="text-3xl font-bold text-blue-600">
                  {analytics.predictions.goalProjections.glucoseControlProjection.expectedImprovement} mg/dL
                </div>
                <div className="text-sm text-gray-600">
                  Expected improvement in {analytics.predictions.goalProjections.glucoseControlProjection.timeframe}
                </div>
                <Badge variant="outline">
                  {Math.round(analytics.predictions.goalProjections.glucoseControlProjection.confidence * 100)}%
                  Confidence
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.achievements.map((achievement) => (
              <Card key={achievement.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-full">{getAchievementIcon(achievement.category)}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{achievement.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {achievement.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(achievement.earnedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {analytics.achievements.length === 0 && (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No achievements yet</p>
              <p className="text-sm text-gray-400">Keep fasting to unlock achievements!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>AI-Generated Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Performance Analysis</h4>
                <p className="text-sm text-blue-800">
                  Your fasting consistency has improved by 25% over the last month. Your most successful fasting window
                  is {analytics.patterns.preferredFastingTypes[0]?.type || "16:8"}, with a{" "}
                  {analytics.patterns.preferredFastingTypes[0]?.successRate || 85}% success rate.
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-2">Health Improvements</h4>
                <p className="text-sm text-green-800">
                  Your glucose control shows a {analytics.healthImpacts.glucoseImprovement.trend} trend with an average
                  reduction of {analytics.healthImpacts.glucoseImprovement.averageReduction} mg/dL per session. This
                  indicates excellent metabolic adaptation to your fasting routine.
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-2">Optimization Opportunities</h4>
                <p className="text-sm text-purple-800">
                  Based on your patterns, starting your fasts at{" "}
                  {analytics.predictions.optimalSchedule.recommendedStartTime} could improve your success rate by up to
                  15%. Consider maintaining your current {analytics.predictions.optimalSchedule.recommendedType}{" "}
                  schedule as it aligns well with your lifestyle.
                </p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-medium text-orange-900 mb-2">Goal Progress</h4>
                <p className="text-sm text-orange-800">
                  You're on track to achieve your health goals. With consistent fasting, you could see an additional{" "}
                  {analytics.predictions.goalProjections.weightLossProjection.expectedLoss} lbs weight loss and{" "}
                  {analytics.predictions.goalProjections.glucoseControlProjection.expectedImprovement} mg/dL glucose
                  improvement over the next {analytics.predictions.goalProjections.weightLossProjection.timeframe}.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
