import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: () => cookieStore },
    )

    // Simple database ping
    const { data, error } = await supabase.from("user_profiles").select("id").limit(1)

    if (error) {
      return NextResponse.json({ status: "unhealthy", error: error.message }, { status: 500 })
    }

    return NextResponse.json({ status: "healthy", timestamp: new Date().toISOString() })
  } catch (error) {
    return NextResponse.json({ status: "unhealthy", error: "Database connection failed" }, { status: 500 })
  }
}
