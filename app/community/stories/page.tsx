"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, MessageCircle, Share, Trophy, TrendingUp, Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShareStoryModal } from "@/components/community/share-story-modal"

export default function SuccessStoriesPage() {
  const [filterCategory, setFilterCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [storyLikes, setStoryLikes] = useState<Record<number, boolean>>({})
  const [storyCounts, setStoryCounts] = useState<Record<number, { likes: number; comments: number; shares: number }>>(
    {},
  )

  const successStories = [
    {
      id: 1,
      user: "Maria Rodriguez",
      avatar: "/smiling-hispanic-woman.png",
      title: "From Pre-Diabetic to Healthiest I've Ever Been",
      achievement: "Lost 25lbs in 6 months",
      category: "weight-loss",
      story:
        "Six months ago, I was diagnosed as pre-diabetic and 25 pounds overweight. I was scared and didn't know where to start. The MetaReverse community became my lifeline. Through the AI meal planning and the incredible support from the 'Weight Loss Warriors' group, I completely transformed my relationship with food. The community challenges kept me motivated, and seeing others share their victories inspired me to keep going. Today, my blood sugar is normal, I've lost 25 pounds, and I feel more energetic than I have in years. This community saved my health and possibly my life.",
      metrics: {
        weightLoss: "25 lbs",
        hba1cImprovement: "6.8% to 5.4%",
        timeframe: "6 months",
      },
      likes: 234,
      comments: 45,
      shares: 12,
      badge: "Weight Loss Champion",
      datePosted: "2 days ago",
      verified: true,
    },
    {
      id: 2,
      user: "David Chen",
      avatar: "/middle-aged-man-contemplative.png",
      title: "Reversing Type 2 Diabetes: My Journey to Medication-Free Life",
      achievement: "HbA1c from 9.2% to 6.8%",
      category: "diabetes",
      story:
        "When I was diagnosed with Type 2 diabetes two years ago, my HbA1c was 9.2% and I was on multiple medications. My doctor said I'd probably need insulin soon. I felt hopeless until I found MetaReverse. The AI coaching helped me understand how different foods affected my blood sugar, and the 'Newly Diagnosed T2D' support group gave me the emotional support I needed. The intermittent fasting community taught me sustainable eating patterns. Today, my HbA1c is 6.8% and I'm completely off diabetes medication. My doctor calls it a miracle, but I know it was the power of this community and the tools that made it possible.",
      metrics: {
        hba1cImprovement: "9.2% to 6.8%",
        medicationReduction: "3 to 0",
        timeframe: "18 months",
      },
      likes: 189,
      comments: 67,
      shares: 23,
      badge: "Diabetes Warrior",
      datePosted: "1 week ago",
      verified: true,
    },
    {
      id: 3,
      user: "Sarah Johnson",
      avatar: "/professional-woman-smiling.png",
      title: "Finding Balance: Managing Diabetes While Building My Career",
      achievement: "Maintained HbA1c under 7% for 2 years",
      category: "lifestyle",
      story:
        "As a busy executive, I thought managing diabetes meant sacrificing my career goals. I was constantly stressed, skipping meals, and my blood sugar was all over the place. The MetaReverse community showed me that health and success aren't mutually exclusive. The meal prep community taught me how to prepare healthy meals in advance, and the AI insights helped me understand how stress affected my glucose levels. The support from other working professionals in similar situations was invaluable. Now I've maintained an HbA1c under 7% for two years while getting promoted twice. This community taught me that taking care of my health actually made me more successful, not less.",
      metrics: {
        hba1cStability: "Under 7% for 24 months",
        stressReduction: "40% improvement",
        careerGrowth: "2 promotions",
      },
      likes: 156,
      comments: 34,
      shares: 8,
      badge: "Balance Master",
      datePosted: "3 days ago",
      verified: true,
    },
    {
      id: 4,
      user: "Robert Kim",
      avatar: "/older-black-man.png",
      title: "Never Too Late: Starting My Health Journey at 65",
      achievement: "Lost 30lbs and improved mobility",
      category: "fitness",
      story:
        "At 65, I thought it was too late to make significant health changes. I had Type 2 diabetes, was 30 pounds overweight, and could barely walk up stairs without getting winded. My family was worried, and honestly, so was I. Joining MetaReverse was the best decision I ever made. The 'Exercise Beginners Circle' welcomed me with open arms and showed me that fitness isn't about being young or athletic – it's about taking small, consistent steps. The AI exercise planner created workouts perfect for my limitations, and the community celebrated every small victory. Six months later, I've lost 30 pounds, can climb stairs easily, and my diabetes is well-controlled. Age is just a number when you have the right support system.",
      metrics: {
        weightLoss: "30 lbs",
        mobilityImprovement: "Significant",
        timeframe: "6 months",
      },
      likes: 278,
      comments: 89,
      shares: 34,
      badge: "Inspiration Award",
      datePosted: "5 days ago",
      verified: true,
    },
  ]

  const filteredStories = successStories.filter((story) => {
    return filterCategory === "all" || story.category === filterCategory
  })

  const sortedStories = [...filteredStories].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
    } else if (sortBy === "popular") {
      return b.likes + b.comments + b.shares - (a.likes + a.comments + a.shares)
    }
    return 0
  })

  useState(() => {
    const initialCounts: Record<number, { likes: number; comments: number; shares: number }> = {}
    successStories.forEach((story) => {
      initialCounts[story.id] = {
        likes: story.likes,
        comments: story.comments,
        shares: story.shares,
      }
    })
    setStoryCounts(initialCounts)
  })

  const handleLike = async (storyId: number) => {
    try {
      const response = await fetch(`/api/community/stories/${storyId}/like`, {
        method: "POST",
      })

      if (response.ok) {
        const { liked } = await response.json()
        setStoryLikes((prev) => ({ ...prev, [storyId]: liked }))
        setStoryCounts((prev) => ({
          ...prev,
          [storyId]: {
            ...prev[storyId],
            likes: liked ? prev[storyId].likes + 1 : prev[storyId].likes - 1,
          },
        }))
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/community">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Success Stories</h1>
                <p className="text-sm text-gray-600">Inspiring journeys from our community</p>
              </div>
            </div>
            <ShareStoryModal>
              <Button>
                <Trophy className="h-4 w-4 mr-2" />
                Share Your Story
              </Button>
            </ShareStoryModal>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stories</SelectItem>
              <SelectItem value="weight-loss">Weight Loss</SelectItem>
              <SelectItem value="diabetes">Diabetes Management</SelectItem>
              <SelectItem value="lifestyle">Lifestyle</SelectItem>
              <SelectItem value="fitness">Fitness</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <TrendingUp className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Success Stories */}
        <div className="space-y-8">
          {sortedStories.map((story) => (
            <Card key={story.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={story.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {story.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{story.user}</h3>
                      {story.verified && (
                        <Badge variant="outline" className="text-xs">
                          ✓ Verified
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {story.badge}
                      </Badge>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{story.title}</h2>
                    <p className="text-lg font-medium text-green-600 mb-2">{story.achievement}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{story.datePosted}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="prose prose-gray max-w-none mb-6">
                  <p className="text-gray-700 leading-relaxed">{story.story}</p>
                </div>

                {/* Metrics */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Achievements</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(story.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-lg font-bold text-blue-600">{value}</div>
                        <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Engagement */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => handleLike(story.id)}
                      className={`flex items-center gap-2 transition-colors ${
                        storyLikes[story.id] ? "text-red-600" : "text-gray-600 hover:text-red-600"
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${storyLikes[story.id] ? "fill-current" : ""}`} />
                      <span>{storyCounts[story.id]?.likes || story.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <MessageCircle className="h-5 w-5" />
                      <span>{storyCounts[story.id]?.comments || story.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                      <Share className="h-5 w-5" />
                      <span>{storyCounts[story.id]?.shares || story.shares}</span>
                    </button>
                  </div>
                  <Button variant="outline" size="sm">
                    Read Comments
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 p-8 bg-blue-50 rounded-lg">
          <Trophy className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Have a Success Story to Share?</h3>
          <p className="text-gray-600 mb-4">
            Your journey could inspire and help others in the community. Share your achievements and be part of the
            motivation that drives others to succeed.
          </p>
          <ShareStoryModal>
            <Button size="lg">Share Your Success Story</Button>
          </ShareStoryModal>
        </div>
      </div>
    </div>
  )
}
