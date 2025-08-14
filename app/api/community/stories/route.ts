import { type NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const supabase = createServerComponentClient({ cookies })

    const { data: stories, error } = await supabase
      .from("success_stories")
      .select(`
        *,
        profiles:user_id (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching stories:", error)
      return NextResponse.json({ stories: [] })
    }

    return NextResponse.json({ stories: stories || [] })
  } catch (error) {
    console.error("Error in stories API:", error)
    return NextResponse.json({ stories: [] })
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { title, achievement, story, category, metrics } = body

    // Insert new story
    const { data, error } = await supabase
      .from("success_stories")
      .insert({
        user_id: user.id,
        title,
        achievement,
        story,
        category,
        metrics,
        likes: 0,
        comments: 0,
        shares: 0,
        verified: false,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating story:", error)
      return NextResponse.json({ error: "Failed to create story" }, { status: 500 })
    }

    return NextResponse.json({ story: data })
  } catch (error) {
    console.error("Error in story creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
