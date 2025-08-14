import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, Zap, Crown } from "lucide-react"
import type { Challenge } from "@/lib/challenges"
import { ChallengeService } from "@/lib/challenges"
import Link from "next/link"

interface MyChallengesProps {
  challenges: Challenge[]
  currentUserId: string
}

export function MyChallenges({ challenges, currentUserId }: MyChallengesProps) {
  const challengeService = new ChallengeService()

  const activeChallenges = challenges.filter((c) => (c.days_remaining || 0) > 0)
  const completedChallenges = challenges.filter((c) => (c.days_remaining || 0) === 0)

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4 text-yellow-500" />
    if (rank <= 3) return <Trophy className="h-4 w-4 text-orange-500" />
    if (rank <= 10) return <Badge variant="secondary">Top 10</Badge>
    return <Badge variant="outline">#{rank}</Badge>
  }

  if (challenges.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No challenges joined yet</h3>
          <p className="text-gray-500 mb-6">
            Join your first challenge to start competing with the community and earning rewards!
          </p>
          <Link href="/challenges">
            <Button>
              <Trophy className="h-4 w-4 mr-2" />
              Browse Challenges
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Active Challenges */}
      {activeChallenges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Active Challenges ({activeChallenges.length})
            </CardTitle>
            <CardDescription>Challenges you're currently participating in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeChallenges.map((challenge) => {
                const {
                  title: typeTitle,
                  icon,
                  color,
                } = challengeService.getChallengeTypeDisplay(challenge.challenge_type)
                const progress = challengeService.calculateProgress(challenge, challenge.user_score || 0)

                return (
                  <Card key={challenge.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{icon}</span>
                          <h4 className="font-semibold">{challenge.title}</h4>
                        </div>
                        {challenge.user_rank && getRankBadge(challenge.user_rank)}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Your Score</p>
                          <p className="font-bold text-lg">{challenge.user_score?.toLocaleString() || 0}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Days Left</p>
                          <p className="font-bold text-lg">{challenge.days_remaining || 0}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">+{challenge.reward_hp} HP</span>
                        </div>
                        <Link href={`/challenges/${challenge.id}`}>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>

                    {challenge.user_rank === 1 && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">Leading!</Badge>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Challenges */}
      {completedChallenges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-green-500" />
              Completed Challenges ({completedChallenges.length})
            </CardTitle>
            <CardDescription>Your challenge history and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedChallenges.map((challenge) => {
                const {
                  title: typeTitle,
                  icon,
                  color,
                } = challengeService.getChallengeTypeDisplay(challenge.challenge_type)

                return (
                  <div key={challenge.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-xl opacity-70">{icon}</span>
                      <div>
                        <h4 className="font-semibold">{challenge.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Final Score: {challenge.user_score?.toLocaleString() || 0} points
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {challenge.user_rank && getRankBadge(challenge.user_rank)}
                      <Badge variant="outline" className="text-green-600">
                        +{challenge.reward_hp} HP Earned
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
