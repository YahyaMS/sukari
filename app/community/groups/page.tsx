"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Users, Search, Filter, Star, Bot, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icon3D } from "@/components/ui/3d-icon"

export default function SupportGroupsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  const supportGroups = [
    {
      id: 1,
      name: "Newly Diagnosed T2D Support",
      description:
        "A welcoming space for those recently diagnosed with Type 2 Diabetes. Share experiences, ask questions, and find support from others on similar journeys.",
      members: 234,
      category: "diabetes",
      activity: "Very Active",
      aiMatch: 95,
      moderator: "Dr. Sarah Kim",
      lastActivity: "2 minutes ago",
      tags: ["Type 2", "Newly Diagnosed", "Support"],
      isRecommended: true,
    },
    {
      id: 2,
      name: "Weight Loss Warriors",
      description:
        "Sustainable weight management through lifestyle changes. Share meal ideas, workout tips, and celebrate victories together.",
      members: 456,
      category: "weight-loss",
      activity: "Very Active",
      aiMatch: 88,
      moderator: "Coach Maria",
      lastActivity: "5 minutes ago",
      tags: ["Weight Loss", "Lifestyle", "Motivation"],
      isRecommended: true,
    },
    {
      id: 3,
      name: "Meal Prep Masters",
      description:
        "Master the art of healthy meal preparation. Share recipes, tips, and strategies for consistent healthy eating.",
      members: 189,
      category: "nutrition",
      activity: "Active",
      aiMatch: 92,
      moderator: "Chef David",
      lastActivity: "15 minutes ago",
      tags: ["Meal Prep", "Recipes", "Nutrition"],
      isRecommended: false,
    },
    {
      id: 4,
      name: "Exercise Beginners Circle",
      description:
        "Start your fitness journey with supportive peers. Perfect for those new to exercise or getting back into it.",
      members: 167,
      category: "fitness",
      activity: "Active",
      aiMatch: 78,
      moderator: "Trainer Alex",
      lastActivity: "1 hour ago",
      tags: ["Exercise", "Beginners", "Fitness"],
      isRecommended: false,
    },
    {
      id: 5,
      name: "Intermittent Fasting Community",
      description:
        "Explore intermittent fasting safely and effectively. Share experiences, schedules, and support each other's fasting goals.",
      members: 298,
      category: "nutrition",
      activity: "Very Active",
      aiMatch: 85,
      moderator: "Dr. Jennifer Lee",
      lastActivity: "30 minutes ago",
      tags: ["Intermittent Fasting", "Lifestyle", "Health"],
      isRecommended: true,
    },
    {
      id: 6,
      name: "Diabetes & Pregnancy Support",
      description: "Support for women managing diabetes during pregnancy. Share experiences and get expert guidance.",
      members: 89,
      category: "diabetes",
      activity: "Moderate",
      aiMatch: 72,
      moderator: "Dr. Lisa Chen",
      lastActivity: "2 hours ago",
      tags: ["Pregnancy", "Diabetes", "Women's Health"],
      isRecommended: false,
    },
  ]

  const filteredGroups = supportGroups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = filterCategory === "all" || group.category === filterCategory

    return matchesSearch && matchesCategory
  })

  const recommendedGroups = filteredGroups.filter((group) => group.isRecommended)
  const otherGroups = filteredGroups.filter((group) => !group.isRecommended)

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
              <Link href="/community">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Icon3D shape="sphere" color="blue" size="sm" icon={Users} />
                <div>
                  <h1 className="text-2xl font-bold text-white">Support Groups</h1>
                  <p className="text-sm text-text-secondary">Find your community and connect with peers</p>
                </div>
              </div>
            </div>
            <Button className="gradient-primary">
              <Users className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
            <Input
              placeholder="Search groups by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-input border-white/20 text-white placeholder:text-text-secondary"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full md:w-48 glass-input border-white/20 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className="glass-card border-white/20">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="diabetes">Diabetes</SelectItem>
              <SelectItem value="weight-loss">Weight Loss</SelectItem>
              <SelectItem value="nutrition">Nutrition</SelectItem>
              <SelectItem value="fitness">Fitness</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {recommendedGroups.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Icon3D shape="cube" color="purple" size="sm" icon={Bot} />
              <h2 className="text-xl font-semibold text-white">AI Recommended for You</h2>
              <Badge className="bg-accent-purple/20 text-accent-purple border-accent-purple/30">
                <Sparkles className="h-3 w-3 mr-1" />
                Smart Match
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedGroups.map((group) => (
                <Card
                  key={group.id}
                  className="glass-card border-accent-purple/30 bg-gradient-to-br from-accent-purple/10 to-accent-purple/5 hover:border-accent-purple/50 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-white">{group.name}</CardTitle>
                        <CardDescription className="mt-1 text-text-secondary">{group.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium text-white">{group.aiMatch}%</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {group.tags.map((tag, index) => (
                        <Badge key={index} className="text-xs bg-accent-blue/20 text-accent-blue border-accent-blue/30">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-text-secondary">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {group.members} members
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
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-text-secondary">
                        <p>Moderated by {group.moderator}</p>
                        <p>Last activity: {group.lastActivity}</p>
                      </div>
                      <Link href={`/community/groups/${group.id}`}>
                        <Button size="sm" className="gradient-primary">
                          Join Group
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {otherGroups.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">All Support Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherGroups.map((group) => (
                <Card
                  key={group.id}
                  className="glass-card border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-white">{group.name}</CardTitle>
                        <CardDescription className="mt-1 text-text-secondary">{group.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-text-secondary">
                        <Star className="h-4 w-4" />
                        <span>{group.aiMatch}%</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {group.tags.map((tag, index) => (
                        <Badge key={index} className="text-xs bg-accent-blue/20 text-accent-blue border-accent-blue/30">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-text-secondary">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {group.members} members
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
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-text-secondary">
                        <p>Moderated by {group.moderator}</p>
                        <p>Last activity: {group.lastActivity}</p>
                      </div>
                      <Link href={`/community/groups/${group.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          Join Group
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <Icon3D shape="sphere" color="blue" size="lg" icon={Users} />
            <h3 className="text-lg font-medium text-white mb-2 mt-4">No groups found</h3>
            <p className="text-text-secondary mb-4">Try adjusting your search or filters, or create a new group.</p>
            <Button className="gradient-primary">Create New Group</Button>
          </div>
        )}
      </div>
    </div>
  )
}
