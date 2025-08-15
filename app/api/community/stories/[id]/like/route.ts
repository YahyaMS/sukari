import { type NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const storyId = params.id

    const { data: existingLike, error: likeError } = await supabase
      .from("story_likes")
      .select("id")
      .eq("story_id", storyId)
      .eq("user_id", user.id)
      .maybeSingle()

    if (likeError) {
      console.error("Error checking existing like:", likeError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    if (existingLike) {
      // Unlike - remove the like
      const { error: deleteError } = await supabase
        .from("story_likes")
        .delete()
        .eq("story_id", storyId)
        .eq("user_id", user.id)

      if (deleteError) {
        console.error("Error removing like:", deleteError)
        return NextResponse.json({ error: "Failed to remove like" }, { status: 500 })
      }

      // Decrement likes count
      const { error: updateError } = await supabase
        .from("success_stories")
        .update({ likes: supabase.sql`likes - 1` })
        .eq("id", storyId)

      if (updateError) {
        console.error("Error updating likes count:", updateError)
      }

      return NextResponse.json({ liked: false })
    } else {
      // Like - add the like
      const { error: insertError } = await supabase.from("story_likes").insert({
        story_id: storyId,
        user_id: user.id,
      })

      if (insertError) {
        console.error("Error adding like:", insertError)
        return NextResponse.json({ error: "Failed to add like" }, { status: 500 })
      }

      // Increment likes count
      const { error: updateError } = await supabase
        .from("success_stories")
        .update({ likes: supabase.sql`likes + 1` })
        .eq("id", storyId)

      if (updateError) {
        console.error("Error updating likes count:", updateError)
      }

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
