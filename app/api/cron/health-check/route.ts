import { NextResponse } from "next/server"
import { monitoring } from "@/lib/monitoring"

// Health check cron job
export async function GET() {
  try {
    // Run health checks
    await monitoring.checkDatabase()
    await monitoring.checkExternalAPIs()

    const health = monitoring.getSystemHealth()

    // Log critical issues
    if (health.status === "unhealthy") {
      monitoring.logCriticalError(new Error("System health check failed"), `System status: ${health.status}`)
    }

    return NextResponse.json({
      success: true,
      health,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Health check failed",
      },
      { status: 500 },
    )
  }
}
