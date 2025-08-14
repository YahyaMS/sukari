import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export interface Friend {
  id: string
  first_name: string
  last_name: string
  email: string
  status: "pending" | "accepted" | "blocked"
  connected_at: string
  health_points?: number
  level?: number
  longest_streak?: number
  rank?: number
}

export interface SocialPost {
  id: string
  user_id: string
  post_type: string
  content: string
  metadata: any
  privacy_level: string
  created_at: string
  user_profiles: {
    first_name: string
    last_name: string
  }
  reactions: SocialReaction[]
  comments: SocialComment[]
  reaction_counts: { [key: string]: number }
}

export interface SocialReaction {
  id: string
  post_id: string
  user_id: string
  reaction_type: string
  created_at: string
  user_profiles: {
    first_name: string
    last_name: string
  }
}

export interface SocialComment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  user_profiles: {
    first_name: string
    last_name: string
  }
}

export interface PrivacySettings {
  share_achievements: boolean
  share_streaks: boolean
  share_progress: boolean
  share_glucose_trends: boolean
  share_weight_progress: boolean
  allow_friend_requests: boolean
  show_in_leaderboards: boolean
}

export class SocialService {
  private supabase

  constructor() {
    this.supabase = createServerComponentClient({ cookies })
  }

  private isTableNotFoundError(error: any): boolean {
    return (
      error?.message?.includes("schema cache") ||
      error?.message?.includes("does not exist") ||
      (error?.message?.includes("table") && error?.message?.includes("not found"))
    )
  }

  async getFriends(userId: string): Promise<Friend[]> {
    try {
      const { data, error } = await this.supabase
        .from("user_friends")
        .select(`
          *,
          friend_profiles:user_profiles!user_friends_friend_id_fkey(
            id, first_name, last_name, email
          ),
          user_profiles!user_friends_user_id_fkey(
            id, first_name, last_name, email
          )
        `)
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq("status", "accepted")

      if (error) {
        if (this.isTableNotFoundError(error)) {
          console.warn("Social tables not yet created. Run social SQL scripts to enable social features.")
          return []
        }
        console.error("Error fetching friends:", error)
        return []
      }

      return (
        data?.map((friendship) => {
          const isUserInitiator = friendship.user_id === userId
          const friendProfile = isUserInitiator ? friendship.friend_profiles : friendship.user_profiles

          return {
            id: isUserInitiator ? friendship.friend_id : friendship.user_id,
            first_name: friendProfile.first_name,
            last_name: friendProfile.last_name,
            email: friendProfile.email,
            status: friendship.status,
            connected_at: friendship.connected_at,
          }
        }) || []
      )
    } catch (error) {
      console.warn("Social features not available. Database tables not found.")
      return []
    }
  }

  async getFriendRequests(userId: string): Promise<Friend[]> {
    try {
      const { data, error } = await this.supabase
        .from("user_friends")
        .select(`
          *,
          requester_profiles:user_profiles!user_friends_requested_by_fkey(
            id, first_name, last_name, email
          )
        `)
        .eq("friend_id", userId)
        .eq("status", "pending")

      if (error) {
        if (this.isTableNotFoundError(error)) {
          console.warn("Social tables not yet created. Run social SQL scripts to enable social features.")
          return []
        }
        console.error("Error fetching friend requests:", error)
        return []
      }

      return (
        data?.map((request) => ({
          id: request.user_id,
          first_name: request.requester_profiles.first_name,
          last_name: request.requester_profiles.last_name,
          email: request.requester_profiles.email,
          status: request.status,
          connected_at: request.connected_at,
        })) || []
      )
    } catch (error) {
      console.warn("Social features not available. Database tables not found.")
      return []
    }
  }

  async sendFriendRequest(requesterId: string, targetEmail: string): Promise<boolean> {
    try {
      // First find the target user by email
      const { data: targetUser, error: userError } = await this.supabase
        .from("user_profiles")
        .select("id")
        .eq("email", targetEmail)
        .single()

      if (userError || !targetUser) {
        console.error("User not found:", userError)
        return false
      }

      const { error } = await this.supabase.rpc("send_friend_request", {
        requester_id: requesterId,
        target_user_id: targetUser.id,
      })

      if (error) {
        if (this.isTableNotFoundError(error)) {
          console.warn("Social features not available. Database tables not found.")
          return false
        }
        console.error("Error sending friend request:", error)
        return false
      }

      return true
    } catch (error) {
      console.warn("Social features not available. Database tables not found.")
      return false
    }
  }

