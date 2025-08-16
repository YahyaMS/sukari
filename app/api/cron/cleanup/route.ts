import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Daily cleanup job for expired data
export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: () => cookieStore },
    )

    // Clean up expired notifications (older than 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    await supabase.from("notifications").delete().lt("created_at", thirtyDaysAgo.toISOString()).eq("is_read", true)

    // Clean up old analytics events (older than 90 days)
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    // Add more cleanup tasks as needed

    return NextResponse.json({
      success: true,
      message: "Cleanup completed",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Cleanup job failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Cleanup failed",
      },
      { status: 500 },
    )
  }
}
