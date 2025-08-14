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
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#21262D] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-xl animate-bounce"></div>
      </div>

      <header className="glass-card border-b border-white/10 sticky top-0 z-50 relative">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Icon3D shape="sphere" color="blue" size="lg" glow />
              <h1 className="text-2xl font-bold text-white">Social Hub</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in-up">
          <ElevatedCard className="glass-card border-accent-blue/30 bg-gradient-to-br from-accent-blue/10 to-accent-blue/5 hover:border-accent-blue/50 transition-all duration-300 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Friends</p>
                  <p className="text-3xl font-bold text-white">{friends.length}</p>
                </div>
                <Icon3D shape="sphere" color="blue" size="xl" glow />
              </div>
            </CardContent>
          </ElevatedCard>

          <ElevatedCard className="glass-card border-accent-green/30 bg-gradient-to-br from-accent-green/10 to-accent-green/5 hover:border-accent-green/50 transition-all duration-300 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Friend Requests</p>
                  <p className="text-3xl font-bold text-white">{friendRequests.length}</p>
                </div>
                <Icon3D shape="cube" color="green" size="xl" glow />
              </div>
            </CardContent>
          </ElevatedCard>

          <ElevatedCard className="glass-card border-accent-purple/30 bg-gradient-to-br from-accent-purple/10 to-accent-purple/5 hover:border-accent-purple/50 transition-all duration-300 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Feed Posts</p>
                  <p className="text-3xl font-bold text-white">{socialFeed.length}</p>
                </div>
                <Icon3D shape="torus" color="purple" size="xl" glow />
              </div>
            </CardContent>
          </ElevatedCard>

          <ElevatedCard className="glass-card border-accent-orange/30 bg-gradient-to-br from-accent-orange/10 to-accent-orange/5 hover:border-accent-orange/50 transition-all duration-300 hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Your Rank</p>
                  <p className="text-3xl font-bold text-white">
                    #{friendsLeaderboard.find((f) => f.id === user.id)?.rank || "-"}
                  </p>
                </div>
                <Icon3D shape="capsule" color="orange" size="xl" glow />
              </div>
            </CardContent>
          </ElevatedCard>
        </div>

        <Tabs defaultValue="feed" className="space-y-8">
          <TabsList className="glass-card border-white/10 grid w-full grid-cols-4 p-2 h-14">
            <TabsTrigger
              value="feed"
              className="flex items-center gap-2 text-text-secondary data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-xl transition-all"
            >
              <Icon3D shape="sphere" color="purple" size="sm" />
              Social Feed
            </TabsTrigger>
            <TabsTrigger
              value="friends"
              className="flex items-center gap-2 text-text-secondary data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-xl transition-all"
            >
              <Icon3D shape="cube" color="blue" size="sm" />
              Friends
              {friendRequests.length > 0 && (
                <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500/20 text-red-400 border-red-500/30">
                  {friendRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="leaderboard"
              className="flex items-center gap-2 text-text-secondary data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-xl transition-all"
            >
              <Icon3D shape="capsule" color="orange" size="sm" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="flex items-center gap-2 text-text-secondary data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-xl transition-all"
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
            <ElevatedCard className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Icon3D shape="torus" color="green" size="md" />
                  Privacy Settings
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  Control what you share with friends and the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="glass-card border-white/10 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Icon3D shape="sphere" color="blue" size="sm" />
                      Health Data Sharing
                    </h3>
                    <p className="text-text-secondary mb-4">
                      Choose what health information you want to share with your friends and the community.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 glass-card border-white/10 rounded-lg">
                        <span className="text-white">Glucose readings</span>
                        <Badge className="bg-accent-green/20 text-accent-green border-accent-green/30">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 glass-card border-white/10 rounded-lg">
                        <span className="text-white">Weight progress</span>
                        <Badge className="bg-accent-green/20 text-accent-green border-accent-green/30">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 glass-card border-white/10 rounded-lg">
                        <span className="text-white">Exercise activities</span>
                        <Badge className="bg-accent-orange/20 text-accent-orange border-accent-orange/30">
                          Limited
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card border-white/10 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Icon3D shape="cube" color="purple" size="sm" />
                      Community Visibility
                    </h3>
                    <p className="text-text-secondary mb-4">
                      Manage your visibility in community features and leaderboards.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 glass-card border-white/10 rounded-lg">
                        <span className="text-white">Leaderboard participation</span>
                        <Badge className="bg-accent-green/20 text-accent-green border-accent-green/30">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 glass-card border-white/10 rounded-lg">
                        <span className="text-white">Success story sharing</span>
                        <Badge className="bg-accent-green/20 text-accent-green border-accent-green/30">Active</Badge>
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
