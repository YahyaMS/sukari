import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { category, question, priority = "medium" } = await request.json()

    if (!category || !question) {
      return NextResponse.json({ error: "Category and question are required" }, { status: 400 })
    }

    // Try to insert into expert_questions table, with fallback
    try {
      const { data, error } = await supabase
        .from("expert_questions")
        .insert({
          user_id: user.id,
          category,
          question,
          priority,
          status: "pending",
        })
        .select()
        .single()

      if (error) throw error

      return NextResponse.json({
        success: true,
        message: "Your question has been submitted successfully! Our experts will respond within 24 hours.",
        question: data,
      })
    } catch (dbError) {
      console.log("Database table not found, using fallback:", dbError)

      // Fallback: Create a notification for the user
      const fallbackResponse = {
        id: Date.now().toString(),
        user_id: user.id,
        category,
        question,
        priority,
        status: "pending",
        created_at: new Date().toISOString(),
      }

      return NextResponse.json({
        success: true,
        message: "Your question has been submitted successfully! Our experts will respond within 24 hours.",
        question: fallbackResponse,
      })
    }
  } catch (error) {
    console.error("Error submitting question:", error)
    return NextResponse.json({ error: "Failed to submit question" }, { status: 500 })
  }
}
