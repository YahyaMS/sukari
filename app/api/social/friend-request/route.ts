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
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Find user by email
    const { data: targetUser, error: userError } = await supabase
      .from("users")
      .select("id, email, first_name, last_name")
      .eq("email", email.toLowerCase())
      .single()

    if (userError || !targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (targetUser.id === user.id) {
      return NextResponse.json({ error: "Cannot send friend request to yourself" }, { status: 400 })
    }

    // Check if friendship already exists
    const { data: existingFriendship } = await supabase
      .from("user_friends")
      .select("*")
      .or(
        `and(user_id.eq.${user.id},friend_id.eq.${targetUser.id}),and(user_id.eq.${targetUser.id},friend_id.eq.${user.id})`,
      )
      .single()

    if (existingFriendship) {
      return NextResponse.json({ error: "Friend request already exists or you are already friends" }, { status: 400 })
    }

    // Create friend request
    const { error: insertError } = await supabase.from("user_friends").insert({
      user_id: user.id,
      friend_id: targetUser.id,
      status: "pending",
      created_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error("Error creating friend request:", insertError)
      return NextResponse.json({ error: "Failed to send friend request" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Friend request sent successfully",
      friend: {
        id: targetUser.id,
        email: targetUser.email,
        first_name: targetUser.first_name,
        last_name: targetUser.last_name,
      },
    })
  } catch (error) {
    console.error("Error in friend request API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
