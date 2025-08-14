import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ChallengeService } from "@/lib/challenges"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Users, Calendar, Target, ArrowLeft, Flame, Zap } from "lucide-react"
import Link from "next/link"
import { ChallengeGrid } from "@/components/challenges/challenge-grid"
import { MyChallenges } from "@/components/challenges/my-challenges"

export default async function ChallengesPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const challengeService = new ChallengeService()
  const activeChallenges = await challengeService.getActiveChallenges(user.id)
  const userChallenges = await challengeService.getUserChallenges(user.id)

  const weeklyActiveChallenges = activeChallenges.filter((c) => c.duration_type === "weekly")
  const monthlyChallenges = activeChallenges.filter((c) => c.duration_type === "monthly")
  const seasonalChallenges = activeChallenges.filter((c) => c.duration_type === "seasonal")

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
            <Trophy className="h-6 w-6 text-yellow-500" />
            <h1 className="text-2xl font-bold">Health Challenges</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Challenges</p>
                  <p className="text-2xl font-bold">{activeChallenges.length}</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">My Challenges</p>
                  <p className="text-2xl font-bold">{userChallenges.length}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Participants</p>
                  <p className="text-2xl font-bold">
                    {activeChallenges.reduce((sum, c) => sum + (c.participant_count || 0), 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rewards Available</p>
                  <p className="text-2xl font-bold">
                    {activeChallenges.reduce((sum, c) => sum + c.reward_hp, 0).toLocaleString()} HP
                  </p>
                </div>
                <Zap className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Active Challenges</TabsTrigger>
            <TabsTrigger value="my-challenges">
              My Challenges
              {userChallenges.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {userChallenges.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    Featured Challenges
                  </CardTitle>
                  <CardDescription>Join these popular challenges and compete with the community</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChallengeGrid challenges={activeChallenges.slice(0, 6)} currentUserId={user.id} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="my-challenges">
            <MyChallenges challenges={userChallenges} currentUserId={user.id} />
          </TabsContent>

          <TabsContent value="weekly">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Weekly Challenges
                </CardTitle>
                <CardDescription>Short-term challenges to build healthy habits</CardDescription>
              </CardHeader>
              <CardContent>
                <ChallengeGrid challenges={weeklyActiveChallenges} currentUserId={user.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-purple-500" />
                  Monthly Challenges
                </CardTitle>
                <CardDescription>Long-term transformation challenges with bigger rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <ChallengeGrid challenges={monthlyChallenges} currentUserId={user.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
