import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: () => cookieStore },
    )

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, preferredDate, preferredTime, notes, urgency } = await request.json()

    // Create appointment request
    const appointmentData = {
      user_id: user.id,
      coach_id: "coach-1", // This would be dynamic based on user's assigned coach
      appointment_type: type, // 'video' or 'phone'
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      notes: notes || "",
      urgency: urgency || "normal",
      status: "pending",
      created_at: new Date().toISOString(),
    }

    // In a real app, this would save to the appointments table
    // For now, we'll simulate the response
    const mockAppointment = {
      id: Date.now().toString(),
      ...appointmentData,
      scheduled_date: null,
      scheduled_time: null,
      meeting_link: null,
    }

    // Simulate coach notification
    console.log("Appointment request created:", mockAppointment)

    return NextResponse.json({
      success: true,
      appointment: mockAppointment,
      message: `${type === "video" ? "Video call" : "Phone call"} request sent to your coach. You'll receive a confirmation within 24 hours.`,
    })
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: "Failed to schedule appointment" }, { status: 500 })
  }
}
