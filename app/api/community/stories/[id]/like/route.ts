import { type NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerComponentClient({ cookies })

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const storyId = params.id

    // Check if user already liked this story
    const { data: existingLike } = await supabase
      .from("story_likes")
      .select("id")
      .eq("story_id", storyId)
      .eq("user_id", user.id)
      .single()

    if (existingLike) {
      // Unlike - remove the like
      await supabase.from("story_likes").delete().eq("story_id", storyId).eq("user_id", user.id)

      // Decrement likes count
      await supabase.from("success_stories").update({ likes: supabase.sql`likes - 1` }).eq("id", storyId)

      return NextResponse.json({ liked: false })
    } else {
      // Like - add the like
      await supabase.from("story_likes").insert({
        story_id: storyId,
        user_id: user.id,
      })

      // Increment likes count
      await supabase.from("success_stories").update({ likes: supabase.sql`likes + 1` }).eq("id", storyId)

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
