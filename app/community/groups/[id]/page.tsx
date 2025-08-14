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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Icon3D } from "@/components/ui/3d-icon"

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
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#21262D] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <header className="glass-card border-b border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/community/groups">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Icon3D type="sphere" color="purple" size="sm" />
                <div>
                  <h1 className="text-2xl font-bold text-white">{group.name}</h1>
                  <p className="text-sm text-text-secondary">
                    {group.members} members • Moderated by {group.moderator}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button className="glass-button" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button className="glass-button" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              {isJoined ? (
                <Button className="glass-button" onClick={() => setIsJoined(false)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Joined
                </Button>
              ) : (
                <Button className="btn btn-primary" onClick={() => setIsJoined(true)}>
                  <Users className="h-4 w-4 mr-2" />
                  Join Group
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="discussions" className="w-full">
              <TabsList className="glass-card grid w-full grid-cols-4 p-1">
                <TabsTrigger
                  value="discussions"
                  className="data-[state=active]:bg-accent-purple/20 data-[state=active]:text-accent-purple"
                >
                  Discussions
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="data-[state=active]:bg-accent-blue/20 data-[state=active]:text-accent-blue"
                >
                  Events
                </TabsTrigger>
                <TabsTrigger
                  value="resources"
                  className="data-[state=active]:bg-accent-green/20 data-[state=active]:text-accent-green"
                >
                  Resources
                </TabsTrigger>
                <TabsTrigger
                  value="challenges"
                  className="data-[state=active]:bg-accent-orange/20 data-[state=active]:text-accent-orange"
                >
                  Challenges
                </TabsTrigger>
              </TabsList>

              <TabsContent value="discussions" className="space-y-6 mt-6">
                {/* New Post */}
                {isJoined && (
                  <div className="glass-card p-6 ring-gradient animate-fade-in-up">
                    <h2 className="text-lg font-bold text-white mb-4">Share with the group</h2>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Share your experience, ask a question, or offer support..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="glass-input min-h-[100px]"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button className="glass-button" size="sm">
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Photo
                          </Button>
                          <Button className="glass-button" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            File
                          </Button>
                        </div>
                        <Button className="btn btn-primary" disabled={!newPost.trim()}>
                          <Plus className="h-4 w-4 mr-2" />
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Posts */}
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className={`glass-card p-6 hover-glow animate-fade-in-up ${post.isPinned ? "ring-gradient border-accent-blue/30" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src={post.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-accent-blue/20 text-accent-blue">
                            {post.author[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-white">{post.author}</span>
                            {post.isModerator && (
                              <Badge className="bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30 text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Moderator
                              </Badge>
                            )}
                            {post.isPinned && (
                              <Badge className="bg-accent-blue/20 text-accent-blue border-accent-blue/30 text-xs">
                                <Pin className="h-3 w-3 mr-1" />
                                Pinned
                              </Badge>
                            )}
                            <span className="text-sm text-text-muted">{post.time}</span>
                          </div>
                          <p className="text-text-secondary mb-3">{post.content}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                className="bg-accent-green/20 text-accent-green border-accent-green/30 text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-text-secondary hover:text-accent-red hover:bg-accent-red/10"
                            >
                              <Heart className="h-4 w-4 mr-1" />
                              {post.likes}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-text-secondary hover:text-accent-blue hover:bg-accent-blue/10"
                            >
                              <Reply className="h-4 w-4 mr-1" />
                              {post.replies}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-text-secondary hover:text-white hover:bg-white/10"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="events" className="space-y-4 mt-6">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="glass-card p-6 hover-glow animate-fade-in-up">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-white">{event.title}</h3>
                        <p className="text-sm text-text-secondary mt-1">{event.date}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge className="bg-accent-blue/20 text-accent-blue border-accent-blue/30">
                            {event.type}
                          </Badge>
                          <span className="text-sm text-text-muted">{event.attendees} attending</span>
                        </div>
                      </div>
                      <Button className="btn btn-primary" size="sm">
                        Join Event
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="resources" className="space-y-4 mt-6">
                <div className="glass-card p-6 ring-gradient animate-fade-in-up">
                  <h2 className="text-xl font-bold text-white mb-2">Group Resources</h2>
                  <p className="text-text-secondary mb-6">Helpful materials shared by the community</p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 glass-card border border-white/10">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-accent-blue" />
                        <div>
                          <p className="font-medium text-white">Type 2 Diabetes Meal Planning Guide</p>
                          <p className="text-sm text-text-secondary">Shared by Dr. Sarah Kim</p>
                        </div>
                      </div>
                      <Button className="btn btn-secondary" size="sm">
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 glass-card border border-white/10">
                      <div className="flex items-center gap-3">
                        <Video className="h-5 w-5 text-accent-green" />
                        <div>
                          <p className="font-medium text-white">Glucose Monitoring Best Practices</p>
                          <p className="text-sm text-text-secondary">Video tutorial • 15 minutes</p>
                        </div>
                      </div>
                      <Button className="btn btn-secondary" size="sm">
                        Watch
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="challenges" className="space-y-4 mt-6">
                <div className="glass-card p-6 ring-gradient animate-fade-in-up">
                  <h2 className="text-xl font-bold text-white mb-2">Active Challenges</h2>
                  <p className="text-text-secondary mb-6">Join group challenges to stay motivated</p>

                  <div className="glass-card p-4 border border-accent-green/20">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-white">30-Day Glucose Tracking Challenge</h3>
                      <Badge className="bg-accent-green text-black">Active</Badge>
                    </div>
                    <p className="text-sm text-text-secondary mb-3">Track your glucose levels daily for 30 days</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-muted">23/234 members participating</span>
                      <Button className="btn btn-primary" size="sm">
                        Join Challenge
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6 ring-gradient animate-fade-in-up">
              <h2 className="text-xl font-bold text-white mb-4">About This Group</h2>
              <p className="text-sm text-text-secondary mb-4">{group.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {group.tags.map((tag, index) => (
                  <Badge key={index} className="bg-accent-purple/20 text-accent-purple border-accent-purple/30 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Members</span>
                  <span className="font-medium text-white">{group.members}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Category</span>
                  <Badge className="bg-accent-blue/20 text-accent-blue border-accent-blue/30 text-xs capitalize">
                    {group.category}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 ring-gradient animate-fade-in-up">
              <h2 className="text-xl font-bold text-white mb-4">Group Rules</h2>
              <ul className="space-y-2 text-sm">
                {group.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-accent-blue font-medium">{index + 1}.</span>
                    <span className="text-text-secondary">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6 ring-gradient animate-fade-in-up">
              <h2 className="text-xl font-bold text-white mb-4">Recent Members</h2>
              <div className="space-y-3">
                {members.slice(0, 5).map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-accent-green/20 text-accent-green">{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{member.name}</p>
                      <p className="text-xs text-text-muted">{member.role}</p>
                    </div>
                  </div>
                ))}
                <Button className="btn btn-secondary w-full text-sm">View All Members</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
