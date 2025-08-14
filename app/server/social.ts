"use server"

import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

export async function getFriends() {
  try {
    const supabase = createServerComponentClient({ cookies })

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return []

    const { data: friends, error } = await supabase
      .from("user_friends")
      .select(`
        *,
        friend:user_profiles!user_friends_friend_id_fkey (*)
      `)
      .eq("user_id", user.id)
      .eq("status", "accepted")
      .order("created_at", { ascending: false })

    if (error) throw error
    return friends || []
  } catch (error) {
    console.error("Error fetching friends:", error)
    return []
  }
}

export async function getFriendRequests() {
  try {
    const supabase = createServerComponentClient({ cookies })

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return []

    const { data: requests, error } = await supabase
      .from("user_friends")
      .select(`
        *,
        requester:user_profiles!user_friends_user_id_fkey (*)
      `)
      .eq("friend_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    if (error) throw error
    return requests || []
  } catch (error) {
    console.error("Error fetching friend requests:", error)
    return []
  }
}

export async function getSocialFeed() {
  try {
    const supabase = createServerComponentClient({ cookies })

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return []

    const { data: posts, error } = await supabase
      .from("social_posts")
      .select(`
        *,
        author:user_profiles!social_posts_user_id_fkey (*),
        reactions:social_reactions (*)
      `)
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) throw error
    return posts || []
  } catch (error) {
    console.error("Error fetching social feed:", error)
    return []
  }
}

export async function sendFriendRequest(friendId: string) {
  try {
    const supabase = createServerComponentClient({ cookies })

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    const { data, error } = await supabase
      .from("user_friends")
      .insert({
        user_id: user.id,
        friend_id: friendId,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error sending friend request:", error)
    return { success: false, error: error.message }
  }
}
