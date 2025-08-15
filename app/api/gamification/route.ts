import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserGamification, getUserAchievements } from "@/lib/gamification"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

export async function GET() {
  try {
    const supabase = createServerComponentClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [gamification, achievements] = await Promise.all([
      getUserGamification(cookies, user.id),
      getUserAchievements(cookies, user.id),
    ])

    return NextResponse.json({
      gamification,
      achievements,
    })
  } catch (error: any) {
    console.error("API Error fetching gamification data:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
