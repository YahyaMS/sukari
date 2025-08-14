"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, Share2, Flame, Trophy, TrendingUp } from "lucide-react"
import type { SocialPost } from "@/lib/social"
import { SocialService } from "@/lib/social"
import { CommentsSection } from "./comments-section"

interface SocialFeedProps {
  posts: SocialPost[]
  currentUserId: string
}

export function SocialFeed({ posts, currentUserId }: SocialFeedProps) {
  const socialService = new SocialService()
  const [postReactions, setPostReactions] = useState<Record<string, { reactionType: string | null; reacted: boolean }>>(
    {},
  )
  const [reactionCounts, setReactionCounts] = useState<Record<string, Record<string, number>>>({})

  // Initialize reaction counts
  useState(() => {
    const initialCounts: Record<string, Record<string, number>> = {}
    posts.forEach((post) => {
      initialCounts[post.id] = post.reaction_counts || { like: 0, fire: 0, heart: 0, celebrate: 0 }
    })
    setReactionCounts(initialCounts)
  })

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const getPostIcon = (postType: string) => {
    switch (postType) {
      case "achievement_unlock":
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case "streak_milestone":
        return <Flame className="h-5 w-5 text-orange-500" />
      case "level_up":
        return <TrendingUp className="h-5 w-5 text-blue-500" />
      default:
        return <Heart className="h-5 w-5 text-red-500" />
    }
  }

  const handleReaction = async (postId: string, reactionType: string) => {
    try {
      const response = await fetch(`/api/social/posts/${postId}/react`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reactionType }),
      })

      if (response.ok) {
        const { reacted, reactionType: newReactionType } = await response.json()
        const currentReaction = postReactions[postId]

        // Update reaction state
        setPostReactions((prev) => ({
          ...prev,
          [postId]: { reacted, reactionType: newReactionType },
        }))

        // Update counts
        setReactionCounts((prev) => {
          const newCounts = { ...prev[postId] }

          // Remove old reaction count
          if (currentReaction?.reacted && currentReaction.reactionType) {
            newCounts[currentReaction.reactionType] = Math.max(0, newCounts[currentReaction.reactionType] - 1)
          }

          // Add new reaction count
          if (reacted && newReactionType) {
            newCounts[newReactionType] = (newCounts[newReactionType] || 0) + 1
          }

          return {
            ...prev,
            [postId]: newCounts,
          }
        })
      }
    } catch (error) {
      console.error("Error handling reaction:", error)
    }
  }

  const renderPostContent = (post: SocialPost) => {
    const { title, icon, color } = socialService.getPostTypeDisplay(post.post_type)

    switch (post.post_type) {
      case "achievement_unlock":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="font-semibold">Achievement Unlocked!</p>
                <p className="text-sm text-muted-foreground">{post.metadata?.achievement_name || "New Achievement"}</p>
              </div>
            </div>
            {post.content && <p className="text-gray-700">{post.content}</p>}
            <Badge className="bg-yellow-100 text-yellow-800">+{post.metadata?.hp_reward || 0} HP</Badge>
          </div>
        )

      case "streak_milestone":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="font-semibold">Streak Milestone!</p>
                <p className="text-sm text-muted-foreground">
                  {post.metadata?.streak_count || 0} day {post.metadata?.streak_type || "health"} streak
                </p>
              </div>
            </div>
            {post.content && <p className="text-gray-700">{post.content}</p>}
            <Badge className="bg-orange-100 text-orange-800">{post.metadata?.streak_count || 0} days strong!</Badge>
          </div>
        )

      case "level_up":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="font-semibold">Level Up!</p>
                <p className="text-sm text-muted-foreground">Reached Level {post.metadata?.new_level || 1}</p>
              </div>
            </div>
            {post.content && <p className="text-gray-700">{post.content}</p>}
            <Badge className="bg-blue-100 text-blue-800">{post.metadata?.level_name || "Health Hero"}</Badge>
          </div>
        )

      default:
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{icon}</span>
              <p className="font-semibold">{title}</p>
            </div>
            {post.content && <p className="text-gray-700">{post.content}</p>}
          </div>
        )
    }
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No posts yet</h3>
          <p className="text-gray-500 mb-4">
            Connect with friends to see their health journey updates, or start tracking your own progress to share
            achievements!
          </p>
          <Button>Add Friends</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {post.user_profiles.first_name?.[0]}
                    {post.user_profiles.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {post.user_profiles.first_name} {post.user_profiles.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">{formatTimeAgo(post.created_at)}</p>
                </div>
              </div>
              {getPostIcon(post.post_type)}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {renderPostContent(post)}

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 transition-colors ${
                    postReactions[post.id]?.reactionType === "like" ? "text-red-600" : "hover:text-red-600"
                  }`}
                  onClick={() => handleReaction(post.id, "like")}
                >
                  <Heart
                    className={`h-4 w-4 ${postReactions[post.id]?.reactionType === "like" ? "fill-current" : ""}`}
                  />
                  {reactionCounts[post.id]?.like || post.reaction_counts?.like || 0}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 transition-colors ${
                    postReactions[post.id]?.reactionType === "fire" ? "text-orange-600" : "hover:text-orange-600"
                  }`}
                  onClick={() => handleReaction(post.id, "fire")}
                >
                  <Flame
                    className={`h-4 w-4 ${postReactions[post.id]?.reactionType === "fire" ? "fill-current" : ""}`}
                  />
                  {reactionCounts[post.id]?.fire || post.reaction_counts?.fire || 0}
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="hover:text-green-600">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <CommentsSection
              postId={post.id}
              initialCommentCount={post.comments?.length || 0}
              currentUserId={currentUserId}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
