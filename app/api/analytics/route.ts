import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const event = await request.json()

    // In production, forward to your analytics service
    // For now, just log the event
    console.log("📊 Analytics Event Received:", {
      event: event.event,
      timestamp: event.timestamp,
      sessionId: event.sessionId,
      userId: event.userId,
      // Don't log full properties to avoid PII in logs
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({ error: "Failed to process analytics event" }, { status: 500 })
  }
}
