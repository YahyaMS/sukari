import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            // Server components can't set cookies, but this is required by the interface
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {
              // Ignore cookie setting errors in server components
            }
          },
        },
      },
    )

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, data } = await request.json()

    switch (action) {
      case "share_lab_results":
        // Handle lab results sharing
        const labResultsData = {
          user_id: user.id,
          coach_id: "coach-1",
          file_name: data.fileName,
          file_url: data.fileUrl,
          notes: data.notes || "",
          shared_at: new Date().toISOString(),
        }
        console.log("Lab results shared:", labResultsData)
        return NextResponse.json({
          success: true,
          message: "Lab results shared with your coach successfully!",
        })

      case "send_progress_photo":
        // Handle progress photo sharing
        const progressPhotoData = {
          user_id: user.id,
          coach_id: "coach-1",
          photo_url: data.photoUrl,
          photo_type: data.photoType, // 'weight', 'meal', 'general'
          notes: data.notes || "",
          taken_at: data.takenAt || new Date().toISOString(),
        }
        console.log("Progress photo shared:", progressPhotoData)
        return NextResponse.json({
          success: true,
          message: "Progress photo sent to your coach!",
        })

      case "view_care_plan":
        // Return mock care plan data
        const carePlan = {
          id: "care-plan-1",
          user_id: user.id,
          coach_id: "coach-1",
          goals: [
            "Reduce HbA1c to below 7%",
            "Lose 15 pounds over 6 months",
            "Exercise 150 minutes per week",
            "Improve glucose time-in-range to 70%",
          ],
          current_medications: [
            { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
            { name: "Glipizide", dosage: "5mg", frequency: "Once daily" },
          ],
          dietary_guidelines: [
            "Limit carbohydrates to 45-60g per meal",
            "Include protein with every meal",
            "Eat vegetables with lunch and dinner",
            "Avoid sugary drinks and processed foods",
          ],
          exercise_plan: [
            "30 minutes walking, 5 days per week",
            "Strength training, 2 days per week",
            "Flexibility exercises, 3 days per week",
          ],
          next_review: "2024-02-15",
          last_updated: "2024-01-15",
        }
        return NextResponse.json({
          success: true,
          carePlan,
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error processing quick action:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
