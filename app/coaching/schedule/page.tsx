"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Video, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]

const consultationTypes = [
  {
    type: "Initial Consultation",
    duration: "60 minutes",
    description: "Comprehensive health assessment and goal setting",
  },
  {
    type: "Follow-up Session",
    duration: "30 minutes",
    description: "Progress review and plan adjustments",
  },
  {
    type: "Nutrition Planning",
    duration: "45 minutes",
    description: "Detailed meal planning and dietary guidance",
  },
  {
    type: "Emergency Consultation",
    duration: "15 minutes",
    description: "Urgent health concerns or questions",
  },
]

const experts = {
  "dr-sarah-kim": {
    name: "Dr. Sarah Kim",
    title: "Endocrinologist & Diabetes Specialist",
    avatar: "/professional-female-doctor.png",
  },
  "dr-michael-rodriguez": {
    name: "Dr. Michael Rodriguez",
    title: "Nutritionist & Metabolic Health Expert",
    avatar: "/middle-aged-man-contemplative.png",
  },
  "dr-jennifer-lee": {
    name: "Dr. Jennifer Lee",
    title: "Exercise Physiologist",
    avatar: "/smiling-hispanic-woman.png",
  },
  default: {
    name: "Dr. Sarah Johnson",
    title: "Certified Diabetes Educator",
    avatar: "/professional-female-doctor.png",
  },
}

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [consultationType, setConsultationType] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduledSession, setScheduledSession] = useState(null)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const expertId = searchParams.get("expert") || "default"

  const coach = experts[expertId] || experts.default

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !consultationType) {
      toast({
        title: "Missing Information",
        description: "Please select a date, time, and consultation type.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/coaching/schedule-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate,
          time: selectedTime,
          consultationType,
          notes,
          expertId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setScheduledSession(data.session)
        setIsScheduled(true)
        toast({
          title: "Session Scheduled!",
          description: data.message,
        })
      } else {
        throw new Error(data.error || "Failed to schedule session")
      }
    } catch (error) {
      console.error("Error scheduling session:", error)
      toast({
        title: "Scheduling Failed",
        description: "There was an error scheduling your session. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isScheduled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <header className="bg-white/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Link href="/coaching">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Consultation Scheduled</h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Consultation Scheduled!</h2>
                <p className="text-gray-600 mb-6">
                  Your video consultation with {coach.name} has been scheduled successfully.
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Date:</span>
                      <span>{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Time:</span>
                      <span>{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Type:</span>
                      <span>{consultationType}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Add to Calendar
                  </Button>
                  <Link href="/coaching">
                    <Button variant="outline" className="w-full bg-transparent">
                      Back to Messages
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/coaching">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Video className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Schedule Consultation</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Coach Info */}
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={coach.avatar || "/placeholder.svg"} alt={coach.name} />
                  <AvatarFallback>
                    {coach.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{coach.name}</CardTitle>
                <CardDescription>{coach.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Available Consultation Types</h4>
                    <div className="space-y-2">
                      {consultationTypes.map((type) => (
                        <div key={type.type} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-sm">{type.type}</span>
                            <Badge variant="secondary" className="text-xs">
                              {type.duration}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{type.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scheduling Form */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule Your Session</CardTitle>
                <CardDescription>Choose your preferred date, time, and consultation type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Consultation Type</label>
                  <Select value={consultationType} onValueChange={setConsultationType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select consultation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {consultationTypes.map((type) => (
                        <SelectItem key={type.type} value={type.type}>
                          {type.type} ({type.duration})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Date</label>
                  <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Today">Today</SelectItem>
                      <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                      <SelectItem value="Wednesday, Jan 17">Wednesday, Jan 17</SelectItem>
                      <SelectItem value="Thursday, Jan 18">Thursday, Jan 18</SelectItem>
                      <SelectItem value="Friday, Jan 19">Friday, Jan 19</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Available Times</label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className={selectedTime === time ? "" : "bg-transparent"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes for Your Coach (Optional)</label>
                  <Textarea
                    placeholder="What would you like to discuss? Any specific concerns or questions?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleSchedule}
                  disabled={!selectedDate || !selectedTime || !consultationType || isLoading}
                >
                  {isLoading ? "Scheduling..." : "Schedule Consultation"}
                </Button>

                <div className="text-xs text-gray-600 text-center">
                  You'll receive a calendar invite and video link 15 minutes before your session
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
