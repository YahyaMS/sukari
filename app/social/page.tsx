import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SocialService } from "@/lib/social"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, UserPlus, Trophy, Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { SocialFeed } from "@/components/social/social-feed"
import { FriendsLeaderboard } from "@/components/social/friends-leaderboard"
import { FriendsList } from "@/components/social/friends-list"

export default async function SocialPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const socialService = new SocialService()
  const friends = await socialService.getFriends(user.id)
  const friendRequests = await socialService.getFriendRequests(user.id)
  const socialFeed = await socialService.getSocialFeed(user.id)
  const friendsLeaderboard = await socialService.getFriendsLeaderboard(user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Social Hub</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Friends</p>
                  <p className="text-2xl font-bold">{friends.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Friend Requests</p>
                  <p className="text-2xl font-bold">{friendRequests.length}</p>
                </div>
                <UserPlus className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Feed Posts</p>
                  <p className="text-2xl font-bold">{socialFeed.length}</p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your Rank</p>
                  <p className="text-2xl font-bold">#{friendsLeaderboard.find((f) => f.id === user.id)?.rank || "-"}</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="feed">Social Feed</TabsTrigger>
            <TabsTrigger value="friends">
              Friends
              {friendRequests.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  {friendRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="feed">
            <SocialFeed posts={socialFeed} currentUserId={user.id} />
          </TabsContent>

          <TabsContent value="friends">
            <FriendsList friends={friends} friendRequests={friendRequests} currentUserId={user.id} />
          </TabsContent>

          <TabsContent value="leaderboard">
            <FriendsLeaderboard friends={friendsLeaderboard} currentUserId={user.id} />
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control what you share with friends and the community</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Privacy settings will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
