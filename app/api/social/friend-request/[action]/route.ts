import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { action: string } }) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { friendId } = await request.json()
    const action = params.action

    if (!friendId) {
      return NextResponse.json({ error: "Friend ID is required" }, { status: 400 })
    }

    if (action === "accept") {
      // Update friend request status to accepted
      const { error: updateError } = await supabase
        .from("user_friends")
        .update({
          status: "accepted",
          accepted_at: new Date().toISOString(),
        })
        .eq("user_id", friendId)
        .eq("friend_id", user.id)
        .eq("status", "pending")

      if (updateError) {
        console.error("Error accepting friend request:", updateError)
        return NextResponse.json({ error: "Failed to accept friend request" }, { status: 500 })
      }

      // Create reciprocal friendship
      const { error: reciprocalError } = await supabase.from("user_friends").insert({
        user_id: user.id,
        friend_id: friendId,
        status: "accepted",
        created_at: new Date().toISOString(),
        accepted_at: new Date().toISOString(),
      })

      if (reciprocalError) {
        console.error("Error creating reciprocal friendship:", reciprocalError)
      }

      return NextResponse.json({ message: "Friend request accepted" })
    } else if (action === "reject") {
      // Delete the friend request
      const { error: deleteError } = await supabase
        .from("user_friends")
        .delete()
        .eq("user_id", friendId)
        .eq("friend_id", user.id)
        .eq("status", "pending")

      if (deleteError) {
        console.error("Error rejecting friend request:", deleteError)
        return NextResponse.json({ error: "Failed to reject friend request" }, { status: 500 })
      }

      return NextResponse.json({ message: "Friend request rejected" })
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in friend request action API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
