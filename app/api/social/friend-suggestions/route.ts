import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current user's profile and medical info
    const { data: currentUserProfile } = await supabase
      .from("user_profiles")
      .select(`
        *,
        medical_profiles (
          condition_type,
          current_medications
        )
      `)
      .eq("user_id", user.id)
      .single()

    if (!currentUserProfile) {
      return NextResponse.json({ suggestions: [] })
    }

    // Get users who are not already friends and not pending requests
    const { data: existingConnections } = await supabase
      .from("user_friends")
      .select("friend_id, requester_id")
      .or(`requester_id.eq.${user.id},friend_id.eq.${user.id}`)

    const connectedUserIds = new Set()
    existingConnections?.forEach((conn) => {
      connectedUserIds.add(conn.friend_id)
      connectedUserIds.add(conn.requester_id)
    })
    connectedUserIds.add(user.id) // Exclude self

    // Get potential friend suggestions
    const { data: potentialFriends } = await supabase
      .from("user_profiles")
      .select(`
        user_id,
        first_name,
        last_name,
        avatar_url,
        created_at,
        medical_profiles (
          condition_type,
          current_medications
        ),
        user_gamification (
          level,
          total_hp
        )
      `)
      .not("user_id", "in", `(${Array.from(connectedUserIds).join(",")})`)
      .limit(10)

    if (!potentialFriends) {
      return NextResponse.json({ suggestions: [] })
    }

    // Score and rank suggestions based on similarity
    const scoredSuggestions = potentialFriends.map((friend) => {
      let score = 0
      const reasons = []

      // Same health condition (+3 points)
      if (friend.medical_profiles?.condition_type === currentUserProfile.medical_profiles?.condition_type) {
        score += 3
        reasons.push(`Both managing ${friend.medical_profiles.condition_type.replace("_", " ")}`)
      }

      // Similar level (+2 points)
      const levelDiff = Math.abs(
        (friend.user_gamification?.level || 1) - (currentUserProfile.user_gamification?.level || 1),
      )
      if (levelDiff <= 2) {
        score += 2
        reasons.push(`Similar health journey level`)
      }

      // Recently joined (+1 point)
      const joinedRecently = new Date(friend.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      if (joinedRecently) {
        score += 1
        reasons.push("New to MetaReverse")
      }

      // Active user (+1 point)
      if ((friend.user_gamification?.total_hp || 0) > 100) {
        score += 1
        reasons.push("Active community member")
      }

      return {
        ...friend,
        score,
        reasons: reasons.slice(0, 2), // Limit to 2 reasons
        suggestion_type: score >= 3 ? "high_match" : score >= 2 ? "good_match" : "potential_match",
      }
    })

    // Sort by score and return top suggestions
    const suggestions = scoredSuggestions.sort((a, b) => b.score - a.score).slice(0, 6)

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("Error fetching friend suggestions:", error)
    return NextResponse.json({ suggestions: [] })
  }
}
