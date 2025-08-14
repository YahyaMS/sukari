import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icon3D } from "@/components/ui/3d-icon"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { personalizationEngine } from "@/lib/personalization"

export default async function PersonalizationPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get personalized recommendations
  const recommendations = await personalizationEngine.getPersonalizedRecommendations(user.id)

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
            <Link href="/ai">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Icon3D shape="sphere" color="purple" size="lg" glow />
              <div>
                <h1 className="text-2xl font-bold text-white">AI Personalization</h1>
                <p className="text-sm text-text-secondary">Your personalized health insights and recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 relative z-10">
        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="glass-card border-white/10 grid w-full grid-cols-3 p-2 h-14">
            <TabsTrigger
              value="insights"
              className="flex items-center gap-2 text-text-secondary data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-xl transition-all"
            >
              <Icon3D shape="sphere" color="purple" size="sm" />
              Smart Insights
            </TabsTrigger>
            <TabsTrigger
              value="nudges"
              className="flex items-center gap-2 text-text-secondary data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-xl transition-all"
            >
              <Icon3D shape="cube" color="blue" size="sm" />
              Personalized Nudges
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 text-text-secondary data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-xl transition-all"
            >
              <Icon3D shape="torus" color="green" size="sm" />
              AI Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-6 animate-fade-in-up">
            <div className="grid gap-6 md:grid-cols-2">
              {recommendations.insights.map((insight) => (
                <Card
                  key={insight.id}
                  className="glass-card border-white/10 hover:border-white/20 transition-all duration-300 border-l-4 border-l-accent-purple"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Icon3D shape="sphere" color="purple" size="sm" />
                        <CardTitle className="text-lg text-white">{insight.title}</CardTitle>
                      </div>
                      <Badge className="bg-accent-purple/20 text-accent-purple border-accent-purple/30">
                        {Math.round(insight.confidence_score * 100)}% confident
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">{insight.description}</p>
                    {insight.action_recommendations?.suggestions && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-white">Recommended Actions:</h4>
                        <ul className="space-y-1">
                          {insight.action_recommendations.suggestions.map((suggestion: string, index: number) => (
                            <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-accent-purple rounded-full" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {recommendations.insights.length === 0 && (
                <Card className="md:col-span-2 glass-card border-white/10">
                  <CardContent className="text-center py-12">
                    <Icon3D shape="sphere" color="gray" size="xl" className="mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Building Your Insights</h3>
                    <p className="text-gray-300">
                      Keep using MetaReverse and we'll generate personalized insights based on your patterns and
                      behaviors.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="nudges" className="space-y-6 animate-fade-in-up">
            <div className="grid gap-4">
              {recommendations.nudges.map((nudge) => (
                <Card
                  key={nudge.id}
                  className="glass-card border-white/10 hover:border-white/20 transition-all duration-300 hover-lift"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="glass-card border-accent-blue/30 bg-gradient-to-br from-accent-blue/10 to-accent-blue/5 p-2 rounded-lg">
                          <Icon3D shape="cube" color="blue" size="sm" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{nudge.title}</h3>
                          <p className="text-gray-300 mb-3">{nudge.message}</p>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                nudge.priority >= 4
                                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                                  : nudge.priority >= 3
                                    ? "bg-accent-orange/20 text-accent-orange border-accent-orange/30"
                                    : "bg-accent-blue/20 text-accent-blue border-accent-blue/30"
                              }
                            >
                              {nudge.priority >= 4
                                ? "High Priority"
                                : nudge.priority >= 3
                                  ? "Medium Priority"
                                  : "Low Priority"}
                            </Badge>
                            <Badge variant="outline" className="bg-white/5 border-white/20 text-gray-300">
                              {nudge.nudge_type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {nudge.action_url && (
                        <Button
                          asChild
                          size="sm"
                          className="gradient-primary hover:scale-105 transition-all duration-200"
                        >
                          <a href={nudge.action_url}>Take Action</a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {recommendations.nudges.length === 0 && (
                <Card className="glass-card border-white/10">
                  <CardContent className="text-center py-12">
                    <Icon3D shape="cube" color="gray" size="xl" className="mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">All Caught Up!</h3>
                    <p className="text-gray-300">No new personalized nudges right now. Keep up the great work!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 animate-fade-in-up">
            <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Icon3D shape="torus" color="green" size="sm" />
                  AI Personalization Settings
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Customize how AI personalizes your MetaReverse experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="glass-card border-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">Engagement Style</CardTitle>
                      <CardDescription className="text-gray-300">How would you like to be motivated?</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="gentle"
                            name="engagement"
                            value="gentle"
                            className="text-accent-blue"
                          />
                          <label htmlFor="gentle" className="text-sm font-medium text-white">
                            Gentle encouragement
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="balanced"
                            name="engagement"
                            value="balanced"
                            className="text-accent-blue"
                            defaultChecked
                          />
                          <label htmlFor="balanced" className="text-sm font-medium text-white">
                            Balanced approach
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="competitive"
                            name="engagement"
                            value="competitive"
                            className="text-accent-blue"
                          />
                          <label htmlFor="competitive" className="text-sm font-medium text-white">
                            Competitive challenges
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-white/10">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">Difficulty Preference</CardTitle>
                      <CardDescription className="text-gray-300">How challenging should your goals be?</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="easy" name="difficulty" value="easy" className="text-accent-blue" />
                          <label htmlFor="easy" className="text-sm font-medium text-white">
                            Start easy
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="adaptive"
                            name="difficulty"
                            value="adaptive"
                            className="text-accent-blue"
                            defaultChecked
                          />
                          <label htmlFor="adaptive" className="text-sm font-medium text-white">
                            Adaptive (recommended)
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="challenging"
                            name="difficulty"
                            value="challenging"
                            className="text-accent-blue"
                          />
                          <label htmlFor="challenging" className="text-sm font-medium text-white">
                            Challenge me
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end">
                  <Button className="gradient-primary hover:scale-105 transition-all duration-200 shadow-lg text-white font-semibold">
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
