import { type NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const commentId = params.id
    const { content } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 })
    }

    // Update comment (only if user owns it)
    const { data: comment, error } = await supabase
      .from("post_comments")
      .update({ content: content.trim(), updated_at: new Date().toISOString() })
      .eq("id", commentId)
      .eq("user_id", user.id)
      .select(`
        *,
        profiles:user_id (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .single()

    if (error) {
      console.error("Error updating comment:", error)
      return NextResponse.json({ error: "Failed to update comment" }, { status: 500 })
    }

    return NextResponse.json({ comment })
  } catch (error) {
    console.error("Error in comment update:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const commentId = params.id

    // Delete comment (only if user owns it)
    const { error } = await supabase.from("post_comments").delete().eq("id", commentId).eq("user_id", user.id)

    if (error) {
      console.error("Error deleting comment:", error)
      return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in comment deletion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
