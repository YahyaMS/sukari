import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  Heart,
  Scale,
  Utensils,
  TrendingUp,
  TrendingDown,
  Bell,
  User,
  Settings,
  MessageCircle,
  Users,
  Bot,
  BarChart3,
  Calendar,
  Trophy,
  Sparkles,
  Flame,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { GamificationService } from "@/lib/gamification"
import { LevelProgress } from "@/components/gamification/level-progress"
import { StreakDisplay } from "@/components/gamification/streak-display"

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">MetaReverse</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/notifications">
                <Button variant="ghost" size="sm" className="relative">
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
                <Button variant="ghost" size="sm" className="relative">
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
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" size="sm">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section with Gamification */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Good {timeOfDay}, {firstName}!
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {gamificationService.getLevelInfo(userGamification?.health_points || 0).currentLevel.name}
                </Badge>
                <span className="text-sm text-gray-600">Level {userGamification?.level || 1}</span>
              </div>
            </div>
          </div>
          <p className="text-gray-600 mb-6">{subtitle}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Health Points</p>
                    <p className="text-2xl font-bold">{userGamification?.health_points?.toLocaleString() || 0}</p>
                  </div>
                  <Zap className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Active Streaks</p>
                    <p className="text-2xl font-bold">{totalStreakDays} days</p>
                  </div>
                  <Flame className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Achievements</p>
                    <p className="text-2xl font-bold">{completedAchievements}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {userGamification && (
            <LevelProgress
              healthPoints={userGamification.health_points}
              level={userGamification.level}
              className="mb-6"
            />
          )}
        </div>

        {/* Fasting Feature - Prominent Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Intermittent Fasting
            </h3>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              Core Feature
            </Badge>
          </div>

          <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white mb-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold mb-2">AI-Powered Fasting Coach</h4>
                  <p className="text-purple-100 mb-4">
                    Intelligent guidance for optimal diabetes management through intermittent fasting
                  </p>
                  <div className="flex gap-3">
                    <Link href="/ai/fasting-coach">
                      <Button variant="secondary" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Start Fasting
                      </Button>
                    </Link>
                    <Link href="/fasting/analytics">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white text-white hover:bg-white hover:text-purple-600 bg-transparent"
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">16:8</div>
                  <div className="text-purple-200 text-sm">Recommended</div>
                  <div className="flex items-center mt-2 text-purple-200">
                    <Sparkles className="h-4 w-4 mr-1" />
                    AI Optimized
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Glucose</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
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
              <div className="flex items-center mt-2 text-xs text-blue-600">
                <Zap className="h-3 w-3 mr-1" />
                +10 HP for logging
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weight</CardTitle>
              <Scale className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
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
              <div className="flex items-center mt-2 text-xs text-green-600">
                <Zap className="h-3 w-3 mr-1" />
                +5 HP for logging
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Carbs</CardTitle>
              <Utensils className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(todayCarbs)}g</div>
              <div className="text-sm text-gray-600">Target: 60g</div>
              <Progress value={Math.min((todayCarbs / 60) * 100, 100)} className="mt-2" />
              <div className="flex items-center mt-2 text-xs text-purple-600">
                <Zap className="h-3 w-3 mr-1" />
                +15 HP per meal
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyGoal}%</div>
              <div className="text-sm text-gray-600">On track</div>
              <Progress value={weeklyGoal} className="mt-2" />
              <div className="flex items-center mt-2 text-xs text-orange-600">
                <Flame className="h-3 w-3 mr-1" />
                +50 HP streak bonus
              </div>
            </CardContent>
          </Card>
        </div>

        {userStreaks.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Your Streaks
              </h3>
              <Link href="/gamification/achievements">
                <Button variant="outline" size="sm">
                  <Trophy className="h-4 w-4 mr-2" />
                  View All Achievements
                </Button>
              </Link>
            </div>
            <StreakDisplay streaks={userStreaks} />
          </div>
        )}

        {/* Health Tracking Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Tracking</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/tracking/glucose">
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2 relative">
                <Activity className="h-6 w-6" />
                <span>Log Glucose</span>
                <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                  +10 HP
                </Badge>
              </Button>
            </Link>
            <Link href="/tracking/weight">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent relative"
              >
                <Scale className="h-6 w-6" />
                <span>Log Weight</span>
                <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                  +5 HP
                </Badge>
              </Button>
            </Link>
            <Link href="/tracking/meals">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent relative"
              >
                <Utensils className="h-6 w-6" />
                <span>Log Meal</span>
                <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                  +15 HP
                </Badge>
              </Button>
            </Link>
            <Link href="/tracking/exercise">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent relative"
              >
                <Heart className="h-6 w-6" />
                <span>Log Exercise</span>
                <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
                  +20 HP
                </Badge>
              </Button>
            </Link>
          </div>
        </div>

        {/* AI & Analytics */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Tools</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/ai">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
              >
                <Bot className="h-6 w-6 text-purple-600" />
                <span className="text-purple-700">AI Assistant</span>
              </Button>
            </Link>
            <Link href="/analytics">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <BarChart3 className="h-6 w-6" />
                <span>Analytics</span>
              </Button>
            </Link>
            <Link href="/ai/meal-planner">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <Sparkles className="h-6 w-6" />
                <span>Meal Planner</span>
              </Button>
            </Link>
            <Link href="/ai/fasting-coach">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <Calendar className="h-6 w-6" />
                <span>Fasting Coach</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Community & Coaching */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Community & Support</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/social">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-blue-50 to-green-50 border-blue-200 relative"
              >
                <Users className="h-6 w-6 text-blue-600" />
                <span className="text-blue-700">Social Hub</span>
                {friendRequests.length > 0 && (
                  <Badge variant="destructive" className="absolute top-2 right-2 h-5 w-5 rounded-full p-0 text-xs">
                    {friendRequests.length}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/coaching">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <Heart className="h-6 w-6" />
                <span>My Coach</span>
              </Button>
            </Link>
            <Link href="/community/stories">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <Trophy className="h-6 w-6" />
                <span>Success Stories</span>
              </Button>
            </Link>
            <Link href="/community/ask-expert">
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              >
                <MessageCircle className="h-6 w-6" />
                <span>Ask Expert</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Activity & Alerts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Health Journey</CardTitle>
              <CardDescription>Every entry helps us understand your health better</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentHPActivities.length > 0 && (
                <>
                  {recentHPActivities.slice(0, 2).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Zap className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-gray-600">{new Date(activity.created_at).toLocaleString()}</p>
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
                    <Activity className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Nice work logging that reading!</p>
                      <p className="text-sm text-gray-600">{new Date(latestGlucose.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{latestGlucose.value} mg/dL</Badge>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-600">Ready for your first reading?</p>
                      <p className="text-sm text-gray-500">No pressure - we'll be here when you're ready</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Heart className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium">Welcome to your health transformation!</p>
                    <p className="text-sm text-gray-600">We're honored to be part of your journey</p>
                  </div>
                </div>
                <Badge variant="outline">Let's go!</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Join the Community</p>
                    <p className="text-sm text-gray-600">Connect with others on similar journeys</p>
                  </div>
                </div>
                <Badge variant="outline">Explore</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bot className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">AI Assistant Ready</p>
                    <p className="text-sm text-gray-600">Get personalized health insights</p>
                  </div>
                </div>
                <Badge variant="secondary">Try Now</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gentle Reminders</CardTitle>
              <CardDescription>Taking care of yourself, one step at a time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Help us understand your health story</p>
                      <p className="text-sm text-gray-600">Complete your profile so we can support you better</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Your consistency is building a clear picture</p>
                      <p className="text-sm text-gray-600">Every entry helps us understand your patterns</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">AI insights are ready when you are</p>
                      <p className="text-sm text-gray-600">Get personalized recommendations based on your data</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Meet others on similar journeys</p>
                      <p className="text-sm text-gray-600">Share victories and challenges in a safe space</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Footer */}
        <div className="mt-8 p-6 bg-white/60 backdrop-blur-sm rounded-lg border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">How are you feeling today, {firstName}?</h3>
              <p className="text-sm text-gray-600">We're here to support you every step of the way</p>
            </div>
            <div className="flex gap-3">
              <Link href="/messages/1">
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Chat with Coach
                </Button>
              </Link>
              <Link href="/social">
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Connect with Friends
                </Button>
              </Link>
              <Link href="/community">
                <Button size="sm">
                  <Users className="h-4 w-4 mr-2" />
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
