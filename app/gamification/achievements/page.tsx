import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { GamificationService } from "@/lib/gamification"
import { AchievementGrid } from "@/components/gamification/achievement-grid"
import { LevelProgress } from "@/components/gamification/level-progress"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Icon3D } from "@/components/ui/3d-icon"
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
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#21262D] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Icon3D shape="trophy" color="yellow" size="lg" glow />
            <h1 className="text-2xl font-bold text-white">Your Achievements</h1>
          </div>
        </div>

        {userGamification && (
          <LevelProgress
            healthPoints={userGamification.health_points}
            level={userGamification.level}
            className="mb-8"
          />
        )}

        {userAchievements.length === 0 ? (
          <div className="glass-card p-12 text-center animate-fade-in-up">
            <Icon3D shape="trophy" color="gray" size="xl" className="mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Earn Your First Achievement?</h2>
            <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
              Your achievement journey starts with your first health action. Every glucose reading, meal log, and
              exercise session brings you closer to unlocking badges and earning Health Points.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="glass-card p-6 border-white/10">
                <Icon3D shape="sphere" color="blue" size="lg" className="mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">First Steps</h3>
                <p className="text-text-secondary text-sm">
                  Log your first glucose reading to unlock your first achievement
                </p>
              </div>
              <div className="glass-card p-6 border-white/10">
                <Icon3D shape="utensils" color="purple" size="lg" className="mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Consistency</h3>
                <p className="text-text-secondary text-sm">Build streaks by logging meals and tracking your progress</p>
              </div>
              <div className="glass-card p-6 border-white/10">
                <Icon3D shape="heart" color="red" size="lg" className="mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Milestones</h3>
                <p className="text-text-secondary text-sm">Reach health milestones and unlock rare achievements</p>
              </div>
            </div>
            <div className="mt-8">
              <Link href="/dashboard">
                <Button size="lg" className="gradient-primary">
                  <Icon3D shape="zap" color="white" size="sm" className="mr-2" />
                  Start Your Journey
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <AchievementGrid achievements={userAchievements} />
        )}
      </div>
    </div>
  )
}
