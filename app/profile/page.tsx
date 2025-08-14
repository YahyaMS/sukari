import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icon3D } from "@/components/ui/3d-icon"
import { ProfileEditForm } from "@/components/profile/profile-edit-form"

export default async function ProfilePage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

  const firstName = profile?.first_name || user.user_metadata?.first_name || "User"
  const lastName = profile?.last_name || user.user_metadata?.last_name || ""
  const email = user.email || ""
  const phone = profile?.phone || ""
  const dateOfBirth = profile?.date_of_birth || ""
  const gender = profile?.gender || ""
  const height = profile?.height_cm || ""
  const location = profile?.location || ""
  const bio = profile?.bio || "Managing my health journey with MetaReverse."
  const emergencyContact = profile?.emergency_contact || ""

  // Fetch health data
  const { data: latestWeight } = await supabase
    .from("weight_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("timestamp", { ascending: false })
    .limit(1)
    .single()

  const { data: latestGlucose } = await supabase
    .from("glucose_readings")
    .select("*")
    .eq("user_id", user.id)
    .order("timestamp", { ascending: false })
    .limit(1)
    .single()

  // Calculate health stats
  const healthStats = {
    currentWeight: latestWeight?.weight_kg || 0,
    targetWeight: profile?.target_weight_kg || 70,
    avgGlucose: latestGlucose?.value || 0,
    targetGlucose: 120,
    hba1c: profile?.latest_hba1c || 0,
    targetHba1c: 6.5,
  }

  const achievements = [
    {
      title: "30-Day Streak",
      description: "Logged glucose for 30 consecutive days",
      shape: "sphere",
      color: "orange",
      earned: true,
    },
    {
      title: "Weight Goal",
      description: "Lost 5kg towards target weight",
      shape: "cube",
      color: "green",
      earned: true,
    },
    {
      title: "Exercise Champion",
      description: "Completed 20 workout sessions",
      shape: "capsule",
      color: "purple",
      earned: false,
    },
    {
      title: "Glucose Master",
      description: "Maintained target range for 7 days",
      shape: "torus",
      color: "blue",
      earned: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#21262D] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="glass-card border-b border-white/10 relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Icon3D shape="sphere" color="purple" size="sm" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Profile</h1>
                  <p className="text-sm text-text-secondary">Manage your personal information</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <div className="grid gap-6">
          <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 ring-4 ring-purple-500/30">
                    <AvatarImage src="/professional-woman-smiling.png" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-lg">
                      {firstName.charAt(0)}
                      {lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-white">
                    {firstName} {lastName}
                  </h2>
                  <p className="text-text-secondary flex items-center justify-center md:justify-start gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {location || "Location not set"}
                  </p>
                  <p className="text-text-primary mt-2">{bio}</p>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                    <Badge className="bg-accent-purple/20 text-accent-purple border-accent-purple/30">
                      Type 2 Diabetes
                    </Badge>
                    <Badge className="bg-accent-green/20 text-accent-green border-accent-green/30">
                      Weight Management
                    </Badge>
                    <Badge className="bg-accent-blue/20 text-accent-blue border-accent-blue/30">Health Novice</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <ProfileEditForm
            user={user}
            profile={{
              firstName,
              lastName,
              email,
              phone,
              dateOfBirth,
              gender,
              height,
              location,
              bio,
              emergencyContact,
            }}
          />

          <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Icon3D shape="heart" color="green" size="sm" />
                Health Overview
              </CardTitle>
              <CardDescription className="text-text-secondary">
                Current health metrics and progress toward goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 glass-card border-accent-blue/30 bg-gradient-to-br from-accent-blue/10 to-accent-blue/5 rounded-lg">
                  <div className="text-2xl font-bold text-accent-blue">
                    {healthStats.currentWeight > 0 ? `${healthStats.currentWeight}kg` : "Not set"}
                  </div>
                  <div className="text-sm text-text-secondary">Current Weight</div>
                  {healthStats.currentWeight > 0 && (
                    <>
                      <Progress value={75} className="mt-2" />
                      <div className="text-xs text-text-secondary mt-1">Target: {healthStats.targetWeight}kg</div>
                    </>
                  )}
                </div>
                <div className="text-center p-4 glass-card border-accent-green/30 bg-gradient-to-br from-accent-green/10 to-accent-green/5 rounded-lg">
                  <div className="text-2xl font-bold text-accent-green">
                    {healthStats.avgGlucose > 0 ? healthStats.avgGlucose : "Not set"}
                  </div>
                  <div className="text-sm text-text-secondary">Latest Glucose (mg/dL)</div>
                  {healthStats.avgGlucose > 0 && (
                    <>
                      <Progress value={60} className="mt-2" />
                      <div className="text-xs text-text-secondary mt-1">Target: {healthStats.targetGlucose}</div>
                    </>
                  )}
                </div>
                <div className="text-center p-4 glass-card border-accent-orange/30 bg-gradient-to-br from-accent-orange/10 to-accent-orange/5 rounded-lg">
                  <div className="text-2xl font-bold text-accent-orange">
                    {healthStats.hba1c > 0 ? `${healthStats.hba1c}%` : "Not set"}
                  </div>
                  <div className="text-sm text-text-secondary">HbA1c</div>
                  {healthStats.hba1c > 0 && (
                    <>
                      <Progress value={45} className="mt-2" />
                      <div className="text-xs text-text-secondary mt-1">Target: {healthStats.targetHba1c}%</div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ... existing achievements and quick actions cards remain the same ... */}
          <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Icon3D shape="torus" color="purple" size="sm" />
                Achievements
              </CardTitle>
              <CardDescription className="text-text-secondary">
                Your health journey milestones and accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg glass-card transition-all duration-300 ${
                      achievement.earned
                        ? "border-accent-green/30 bg-gradient-to-br from-accent-green/10 to-accent-green/5 hover:border-accent-green/50"
                        : "border-white/10 bg-gradient-to-br from-white/5 to-white/2 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon3D shape={achievement.shape as any} color={achievement.color as any} size="sm" />
                      <div className="flex-1">
                        <h4
                          className={`font-semibold ${achievement.earned ? "text-accent-green" : "text-text-secondary"}`}
                        >
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-text-secondary">{achievement.description}</p>
                      </div>
                      {achievement.earned && (
                        <Badge className="bg-accent-green/20 text-accent-green border-accent-green/30">Earned</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Icon3D shape="capsule" color="orange" size="sm" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/profile/medical">
                  <Button
                    variant="outline"
                    className="w-full glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Update Medical Info
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button
                    variant="outline"
                    className="w-full glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Privacy Settings
                  </Button>
                </Link>
                <Link href="/coaching">
                  <Button
                    variant="outline"
                    className="w-full glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Contact Coach
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
