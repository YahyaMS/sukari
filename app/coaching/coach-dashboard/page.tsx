"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  MessageCircle,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

const patients = [
  {
    id: "1",
    name: "John Smith",
    condition: "Type 2 Diabetes",
    lastContact: "2 hours ago",
    status: "active",
    progress: 85,
    alerts: 1,
    avatar: "/middle-aged-man-contemplative.png",
    recentMetrics: {
      avgGlucose: 142,
      weightChange: -2.3,
      adherence: 90,
    },
  },
  {
    id: "2",
    name: "Maria Garcia",
    condition: "Pre-diabetes",
    lastContact: "1 day ago",
    status: "active",
    progress: 92,
    alerts: 0,
    avatar: "/smiling-hispanic-woman.png",
    recentMetrics: {
      avgGlucose: 118,
      weightChange: -4.1,
      adherence: 95,
    },
  },
  {
    id: "3",
    name: "Robert Johnson",
    condition: "Type 2 Diabetes",
    lastContact: "3 days ago",
    status: "needs_attention",
    progress: 65,
    alerts: 2,
    avatar: "/older-black-man.png",
    recentMetrics: {
      avgGlucose: 165,
      weightChange: 0.5,
      adherence: 70,
    },
  },
]

const upcomingAppointments = [
  {
    id: "1",
    patientName: "John Smith",
    type: "Follow-up Session",
    time: "2:00 PM",
    duration: "30 min",
    status: "confirmed",
  },
  {
    id: "2",
    patientName: "Maria Garcia",
    type: "Nutrition Planning",
    time: "3:30 PM",
    duration: "45 min",
    status: "confirmed",
  },
  {
    id: "3",
    patientName: "Robert Johnson",
    type: "Initial Consultation",
    time: "4:30 PM",
    duration: "60 min",
    status: "pending",
  },
]

export default function CoachDashboardPage() {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "needs_attention":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalPatients = patients.length
  const activePatients = patients.filter((p) => p.status === "active").length
  const patientsNeedingAttention = patients.filter((p) => p.status === "needs_attention").length
  const totalAlerts = patients.reduce((sum, p) => sum + p.alerts, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Coach Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">{totalAlerts} Alerts</Badge>
              <Avatar>
                <AvatarImage src="/professional-female-doctor.png" />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPatients}</div>
              <p className="text-xs text-muted-foreground">Active caseload</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activePatients}</div>
              <p className="text-xs text-muted-foreground">On track with goals</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Need Attention</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patientsNeedingAttention}</div>
              <p className="text-xs text-muted-foreground">Require follow-up</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              <p className="text-xs text-muted-foreground">Scheduled consultations</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Patient List */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="patients" className="space-y-4">
              <TabsList>
                <TabsTrigger value="patients">My Patients</TabsTrigger>
                <TabsTrigger value="appointments">Today's Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="patients">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Overview</CardTitle>
                    <CardDescription>Monitor your patients' progress and health metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {patients.map((patient) => (
                        <div
                          key={patient.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedPatient(patient.id)}
                        >
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                              <AvatarFallback>
                                {patient.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{patient.name}</h4>
                              <p className="text-sm text-gray-600">{patient.condition}</p>
                              <p className="text-xs text-gray-500">Last contact: {patient.lastContact}</p>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(patient.status)} variant="secondary">
                                {patient.status.replace("_", " ")}
                              </Badge>
                              {patient.alerts > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {patient.alerts} alert{patient.alerts > 1 ? "s" : ""}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <span>Progress:</span>
                              <Progress value={patient.progress} className="w-16 h-2" />
                              <span>{patient.progress}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appointments">
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Schedule</CardTitle>
                    <CardDescription>Your upcoming consultations and appointments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Clock className="h-5 w-5 text-gray-500" />
                            <div>
                              <h4 className="font-medium">{appointment.patientName}</h4>
                              <p className="text-sm text-gray-600">{appointment.type}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{appointment.time}</p>
                            <p className="text-sm text-gray-600">{appointment.duration}</p>
                            <Badge
                              variant="secondary"
                              className={
                                appointment.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Patient Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedPatient ? (
              <Card>
                <CardHeader>
                  <CardTitle>Patient Details</CardTitle>
                  <CardDescription>{patients.find((p) => p.id === selectedPatient)?.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const patient = patients.find((p) => p.id === selectedPatient)
                    if (!patient) return null

                    return (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                            <AvatarFallback>
                              {patient.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{patient.name}</h4>
                            <p className="text-sm text-gray-600">{patient.condition}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Avg Glucose</span>
                            <div className="flex items-center space-x-1">
                              <span className="font-medium">{patient.recentMetrics.avgGlucose} mg/dL</span>
                              <Activity className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Weight Change</span>
                            <div className="flex items-center space-x-1">
                              <span className="font-medium">{patient.recentMetrics.weightChange} lbs</span>
                              {patient.recentMetrics.weightChange < 0 ? (
                                <TrendingDown className="h-4 w-4 text-green-600" />
                              ) : (
                                <TrendingUp className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Plan Adherence</span>
                            <span className="font-medium">{patient.recentMetrics.adherence}%</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Button className="w-full" size="sm">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Send Message
                          </Button>
                          <Button variant="outline" className="w-full bg-transparent" size="sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Session
                          </Button>
                        </div>
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a patient to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
