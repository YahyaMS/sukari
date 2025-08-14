"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Users, Search, Filter, Star, Bot, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/community">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Support Groups</h1>
                <p className="text-sm text-gray-600">Find your community and connect with peers</p>
              </div>
            </div>
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search groups by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="diabetes">Diabetes</SelectItem>
              <SelectItem value="weight-loss">Weight Loss</SelectItem>
              <SelectItem value="nutrition">Nutrition</SelectItem>
              <SelectItem value="fitness">Fitness</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* AI Recommended Groups */}
        {recommendedGroups.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">AI Recommended for You</h2>
              <Badge variant="secondary">
                <Sparkles className="h-3 w-3 mr-1" />
                Smart Match
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedGroups.map((group) => (
                <Card key={group.id} className="border-2 border-purple-200 bg-purple-50/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <CardDescription className="mt-1">{group.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{group.aiMatch}%</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {group.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {group.members} members
                        </div>
                        <Badge variant={group.activity === "Very Active" ? "default" : "secondary"} className="text-xs">
                          {group.activity}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <p>Moderated by {group.moderator}</p>
                        <p>Last activity: {group.lastActivity}</p>
                      </div>
                      <Link href={`/community/groups/${group.id}`}>
                        <Button size="sm">Join Group</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Other Groups */}
        {otherGroups.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">All Support Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherGroups.map((group) => (
                <Card key={group.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <CardDescription className="mt-1">{group.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star className="h-4 w-4" />
                        <span>{group.aiMatch}%</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {group.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {group.members} members
                        </div>
                        <Badge variant={group.activity === "Very Active" ? "default" : "secondary"} className="text-xs">
                          {group.activity}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <p>Moderated by {group.moderator}</p>
                        <p>Last activity: {group.lastActivity}</p>
                      </div>
                      <Link href={`/community/groups/${group.id}`}>
                        <Button variant="outline" size="sm">
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
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No groups found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters, or create a new group.</p>
            <Button>Create New Group</Button>
          </div>
        )}
      </div>
    </div>
  )
}
