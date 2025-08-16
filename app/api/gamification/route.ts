import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserGamification, getUserAchievements } from "@/lib/gamification"
import { createServerClient } from "@supabase/ssr"

export async function GET() {
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

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [gamification, achievements] = await Promise.all([getUserGamification(), getUserAchievements()])

    return NextResponse.json({
      gamification,
      achievements,
    })
  } catch (error: any) {
    console.error("API Error fetching gamification data:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
