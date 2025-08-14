import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { GamificationService } from "@/lib/gamification"
import { AchievementGrid } from "@/components/gamification/achievement-grid"
import { LevelProgress } from "@/components/gamification/level-progress"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy } from "lucide-react"
import Link from "next/link"

export default async function AchievementsPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const gamificationService = new GamificationService()
  const userGamification = await gamificationService.getUserGamification(user.id)
  const userAchievements = await gamificationService.getUserAchievements(user.id)

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
            <h1 className="text-2xl font-bold">Your Achievements</h1>
          </div>
        </div>

        {userGamification && (
          <LevelProgress
            healthPoints={userGamification.health_points}
            level={userGamification.level}
            className="mb-8"
          />
        )}

        <AchievementGrid achievements={userAchievements} />
      </div>
    </div>
  )
}
