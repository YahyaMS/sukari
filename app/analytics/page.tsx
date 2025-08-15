"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Icon3D } from "@/components/ui/3d-icon"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface AnalyticsData {
  glucoseReadings: any[]
  weightEntries: any[]
  meals: any[]
  exerciseLogs: any[]
  avgGlucose: number
  weightChange: number
  timeInRange: number
  totalReadings: number
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Calculate date range
      const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : 365
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Fetch glucose readings
      const { data: glucoseReadings } = await supabase
        .from("glucose_readings")
        .select("*")
        .eq("user_id", user.id)
        .gte("timestamp", startDate.toISOString())
        .order("timestamp", { ascending: true })

      // Fetch weight entries
      const { data: weightEntries } = await supabase
        .from("weight_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("timestamp", startDate.toISOString())
        .order("timestamp", { ascending: true })

      // Fetch meals
      const { data: meals } = await supabase
        .from("meals")
        .select("*")
        .eq("user_id", user.id)
        .gte("timestamp", startDate.toISOString())
        .order("timestamp", { ascending: true })

      // Fetch exercise logs (if table exists)
      const { data: exerciseLogs, error: exerciseError } = await supabase
        .from("exercise_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("timestamp", startDate.toISOString())
        .order("timestamp", { ascending: true })

      // Handle if table doesn't exist or other errors
      const safeExerciseLogs = exerciseError ? [] : exerciseLogs || []

      // Calculate analytics
      const avgGlucose = glucoseReadings?.length
        ? glucoseReadings.reduce((sum, reading) => sum + reading.value, 0) / glucoseReadings.length
        : 0

      const weightChange =
        weightEntries && weightEntries.length >= 2
          ? weightEntries[weightEntries.length - 1].weight_kg - weightEntries[0].weight_kg
          : 0

      const timeInRange = glucoseReadings?.length
        ? (glucoseReadings.filter((r) => r.value >= 70 && r.value <= 180).length / glucoseReadings.length) * 100
        : 0

      setAnalyticsData({
        glucoseReadings: glucoseReadings || [],
        weightEntries: weightEntries || [],
        meals: meals || [],
        exerciseLogs: safeExerciseLogs,
        avgGlucose: Math.round(avgGlucose),
        weightChange: Math.round(weightChange * 2.20462 * 10) / 10, // Convert to lbs
        timeInRange: Math.round(timeInRange),
        totalReadings: glucoseReadings?.length || 0,
      })
    } catch (error) {
      console.error("Error fetching analytics data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const prepareGlucoseChartData = () => {
    if (!analyticsData?.glucoseReadings.length) return []

    return analyticsData.glucoseReadings.slice(-14).map((reading) => ({
      date: new Date(reading.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: reading.value,
      category: reading.category,
    }))
  }

  const prepareWeightChartData = () => {
    if (!analyticsData?.weightEntries.length) return []

    return analyticsData.weightEntries.map((entry, index) => ({
      week: `Week ${index + 1}`,
      weight: Math.round(entry.weight_kg * 2.20462 * 10) / 10, // Convert to lbs
      date: new Date(entry.timestamp).toLocaleDateString(),
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#21262D] flex items-center justify-center">
        <div className="text-center">
          <Icon3D shape="sphere" color="blue" size="xl" className="mx-auto mb-4 animate-pulse" />
          <p className="text-white text-lg">Loading your health analytics...</p>
        </div>
      </div>
    )
  }

  const hasData =
    analyticsData &&
    (analyticsData.glucoseReadings.length > 0 ||
      analyticsData.weightEntries.length > 0 ||
      analyticsData.meals.length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#21262D] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-xl animate-bounce"></div>
      </div>

      {/* Header */}
      <header className="glass-card border-b border-white/10 sticky top-0 z-50 relative">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <Icon3D shape="cube" color="blue" size="lg" glow />
                <div>
                  <h1 className="text-2xl font-bold text-white">Health Analytics</h1>
                  <p className="text-sm text-text-secondary">Comprehensive health insights and trends</p>
                </div>
              </div>
            </div>
            {hasData && (
              <div className="flex items-center space-x-4">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32 glass-input border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/20">
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 3 months</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  className="glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 relative z-10">
        {!hasData ? (
          <div className="glass-card p-12 text-center animate-fade-in-up">
            <Icon3D shape="cube" color="blue" size="xl" className="mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Your Analytics Are Building</h2>
            <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
              Start tracking your health data to unlock powerful insights and trends. Your analytics will become more
              meaningful as you log glucose readings, meals, weight, and exercise.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="glass-card p-6 border-white/10">
                <Icon3D shape="sphere" color="blue" size="lg" className="mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Glucose Trends</h3>
                <p className="text-text-secondary text-sm">
                  Track patterns and see how food, exercise, and medication affect your levels
                </p>
              </div>
              <div className="glass-card p-6 border-white/10">
                <Icon3D shape="scale" color="green" size="lg" className="mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Progress Tracking</h3>
                <p className="text-text-secondary text-sm">
                  Monitor weight changes and see your journey toward health goals
                </p>
              </div>
              <div className="glass-card p-6 border-white/10">
                <Icon3D shape="utensils" color="purple" size="lg" className="mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Food Insights</h3>
                <p className="text-text-secondary text-sm">Discover which foods work best for your glucose control</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tracking/glucose">
                <Button size="lg" className="gradient-primary">
                  <Icon3D shape="sphere" color="white" size="sm" className="mr-2" />
                  Log First Glucose Reading
                </Button>
              </Link>
              <Link href="/tracking/meals">
                <Button
                  variant="outline"
                  size="lg"
                  className="glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Icon3D shape="utensils" color="white" size="sm" className="mr-2" />
                  Track Your First Meal
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Key Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
              <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Avg Glucose</CardTitle>
                  <Icon3D shape="sphere" color="blue" size="sm" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {analyticsData.avgGlucose > 0 ? `${analyticsData.avgGlucose} mg/dL` : "No data"}
                  </div>
                  <div className="flex items-center text-sm text-text-secondary">
                    <span>{analyticsData.totalReadings} readings</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Weight Change</CardTitle>
                  <Icon3D shape="cube" color="green" size="sm" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {analyticsData.weightChange !== 0
                      ? `${analyticsData.weightChange > 0 ? "+" : ""}${analyticsData.weightChange} lbs`
                      : "No change"}
                  </div>
                  <div className="flex items-center text-sm text-text-secondary">
                    <span>{analyticsData.weightEntries.length} measurements</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Time in Range</CardTitle>
                  <Icon3D shape="torus" color="purple" size="sm" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {analyticsData.timeInRange > 0 ? `${analyticsData.timeInRange}%` : "No data"}
                  </div>
                  <div className="flex items-center text-sm text-text-secondary">
                    <span>70-180 mg/dL range</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-white">Meals Logged</CardTitle>
                  <Icon3D shape="capsule" color="orange" size="sm" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analyticsData.meals.length}</div>
                  <div className="flex items-center text-sm text-text-secondary">
                    <span>In selected period</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="trends" className="space-y-6">
              <TabsList className="glass-card border-white/10 grid w-full grid-cols-2 p-2 h-14">
                <TabsTrigger
                  value="trends"
                  className="flex items-center gap-2 text-text-secondary data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-xl transition-all"
                >
                  <Icon3D shape="sphere" color="blue" size="sm" />
                  Health Trends
                </TabsTrigger>
                <TabsTrigger
                  value="summary"
                  className="flex items-center gap-2 text-text-secondary data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-xl transition-all"
                >
                  <Icon3D shape="cube" color="green" size="sm" />
                  Summary Report
                </TabsTrigger>
              </TabsList>

              {/* Health Trends Tab */}
              <TabsContent value="trends" className="space-y-6 animate-fade-in-up">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-white">Glucose Trends</CardTitle>
                      <CardDescription className="text-gray-300">Your glucose readings over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {prepareGlucoseChartData().length > 0 ? (
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={prepareGlucoseChartData()}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                              <XAxis dataKey="date" stroke="#9CA3AF" />
                              <YAxis domain={[60, 200]} stroke="#9CA3AF" />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "rgba(17, 24, 39, 0.8)",
                                  border: "1px solid rgba(255, 255, 255, 0.1)",
                                  borderRadius: "8px",
                                  color: "#fff",
                                }}
                              />
                              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} name="Glucose" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="h-80 flex items-center justify-center">
                          <div className="text-center">
                            <Icon3D shape="sphere" color="blue" size="lg" className="mx-auto mb-4" />
                            <h3 className="text-white font-medium mb-2">No glucose data yet</h3>
                            <p className="text-text-secondary text-sm mb-4">
                              Start logging glucose readings to see your trends
                            </p>
                            <Link href="/tracking/glucose">
                              <Button size="sm" className="gradient-primary">
                                Log Reading
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-white">Weight Progress</CardTitle>
                      <CardDescription className="text-gray-300">Your weight measurements over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {prepareWeightChartData().length > 0 ? (
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={prepareWeightChartData()}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                              <XAxis dataKey="week" stroke="#9CA3AF" />
                              <YAxis stroke="#9CA3AF" />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "rgba(17, 24, 39, 0.8)",
                                  border: "1px solid rgba(255, 255, 255, 0.1)",
                                  borderRadius: "8px",
                                  color: "#fff",
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="weight"
                                stroke="#10B981"
                                fill="#10B981"
                                fillOpacity={0.3}
                                name="Weight (lbs)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="h-80 flex items-center justify-center">
                          <div className="text-center">
                            <Icon3D shape="scale" color="green" size="lg" className="mx-auto mb-4" />
                            <h3 className="text-white font-medium mb-2">No weight data yet</h3>
                            <p className="text-text-secondary text-sm mb-4">
                              Start tracking weight to see your progress
                            </p>
                            <Link href="/tracking/weight">
                              <Button size="sm" className="gradient-primary">
                                Log Weight
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Summary Report Tab */}
              <TabsContent value="summary" className="space-y-6 animate-fade-in-up">
                <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-white">Health Summary Report</CardTitle>
                    <CardDescription className="text-gray-300">
                      Overview of your health data for the selected period
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-white">Key Metrics</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Total Glucose Readings:</span>
                            <span className="font-medium text-white">{analyticsData.totalReadings}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Average Glucose:</span>
                            <span className="font-medium text-white">
                              {analyticsData.avgGlucose > 0 ? `${analyticsData.avgGlucose} mg/dL` : "No data"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Time in Range:</span>
                            <span className="font-medium text-white">
                              {analyticsData.timeInRange > 0 ? `${analyticsData.timeInRange}%` : "No data"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Weight Change:</span>
                            <span
                              className={`font-medium ${
                                analyticsData.weightChange < 0 ? "text-accent-green" : "text-white"
                              }`}
                            >
                              {analyticsData.weightChange !== 0
                                ? `${analyticsData.weightChange > 0 ? "+" : ""}${analyticsData.weightChange} lbs`
                                : "No change"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Meals Logged:</span>
                            <span className="font-medium text-white">{analyticsData.meals.length}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-medium text-white">Data Collection Progress</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-300">Glucose Tracking</span>
                              <span className="text-white">{analyticsData.totalReadings > 0 ? "Active" : "Start"}</span>
                            </div>
                            <Progress value={analyticsData.totalReadings > 0 ? 100 : 0} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-300">Weight Tracking</span>
                              <span className="text-white">
                                {analyticsData.weightEntries.length > 0 ? "Active" : "Start"}
                              </span>
                            </div>
                            <Progress value={analyticsData.weightEntries.length > 0 ? 100 : 0} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-300">Meal Tracking</span>
                              <span className="text-white">{analyticsData.meals.length > 0 ? "Active" : "Start"}</span>
                            </div>
                            <Progress value={analyticsData.meals.length > 0 ? 100 : 0} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  )
}
