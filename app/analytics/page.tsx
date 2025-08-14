"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Icon3D } from "@/components/ui/3d-icon"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, ArrowLeft, Download, Share, Calendar } from "lucide-react"
import Link from "next/link"

// Mock data for charts
const glucoseData = [
  { date: "Jan 1", fasting: 95, postMeal: 140, target: 120 },
  { date: "Jan 2", fasting: 92, postMeal: 135, target: 120 },
  { date: "Jan 3", fasting: 98, postMeal: 145, target: 120 },
  { date: "Jan 4", fasting: 90, postMeal: 130, target: 120 },
  { date: "Jan 5", fasting: 88, postMeal: 125, target: 120 },
  { date: "Jan 6", fasting: 85, postMeal: 120, target: 120 },
  { date: "Jan 7", fasting: 87, postMeal: 118, target: 120 },
]

const weightData = [
  { week: "Week 1", weight: 185, goal: 165 },
  { week: "Week 2", weight: 183.5, goal: 165 },
  { week: "Week 3", weight: 181.8, goal: 165 },
  { week: "Week 4", weight: 180.2, goal: 165 },
  { week: "Week 5", weight: 178.9, goal: 165 },
  { week: "Week 6", weight: 177.5, goal: 165 },
]

const hba1cData = [
  { month: "Oct", actual: 8.2, predicted: 8.1 },
  { month: "Nov", actual: 7.8, predicted: 7.7 },
  { month: "Dec", actual: 7.4, predicted: 7.3 },
  { month: "Jan", actual: null, predicted: 6.9 },
  { month: "Feb", actual: null, predicted: 6.5 },
  { month: "Mar", actual: null, predicted: 6.2 },
]

const foodResponseData = [
  { food: "Oatmeal", avgResponse: 25, frequency: 12 },
  { food: "White Rice", avgResponse: 45, frequency: 8 },
  { food: "Brown Rice", avgResponse: 35, frequency: 10 },
  { food: "Chicken", avgResponse: 5, frequency: 15 },
  { food: "Vegetables", avgResponse: 10, frequency: 20 },
]

const exerciseImpactData = [
  { type: "Walking", beforeExercise: 145, afterExercise: 125, sessions: 15 },
  { type: "Weight Training", beforeExercise: 140, afterExercise: 130, sessions: 8 },
  { type: "Cycling", beforeExercise: 150, afterExercise: 120, sessions: 6 },
  { type: "Yoga", beforeExercise: 135, afterExercise: 128, sessions: 10 },
]

