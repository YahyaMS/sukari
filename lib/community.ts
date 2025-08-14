import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export interface CommunityGroup {
  id: string
  name: string
  description: string
  category: string
  member_count: number
  activity_level: string
  moderator_name: string
  last_activity: string
  tags: string[]
  is_public: boolean
  created_at: string
}

export interface GroupMembership {
  group_id: string
  user_id: string
  role: string
  joined_at: string
}

export class CommunityService {
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

  async getAllGroups(): Promise<CommunityGroup[]> {
    try {
      const { data, error } = await this.supabase
        .from("community_groups")
        .select(`
          *,
          group_memberships(count)
        `)
        .eq("is_public", true)
        .order("member_count", { ascending: false })

      if (error) {
        if (this.isTableNotFoundError(error)) {
          console.warn("Community tables not yet created. Run community SQL scripts to enable community features.")
          return []
        }
        console.error("Error fetching community groups:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.warn("Community features not available. Database tables not found.")
      return []
    }
  }

  async getUserGroups(userId: string): Promise<CommunityGroup[]> {
    try {
      const { data, error } = await this.supabase
        .from("group_memberships")
        .select(`
          *,
          community_groups(*)
        `)
        .eq("user_id", userId)

      if (error) {
        if (this.isTableNotFoundError(error)) {
          console.warn("Community tables not yet created. Run community SQL scripts to enable community features.")
          return []
        }
        console.error("Error fetching user groups:", error)
        return []
      }

      return data?.map((membership) => membership.community_groups) || []
    } catch (error) {
      console.warn("Community features not available. Database tables not found.")
      return []
    }
  }

  async joinGroup(userId: string, groupId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("group_memberships").insert({
        user_id: userId,
        group_id: groupId,
        role: "member",
        joined_at: new Date().toISOString(),
      })

      if (error) {
        if (this.isTableNotFoundError(error)) {
          console.warn("Community features not available. Database tables not found.")
          return false
        }
        console.error("Error joining group:", error)
        return false
      }

      // Update member count
      await this.updateGroupMemberCount(groupId)
      return true
    } catch (error) {
      console.warn("Community features not available. Database tables not found.")
      return false
    }
  }

  async leaveGroup(userId: string, groupId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("group_memberships")
        .delete()
        .eq("user_id", userId)
        .eq("group_id", groupId)

      if (error) {
        if (this.isTableNotFoundError(error)) {
          console.warn("Community features not available. Database tables not found.")
          return false
        }
        console.error("Error leaving group:", error)
        return false
      }

      // Update member count
      await this.updateGroupMemberCount(groupId)
      return true
    } catch (error) {
      console.warn("Community features not available. Database tables not found.")
      return false
    }
  }

  private async updateGroupMemberCount(groupId: string): Promise<void> {
    try {
      const { count } = await this.supabase
        .from("group_memberships")
        .select("*", { count: "exact", head: true })
        .eq("group_id", groupId)

      await this.supabase
        .from("community_groups")
        .update({ member_count: count || 0 })
        .eq("id", groupId)
    } catch (error) {
      console.warn("Error updating group member count:", error)
    }
  }

  async getRecommendedGroups(userId: string): Promise<CommunityGroup[]> {
    try {
      // Get user's profile and interests
      const { data: userProfile } = await this.supabase
        .from("user_profiles")
        .select(`
          *,
          medical_profiles(condition_type, current_medications)
        `)
        .eq("user_id", userId)
        .single()

      if (!userProfile) {
        return []
      }

      // Get groups user hasn't joined yet
      const { data: userGroups } = await this.supabase
        .from("group_memberships")
        .select("group_id")
        .eq("user_id", userId)

      const joinedGroupIds = userGroups?.map((g) => g.group_id) || []

      const { data: allGroups } = await this.supabase
        .from("community_groups")
        .select("*")
        .eq("is_public", true)
        .not("id", "in", `(${joinedGroupIds.join(",") || "''"})`)

      if (!allGroups) {
        return []
      }

      // Simple recommendation based on condition type
      const conditionType = userProfile.medical_profiles?.condition_type
      const recommended = allGroups.filter((group) => {
        if (conditionType === "type_2_diabetes") {
          return group.category === "diabetes" || group.tags?.includes("Type 2")
        }
        return group.category === "general" || group.member_count > 50
      })

      return recommended.slice(0, 3)
    } catch (error) {
      if (this.isTableNotFoundError(error)) {
        console.warn("Community tables not yet created. Run community SQL scripts to enable community features.")
        return []
      }
      console.error("Error fetching recommended groups:", error)
      return []
    }
  }
}
