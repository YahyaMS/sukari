import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserFriends, getFriendRequests, getSocialFeed } from "@/lib/social"
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

    const [friends, friendRequests, socialFeed] = await Promise.all([
      getUserFriends(),
      getFriendRequests(),
      getSocialFeed(),
    ])

    return NextResponse.json({
      friends,
      friendRequests,
      socialFeed,
    })
  } catch (error: any) {
    console.error("API Error fetching social data:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
