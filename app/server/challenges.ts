"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function getChallenges() {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: () => cookieStore },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return []

    const { data: challenges, error } = await supabase
      .from("challenges")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return challenges || []
  } catch (error) {
    console.error("Error fetching challenges:", error)
    return []
  }
}

export async function getUserChallenges() {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: () => cookieStore },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return []

    const { data: userChallenges, error } = await supabase
      .from("user_challenges")
      .select(`
        *,
        challenges (*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error
    return userChallenges || []
  } catch (error) {
    console.error("Error fetching user challenges:", error)
    return []
  }
}

export async function joinChallenge(challengeId: string) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: () => cookieStore },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    const { data, error } = await supabase
      .from("user_challenges")
      .insert({
        user_id: user.id,
        challenge_id: challengeId,
        status: "active",
        progress: 0,
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error joining challenge:", error)
    return { success: false, error: error.message }
  }
}
