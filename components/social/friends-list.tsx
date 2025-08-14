"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserPlus, Check, X, Mail } from "lucide-react"
import { FriendSuggestions } from "./friend-suggestions"
import type { Friend } from "@/lib/social"

interface FriendsListProps {
  friends: Friend[]
  friendRequests: Friend[]
  currentUserId: string
}

export function FriendsList({ friends, friendRequests, currentUserId }: FriendsListProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSendRequest = async () => {
    if (!email.trim()) return

    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/social/friend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Friend request sent successfully!")
        setEmail("")
        // Refresh the page to show updated data
        window.location.reload()
      } else {
        setMessage(data.error || "Failed to send friend request")
      }
    } catch (error) {
      console.error("Error sending friend request:", error)
      setMessage("Failed to send friend request")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptRequest = async (friendId: string) => {
    try {
      const response = await fetch("/api/social/friend-request/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId }),
      })

      const data = await response.json()

      if (response.ok) {
        // Refresh the page to show updated data
        window.location.reload()
      } else {
        console.error("Error accepting friend request:", data.error)
      }
    } catch (error) {
      console.error("Error accepting friend request:", error)
    }
  }

  const handleRejectRequest = async (friendId: string) => {
    try {
      const response = await fetch("/api/social/friend-request/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId }),
      })

      const data = await response.json()

      if (response.ok) {
        // Refresh the page to show updated data
        window.location.reload()
      } else {
        console.error("Error rejecting friend request:", data.error)
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error)
    }
  }

  return (
    <div className="space-y-6">
      <FriendSuggestions currentUserId={currentUserId} />

      {/* Add Friends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Friends by Email
          </CardTitle>
          <CardDescription>Connect with friends using their email address</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Enter friend's email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <Button onClick={handleSendRequest} disabled={isLoading || !email.trim()}>
              <Mail className="h-4 w-4 mr-2" />
              {isLoading ? "Sending..." : "Send Request"}
            </Button>
          </div>
          {message && (
            <div
              className={`text-sm p-2 rounded ${
                message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Friend Requests */}
      {friendRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Friend Requests
              <Badge variant="destructive">{friendRequests.length}</Badge>
            </CardTitle>
            <CardDescription>People who want to connect with you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {friendRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {request.first_name?.[0]}
                        {request.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {request.first_name} {request.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{request.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleAcceptRequest(request.id)}>
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleRejectRequest(request.id)}>
                      <X className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Friends List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Friends ({friends.length})</CardTitle>
          <CardDescription>Your health journey companions</CardDescription>
        </CardHeader>
        <CardContent>
          {friends.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No friends yet</h3>
              <p className="text-gray-500">
                Add friends to share your health journey, celebrate achievements together, and stay motivated!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {friend.first_name?.[0]}
                        {friend.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {friend.first_name} {friend.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Connected {new Date(friend.connected_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Message
                    </Button>
                    <Button size="sm" variant="outline">
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
