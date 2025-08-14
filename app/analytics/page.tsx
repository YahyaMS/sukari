"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
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
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Scale,
  Target,
  Calendar,
  Download,
  Share,
  ArrowLeft,
  AlertCircle,
} from "lucide-react"
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("glucose")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Health Analytics</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Glucose</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128 mg/dL</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingDown className="h-4 w-4 mr-1" />
                -12% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weight Loss</CardTitle>
              <Scale className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.5 lbs</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingDown className="h-4 w-4 mr-1" />
                38% to goal
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time in Range</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <div className="flex items-center text-sm text-orange-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +15% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">HbA1c Trend</CardTitle>
              <Calendar className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.4%</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingDown className="h-4 w-4 mr-1" />
                Predicted: 6.9%
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Health Trends</TabsTrigger>
            <TabsTrigger value="patterns">Patterns & Insights</TabsTrigger>
            <TabsTrigger value="goals">Goal Progress</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Health Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Glucose Trends</CardTitle>
                  <CardDescription>Fasting and post-meal glucose levels over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={glucoseData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[60, 180]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="fasting" stroke="#2563eb" strokeWidth={2} name="Fasting" />
                        <Line type="monotone" dataKey="postMeal" stroke="#dc2626" strokeWidth={2} name="Post-meal" />
                        <Line
                          type="monotone"
                          dataKey="target"
                          stroke="#16a34a"
                          strokeWidth={1}
                          strokeDasharray="5 5"
                          name="Target"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weight Progress</CardTitle>
                  <CardDescription>Weekly weight measurements and goal tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weightData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis domain={[160, 190]} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="weight"
                          stroke="#16a34a"
                          fill="#16a34a"
                          fillOpacity={0.3}
                          name="Current Weight"
                        />
                        <Line type="monotone" dataKey="goal" stroke="#dc2626" strokeDasharray="5 5" name="Goal" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>HbA1c Prediction</CardTitle>
                  <CardDescription>Historical values and AI-powered predictions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={hba1cData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[6, 9]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={2} name="Actual" />
                        <Line
                          type="monotone"
                          dataKey="predicted"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Predicted"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Exercise Impact</CardTitle>
                  <CardDescription>Glucose levels before and after different exercises</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={exerciseImpactData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="beforeExercise" fill="#ef4444" name="Before Exercise" />
                        <Bar dataKey="afterExercise" fill="#22c55e" name="After Exercise" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Patterns & Insights Tab */}
          <TabsContent value="patterns" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Food Response Patterns</CardTitle>
                  <CardDescription>How different foods affect your glucose levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {foodResponseData.map((food, index) => (
                      <div key={food.food} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                            <p className="font-medium">{food.food}</p>
                            <p className="text-sm text-gray-600">{food.frequency} meals logged</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">+{food.avgResponse} mg/dL</p>
                          <p className="text-xs text-gray-600">avg response</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Patterns</CardTitle>
                  <CardDescription>Your glucose patterns by day of the week</CardDescription>
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
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="avg" fill="#3b82f6" name="Average Glucose" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                  <CardDescription>AI-generated insights from your health data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Exercise Timing</p>
                      <p className="text-sm text-blue-800">
                        Walking after dinner reduces your glucose by an average of 20 mg/dL
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Best Meal Timing</p>
                      <p className="text-sm text-green-800">
                        Your glucose control is best when you eat lunch between 12-1 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-orange-900">Sleep Impact</p>
                      <p className="text-sm text-orange-800">
                        Poor sleep ({"<"}6 hours) correlates with 15% higher morning glucose
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Medication Effectiveness</CardTitle>
                  <CardDescription>How your medications are impacting your glucose control</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Metformin 500mg</p>
                        <p className="text-sm text-gray-600">Twice daily</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-800">Effective</Badge>
                        <p className="text-xs text-gray-600 mt-1">-18% avg glucose</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Glipizide 5mg</p>
                        <p className="text-sm text-gray-600">Once daily</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-yellow-100 text-yellow-800">Moderate</Badge>
                        <p className="text-xs text-gray-600 mt-1">-8% avg glucose</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Goal Progress Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Goal Achievement</CardTitle>
                  <CardDescription>Track your progress toward health goals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {goalProgress.map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-sm">{goal.goal}</p>
                        <Badge
                          variant="secondary"
                          className={
                            goal.progress >= 90
                              ? "bg-green-100 text-green-800"
                              : goal.progress >= 70
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {goal.progress}%
                        </Badge>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Current: {goal.current}</span>
                        <span>Target: {goal.target}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Achievements</CardTitle>
                  <CardDescription>Your accomplishments this month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Glucose Target Days</p>
                      <p className="text-sm text-gray-600">21 out of 30 days in target range</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Exercise Streak</p>
                      <p className="text-sm text-gray-600">12 consecutive days with activity</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <Scale className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Weight Loss Milestone</p>
                      <p className="text-sm text-gray-600">Lost 7.5 lbs - halfway to goal!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Monthly Health Report</CardTitle>
                  <CardDescription>Comprehensive summary for healthcare providers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Key Metrics Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Average Fasting Glucose:</span>
                          <span className="font-medium">89 mg/dL</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average Post-meal Glucose:</span>
                          <span className="font-medium">128 mg/dL</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time in Range (70-180):</span>
                          <span className="font-medium">68%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Weight Change:</span>
                          <span className="font-medium text-green-600">-7.5 lbs</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Exercise Sessions:</span>
                          <span className="font-medium">24</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Medication Adherence</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Metformin:</span>
                          <span className="font-medium">95%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Glipizide:</span>
                          <span className="font-medium">88%</span>
                        </div>
                      </div>
                      <h4 className="font-medium mt-4">Notable Events</h4>
                      <div className="text-sm text-gray-600">
                        <p>• Started new exercise routine (Week 2)</p>
                        <p>• Adjusted dinner timing (Week 3)</p>
                        <p>• Reduced carb intake by 20% (Week 4)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export Options</CardTitle>
                  <CardDescription>Share your data with healthcare providers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF Report
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Share className="h-4 w-4 mr-2" />
                    Email to Doctor
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Review
                  </Button>
                  <div className="text-xs text-gray-600 mt-4">
                    <p>Reports include:</p>
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
