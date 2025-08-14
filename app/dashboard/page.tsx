import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, HeroCard, ElevatedCard } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Icon3D } from "@/components/ui/3d-icon"
import {
  Heart,
  TrendingUp,
  TrendingDown,
  Bell,
  User,
  Settings,
  MessageCircle,
  Users,
  BarChart3,
  Calendar,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { GamificationService } from "@/lib/gamification"
import { LevelProgress } from "@/components/gamification/level-progress"

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const gamificationService = new GamificationService()

  const userGamification = await gamificationService.getOrCreateUserGamification(user.id)
  const userStreaks = (await gamificationService.getUserStreaks(user.id)) || []
  const userAchievements = (await gamificationService.getUserAchievements(user.id)) || []
  const recentHPActivities = (await gamificationService.getRecentHPActivities(user.id, 5)) || []

  // Fetch user profile
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

  // Fetch latest health data
  const { data: latestGlucose } = await supabase
    .from("glucose_readings")
    .select("*")
    .eq("user_id", user.id)
    .order("timestamp", { ascending: false })
    .limit(1)
    .single()

  const { data: latestWeight } = await supabase
    .from("weight_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("timestamp", { ascending: false })
    .limit(1)
    .single()

  // Fetch today's meals for carb calculation
  const today = new Date().toISOString().split("T")[0]
  const { data: todayMeals } = await supabase
    .from("meals")
    .select("total_carbs")
    .eq("user_id", user.id)
    .gte("timestamp", `${today}T00:00:00`)
    .lte("timestamp", `${today}T23:59:59`)

  // Fetch recent notifications
  const { data: notificationsData } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .eq("read", false)
    .order("created_at", { ascending: false })
    .limit(10)

  const { data: friendRequestsData } = await supabase
    .from("friend_requests")
    .select("*")
    .eq("recipient_id", user.id)
    .eq("status", "pending")

  const notifications = notificationsData || []
  const friendRequests = friendRequestsData || []
  const safeTodayMeals = todayMeals || []

  const currentGlucose = latestGlucose?.value || 0
  const currentWeight = latestWeight?.weight_kg ? (latestWeight.weight_kg * 2.20462).toFixed(1) : 0
  const todayCarbs = safeTodayMeals.reduce((sum, meal) => sum + (meal.total_carbs || 0), 0) || 0
  const weeklyGoal = 75 // This would be calculated based on user goals and progress

  const unreadNotifications = notifications.length || 0
  const unreadMessages = 3 // This would come from messages table

  const firstName = profile?.first_name || user.user_metadata?.first_name || "there"
  const timeOfDay = new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"

  const getPersonalizedGreeting = () => {
    const level = userGamification?.level || 1
    const hp = userGamification?.health_points || 0
    const levelInfo = gamificationService.getLevelInfo(hp)

    if (currentGlucose === 0 && currentWeight === 0) {
      return {
        greeting: `Good ${timeOfDay}, ${firstName}!`,
        subtitle:
          "Your health transformation journey starts here. Every small step builds momentum - we're honored to support you.",
      }
    } else {
      return {
        greeting: `Good ${timeOfDay}, ${firstName}!`,
        subtitle: "You're building incredible momentum! Ready to earn some Health Points and keep those streaks alive?",
      }
    }
  }

  const { greeting, subtitle } = getPersonalizedGreeting()

  // Safe array operations with proper null checks
  const completedAchievements = userAchievements.filter((a) => a.completed).length
  const totalStreakDays = userStreaks.reduce((sum, streak) => sum + (streak.current_count || 0), 0)
  const longestStreak = userStreaks.length > 0 ? Math.max(...userStreaks.map((s) => s.current_count || 0)) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#21262D] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <header className="glass-card border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon3D shape="sphere" color="gradient" size="lg" glow />
              <h1 className="text-2xl font-bold text-text-primary">MetaReverse</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link href="/messages">
                <Button variant="ghost" size="icon" className="relative">
                  <MessageCircle className="h-5 w-5" />
                  {unreadMessages > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {unreadMessages}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        <div className="animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-4xl font-bold text-text-primary mb-2">Good {timeOfDay},</h2>
              <div className="text-3xl font-bold text-text-primary mb-3">{firstName}!</div>
              <div className="flex items-center gap-3">
                <Badge className="gradient-primary text-white px-4 py-2 text-sm font-semibold">
                  {gamificationService.getLevelInfo(userGamification?.health_points || 0).currentLevel.name}
                </Badge>
                <span className="text-text-tertiary">Level {userGamification?.level || 1}</span>
              </div>
            </div>
          </div>
          <p className="text-text-secondary text-lg mb-8 leading-relaxed">{subtitle}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ElevatedCard className="hover-glow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-tertiary text-sm mb-1">Health Points</p>
                    <p className="text-3xl font-bold text-text-primary">
                      {userGamification?.health_points?.toLocaleString() || 0}
                    </p>
                  </div>
                  <Icon3D shape="sphere" color="purple" size="xl" glow />
                </div>
              </CardContent>
            </ElevatedCard>

            <ElevatedCard className="hover-glow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-tertiary text-sm mb-1">Active Streaks</p>
                    <p className="text-3xl font-bold text-text-primary">{totalStreakDays} days</p>
                  </div>
                  <Icon3D shape="torus" color="orange" size="xl" glow />
                </div>
              </CardContent>
            </ElevatedCard>

            <ElevatedCard className="hover-glow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-tertiary text-sm mb-1">Achievements</p>
                    <p className="text-3xl font-bold text-text-primary">{completedAchievements}</p>
                  </div>
                  <Icon3D shape="cube" color="green" size="xl" glow />
                </div>
              </CardContent>
            </ElevatedCard>
          </div>

          {userGamification && (
            <div className="mb-8">
              <LevelProgress
                healthPoints={userGamification.health_points}
                level={userGamification.level}
                className="mb-6"
              />
            </div>
          )}
        </div>

        <div className="animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-text-primary flex items-center gap-3">
              <Icon3D shape="capsule" color="purple" size="lg" />
              Intermittent Fasting
            </h3>
            <Badge className="glass-elevated px-4 py-2 text-accent-purple border-accent-purple/30">Core Feature</Badge>
          </div>

          <HeroCard className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-2xl font-bold mb-3">AI-Powered Fasting Coach</h4>
                <p className="text-white/90 mb-6 text-lg leading-relaxed">
                  Intelligent guidance for optimal diabetes management through intermittent fasting
                </p>
                <div className="flex gap-4">
                  <Link href="/ai/fasting-coach">
                    <Button variant="secondary" size="lg" className="bg-white/20 hover:bg-white/30">
                      <Calendar className="h-5 w-5 mr-2" />
                      Start Fasting
                    </Button>
                  </Link>
                  <Link href="/fasting/analytics">
                    <Button variant="outline" size="lg" className="border-white/30 hover:bg-white/10 bg-transparent">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      View Analytics
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="text-right ml-8">
                <div className="text-5xl font-bold mb-2">16:8</div>
                <div className="text-white/80 text-lg mb-3">Recommended</div>
                <div className="flex items-center text-white/80">
                  <Sparkles className="h-5 w-5 mr-2" />
                  AI Optimized
                </div>
              </div>
            </div>
          </HeroCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-text-secondary">Current Glucose</CardTitle>
              <Icon3D shape="sphere" color="blue" size="md" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary mb-2">
                {currentGlucose > 0 ? `${currentGlucose} mg/dL` : "Ready when you are"}
              </div>
              {currentGlucose > 140 ? (
                <div className="flex items-center text-sm text-orange-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  That's higher than usual - let's figure out what happened
                </div>
              ) : currentGlucose > 0 ? (
                <div className="flex items-center text-sm text-green-600">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  Beautiful! You're in your target range
                </div>
              ) : (
                <div className="text-sm text-gray-600">Your glucose meter is ready when you are</div>
              )}
              <div className="flex items-center mt-3 text-xs text-accent-blue">
                <Icon3D shape="sphere" color="blue" size="sm" className="mr-2" />
                +10 HP for logging
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-text-secondary">Weight</CardTitle>
              <Icon3D shape="scale" color="green" size="md" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary mb-2">
                {currentWeight > 0 ? `${currentWeight} lbs` : "Every weigh-in is data"}
              </div>
              {currentWeight > 0 ? (
                <div className="flex items-center text-sm text-green-600">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  You're building awareness - that's what matters
                </div>
              ) : (
                <div className="text-sm text-gray-600">Not judgment, just building awareness</div>
              )}
              <div className="flex items-center mt-3 text-xs text-accent-green">
                <Icon3D shape="scale" color="green" size="sm" className="mr-2" />
                +5 HP for logging
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-text-secondary">Today's Carbs</CardTitle>
              <Icon3D shape="utensils" color="purple" size="md" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary mb-2">{Math.round(todayCarbs)}g</div>
              <div className="text-sm text-text-secondary">Target: 60g</div>
              <Progress value={Math.min((todayCarbs / 60) * 100, 100)} className="mt-2" />
              <div className="flex items-center mt-3 text-xs text-accent-purple">
                <Icon3D shape="utensils" color="purple" size="sm" className="mr-2" />
                +15 HP per meal
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-text-secondary">Weekly Goal</CardTitle>
              <Icon3D shape="trending-up" color="blue" size="md" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary mb-2">{weeklyGoal}%</div>
              <div className="text-sm text-text-secondary">On track</div>
              <Progress value={weeklyGoal} className="mt-2" />
              <div className="flex items-center mt-3 text-xs text-accent-orange">
                <Icon3D shape="flame" color="orange" size="sm" className="mr-2" />
                +50 HP streak bonus
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="animate-fade-in-up">
          <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
            <Icon3D shape="cube" color="green" size="lg" />
            Health Tracking
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/tracking/glucose">
              <Button className="w-full h-24 flex flex-col items-center justify-center space-y-3 relative group">
                <Icon3D shape="sphere" color="blue" size="lg" className="group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Log Glucose</span>
                <Badge variant="secondary" className="absolute top-3 right-3 text-xs">
                  +10 HP
                </Badge>
              </Button>
            </Link>
            <Link href="/tracking/weight">
              <Button className="w-full h-24 flex flex-col items-center justify-center space-y-3 relative group">
                <Icon3D shape="scale" color="green" size="lg" className="group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Log Weight</span>
                <Badge variant="secondary" className="absolute top-3 right-3 text-xs">
                  +5 HP
                </Badge>
              </Button>
            </Link>
            <Link href="/tracking/meals">
              <Button className="w-full h-24 flex flex-col items-center justify-center space-y-3 relative group">
                <Icon3D
                  shape="utensils"
                  color="purple"
                  size="lg"
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="font-semibold">Log Meal</span>
                <Badge variant="secondary" className="absolute top-3 right-3 text-xs">
                  +15 HP
                </Badge>
              </Button>
            </Link>
            <Link href="/tracking/exercise">
              <Button className="w-full h-24 flex flex-col items-center justify-center space-y-3 relative group">
                <Icon3D shape="heart" color="red" size="lg" className="group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Log Exercise</span>
                <Badge variant="secondary" className="absolute top-3 right-3 text-xs">
                  +20 HP
                </Badge>
              </Button>
            </Link>
          </div>
        </div>

        <div className="animate-fade-in-up">
          <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
            <Icon3D shape="torus" color="purple" size="lg" />
            AI-Powered Tools
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/ai">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center space-y-3 glass-elevated hover-glow group bg-transparent"
              >
                <Icon3D
                  shape="sphere"
                  color="gradient"
                  size="lg"
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="font-semibold text-accent-purple">AI Assistant</span>
              </Button>
            </Link>
            <Link href="/analytics">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center space-y-3 glass-elevated hover-glow group bg-transparent"
              >
                <Icon3D
                  shape="bar-chart"
                  color="white"
                  size="lg"
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="font-semibold">Analytics</span>
              </Button>
            </Link>
            <Link href="/ai/meal-planner">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center space-y-3 glass-elevated hover-glow group bg-transparent"
              >
                <Icon3D
                  shape="sparkles"
                  color="white"
                  size="lg"
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="font-semibold">Meal Planner</span>
              </Button>
            </Link>
            <Link href="/ai/fasting-coach">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center space-y-3 glass-elevated hover-glow group bg-transparent"
              >
                <Icon3D
                  shape="capsule"
                  color="purple"
                  size="lg"
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="font-semibold">Fasting Coach</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="animate-fade-in-up">
          <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
            <Icon3D shape="capsule" color="blue" size="lg" />
            Community & Support
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/social">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center space-y-3 glass-elevated hover-glow group bg-transparent"
              >
                <Icon3D shape="users" color="blue" size="lg" className="group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Social Hub</span>
                {friendRequests.length > 0 && (
                  <Badge variant="destructive" className="absolute top-3 right-3 h-5 w-5 rounded-full p-0 text-xs">
                    {friendRequests.length}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/coaching">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center space-y-3 glass-elevated hover-glow group bg-transparent"
              >
                <Icon3D shape="heart" color="red" size="lg" className="group-hover:scale-110 transition-transform" />
                <span className="font-semibold">My Coach</span>
              </Button>
            </Link>
            <Link href="/community/stories">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center space-y-3 glass-elevated hover-glow group bg-transparent"
              >
                <Icon3D shape="trophy" color="white" size="lg" className="group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Success Stories</span>
              </Button>
            </Link>
            <Link href="/community/ask-expert">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center space-y-3 glass-elevated hover-glow group bg-transparent"
              >
                <Icon3D
                  shape="message-circle"
                  color="white"
                  size="lg"
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="font-semibold">Ask Expert</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 animate-fade-in-up">
          <ElevatedCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Icon3D shape="cube" color="green" size="md" />
                Your Health Journey
              </CardTitle>
              <CardDescription>Every entry helps us understand your health better</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {recentHPActivities.length > 0 && (
                <>
                  {recentHPActivities.slice(0, 2).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon3D shape="zap" color="blue" size="md" className="mr-2" />
                        <div>
                          <p className="font-medium text-text-primary">{activity.description}</p>
                          <p className="text-sm text-text-secondary">
                            {new Date(activity.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">+{activity.hp_earned} HP</Badge>
                    </div>
                  ))}
                </>
              )}

              {latestGlucose ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon3D shape="activity" color="blue" size="md" className="mr-2" />
                    <div>
                      <p className="font-medium text-text-primary">Nice work logging that reading!</p>
                      <p className="text-sm text-text-secondary">
                        {new Date(latestGlucose.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{latestGlucose.value} mg/dL</Badge>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon3D shape="activity" color="gray" size="md" className="mr-2" />
                    <div>
                      <p className="font-medium text-text-secondary">Ready for your first reading?</p>
                      <p className="text-sm text-text-tertiary">No pressure - we'll be here when you're ready</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon3D shape="heart" color="red" size="md" className="mr-2" />
                  <div>
                    <p className="font-medium text-text-primary">Welcome to your health transformation!</p>
                    <p className="text-sm text-text-secondary">We're honored to be part of your journey</p>
                  </div>
                </div>
                <Badge variant="outline">Let's go!</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon3D shape="users" color="green" size="md" className="mr-2" />
                  <div>
                    <p className="font-medium text-text-primary">Join the Community</p>
                    <p className="text-sm text-text-secondary">Connect with others on similar journeys</p>
                  </div>
                </div>
                <Badge variant="outline">Explore</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon3D shape="bot" color="purple" size="md" className="mr-2" />
                  <div>
                    <p className="font-medium text-text-primary">AI Assistant Ready</p>
                    <p className="text-sm text-text-secondary">Get personalized health insights</p>
                  </div>
                </div>
                <Badge variant="secondary">Try Now</Badge>
              </div>
            </CardContent>
          </ElevatedCard>

          <ElevatedCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Icon3D shape="torus" color="orange" size="md" />
                Gentle Reminders
              </CardTitle>
              <CardDescription>Taking care of yourself, one step at a time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {notifications.length > 0 ? (
                notifications.slice(0, 4).map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        notification.priority === "high"
                          ? "bg-red-500"
                          : notification.priority === "medium"
                            ? "bg-orange-500"
                            : "bg-blue-500"
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium text-text-primary">{notification.title}</p>
                      <p className="text-sm text-text-secondary">{notification.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-text-primary">Help us understand your health story</p>
                      <p className="text-sm text-text-secondary">Complete your profile so we can support you better</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-text-primary">Your consistency is building a clear picture</p>
                      <p className="text-sm text-text-secondary">Every entry helps us understand your patterns</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-text-primary">AI insights are ready when you are</p>
                      <p className="text-sm text-text-secondary">Get personalized recommendations based on your data</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-text-primary">Meet others on similar journeys</p>
                      <p className="text-sm text-text-secondary">Share victories and challenges in a safe space</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </ElevatedCard>
        </div>

        <div className="glass-elevated p-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-text-primary mb-2">How are you feeling today, {firstName}?</h3>
              <p className="text-text-secondary">We're here to support you every step of the way</p>
            </div>
            <div className="flex gap-4">
              <Link href="/messages/1">
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5 mr-2" />
                  Chat with Coach
                </Button>
              </Link>
              <Link href="/social">
                <Button variant="outline" size="lg">
                  <Users className="h-5 w-5 mr-2" />
                  Connect with Friends
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="premium" size="lg">
                  <Users className="h-5 w-5 mr-2" />
                  Join Community
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
