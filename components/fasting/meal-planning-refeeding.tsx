"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, ChefHat, AlertTriangle, Lightbulb, Droplets } from "lucide-react"
import { MealPlanningRefeedingService, type RefeedingPlan, type RefeedingMeal } from "@/lib/meal-planning-refeeding"

interface MealPlanningRefeedingProps {
  fastingDuration: number
  fastingType: string
  onPlanGenerated?: (plan: RefeedingPlan) => void
}

export default function MealPlanningRefeeding({
  fastingDuration,
  fastingType,
  onPlanGenerated,
}: MealPlanningRefeedingProps) {
  const [refeedingPlan, setRefeedingPlan] = useState<RefeedingPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<RefeedingMeal | null>(null)

  const mealService = MealPlanningRefeedingService.getInstance()

  useEffect(() => {
    generateRefeedingPlan()
  }, [fastingDuration, fastingType])

  const generateRefeedingPlan = async () => {
    setLoading(true)
    try {
      // Mock user profile - in real app, this would come from user data
      const userProfile = {
        weight: 150,
        height: 68,
        age: 35,
        activityLevel: "moderate",
        diabetesType: "type2",
        medications: ["metformin"],
        allergies: [],
        preferences: ["low-carb", "anti-inflammatory"],
      }

      const plan = await mealService.generateRefeedingPlan(fastingDuration, fastingType, userProfile)

      setRefeedingPlan(plan)
      onPlanGenerated?.(plan)
    } catch (error) {
      console.error("Error generating refeeding plan:", error)
    } finally {
      setLoading(false)
    }
  }

  const getMealTimingColor = (timing: string) => {
    switch (timing) {
      case "immediate":
        return "bg-red-100 text-red-800"
      case "30min":
        return "bg-orange-100 text-orange-800"
      case "1hour":
        return "bg-yellow-100 text-yellow-800"
      case "2hours":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getGlycemicColor = (impact: string) => {
    switch (impact) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Generating your personalized refeeding plan...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!refeedingPlan) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Unable to generate refeeding plan</p>
            <Button onClick={generateRefeedingPlan}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Plan Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ChefHat className="h-5 w-5" />
            <span>Your Personalized Refeeding Plan</span>
          </CardTitle>
          <CardDescription>
            AI-generated meal plan for safely breaking your {fastingDuration}-hour {fastingType} fast
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{refeedingPlan.meals.length}</div>
              <div className="text-sm text-gray-600">Phases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{refeedingPlan.totalCalories}</div>
              <div className="text-sm text-gray-600">Total Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{refeedingPlan.hydrationPlan.water}oz</div>
              <div className="text-sm text-gray-600">Water Goal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.max(...refeedingPlan.meals.map((m) => m.prepTime))}min
              </div>
              <div className="text-sm text-gray-600">Max Prep Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="meals" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="meals">Meal Plan</TabsTrigger>
          <TabsTrigger value="hydration">Hydration</TabsTrigger>
          <TabsTrigger value="supplements">Supplements</TabsTrigger>
          <TabsTrigger value="guidance">AI Guidance</TabsTrigger>
        </TabsList>

        <TabsContent value="meals" className="space-y-4">
          <div className="grid gap-4">
            {refeedingPlan.meals.map((meal, index) => (
              <Card
                key={meal.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedMeal(meal)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{meal.name}</CardTitle>
                    <div className="flex space-x-2">
                      <Badge className={getMealTimingColor(meal.timing)}>
                        {meal.timing === "immediate" ? "Start Now" : `Wait ${meal.timing}`}
                      </Badge>
                      <Badge className={getGlycemicColor(meal.glycemicImpact)}>{meal.glycemicImpact} GI</Badge>
                    </div>
                  </div>
                  <CardDescription>{meal.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-blue-600">{meal.calories}</div>
                      <div className="text-gray-600">Calories</div>
                    </div>
                    <div>
                      <div className="font-medium text-green-600">{meal.macros.protein}g</div>
                      <div className="text-gray-600">Protein</div>
                    </div>
                    <div>
                      <div className="font-medium text-orange-600">{meal.macros.carbs}g</div>
                      <div className="text-gray-600">Carbs</div>
                    </div>
                    <div>
                      <div className="font-medium text-purple-600">{meal.macros.fat}g</div>
                      <div className="text-gray-600">Fat</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-600">{meal.prepTime}min</div>
                      <div className="text-gray-600">Prep Time</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Meal Detail Modal */}
          {selectedMeal && (
            <Card className="mt-6 border-2 border-blue-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedMeal.name}</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setSelectedMeal(null)}>
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Ingredients:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {selectedMeal.ingredients.map((ingredient, i) => (
                      <li key={i}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    {selectedMeal.instructions.map((instruction, i) => (
                      <li key={i}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="hydration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Droplets className="h-5 w-5" />
                <span>Hydration Protocol</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{refeedingPlan.hydrationPlan.water}oz</div>
                  <div className="text-sm text-gray-600">Total Water Goal</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {refeedingPlan.hydrationPlan.electrolytes ? "Yes" : "No"}
                  </div>
                  <div className="text-sm text-gray-600">Electrolytes Needed</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Hydration Timeline:</h4>
                <ul className="space-y-2">
                  {refeedingPlan.hydrationPlan.timing.map((timing, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{timing}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supplements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Supplements</CardTitle>
              <CardDescription>Optional supplements to support your refeeding process</CardDescription>
            </CardHeader>
            <CardContent>
              {refeedingPlan.supplements.length > 0 ? (
                <div className="space-y-3">
                  {refeedingPlan.supplements.map((supplement, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{supplement}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No additional supplements recommended for this fast duration.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guidance" className="space-y-4">
          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span>AI Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {refeedingPlan.aiRecommendations.map((recommendation, i) => (
                  <div key={i} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{recommendation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Warnings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Important Warnings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {refeedingPlan.warnings.map((warning, i) => (
                  <div key={i} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{warning}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