  async sendFriendRequestById(requesterId: string, targetUserId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("user_friends").insert({
        user_id: requesterId,
        friend_id: targetUserId,
        status: "pending",
        requested_by: requesterId,
        created_at: new Date().toISOString(),
      })

      if (error) {
        if (this.isTableNotFoundError(error)) {
          console.warn("Social features not available. Database tables not found.")
          return false
        }
        console.error("Error sending friend request:", error)
        return false
      }

      return true
    } catch (error) {
      console.warn("Social features not available. Database tables not found.")
      return false
    }
  }

  async acceptFriendRequest(userId: string, requesterId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.rpc("accept_friend_request", {
        user_id: userId,
        requester_id: requesterId,
      })

      if (error) {
        if (this.isTableNotFoundError(error)) {
          console.warn("Social features not available. Database tables not found.")
          return false
        }
        console.error("Error accepting friend request:", error)
        return false
      }

      return true
    } catch (error) {
      console.warn("Social features not available. Database tables not found.")
      return false
    }
  }

  async getFriendsLeaderboard(userId: string, type = "health_points"): Promise<Friend[]> {
    try {
      const { data, error } = await this.supabase.rpc("get_friends_leaderboard", {
        user_id: userId,
        leaderboard_type: type,
      })

      if (error) {
        if (this.isTableNotFoundError(error)) {
          console.warn("Social features not available. Database tables not found.")
          return []
        }
        console.error("Error fetching friends leaderboard:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.warn("Social features not available. Database tables not found.")
      return []
    }
  }

  async getSocialFeed(userId: string, limit = 20): Promise<SocialPost[]> {
    try {
      const { data, error } = await this.supabase
        .from("social_posts")
        .select(`
          *,
          user_profiles(first_name, last_name),
          social_reactions(
            id, reaction_type, user_id,
            user_profiles(first_name, last_name)
          ),
          social_comments(
            id, content, created_at, user_id,
            user_profiles(first_name, last_name)
          )
        `)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) {
        if (this.isTableNotFoundError(error)) {
          console.warn("Social features not available. Database tables not found.")
          return []
        }
        console.error("Error fetching social feed:", error)
        return []
      }

      return (
        data?.map((post) => ({
          ...post,
          reaction_counts: this.calculateReactionCounts(post.social_reactions),
        })) || []
      )
    } catch (error) {
      console.warn("Social features not available. Database tables not found.")
      return []
    }
  }

  async createSocialPost(
    userId: string,
    postType: string,
    content?: string,
    metadata?: any,
    privacyLevel = "friends",
  ): Promise<string | null> {
    const { data, error } = await this.supabase.rpc("create_social_post", {
      user_id: userId,
      post_type: postType,
      content,
      metadata,
      privacy_level: privacyLevel,
    })

    if (error) {
      console.error("Error creating social post:", error)
      return null
    }

    return data
  }

  async addReaction(postId: string, userId: string, reactionType: string): Promise<boolean> {
    const { error } = await this.supabase.from("social_reactions").upsert({
      post_id: postId,
      user_id: userId,
      reaction_type: reactionType,
    })

    if (error) {
      console.error("Error adding reaction:", error)
      return false
    }

    return true
  }

  async removeReaction(postId: string, userId: string, reactionType: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("social_reactions")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId)
      .eq("reaction_type", reactionType)

    if (error) {
      console.error("Error removing reaction:", error)
      return false
    }

    return true
  }

  async addComment(postId: string, userId: string, content: string): Promise<boolean> {
    const { error } = await this.supabase.from("social_comments").insert({
      post_id: postId,
      user_id: userId,
      content,
    })

    if (error) {
      console.error("Error adding comment:", error)
      return false
    }

    return true
  }

  async getPrivacySettings(userId: string): Promise<PrivacySettings | null> {
    try {
      const { data, error } = await this.supabase
        .from("user_privacy_settings")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (error) {
        if (this.isTableNotFoundError(error)) {
          console.warn("Social features not available. Database tables not found.")
          return {
            share_achievements: true,
            share_streaks: true,
            share_progress: true,
            share_glucose_trends: false,
            share_weight_progress: false,
            allow_friend_requests: true,
            show_in_leaderboards: true,
          }
        }
        console.error("Error fetching privacy settings:", error)
        return null
      }

      return data
    } catch (error) {
      console.warn("Social features not available. Database tables not found.")
      return {
        share_achievements: true,
        share_streaks: true,
        share_progress: true,
        share_glucose_trends: false,
        share_weight_progress: false,
        allow_friend_requests: true,
        show_in_leaderboards: true,
      }
    }
  }

  async updatePrivacySettings(userId: string, settings: Partial<PrivacySettings>): Promise<boolean> {
    const { error } = await this.supabase.from("user_privacy_settings").upsert({
      user_id: userId,
      ...settings,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error updating privacy settings:", error)
      return false
    }

    return true
  }

  async getFriendSuggestions(userId: string, limit = 6): Promise<any[]> {
    try {
      // Get current user's profile and medical info
      const { data: currentUserProfile } = await this.supabase
        .from("user_profiles")
        .select(`
          *,
          medical_profiles (
            condition_type,
            current_medications
          ),
          user_gamification (
            level,
            total_hp
          )
        `)
        .eq("user_id", userId)
        .single()

      if (!currentUserProfile) {
        return []
      }

      // Get users who are not already friends and not pending requests
      const { data: existingConnections } = await this.supabase
        .from("user_friends")
        .select("friend_id, user_id")
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)

      const connectedUserIds = new Set()
      existingConnections?.forEach((conn) => {
        connectedUserIds.add(conn.friend_id)
        connectedUserIds.add(conn.user_id)
      })
      connectedUserIds.add(userId) // Exclude self

      // Get potential friend suggestions
      const { data: potentialFriends } = await this.supabase
        .from("user_profiles")
        .select(`
          user_id,
          first_name,
          last_name,
          avatar_url,
          created_at,
          medical_profiles (
            condition_type,
            current_medications
          ),
          user_gamification (
            level,
            total_hp
          )
        `)
        .not("user_id", "in", `(${Array.from(connectedUserIds).join(",")})`)
        .limit(10)

      if (!potentialFriends) {
        return []
      }

      // Score and rank suggestions based on similarity
      const scoredSuggestions = potentialFriends.map((friend) => {
        let score = 0
        const reasons = []

        // Same health condition (+3 points)
        if (friend.medical_profiles?.condition_type === currentUserProfile.medical_profiles?.condition_type) {
          score += 3
          reasons.push(`Both managing ${friend.medical_profiles.condition_type.replace("_", " ")}`)
        }

        // Similar level (+2 points)
        const levelDiff = Math.abs(
          (friend.user_gamification?.level || 1) - (currentUserProfile.user_gamification?.level || 1),
        )
        if (levelDiff <= 2) {
          score += 2
          reasons.push(`Similar health journey level`)
        }

        // Recently joined (+1 point)
        const joinedRecently = new Date(friend.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        if (joinedRecently) {
          score += 1
          reasons.push("New to MetaReverse")
        }

        // Active user (+1 point)
        if ((friend.user_gamification?.total_hp || 0) > 100) {
          score += 1
          reasons.push("Active community member")
        }

        return {
          ...friend,
          score,
          reasons: reasons.slice(0, 2), // Limit to 2 reasons
          suggestion_type: score >= 3 ? "high_match" : score >= 2 ? "good_match" : "potential_match",
        }
      })

      // Sort by score and return top suggestions
      return scoredSuggestions.sort((a, b) => b.score - a.score).slice(0, limit)
    } catch (error) {
      if (this.isTableNotFoundError(error)) {
        console.warn("Social tables not yet created. Run social SQL scripts to enable friend suggestions.")
        return []
      }
      console.error("Error fetching friend suggestions:", error)
      return []
    }
  }

  private calculateReactionCounts(reactions: SocialReaction[]): { [key: string]: number } {
    const counts: { [key: string]: number } = {}
    reactions.forEach((reaction) => {
      counts[reaction.reaction_type] = (counts[reaction.reaction_type] || 0) + 1
    })
    return counts
  }

  getPostTypeDisplay(postType: string): { title: string; icon: string; color: string } {
    switch (postType) {
      case "achievement_unlock":
        return { title: "Achievement Unlocked", icon: "🏆", color: "text-yellow-600" }
      case "streak_milestone":
        return { title: "Streak Milestone", icon: "🔥", color: "text-orange-600" }
      case "level_up":
        return { title: "Level Up", icon: "⬆️", color: "text-blue-600" }
      case "challenge_victory":
        return { title: "Challenge Victory", icon: "🎯", color: "text-green-600" }
      case "meal_photo":
        return { title: "Healthy Meal", icon: "🍽️", color: "text-purple-600" }
      case "exercise_completion":
        return { title: "Workout Complete", icon: "💪", color: "text-red-600" }
      case "coach_recognition":
        return { title: "Coach Recognition", icon: "👨‍⚕️", color: "text-teal-600" }
      default:
        return { title: "Health Update", icon: "📊", color: "text-gray-600" }
    }
  }

  getReactionEmoji(reactionType: string): string {
    switch (reactionType) {
      case "like":
        return "👍"
      case "fire":
        return "🔥"
      case "clap":
        return "👏"
      case "heart":
        return "❤️"
      case "strong":
        return "💪"
      case "celebrate":
        return "🎉"
      default:
        return "👍"
    }
  }
}
