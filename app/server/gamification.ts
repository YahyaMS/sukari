"use server"

import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

export async function getUserGamification() {
  try {
    const supabase = createServerComponentClient({ cookies })

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data: gamification, error } = await supabase
      .from("user_gamification")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error && error.code !== "PGRST116") throw error

    // Return default values for new users
    return (
      gamification || {
        user_id: user.id,
        health_points: 0,
        level: 1,
        total_hp_earned: 0,
      }
    )
  } catch (error) {
    console.error("Error fetching user gamification:", error)
    return {
      user_id: "",
      health_points: 0,
      level: 1,
      total_hp_earned: 0,
    }
  }
}

export async function getUserAchievements() {
  try {
    const supabase = createServerComponentClient({ cookies })

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return []

    const { data: achievements, error } = await supabase
      .from("user_achievements")
      .select(`
        *,
        achievements (*)
      `)
      .eq("user_id", user.id)
      .order("earned_at", { ascending: false })

    if (error) throw error
    return achievements || []
  } catch (error) {
    console.error("Error fetching user achievements:", error)
    return []
  }
}

export async function awardHealthPoints(userId: string, points: number, activity: string) {
  try {
    const supabase = createServerComponentClient({ cookies })

    // Update user gamification
    const { data: currentGamification } = await supabase
      .from("user_gamification")
      .select("*")
      .eq("user_id", userId)
      .single()

    const newHealthPoints = (currentGamification?.health_points || 0) + points
    const newTotalHP = (currentGamification?.total_hp_earned || 0) + points
    const newLevel = Math.floor(newTotalHP / 100) + 1

    const { error } = await supabase.from("user_gamification").upsert({
      user_id: userId,
      health_points: newHealthPoints,
      level: newLevel,
      total_hp_earned: newTotalHP,
      updated_at: new Date().toISOString(),
    })

    if (error) throw error

    // Log the HP transaction
    await supabase.from("hp_transactions").insert({
      user_id: userId,
      points,
      activity,
      transaction_type: "earned",
    })

    return { success: true, newHealthPoints, newLevel }
  } catch (error) {
    console.error("Error awarding health points:", error)
    return { success: false, error: error.message }
  }
}
