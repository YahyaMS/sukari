"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Icon3D } from "@/components/ui/3d-icon"
import {
  MessageCircle,
  Video,
  Calendar,
  Paperclip,
  Send,
  Phone,
  Star,
  Clock,
  FileText,
  ImageIcon,
  Mic,
  ArrowLeft,
  Camera,
} from "lucide-react"
import Link from "next/link"
import { ScheduleModal } from "@/components/coaching/schedule-modal"
import { toast } from "sonner"
import LabResultsModal from "@/components/coaching/lab-results-modal"
import ProgressPhotoModal from "@/components/coaching/progress-photo-modal"
import CarePlanModal from "@/components/coaching/care-plan-modal"

interface Message {
  id: string
  senderId: string
  senderType: "user" | "coach"
  content: string
  timestamp: Date
  type: "text" | "image" | "file" | "audio"
  fileUrl?: string
  fileName?: string
}

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "coach-1",
    senderType: "coach",
    content:
      "Good morning John! How are you feeling today? I noticed your glucose readings have been improving this week.",
    timestamp: new Date("2024-01-15T09:00:00"),
    type: "text",
  },
  {
    id: "2",
    senderId: "user-1",
    senderType: "user",
    content: "Hi Dr. Sarah! I'm feeling much better. The new meal plan is really helping. My energy levels are up too.",
    timestamp: new Date("2024-01-15T09:15:00"),
    type: "text",
  },
  {
    id: "3",
    senderId: "coach-1",
    senderType: "coach",
    content:
      "That's wonderful to hear! Keep up the great work. I've reviewed your food logs and I think we can make a small adjustment to your dinner portions.",
    timestamp: new Date("2024-01-15T09:20:00"),
    type: "text",
  },
  {
    id: "4",
    senderId: "user-1",
    senderType: "user",
    content: "Here are my latest lab results from yesterday's appointment",
    timestamp: new Date("2024-01-15T14:30:00"),
    type: "file",
    fileName: "Lab_Results_Jan_2024.pdf",
  },
]

