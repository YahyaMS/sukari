"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, Sparkles, Users, Star } from "lucide-react"
import { toast } from "sonner"

interface FriendSuggestion {
  user_id: string
  first_name: string
  last_name: string
  avatar_url?: string
  score: number
  reasons: string[]
  suggestion_type: "high_match" | "good_match" | "potential_match"
  user_gamification?: {
    level: number
    total_hp: number
  }
  medical_profiles?: {
    condition_type: string
  }
}

interface FriendSuggestionsProps {
  currentUserId: string
}

export function FriendSuggestions({ currentUserId }: FriendSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<FriendSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingRequest, setSendingRequest] = useState<string | null>(null)

  useEffect(() => {
    fetchSuggestions()
  }, [])

  const fetchSuggestions = async () => {
    try {
      const response = await fetch("/api/social/friend-suggestions")
      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch (error) {
      console.error("Error fetching suggestions:", error)
    } finally {
      setLoading(false)
    }
  }

  const sendFriendRequest = async (targetUserId: string, targetName: string) => {
    setSendingRequest(targetUserId)
    try {
      const response = await fetch("/api/social/friend-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_user_id: targetUserId }),
      })

      if (response.ok) {
        toast.success(`Friend request sent to ${targetName}!`)
        // Remove from suggestions
        setSuggestions((prev) => prev.filter((s) => s.user_id !== targetUserId))
      } else {
        toast.error("Failed to send friend request")
      }
    } catch (error) {
      toast.error("Error sending friend request")
    } finally {
      setSendingRequest(null)
    }
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "high_match":
        return <Star className="h-4 w-4 text-yellow-500" />
      case "good_match":
        return <Sparkles className="h-4 w-4 text-blue-500" />
      default:
        return <Users className="h-4 w-4 text-gray-500" />
    }
  }

  const getSuggestionBadge = (type: string) => {
    switch (type) {
      case "high_match":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            Perfect Match
          </Badge>
        )
      case "good_match":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Good Match
          </Badge>
        )
      default:
        return <Badge variant="outline">Potential Friend</Badge>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Suggested Friends
          </CardTitle>
          <CardDescription>Discover people with similar health journeys</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Suggested Friends
          </CardTitle>
          <CardDescription>Discover people with similar health journeys</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground">No suggestions available right now.</p>
            <p className="text-sm text-muted-foreground mt-2">Check back later for new friend recommendations!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          Suggested Friends
        </CardTitle>
        <CardDescription>Discover people with similar health journeys</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.user_id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={suggestion.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>
                    {suggestion.first_name[0]}
                    {suggestion.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">
                      {suggestion.first_name} {suggestion.last_name}
                    </p>
                    {getSuggestionIcon(suggestion.suggestion_type)}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {getSuggestionBadge(suggestion.suggestion_type)}
                    {suggestion.user_gamification && (
                      <Badge variant="outline" className="text-xs">
                        Level {suggestion.user_gamification.level}
                      </Badge>
                    )}
                  </div>
                  {suggestion.reasons.length > 0 && (
                    <div className="space-y-1">
                      {suggestion.reasons.map((reason, index) => (
                        <p key={index} className="text-xs text-muted-foreground">
                          • {reason}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                onClick={() =>
                  sendFriendRequest(suggestion.user_id, `${suggestion.first_name} ${suggestion.last_name}`)
                }
                disabled={sendingRequest === suggestion.user_id}
                className="ml-4"
              >
                {sendingRequest === suggestion.user_id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Friend
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
