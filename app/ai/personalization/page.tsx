import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Bell, Lightbulb, Settings } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Personalization</h1>
              <p className="text-gray-600 dark:text-gray-300">Your personalized health insights and recommendations</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="insights">Smart Insights</TabsTrigger>
            <TabsTrigger value="nudges">Personalized Nudges</TabsTrigger>
            <TabsTrigger value="settings">AI Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {recommendations.insights.map((insight) => (
                <Card key={insight.id} className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-purple-600" />
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                      </div>
                      <Badge variant="secondary">{Math.round(insight.confidence_score * 100)}% confident</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{insight.description}</p>
                    {insight.action_recommendations?.suggestions && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white">Recommended Actions:</h4>
                        <ul className="space-y-1">
                          {insight.action_recommendations.suggestions.map((suggestion: string, index: number) => (
                            <li
                              key={index}
                              className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2"
                            >
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
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
                <Card className="md:col-span-2">
                  <CardContent className="text-center py-12">
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Building Your Insights</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Keep using MetaReverse and we'll generate personalized insights based on your patterns and
                      behaviors.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="nudges" className="space-y-6">
            <div className="grid gap-4">
              {recommendations.nudges.map((nudge) => (
                <Card key={nudge.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{nudge.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-3">{nudge.message}</p>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                nudge.priority >= 4 ? "destructive" : nudge.priority >= 3 ? "default" : "secondary"
                              }
                            >
                              {nudge.priority >= 4
                                ? "High Priority"
                                : nudge.priority >= 3
                                  ? "Medium Priority"
                                  : "Low Priority"}
                            </Badge>
                            <Badge variant="outline">{nudge.nudge_type}</Badge>
                          </div>
                        </div>
                      </div>
                      {nudge.action_url && (
                        <Button asChild size="sm">
                          <a href={nudge.action_url}>Take Action</a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {recommendations.nudges.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">All Caught Up!</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      No new personalized nudges right now. Keep up the great work!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  AI Personalization Settings
                </CardTitle>
                <CardDescription>Customize how AI personalizes your MetaReverse experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Engagement Style</CardTitle>
                      <CardDescription>How would you like to be motivated?</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="gentle" name="engagement" value="gentle" className="text-blue-600" />
                          <label htmlFor="gentle" className="text-sm font-medium">
                            Gentle encouragement
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="balanced"
                            name="engagement"
                            value="balanced"
                            className="text-blue-600"
                            defaultChecked
                          />
                          <label htmlFor="balanced" className="text-sm font-medium">
                            Balanced approach
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="competitive"
                            name="engagement"
                            value="competitive"
                            className="text-blue-600"
                          />
                          <label htmlFor="competitive" className="text-sm font-medium">
                            Competitive challenges
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Difficulty Preference</CardTitle>
                      <CardDescription>How challenging should your goals be?</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="easy" name="difficulty" value="easy" className="text-blue-600" />
                          <label htmlFor="easy" className="text-sm font-medium">
                            Start easy
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="adaptive"
                            name="difficulty"
                            value="adaptive"
                            className="text-blue-600"
                            defaultChecked
                          />
                          <label htmlFor="adaptive" className="text-sm font-medium">
                            Adaptive (recommended)
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="challenging"
                            name="difficulty"
                            value="challenging"
                            className="text-blue-600"
                          />
                          <label htmlFor="challenging" className="text-sm font-medium">
                            Challenge me
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
