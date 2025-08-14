"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, TrendingUp, AlertTriangle, CheckCircle, Phone, MessageSquare, BarChart3, Activity } from "lucide-react"
import {
  CoachAnalyticsService,
  type PatientData,
  type AnalyticsData,
  type PredictiveInsight,
} from "@/lib/coach-analytics"
import { FadeIn, SlideIn, StaggeredList } from "@/components/ui/advanced-animations"

export default function CoachDashboardPage() {
  const [analyticsService] = useState(() => new CoachAnalyticsService())
  const [patients, setPatients] = useState<PatientData[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [insights, setInsights] = useState<PredictiveInsight[]>([])
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      const [patientsData, analyticsData, insightsData] = await Promise.all([
        analyticsService.getPatientList(),
        analyticsService.getAnalyticsDashboard(),
        analyticsService.getPredictiveInsights(),
      ])

      setPatients(patientsData)
      setAnalytics(analyticsData)
      setInsights(insightsData)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "low":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading coach dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Coach Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your patients' fasting journeys</p>
        </div>
      </FadeIn>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <SlideIn direction="up">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                      <p className="text-2xl font-bold">{analytics?.totalPatients}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Today</p>
                      <p className="text-2xl font-bold">{analytics?.activePatients}</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold">{analytics?.successRate}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Weight Loss</p>
                      <p className="text-2xl font-bold">{analytics?.avgWeightLoss}lbs</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </SlideIn>

          {/* High Priority Patients */}
          <SlideIn direction="left" delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  High Priority Patients
                </CardTitle>
                <CardDescription>Patients requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patients
                    .filter((p) => p.riskLevel === "high")
                    .map((patient) => (
                      <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 font-semibold">{patient.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Avg Glucose: {patient.recentMetrics.avgGlucose} mg/dL
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getRiskColor(patient.riskLevel)}>{patient.riskLevel} risk</Badge>
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </SlideIn>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Patient List</CardTitle>
                  <CardDescription>All patients under your care</CardDescription>
                </CardHeader>
                <CardContent>
                  <StaggeredList className="space-y-3">
                    {patients.map((patient) => (
                      <div
                        key={patient.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedPatient?.id === patient.id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">{patient.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-medium">{patient.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Type {patient.diabetesType} • {patient.age} years
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getRiskColor(patient.riskLevel)}>{patient.riskLevel}</Badge>
                            {patient.currentFastingSession && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {patient.currentFastingSession.type} • {patient.currentFastingSession.progress}%
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </StaggeredList>
                </CardContent>
              </Card>
            </div>

            {/* Patient Details */}
            <div>
              {selectedPatient ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedPatient.name}</CardTitle>
                    <CardDescription>{selectedPatient.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Age</p>
                        <p className="text-lg font-semibold">{selectedPatient.age}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Diabetes Type</p>
                        <p className="text-lg font-semibold">Type {selectedPatient.diabetesType}</p>
                      </div>
                    </div>

                    {selectedPatient.currentFastingSession && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Current Fast</p>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="font-medium">{selectedPatient.currentFastingSession.type}</p>
                          <Progress value={selectedPatient.currentFastingSession.progress} className="mt-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {selectedPatient.currentFastingSession.progress}% complete
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Recent Metrics</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Avg Glucose</span>
                          <span className="text-sm font-medium">{selectedPatient.recentMetrics.avgGlucose} mg/dL</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Weight Change</span>
                          <span className="text-sm font-medium">{selectedPatient.recentMetrics.weightChange} lbs</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Adherence Rate</span>
                          <span className="text-sm font-medium">{selectedPatient.recentMetrics.adherenceRate}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a patient to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription>Predictive analytics and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <StaggeredList className="space-y-4">
                {insights.map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium">{insight.message}</p>
                        <p className="text-sm text-muted-foreground">Confidence: {insight.confidence}%</p>
                      </div>
                      <Badge className={getUrgencyColor(insight.urgency)}>{insight.urgency} priority</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Recommendations:</p>
                      <ul className="text-sm space-y-1">
                        {insight.recommendations.map((rec, recIndex) => (
                          <li key={recIndex} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </StaggeredList>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Low Risk</span>
                    <span className="text-sm font-medium">{analytics?.riskDistribution.low}%</span>
                  </div>
                  <Progress value={analytics?.riskDistribution.low} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Medium Risk</span>
                    <span className="text-sm font-medium">{analytics?.riskDistribution.medium}%</span>
                  </div>
                  <Progress value={analytics?.riskDistribution.medium} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">High Risk</span>
                    <span className="text-sm font-medium">{analytics?.riskDistribution.high}%</span>
                  </div>
                  <Progress value={analytics?.riskDistribution.high} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fasting Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics?.fastingTypeDistribution || {}).map(([type, percentage]) => (
                    <div key={type}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{type}</span>
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
