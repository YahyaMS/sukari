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

    const postId = params.id
    const { reactionType } = await request.json()

    // Validate reaction type
    const validReactions = ["like", "fire", "heart", "celebrate"]
    if (!validReactions.includes(reactionType)) {
      return NextResponse.json({ error: "Invalid reaction type" }, { status: 400 })
    }

    // Check if user already reacted to this post
    const { data: existingReaction } = await supabase
      .from("post_reactions")
      .select("id, reaction_type")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .single()

    if (existingReaction) {
      if (existingReaction.reaction_type === reactionType) {
        // Remove reaction if same type
        await supabase.from("post_reactions").delete().eq("post_id", postId).eq("user_id", user.id)

        return NextResponse.json({ reacted: false, reactionType: null })
      } else {
        // Update reaction type
        await supabase
          .from("post_reactions")
          .update({ reaction_type: reactionType })
          .eq("post_id", postId)
          .eq("user_id", user.id)

        return NextResponse.json({ reacted: true, reactionType })
      }
    } else {
      // Add new reaction
      await supabase.from("post_reactions").insert({
        post_id: postId,
        user_id: user.id,
        reaction_type: reactionType,
      })

      return NextResponse.json({ reacted: true, reactionType })
    }
  } catch (error) {
    console.error("Error handling reaction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