const goalProgress = [
  { goal: "Lower HbA1c to 6.5%", current: 7.4, target: 6.5, progress: 65 },
  { goal: "Lose 20 lbs", current: 7.5, target: 20, progress: 38 },
  { goal: "Exercise 150 min/week", current: 135, target: 150, progress: 90 },
  { goal: "Glucose in range 70%", current: 68, target: 70, progress: 97 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("glucose")

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
              <Button
                variant="outline"
                size="sm"
                className="glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 relative z-10">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
          <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Avg Glucose</CardTitle>
              <Icon3D shape="sphere" color="blue" size="sm" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">128 mg/dL</div>
              <div className="flex items-center text-sm text-accent-green">
                <TrendingDown className="h-4 w-4 mr-1" />
                -12% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Weight Loss</CardTitle>
              <Icon3D shape="cube" color="green" size="sm" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">7.5 lbs</div>
              <div className="flex items-center text-sm text-accent-green">
                <TrendingDown className="h-4 w-4 mr-1" />
                38% to goal
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Time in Range</CardTitle>
              <Icon3D shape="torus" color="purple" size="sm" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">68%</div>
              <div className="flex items-center text-sm text-accent-orange">
                <TrendingUp className="h-4 w-4 mr-1" />
                +15% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">HbA1c Trend</CardTitle>
              <Icon3D shape="capsule" color="orange" size="sm" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">7.4%</div>
              <div className="flex items-center text-sm text-accent-green">
                <TrendingDown className="h-4 w-4 mr-1" />
                Predicted: 6.9%
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="glass-card border-white/10 grid w-full grid-cols-4 p-2 h-14">
            <TabsTrigger
              value="trends"
              className="flex items-center gap-2 text-text-secondary data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-xl transition-all"
            >
              <Icon3D shape="sphere" color="blue" size="sm" />
              Health Trends
            </TabsTrigger>
            <TabsTrigger
              value="patterns"
              className="flex items-center gap-2 text-text-secondary data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-xl transition-all"
            >
              <Icon3D shape="cube" color="green" size="sm" />
              Patterns & Insights
            </TabsTrigger>
            <TabsTrigger
              value="goals"
              className="flex items-center gap-2 text-text-secondary data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-xl transition-all"
            >
              <Icon3D shape="torus" color="purple" size="sm" />
              Goal Progress
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="flex items-center gap-2 text-text-secondary data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-xl transition-all"
            >
              <Icon3D shape="capsule" color="orange" size="sm" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Health Trends Tab */}
          <TabsContent value="trends" className="space-y-6 animate-fade-in-up">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white">Glucose Trends</CardTitle>
                  <CardDescription className="text-gray-300">
                    Fasting and post-meal glucose levels over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={glucoseData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis domain={[60, 180]} stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(17, 24, 39, 0.8)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "8px",
                            color: "#fff",
                          }}
                        />
                        <Line type="monotone" dataKey="fasting" stroke="#3B82F6" strokeWidth={2} name="Fasting" />
                        <Line type="monotone" dataKey="postMeal" stroke="#EF4444" strokeWidth={2} name="Post-meal" />
                        <Line
                          type="monotone"
                          dataKey="target"
                          stroke="#10B981"
                          strokeWidth={1}
                          strokeDasharray="5 5"
                          name="Target"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white">Weight Progress</CardTitle>
                  <CardDescription className="text-gray-300">
                    Weekly weight measurements and goal tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weightData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="week" stroke="#9CA3AF" />
                        <YAxis domain={[160, 190]} stroke="#9CA3AF" />
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
                          name="Current Weight"
                        />
                        <Line type="monotone" dataKey="goal" stroke="#EF4444" strokeDasharray="5 5" name="Goal" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white">HbA1c Prediction</CardTitle>
                  <CardDescription className="text-gray-300">
                    Historical values and AI-powered predictions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={hba1cData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis domain={[6, 9]} stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(17, 24, 39, 0.8)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "8px",
                            color: "#fff",
                          }}
                        />
                        <Line type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={2} name="Actual" />
                        <Line
                          type="monotone"
                          dataKey="predicted"
                          stroke="#F59E0B"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Predicted"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white">Exercise Impact</CardTitle>
                  <CardDescription className="text-gray-300">
                    Glucose levels before and after different exercises
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={exerciseImpactData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="type" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(17, 24, 39, 0.8)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "8px",
                            color: "#fff",
                          }}
                        />
                        <Bar dataKey="beforeExercise" fill="#EF4444" name="Before Exercise" />
                        <Bar dataKey="afterExercise" fill="#22C55E" name="After Exercise" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Patterns & Insights Tab */}
          <TabsContent value="patterns" className="space-y-6 animate-fade-in-up">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white">Food Response Patterns</CardTitle>
                  <CardDescription className="text-gray-300">
                    How different foods affect your glucose levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {foodResponseData.map((food, index) => (
                      <div
                        key={food.food}
                        className="flex items-center justify-between p-3 glass-card border-white/10 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              food.avgResponse > 40
                                ? "bg-red-500"
                                : food.avgResponse > 25
                                  ? "bg-orange-500"
                                  : "bg-green-500"
                            }`}
                          />
                          <div>
                            <p className="font-medium text-white">{food.food}</p>
                            <p className="text-sm text-gray-300">{food.frequency} meals logged</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">+{food.avgResponse} mg/dL</p>
                          <p className="text-xs text-gray-400">avg response</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white">Weekly Patterns</CardTitle>
                  <CardDescription className="text-gray-300">Your glucose patterns by day of the week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { day: "Mon", avg: 125, readings: 8 },
                          { day: "Tue", avg: 130, readings: 7 },
                          { day: "Wed", avg: 128, readings: 9 },
                          { day: "Thu", avg: 135, readings: 6 },
                          { day: "Fri", avg: 140, readings: 5 },
                          { day: "Sat", avg: 145, readings: 4 },
                          { day: "Sun", avg: 132, readings: 6 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="day" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(17, 24, 39, 0.8)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "8px",
                            color: "#fff",
                          }}
                        />
                        <Bar dataKey="avg" fill="#3B82F6" name="Average Glucose" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white">Key Insights</CardTitle>
                  <CardDescription className="text-gray-300">
                    AI-generated insights from your health data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 glass-card border-accent-blue/30 bg-gradient-to-br from-accent-blue/10 to-accent-blue/5 rounded-lg">
                    <Icon3D shape="sphere" color="blue" size="sm" className="mt-0.5" />
                    <div>
                      <p className="font-medium text-accent-blue">Exercise Timing</p>
                      <p className="text-sm text-gray-300">
                        Walking after dinner reduces your glucose by an average of 20 mg/dL
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 glass-card border-accent-green/30 bg-gradient-to-br from-accent-green/10 to-accent-green/5 rounded-lg">
                    <Icon3D shape="cube" color="green" size="sm" className="mt-0.5" />
                    <div>
                      <p className="font-medium text-accent-green">Best Meal Timing</p>
                      <p className="text-sm text-gray-300">
                        Your glucose control is best when you eat lunch between 12-1 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 glass-card border-accent-orange/30 bg-gradient-to-br from-accent-orange/10 to-accent-orange/5 rounded-lg">
                    <Icon3D shape="torus" color="orange" size="sm" className="mt-0.5" />
                    <div>
                      <p className="font-medium text-accent-orange">Sleep Impact</p>
                      <p className="text-sm text-gray-300">
                        Poor sleep ({"<"}6 hours) correlates with 15% higher morning glucose
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white">Medication Effectiveness</CardTitle>
                  <CardDescription className="text-gray-300">
                    How your medications are impacting your glucose control
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 glass-card border-white/10 rounded-lg">
                      <div>
                        <p className="font-medium text-white">Metformin 500mg</p>
                        <p className="text-sm text-gray-300">Twice daily</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-accent-green/20 text-accent-green border-accent-green/30">Effective</Badge>
                        <p className="text-xs text-gray-400 mt-1">-18% avg glucose</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 glass-card border-white/10 rounded-lg">
                      <div>
                        <p className="font-medium text-white">Glipizide 5mg</p>
                        <p className="text-sm text-gray-300">Once daily</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-accent-orange/20 text-accent-orange border-accent-orange/30">
                          Moderate
                        </Badge>
                        <p className="text-xs text-gray-400 mt-1">-8% avg glucose</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Goal Progress Tab */}
          <TabsContent value="goals" className="space-y-6 animate-fade-in-up">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white">Goal Achievement</CardTitle>
                  <CardDescription className="text-gray-300">Track your progress toward health goals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {goalProgress.map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-sm text-white">{goal.goal}</p>
                        <Badge
                          className={
                            goal.progress >= 90
                              ? "bg-accent-green/20 text-accent-green border-accent-green/30"
                              : goal.progress >= 70
                                ? "bg-accent-orange/20 text-accent-orange border-accent-orange/30"
                                : "bg-red-500/20 text-red-400 border-red-500/30"
                          }
                        >
                          {goal.progress}%
                        </Badge>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Current: {goal.current}</span>
                        <span>Target: {goal.target}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white">Monthly Achievements</CardTitle>
                  <CardDescription className="text-gray-300">Your accomplishments this month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 glass-card border-accent-green/30 bg-gradient-to-br from-accent-green/10 to-accent-green/5 rounded-lg">
                    <div className="w-8 h-8 bg-accent-green rounded-full flex items-center justify-center">
                      <Icon3D shape="torus" color="green" size="xs" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Glucose Target Days</p>
                      <p className="text-sm text-gray-300">21 out of 30 days in target range</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 glass-card border-accent-blue/30 bg-gradient-to-br from-accent-blue/10 to-accent-blue/5 rounded-lg">
                    <div className="w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center">
                      <Icon3D shape="sphere" color="blue" size="xs" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Exercise Streak</p>
                      <p className="text-sm text-gray-300">12 consecutive days with activity</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 glass-card border-accent-purple/30 bg-gradient-to-br from-accent-purple/10 to-accent-purple/5 rounded-lg">
                    <div className="w-8 h-8 bg-accent-purple rounded-full flex items-center justify-center">
                      <Icon3D shape="cube" color="purple" size="xs" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Weight Loss Milestone</p>
                      <p className="text-sm text-gray-300">Lost 7.5 lbs - halfway to goal!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6 animate-fade-in-up">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 glass-card border-white/10 hover:border-white/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white">Monthly Health Report</CardTitle>
                  <CardDescription className="text-gray-300">
                    Comprehensive summary for healthcare providers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-white">Key Metrics Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Average Fasting Glucose:</span>
                          <span className="font-medium text-white">89 mg/dL</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Average Post-meal Glucose:</span>
                          <span className="font-medium text-white">128 mg/dL</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Time in Range (70-180):</span>
                          <span className="font-medium text-white">68%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Weight Change:</span>
                          <span className="font-medium text-accent-green">-7.5 lbs</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Exercise Sessions:</span>
                          <span className="font-medium text-white">24</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium text-white">Medication Adherence</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Metformin:</span>
                          <span className="font-medium text-white">95%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Glipizide:</span>
                          <span className="font-medium text-white">88%</span>
                        </div>
                      </div>
                      <h4 className="font-medium mt-4 text-white">Notable Events</h4>
                      <div className="text-sm text-gray-300">
                        <p>• Started new exercise routine (Week 2)</p>
                        <p>• Adjusted dinner timing (Week 3)</p>
                        <p>• Reduced carb intake by 20% (Week 4)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white">Export Options</CardTitle>
                  <CardDescription className="text-gray-300">Share your data with healthcare providers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full gradient-primary hover:scale-105 transition-all duration-200 shadow-lg text-white font-semibold">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF Report
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Email to Doctor
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Review
                  </Button>
                  <div className="text-xs text-gray-400 mt-4">
                    <p className="text-white mb-2">Reports include:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Glucose trends & patterns</li>
                      <li>Weight & exercise data</li>
                      <li>Medication adherence</li>
                      <li>Goal progress</li>
                      <li>AI-generated insights</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
