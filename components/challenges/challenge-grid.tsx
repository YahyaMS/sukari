"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Trophy, Target, Zap } from "lucide-react"
import type { Challenge } from "@/lib/challenges"
import { ChallengeService } from "@/lib/challenges"
import Link from "next/link"

interface ChallengeGridProps {
  challenges: Challenge[]
  currentUserId: string
}

export function ChallengeGrid({ challenges, currentUserId }: ChallengeGridProps) {
  const challengeService = new ChallengeService()

  const formatTimeRemaining = (daysRemaining: number) => {
    if (daysRemaining === 0) return "Ends today"
    if (daysRemaining === 1) return "1 day left"
    if (daysRemaining < 7) return `${daysRemaining} days left`
    if (daysRemaining < 30) return `${Math.ceil(daysRemaining / 7)} weeks left`
    return `${Math.ceil(daysRemaining / 30)} months left`
  }

  if (challenges.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No challenges available</h3>
        <p className="text-gray-500 mb-6">Check back soon for new exciting health challenges!</p>
        <Button>Create Custom Challenge</Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {challenges.map((challenge) => {
        const { title: typeTitle, icon, color } = challengeService.getChallengeTypeDisplay(challenge.challenge_type)
        const durationDisplay = challengeService.getDurationDisplay(challenge.duration_type)

        return (
          <Card key={challenge.id} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <Badge variant="outline" className={color}>
                      {durationDisplay}
                    </Badge>
                  </div>
                </div>
                {challenge.user_participating && <Badge className="bg-green-100 text-green-800">Joined</Badge>}
              </div>
              <CardTitle className="text-lg">{challenge.title}</CardTitle>
              <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{challenge.participant_count || 0} participants</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{formatTimeRemaining(challenge.days_remaining || 0)}</span>
                </div>
              </div>

              {challenge.user_participating && challenge.user_rank && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Your Rank</span>
                    <Badge variant="secondary">#{challenge.user_rank}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Your Score</span>
                    <span className="font-semibold">{challenge.user_score?.toLocaleString() || 0} pts</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-semibold">+{challenge.reward_hp} HP</span>
                </div>
                {challenge.reward_badge && (
                  <Badge variant="outline" className="text-xs">
                    {challenge.reward_badge}
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Link href={`/challenges/${challenge.id}`} className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Target className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </Link>
                {!challenge.user_participating && (
                  <Button className="flex-1">
                    <Trophy className="h-4 w-4 mr-2" />
                    Join Challenge
                  </Button>
                )}
              </div>
            </CardContent>

            {challenge.user_participating && (
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-green-500">
                <Trophy className="absolute -top-8 -right-6 h-4 w-4 text-white" />
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
