"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Bell,
  Check,
  X,
  Heart,
  MessageCircle,
  Calendar,
  TrendingUp,
  Bot,
  Users,
  Trophy,
  Pill,
  Activity,
  Clock,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [filterType, setFilterType] = useState("all")

  const empathicNotifications = [
    {
      id: 1,
      type: "health_alert",
      priority: "high",
      title: "Gentle glucose reminder",
      message: "It's been 4 hours since your last reading. No pressure - just a friendly nudge when you're ready.",
      timestamp: "5 minutes ago",
      read: false,
      actionable: true,
      actions: [
        { label: "I'm ready", type: "primary" },
        { label: "Remind me later", type: "secondary" },
      ],
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      type: "coach_message",
      priority: "medium",
      title: "Your coach is proud of you!",
      message: "Dr. Emily noticed your amazing consistency this week. She has some encouraging insights to share.",
      timestamp: "15 minutes ago",
      read: false,
      actionable: true,
      actions: [{ label: "See message", type: "primary" }],
      avatar: "/professional-female-doctor.png",
      icon: Heart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 3,
      type: "community",
      priority: "low",
      title: "Inspiring success story shared",
      message:
        "Maria's journey will warm your heart - 25 pounds down and feeling amazing! Her story might inspire you too.",
      timestamp: "30 minutes ago",
      read: false,
      actionable: true,
      actions: [{ label: "Read story", type: "primary" }],
      icon: Trophy,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: 4,
      type: "ai_insight",
      priority: "medium",
      title: "Celebrating your progress!",
      message: "Your glucose levels are 15% more stable this week. Your consistent meal timing is really paying off!",
      timestamp: "1 hour ago",
      read: true,
      actionable: true,
      actions: [{ label: "See details", type: "primary" }],
      icon: Bot,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      id: 5,
      type: "medication",
      priority: "high",
      title: "Medication time - you've got this!",
      message: "Time for your evening Metformin (500mg). Consistency with medications really helps your progress.",
      timestamp: "1 hour ago",
      read: false,
      actionable: true,
      actions: [
        { label: "Taken ✓", type: "primary" },
        { label: "15 more minutes", type: "secondary" },
      ],
      icon: Pill,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: 6,
      type: "appointment",
      priority: "medium",
      title: "Upcoming appointment reminder",
      message: "Video consultation with Dr. Emily Chen tomorrow at 2:00 PM. You're doing great!",
      timestamp: "2 hours ago",
      read: true,
      actionable: true,
      actions: [
        { label: "Join Call", type: "primary" },
        { label: "Reschedule", type: "secondary" },
      ],
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 7,
      type: "community",
      priority: "low",
      title: "Expert Q&A session starting soon",
      message: "Dr. Sarah Kim will answer diabetes questions in 30 minutes. Join the live session!",
      timestamp: "3 hours ago",
      read: true,
      actionable: true,
      actions: [{ label: "Join Session", type: "primary" }],
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: 8,
      type: "health_alert",
      priority: "medium",
      title: "Weekly Progress Summary",
      message: "Your weekly health report is ready. See your glucose trends and achievements!",
      timestamp: "1 day ago",
      read: true,
      actionable: true,
      actions: [{ label: "View Report", type: "primary" }],
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 9,
      type: "system",
      priority: "low",
      title: "App Update Available",
      message: "MetaReverse v1.2.0 is available with new AI features and bug fixes.",
      timestamp: "2 days ago",
      read: true,
      actionable: true,
      actions: [{ label: "Update Now", type: "primary" }],
      icon: Bell,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ]

  const filteredNotifications = empathicNotifications.filter((notification) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && !notification.read) ||
      (activeTab === "health" && ["health_alert", "medication", "ai_insight"].includes(notification.type)) ||
      (activeTab === "social" && ["coach_message", "community", "appointment"].includes(notification.type))

    const matchesFilter = filterType === "all" || notification.type === filterType

    return matchesTab && matchesFilter
  })

  const unreadCount = empathicNotifications.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    // Here you would update the notification status
    console.log("Marking notification as read:", id)
  }

  const dismissNotification = (id: number) => {
    // Here you would dismiss the notification
    console.log("Dismissing notification:", id)
  }

  const handleAction = (notificationId: number, actionLabel: string) => {
    // Here you would handle the specific action
    console.log("Handling action:", actionLabel, "for notification:", notificationId)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-300"
    }
  }

  const getTypeIcon = (notification: any) => {
    const IconComponent = notification.icon
    return <IconComponent className={`h-5 w-5 ${notification.color}`} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Your Health Updates</h1>
                <p className="text-sm text-gray-600">
                  Gentle reminders and encouraging updates for your journey
                  {unreadCount > 0 && (
                    <Badge variant="default" className="ml-2">
                      {unreadCount} new
                    </Badge>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => console.log("Mark all as read")}>
                <Check className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-blue-600" />
                <span className="font-semibold text-gray-900">MetaReverse</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="health_alert">Health Alerts</SelectItem>
              <SelectItem value="coach_message">Coach Messages</SelectItem>
              <SelectItem value="community">Community</SelectItem>
              <SelectItem value="ai_insight">AI Insights</SelectItem>
              <SelectItem value="medication">Medication</SelectItem>
              <SelectItem value="appointment">Appointments</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`border-l-4 ${getPriorityColor(notification.priority)} ${
                !notification.read ? "bg-blue-50/30" : ""
              } hover:shadow-md transition-shadow`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon/Avatar */}
                  <div className={`p-2 rounded-full ${notification.bgColor} flex-shrink-0`}>
                    {notification.avatar ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {notification.title
                            .split(" ")
                            .slice(-2)
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      getTypeIcon(notification)
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className={`font-semibold ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2 ml-4">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {notification.timestamp}
                        </div>
                        {!notification.read && <div className="h-2 w-2 bg-blue-600 rounded-full"></div>}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{notification.message}</p>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {notification.actionable &&
                          notification.actions?.map((action, index) => (
                            <Button
                              key={index}
                              size="sm"
                              variant={action.type === "primary" ? "default" : "outline"}
                              onClick={() => handleAction(notification.id, action.label)}
                            >
                              {action.label}
                            </Button>
                          ))}
                      </div>

                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissNotification(notification.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600">You're all caught up! Check back later for updates.</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Ready to take action?</h3>
          <p className="text-sm text-gray-600 mb-4">Every small step counts toward your health goals</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/tracking/glucose">
              <Button variant="outline" className="w-full bg-white">
                <Activity className="h-4 w-4 mr-2" />
                Log Reading
              </Button>
            </Link>
            <Link href="/tracking/meals">
              <Button variant="outline" className="w-full bg-white">
                <MessageCircle className="h-4 w-4 mr-2" />
                Log Meal
              </Button>
            </Link>
            <Link href="/coaching">
              <Button variant="outline" className="w-full bg-white">
                <Heart className="h-4 w-4 mr-2" />
                Chat with Coach
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
