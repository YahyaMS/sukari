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

    const postId = params.id
    const { reactionType } = await request.json()

    // Validate reaction type
    const validReactions = ["like", "fire", "heart", "celebrate"]
    if (!validReactions.includes(reactionType)) {
      return NextResponse.json({ error: "Invalid reaction type" }, { status: 400 })
    }

    const { data: existingReaction, error: reactionError } = await supabase
      .from("post_reactions")
      .select("id, reaction_type")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .maybeSingle()

    if (reactionError) {
      console.error("Error checking existing reaction:", reactionError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    if (existingReaction) {
      if (existingReaction.reaction_type === reactionType) {
        // Remove reaction if same type
        const { error: deleteError } = await supabase
          .from("post_reactions")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id)

        if (deleteError) {
          console.error("Error removing reaction:", deleteError)
          return NextResponse.json({ error: "Failed to remove reaction" }, { status: 500 })
        }

        return NextResponse.json({ reacted: false, reactionType: null })
      } else {
        // Update reaction type
        const { error: updateError } = await supabase
          .from("post_reactions")
          .update({ reaction_type: reactionType })
          .eq("post_id", postId)
          .eq("user_id", user.id)

        if (updateError) {
          console.error("Error updating reaction:", updateError)
          return NextResponse.json({ error: "Failed to update reaction" }, { status: 500 })
        }

        return NextResponse.json({ reacted: true, reactionType })
      }
    } else {
      // Add new reaction
      const { error: insertError } = await supabase.from("post_reactions").insert({
        post_id: postId,
        user_id: user.id,
        reaction_type: reactionType,
      })

      if (insertError) {
        console.error("Error adding reaction:", insertError)
        return NextResponse.json({ error: "Failed to add reaction" }, { status: 500 })
      }

      return NextResponse.json({ reacted: true, reactionType })
    }
  } catch (error) {
    console.error("Error handling reaction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
