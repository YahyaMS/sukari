"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Users,
  MessageCircle,
  Trophy,
  Lightbulb,
  Heart,
  TrendingUp,
  Sparkles,
  Bot,
  Star,
  Calendar,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const communityStats = {
    totalMembers: 12847,
    activeToday: 1234,
    successStories: 892,
    supportGroups: 45,
  }

  const featuredStories = [
    {
      user: "Maria Rodriguez",
      avatar: "/smiling-hispanic-woman.png",
      achievement: "Lost 25lbs in 6 months",
      story:
        "Through the MetaReverse community support and AI meal planning, I've completely transformed my relationship with food...",
      likes: 234,
      comments: 45,
      badge: "Weight Loss Champion",
    },
    {
      user: "David Chen",
      avatar: "/middle-aged-man-contemplative.png",
      achievement: "HbA1c from 9.2% to 6.8%",
      story: "The AI coaching and community accountability helped me reverse my diabetes. I'm now medication-free!",
      likes: 189,
      comments: 67,
      badge: "Diabetes Warrior",
    },
  ]

  const supportGroups = [
    {
      name: "Newly Diagnosed T2D",
      members: 234,
      description: "Support for those recently diagnosed with Type 2 Diabetes",
      aiMatch: 95,
      activity: "Very Active",
    },
    {
      name: "Weight Loss Journey",
      members: 456,
      description: "Peer support for sustainable weight management",
      aiMatch: 88,
      activity: "Active",
    },
    {
      name: "Meal Prep Masters",
      members: 189,
      description: "Share recipes and meal planning strategies",
      aiMatch: 92,
      activity: "Very Active",
    },
  ]

  const aiInsights = [
    {
      title: "Community Mood Trending Positive",
      description: "AI analysis shows 87% positive sentiment this week, up 12% from last week",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Popular Discussion Topics",
      description: "Intermittent fasting, meal prep, and exercise motivation are trending",
      icon: Lightbulb,
      color: "text-blue-600",
    },
    {
      title: "Success Pattern Identified",
      description: "Members who engage in support groups show 3x better health outcomes",
      icon: Trophy,
      color: "text-orange-600",
    },
  ]

  const upcomingEvents = [
    {
      title: "Expert Q&A: Managing Diabetes with Dr. Sarah Kim",
      date: "Tomorrow, 2:00 PM",
      participants: 234,
      type: "Expert Session",
    },
    {
      title: "30-Day Meal Prep Challenge",
      date: "Starting Monday",
      participants: 567,
      type: "Community Challenge",
    },
    {
      title: "Virtual Support Group: Motivation Monday",
      date: "Every Monday, 7:00 PM",
      participants: 89,
      type: "Support Group",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Community</h1>
                <p className="text-sm text-gray-600">Connect, share, and grow together</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{communityStats.totalMembers.toLocaleString()} members</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-blue-600" />
                <span className="font-semibold text-gray-900">MetaReverse</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{communityStats.totalMembers.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Members</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{communityStats.activeToday.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Active Today</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{communityStats.successStories}</div>
                <div className="text-sm text-gray-600">Success Stories</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{communityStats.supportGroups}</div>
                <div className="text-sm text-gray-600">Support Groups</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Community Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-purple-600" />
                  AI Community Insights
                  <Badge variant="secondary" className="ml-2">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Powered by AI
                  </Badge>
                </CardTitle>
                <CardDescription>Real-time analysis of community health and engagement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <insight.icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                    <div>
                      <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Featured Success Stories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-orange-600" />
                  Featured Success Stories
                </CardTitle>
                <CardDescription>Inspiring journeys from our community members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {featuredStories.map((story, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar>
                        <AvatarImage src={story.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {story.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{story.user}</h4>
                          <Badge variant="outline" className="text-xs">
                            {story.badge}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-green-600">{story.achievement}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{story.story}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {story.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {story.comments}
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        Read Full Story
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="text-center">
                  <Link href="/community/stories">
                    <Button variant="outline">View All Success Stories</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* AI-Matched Support Groups */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  AI-Matched Support Groups
                  <Badge variant="secondary" className="ml-2">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Smart Matching
                  </Badge>
                </CardTitle>
                <CardDescription>Groups recommended based on your health profile and goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {supportGroups.map((group, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{group.name}</h4>
                        <p className="text-sm text-gray-600">{group.description}</p>
                      </div>
                      <Badge variant={group.activity === "Very Active" ? "default" : "secondary"}>
                        {group.activity}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{group.members} members</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{group.aiMatch}% AI match</span>
                        </div>
                      </div>
                      <Button size="sm">Join Group</Button>
                    </div>
                  </div>
                ))}
                <div className="text-center">
                  <Link href="/community/groups">
                    <Button variant="outline">Browse All Groups</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/community/post">
                  <Button className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Share Your Story
                  </Button>
                </Link>
                <Link href="/community/groups/find">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    Find Support Group
                  </Button>
                </Link>
                <Link href="/community/ask-expert">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Ask an Expert
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-3">
                    <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                    <p className="text-xs text-gray-600">{event.date}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                      <span className="text-xs text-gray-500">{event.participants} joining</span>
                    </div>
                  </div>
                ))}
                <Link href="/community/events">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    View All Events
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Community Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Community Champions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Sarah M.", points: 2450, badge: "Motivation Master" },
                  { name: "Mike R.", points: 2180, badge: "Support Hero" },
                  { name: "Lisa K.", points: 1950, badge: "Story Sharer" },
                ].map((champion, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="text-lg font-bold text-yellow-600">#{index + 1}</div>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {champion.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{champion.name}</p>
                      <p className="text-xs text-gray-600">{champion.badge}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{champion.points}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
