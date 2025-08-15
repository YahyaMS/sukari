"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Users, MessageCircle, Trophy, Lightbulb, Heart, TrendingUp, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icon3D } from "@/components/ui/3d-icon"

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
      color: "text-accent-green",
    },
    {
      title: "Popular Discussion Topics",
      description: "Intermittent fasting, meal prep, and exercise motivation are trending",
      icon: Lightbulb,
      color: "text-accent-blue",
    },
    {
      title: "Success Pattern Identified",
      description: "Members who engage in support groups show 3x better health outcomes",
      icon: Trophy,
      color: "text-accent-orange",
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
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#21262D] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-xl animate-bounce"></div>
      </div>

      <div className="glass-card border-b border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Icon3D shape="sphere" color="purple" size="sm" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Community</h1>
                  <p className="text-sm text-text-secondary">Connect, share, and grow together</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Users className="h-4 w-4" />
                <span>{communityStats.totalMembers.toLocaleString()} members</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon3D shape="heart" color="blue" size="sm" />
                <span className="font-semibold text-white">MetaReverse</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card border-accent-blue/30 bg-gradient-to-br from-accent-blue/10 to-accent-blue/5 hover:border-accent-blue/50 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-blue">
                  {communityStats.totalMembers.toLocaleString()}
                </div>
                <div className="text-sm text-text-secondary">Total Members</div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-accent-green/30 bg-gradient-to-br from-accent-green/10 to-accent-green/5 hover:border-accent-green/50 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-green">
                  {communityStats.activeToday.toLocaleString()}
                </div>
                <div className="text-sm text-text-secondary">Active Today</div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-accent-orange/30 bg-gradient-to-br from-accent-orange/10 to-accent-orange/5 hover:border-accent-orange/50 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-orange">{communityStats.successStories}</div>
                <div className="text-sm text-text-secondary">Success Stories</div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-accent-purple/30 bg-gradient-to-br from-accent-purple/10 to-accent-purple/5 hover:border-accent-purple/50 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-purple">{communityStats.supportGroups}</div>
                <div className="text-sm text-text-secondary">Support Groups</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Icon3D shape="cube" color="purple" size="sm" />
                  AI Community Insights
                  <Badge className="ml-2 bg-accent-purple/20 text-accent-purple border-accent-purple/30">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Powered by AI
                  </Badge>
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  Real-time analysis of community health and engagement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 glass-card border-white/10 rounded-lg">
                    <insight.icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                    <div>
                      <h4 className="font-medium text-white">{insight.title}</h4>
                      <p className="text-sm text-text-secondary">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Icon3D shape="torus" color="orange" size="sm" />
                  Featured Success Stories
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  Inspiring journeys from our community members
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {featuredStories.map((story, index) => (
                  <div
                    key={index}
                    className="glass-card border-white/10 rounded-lg p-4 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="ring-2 ring-accent-purple/30">
                        <AvatarImage src={story.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                          {story.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white">{story.user}</h4>
                          <Badge className="text-xs bg-accent-green/20 text-accent-green border-accent-green/30">
                            {story.badge}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-accent-green">{story.achievement}</p>
                      </div>
                    </div>
                    <p className="text-text-primary mb-3">{story.story}</p>
                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {story.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {story.comments}
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto text-white hover:bg-white/10">
                        Read Full Story
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="text-center">
                  <Link href="/community/stories">
                    <Button
                      variant="outline"
                      className="glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      View All Success Stories
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Icon3D shape="sphere" color="blue" size="sm" />
                  AI-Matched Support Groups
                  <Badge className="ml-2 bg-accent-blue/20 text-accent-blue border-accent-blue/30">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Smart Matching
                  </Badge>
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  Groups recommended based on your health profile and goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {supportGroups.map((group, index) => (
                  <div
                    key={index}
                    className="glass-card border-white/10 rounded-lg p-4 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-white">{group.name}</h4>
                        <p className="text-sm text-text-secondary">{group.description}</p>
                      </div>
                      <Badge
                        className={
                          group.activity === "Very Active"
                            ? "bg-accent-green/20 text-accent-green border-accent-green/30"
                            : "bg-accent-blue/20 text-accent-blue border-accent-blue/30"
                        }
                      >
                        {group.activity}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-4 text-sm text-text-secondary">
                        <span>{group.members} members</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{group.aiMatch}% AI match</span>
                        </div>
                      </div>
                      <Button size="sm" className="gradient-primary">
                        Join Group
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="text-center">
                  <Link href="/community/groups">
                    <Button
                      variant="outline"
                      className="glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      Browse All Groups
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon3D shape="capsule" color="green" size="sm" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/community/post">
                  <Button className="w-full gradient-primary">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Share Your Story
                  </Button>
                </Link>
                <Link href="/community/groups/find">
                  <Button
                    variant="outline"
                    className="w-full glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Find Support Group
                  </Button>
                </Link>
                <Link href="/community/ask-expert">
                  <Button
                    variant="outline"
                    className="w-full glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Ask an Expert
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Icon3D shape="cube" color="blue" size="sm" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="border-l-4 border-accent-blue pl-3">
                    <h4 className="font-medium text-white text-sm">{event.title}</h4>
                    <p className="text-xs text-text-secondary">{event.date}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge className="text-xs bg-accent-blue/20 text-accent-blue border-accent-blue/30">
                        {event.type}
                      </Badge>
                      <span className="text-xs text-text-secondary">{event.participants} joining</span>
                    </div>
                  </div>
                ))}
                <Link href="/community/events">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    View All Events
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Icon3D shape="torus" color="orange" size="sm" />
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
                    <div className="text-lg font-bold text-accent-orange">#{index + 1}</div>
                    <Avatar className="h-8 w-8 ring-2 ring-accent-orange/30">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-orange-500 to-red-500 text-white">
                        {champion.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-white">{champion.name}</p>
                      <p className="text-xs text-text-secondary">{champion.badge}</p>
                    </div>
                    <div className="text-sm font-medium text-white">{champion.points}</div>
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
