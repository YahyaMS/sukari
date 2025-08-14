"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Users, Search, Filter, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icon3D } from "@/components/ui/3d-icon"
import type { CommunityGroup } from "@/lib/community"

interface CommunityGroupsClientProps {
  allGroups: CommunityGroup[]
  userGroups: CommunityGroup[]
  recommendedGroups: CommunityGroup[]
  userId: string
}

export function CommunityGroupsClient({
  allGroups,
  userGroups,
  recommendedGroups,
  userId,
}: CommunityGroupsClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  const userGroupIds = new Set(userGroups.map((g) => g.id))

  const filteredGroups = allGroups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = filterCategory === "all" || group.category === filterCategory

    return matchesSearch && matchesCategory
  })

  const availableGroups = filteredGroups.filter((group) => !userGroupIds.has(group.id))

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
                <Icon3D shape="sphere" color="blue" size="sm" />
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

        {allGroups.length === 0 ? (
          <div className="glass-card p-12 text-center animate-fade-in-up">
            <Icon3D shape="sphere" color="blue" size="xl" className="mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to Community Groups!</h2>
            <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
              Community groups are being set up for you. Soon you'll be able to connect with others on similar health
              journeys, share experiences, and find support from peers who understand your challenges.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="glass-card p-6 border-white/10">
                <Icon3D shape="heart" color="red" size="lg" className="mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Support</h3>
                <p className="text-text-secondary text-sm">
                  Find encouragement and understanding from others facing similar health challenges
                </p>
              </div>
              <div className="glass-card p-6 border-white/10">
                <Icon3D shape="users" color="blue" size="lg" className="mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Connection</h3>
                <p className="text-text-secondary text-sm">
                  Build meaningful relationships with people who share your health goals
                </p>
              </div>
              <div className="glass-card p-6 border-white/10">
                <Icon3D shape="sparkles" color="purple" size="lg" className="mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Growth</h3>
                <p className="text-text-secondary text-sm">
                  Learn from shared experiences and celebrate victories together
                </p>
              </div>
            </div>
            <Link href="/dashboard">
              <Button size="lg" className="gradient-primary">
                <Icon3D shape="zap" color="white" size="sm" className="mr-2" />
                Continue Your Journey
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {recommendedGroups.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Icon3D shape="cube" color="purple" size="sm" />
                  <h2 className="text-xl font-semibold text-white">Recommended for You</h2>
                  <Badge className="bg-accent-purple/20 text-accent-purple border-accent-purple/30">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Smart Match
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendedGroups.map((group) => (
                    <GroupCard key={group.id} group={group} isRecommended={true} />
                  ))}
                </div>
              </div>
            )}

            {availableGroups.length > 0 ? (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">All Support Groups</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableGroups.map((group) => (
                    <GroupCard key={group.id} group={group} isRecommended={false} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon3D shape="sphere" color="blue" size="lg" />
                <h3 className="text-lg font-medium text-white mb-2 mt-4">No groups found</h3>
                <p className="text-text-secondary mb-4">Try adjusting your search or filters.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function GroupCard({ group, isRecommended }: { group: CommunityGroup; isRecommended: boolean }) {
  return (
    <Card
      className={`glass-card transition-all duration-300 ${
        isRecommended
          ? "border-accent-purple/30 bg-gradient-to-br from-accent-purple/10 to-accent-purple/5 hover:border-accent-purple/50"
          : "border-white/10 hover:border-white/20"
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg text-white">{group.name}</CardTitle>
            <CardDescription className="mt-1 text-text-secondary">{group.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {group.tags?.map((tag, index) => (
            <Badge key={index} className="text-xs bg-accent-blue/20 text-accent-blue border-accent-blue/30">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {group.member_count} members
            </div>
            <Badge className="bg-accent-green/20 text-accent-green border-accent-green/30">
              {group.activity_level}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            <p>Moderated by {group.moderator_name}</p>
            <p>Last activity: {group.last_activity}</p>
          </div>
          <Link href={`/community/groups/${group.id}`}>
            <Button
              size="sm"
              className={
                isRecommended
                  ? "gradient-primary"
                  : "glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
              }
            >
              Join Group
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
