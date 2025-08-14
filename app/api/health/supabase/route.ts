import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if Supabase environment variables are configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ status: "unhealthy", error: "Supabase not configured" }, { status: 500 })
    }

    // Simple connectivity check
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ status: "degraded", error: "Supabase API not responding" }, { status: 200 })
    }

    return NextResponse.json({ status: "healthy", timestamp: new Date().toISOString() })
  } catch (error) {
    return NextResponse.json({ status: "unhealthy", error: "Supabase connection failed" }, { status: 500 })
  }
}