export default function CoachingPage() {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [scheduleType, setScheduleType] = useState<"video" | "phone">("video")
  const [labResultsModalOpen, setLabResultsModalOpen] = useState(false)
  const [progressPhotoModalOpen, setProgressPhotoModalOpen] = useState(false)
  const [carePlanModalOpen, setCarePlanModalOpen] = useState(false)
  const [carePlan, setCarePlan] = useState<any>(null)

  const coach = {
    id: "coach-1",
    name: "Dr. Sarah Johnson",
    title: "Certified Diabetes Educator",
    specializations: ["Type 2 Diabetes", "Weight Management", "Nutrition"],
    rating: 4.9,
    experience: "8 years",
    avatar: "/professional-female-doctor.png",
    nextAvailable: "Today at 3:00 PM",
    responseTime: "Usually responds within 2 hours",
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: "user-1",
      senderType: "user",
      content: newMessage,
      timestamp: new Date(),
      type: "text",
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Simulate coach response
    setTimeout(() => {
      const coachResponse: Message = {
        id: (Date.now() + 1).toString(),
        senderId: "coach-1",
        senderType: "coach",
        content: "Thanks for sharing that! I'll review this and get back to you with recommendations.",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, coachResponse])
    }, 2000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleShareLabResults = async (file: File, notes: string) => {
    try {
      // In a real app, you'd upload the file first
      const mockFileUrl = URL.createObjectURL(file)

      const response = await fetch("/api/coaching/quick-actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "share_lab_results",
          data: {
            fileName: file.name,
            fileUrl: mockFileUrl,
            notes,
          },
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
        setLabResultsModalOpen(false)
      } else {
        toast.error(data.error || "Failed to share lab results")
      }
    } catch (error) {
      console.error("Error sharing lab results:", error)
      toast.error("Failed to share lab results")
    }
  }

  const handleSendProgressPhoto = async (file: File, photoType: string, notes: string) => {
    try {
      // In a real app, you'd upload the file first
      const mockPhotoUrl = URL.createObjectURL(file)

      const response = await fetch("/api/coaching/quick-actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "send_progress_photo",
          data: {
            photoUrl: mockPhotoUrl,
            photoType,
            notes,
          },
        }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
        setProgressPhotoModalOpen(false)
      } else {
        toast.error(data.error || "Failed to send progress photo")
      }
    } catch (error) {
      console.error("Error sending progress photo:", error)
      toast.error("Failed to send progress photo")
    }
  }

  const handleViewCarePlan = async () => {
    try {
      const response = await fetch("/api/coaching/quick-actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "view_care_plan",
        }),
      })

      const data = await response.json()
      if (data.success) {
        setCarePlan(data.carePlan)
        setCarePlanModalOpen(true)
      } else {
        toast.error(data.error || "Failed to load care plan")
      }
    } catch (error) {
      console.error("Error loading care plan:", error)
      toast.error("Failed to load care plan")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#21262D] relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-xl animate-bounce"></div>
      </div>

      {/* Header */}
      <header className="glass-card border-b border-white/10 relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <Icon3D shape="sphere" color="blue" size="sm" icon={MessageCircle} />
              <h1 className="text-2xl font-bold text-white">My Coach</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coach Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="relative">
                  <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-purple-500/30">
                    <AvatarImage src={coach.avatar || "/placeholder.svg"} alt={coach.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xl">
                      SJ
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Online</Badge>
                  </div>
                </div>
                <CardTitle className="text-white text-xl">{coach.name}</CardTitle>
                <CardDescription className="text-text-secondary">{coach.title}</CardDescription>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-white">{coach.rating}</span>
                  <span className="text-text-secondary">({coach.experience})</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-white">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {coach.specializations.map((spec) => (
                      <Badge key={spec} className="bg-accent-purple/20 text-accent-purple border-accent-purple/30">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <Clock className="h-4 w-4" />
                    <span>{coach.responseTime}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <Calendar className="h-4 w-4" />
                    <span>Next available: {coach.nextAvailable}</span>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-2">
                  <Button
                    className="w-full gradient-primary hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                    size="sm"
                    onClick={() => {
                      setScheduleType("video")
                      setScheduleModalOpen(true)
                    }}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Schedule Video Call
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                    size="sm"
                    onClick={() => {
                      setScheduleType("phone")
                      setScheduleModalOpen(true)
                    }}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Request Phone Call
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6 glass-card border-white/10 hover:border-white/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Icon3D shape="cube" color="green" size="sm" icon={Calendar} />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                  size="sm"
                  onClick={() => setLabResultsModalOpen(true)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Share Lab Results
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                  size="sm"
                  onClick={() => setProgressPhotoModalOpen(true)}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Send Progress Photo
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                  size="sm"
                  onClick={handleViewCarePlan}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View Care Plan
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col glass-card border-white/10 hover:border-white/20 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Chat with {coach.name}</CardTitle>
                    <CardDescription className="text-text-secondary">Secure, HIPAA-compliant messaging</CardDescription>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Online</Badge>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderType === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderType === "user"
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                          : "glass-card border-white/10 text-white"
                      }`}
                    >
                      {message.type === "text" && <p>{message.content}</p>}
                      {message.type === "file" && (
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{message.fileName}</span>
                        </div>
                      )}
                      <p
                        className={`text-xs mt-1 ${
                          message.senderType === "user" ? "text-purple-100" : "text-text-secondary"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 glass-input border-white/20 text-white placeholder:text-text-secondary"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="gradient-primary hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Modals */}
      <ScheduleModal isOpen={scheduleModalOpen} onClose={() => setScheduleModalOpen(false)} type={scheduleType} />

      <LabResultsModal
        isOpen={labResultsModalOpen}
        onClose={() => setLabResultsModalOpen(false)}
        onSubmit={handleShareLabResults}
      />

      <ProgressPhotoModal
        isOpen={progressPhotoModalOpen}
        onClose={() => setProgressPhotoModalOpen(false)}
        onSubmit={handleSendProgressPhoto}
      />

      <CarePlanModal isOpen={carePlanModalOpen} onClose={() => setCarePlanModalOpen(false)} carePlan={carePlan} />
    </div>
  )
}
