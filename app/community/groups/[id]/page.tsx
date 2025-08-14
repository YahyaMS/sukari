"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Users,
  Settings,
  Share2,
  Bell,
  Plus,
  Heart,
  Reply,
  MoreHorizontal,
  Pin,
  Star,
  ImageIcon,
  Video,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

interface GroupPageProps {
  params: {
    id: string
  }
}

export default function GroupPage({ params }: GroupPageProps) {
  const [newPost, setNewPost] = useState("")
  const [isJoined, setIsJoined] = useState(false)

  // Mock data based on group ID
  const getGroupData = (id: string) => {
    const groups = {
      "1": {
        name: "Newly Diagnosed T2D Support",
        description:
          "A welcoming space for those recently diagnosed with Type 2 Diabetes. Share experiences, ask questions, and find support from others on similar journeys.",
        members: 234,
        moderator: "Dr. Sarah Kim",
        category: "diabetes",
        tags: ["Type 2", "Newly Diagnosed", "Support"],
        rules: [
          "Be respectful and supportive to all members",
          "Share experiences, not medical advice",
          "Keep discussions relevant to Type 2 Diabetes",
          "No spam or promotional content",
        ],
      },
      "2": {
        name: "Weight Loss Warriors",
        description:
          "Sustainable weight management through lifestyle changes. Share meal ideas, workout tips, and celebrate victories together.",
        members: 456,
        moderator: "Coach Maria",
        category: "weight-loss",
        tags: ["Weight Loss", "Lifestyle", "Motivation"],
        rules: [
          "Focus on healthy, sustainable weight loss",
          "Share progress and celebrate victories",
          "Support each other through challenges",
          "No extreme dieting or unhealthy practices",
        ],
      },
    }
    return groups[id as keyof typeof groups] || groups["1"]
  }

  const group = getGroupData(params.id)

  const posts = [
    {
      id: 1,
      author: "Sarah M.",
      avatar: "/professional-woman-smiling.png",
      time: "2 hours ago",
      content:
        "Just got my latest HbA1c results - down from 8.2 to 7.1! The meal planning tips from this group have been life-changing. Thank you all for the support! 🎉",
      likes: 24,
      replies: 8,
      isPinned: true,
      tags: ["Success Story", "HbA1c"],
    },
    {
      id: 2,
      author: "Mike R.",
      avatar: "/middle-aged-man-contemplative.png",
      time: "4 hours ago",
      content:
        "Having a tough day with glucose spikes after meals. Any tips for better post-meal management? I'm following the meal plan but still struggling.",
      likes: 12,
      replies: 15,
      isPinned: false,
      tags: ["Question", "Glucose Management"],
    },
    {
      id: 3,
      author: "Dr. Sarah Kim",
      avatar: "/professional-female-doctor.png",
      time: "6 hours ago",
      content:
        "Weekly reminder: Remember to check your glucose 2 hours after meals, not just before. This helps you understand how different foods affect your levels. What patterns have you noticed?",
      likes: 31,
      replies: 22,
      isPinned: false,
      tags: ["Moderator", "Education"],
      isModerator: true,
    },
  ]

  const members = [
    { name: "Sarah M.", avatar: "/professional-woman-smiling.png", role: "Active Member", joinDate: "2 months ago" },
    { name: "Mike R.", avatar: "/middle-aged-man-contemplative.png", role: "New Member", joinDate: "1 week ago" },
    { name: "Dr. Sarah Kim", avatar: "/professional-female-doctor.png", role: "Moderator", joinDate: "6 months ago" },
    { name: "Lisa T.", avatar: "/smiling-hispanic-woman.png", role: "Active Member", joinDate: "3 months ago" },
    { name: "James W.", avatar: "/older-black-man.png", role: "Active Member", joinDate: "4 months ago" },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Weekly Check-in & Q&A",
      date: "Tomorrow, 7:00 PM",
      type: "Video Call",
      attendees: 23,
    },
    {
      id: 2,
      title: "Meal Planning Workshop",
      date: "Friday, 2:00 PM",
      type: "Workshop",
      attendees: 45,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/community/groups">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
                <p className="text-sm text-gray-600">
                  {group.members} members • Moderated by {group.moderator}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              {isJoined ? (
                <Button variant="outline" onClick={() => setIsJoined(false)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Joined
                </Button>
              ) : (
                <Button onClick={() => setIsJoined(true)}>
                  <Users className="h-4 w-4 mr-2" />
                  Join Group
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="discussions" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
              </TabsList>

              <TabsContent value="discussions" className="space-y-6">
                {/* New Post */}
                {isJoined && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Share with the group</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="Share your experience, ask a question, or offer support..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Photo
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            File
                          </Button>
                        </div>
                        <Button disabled={!newPost.trim()}>
                          <Plus className="h-4 w-4 mr-2" />
                          Post
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Posts */}
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Card key={post.id} className={post.isPinned ? "border-blue-200 bg-blue-50/30" : ""}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src={post.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{post.author[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{post.author}</span>
                              {post.isModerator && (
                                <Badge variant="secondary" className="text-xs">
                                  <Star className="h-3 w-3 mr-1" />
                                  Moderator
                                </Badge>
                              )}
                              {post.isPinned && (
                                <Badge variant="outline" className="text-xs">
                                  <Pin className="h-3 w-3 mr-1" />
                                  Pinned
                                </Badge>
                              )}
                              <span className="text-sm text-gray-500">{post.time}</span>
                            </div>
                            <p className="text-gray-900 mb-3">{post.content}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {post.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-4">
                              <Button variant="ghost" size="sm">
                                <Heart className="h-4 w-4 mr-1" />
                                {post.likes}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Reply className="h-4 w-4 mr-1" />
                                {post.replies}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="events" className="space-y-4">
                {upcomingEvents.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{event.date}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="outline">{event.type}</Badge>
                            <span className="text-sm text-gray-500">{event.attendees} attending</span>
                          </div>
                        </div>
                        <Button size="sm">Join Event</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Group Resources</CardTitle>
                    <CardDescription>Helpful materials shared by the community</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Type 2 Diabetes Meal Planning Guide</p>
                          <p className="text-sm text-gray-600">Shared by Dr. Sarah Kim</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Video className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Glucose Monitoring Best Practices</p>
                          <p className="text-sm text-gray-600">Video tutorial • 15 minutes</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Watch
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="challenges" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Challenges</CardTitle>
                    <CardDescription>Join group challenges to stay motivated</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg bg-green-50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">30-Day Glucose Tracking Challenge</h3>
                        <Badge className="bg-green-600">Active</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Track your glucose levels daily for 30 days</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">23/234 members participating</span>
                        <Button size="sm">Join Challenge</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Group Info */}
            <Card>
              <CardHeader>
                <CardTitle>About This Group</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{group.description}</p>
                <div className="flex flex-wrap gap-2">
                  {group.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Members</span>
                    <span className="font-medium">{group.members}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Category</span>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {group.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Group Rules */}
            <Card>
              <CardHeader>
                <CardTitle>Group Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {group.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 font-medium">{index + 1}.</span>
                      <span className="text-gray-600">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Recent Members */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Members</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {members.slice(0, 5).map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View All Members
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
