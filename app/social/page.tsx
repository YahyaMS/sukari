import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SocialService } from "@/lib/social"
import { CardContent, CardDescription, CardHeader, CardTitle, ElevatedCard } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icon3D } from "@/components/ui/3d-icon"
import { ArrowLeft } from "lucide-react"
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
    <div className="min-h-screen">
      <header className="glass-card border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Icon3D shape="sphere" color="blue" size="lg" glow />
              <h1 className="text-2xl font-bold text-text-primary">Social Hub</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
          <ElevatedCard className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-tertiary mb-1">Friends</p>
                  <p className="text-3xl font-bold text-text-primary">{friends.length}</p>
                </div>
                <Icon3D shape="sphere" color="blue" size="xl" glow />
              </div>
            </CardContent>
          </ElevatedCard>

          <ElevatedCard className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-tertiary mb-1">Friend Requests</p>
                  <p className="text-3xl font-bold text-text-primary">{friendRequests.length}</p>
                </div>
                <Icon3D shape="cube" color="green" size="xl" glow />
              </div>
            </CardContent>
          </ElevatedCard>

          <ElevatedCard className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-tertiary mb-1">Feed Posts</p>
                  <p className="text-3xl font-bold text-text-primary">{socialFeed.length}</p>
                </div>
                <Icon3D shape="torus" color="purple" size="xl" glow />
              </div>
            </CardContent>
          </ElevatedCard>

          <ElevatedCard className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-tertiary mb-1">Your Rank</p>
                  <p className="text-3xl font-bold text-text-primary">
                    #{friendsLeaderboard.find((f) => f.id === user.id)?.rank || "-"}
                  </p>
                </div>
                <Icon3D shape="capsule" color="orange" size="xl" glow />
              </div>
            </CardContent>
          </ElevatedCard>
        </div>

        <Tabs defaultValue="feed" className="space-y-8">
          <TabsList className="glass-elevated grid w-full grid-cols-4 p-2 h-14">
            <TabsTrigger
              value="feed"
              className="flex items-center gap-2 text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-white/10 rounded-xl transition-all"
            >
              <Icon3D shape="sphere" color="purple" size="sm" />
              Social Feed
            </TabsTrigger>
            <TabsTrigger
              value="friends"
              className="flex items-center gap-2 text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-white/10 rounded-xl transition-all"
            >
              <Icon3D shape="cube" color="blue" size="sm" />
              Friends
              {friendRequests.length > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {friendRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="leaderboard"
              className="flex items-center gap-2 text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-white/10 rounded-xl transition-all"
            >
              <Icon3D shape="capsule" color="orange" size="sm" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="flex items-center gap-2 text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-white/10 rounded-xl transition-all"
            >
              <Icon3D shape="torus" color="green" size="sm" />
              Privacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="animate-fade-in-up">
            <SocialFeed posts={socialFeed} currentUserId={user.id} />
          </TabsContent>

          <TabsContent value="friends" className="animate-fade-in-up">
            <FriendsList friends={friends} friendRequests={friendRequests} currentUserId={user.id} />
          </TabsContent>

          <TabsContent value="leaderboard" className="animate-fade-in-up">
            <FriendsLeaderboard friends={friendsLeaderboard} currentUserId={user.id} />
          </TabsContent>

          <TabsContent value="privacy" className="animate-fade-in-up">
            <ElevatedCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-text-primary">
                  <Icon3D shape="torus" color="green" size="md" />
                  Privacy Settings
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  Control what you share with friends and the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <Icon3D shape="sphere" color="blue" size="sm" />
                      Health Data Sharing
                    </h3>
                    <p className="text-text-secondary mb-4">
                      Choose what health information you want to share with your friends and the community.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 glass-card rounded-lg">
                        <span className="text-text-primary">Glucose readings</span>
                        <Badge className="bg-green-500/20 text-green-400">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 glass-card rounded-lg">
                        <span className="text-text-primary">Weight progress</span>
                        <Badge className="bg-green-500/20 text-green-400">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 glass-card rounded-lg">
                        <span className="text-text-primary">Exercise activities</span>
                        <Badge className="bg-orange-500/20 text-orange-400">Limited</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <Icon3D shape="cube" color="purple" size="sm" />
                      Community Visibility
                    </h3>
                    <p className="text-text-secondary mb-4">
                      Manage your visibility in community features and leaderboards.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 glass-card rounded-lg">
                        <span className="text-text-primary">Leaderboard participation</span>
                        <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 glass-card rounded-lg">
                        <span className="text-text-primary">Success story sharing</span>
                        <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </ElevatedCard>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
