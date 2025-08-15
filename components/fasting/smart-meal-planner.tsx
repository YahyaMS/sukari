"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Utensils, Clock, TrendingUp, Droplets, Zap, AlertTriangle, CheckCircle, ChefHat, Timer } from "lucide-react"
import { toast } from "sonner"

interface SmartMealPlannerProps {
  sessionId?: string
  fastingDuration?: number
  currentGlucose?: number
  metabolicState?: string
  onMealLogged?: (meal: any) => void
}

interface MealRecommendation {
  mealName: string
  description: string
  macros: { protein: number; carbs: number; fat: number; calories: number }
  ingredients: string[]
  preparation: string[]
  timing: string
  portionSize: string
  glucoseImpact: "low" | "medium" | "high"
  digestibility: "easy" | "moderate" | "complex"
  benefits: string[]
  warnings?: string[]
}

interface MealPlan {
  meals: MealRecommendation[]
  guidance: string
  metabolicState: string
}

type MealType = "pre_fast" | "breaking_fast" | "post_fast" | "regular"

export default function SmartMealPlanner({
  sessionId,
  fastingDuration = 0,
  currentGlucose,
  metabolicState,
  onMealLogged,
}: SmartMealPlannerProps) {
  const [selectedMealType, setSelectedMealType] = useState<MealType>("breaking_fast")
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [hydrationGuidance, setHydrationGuidance] = useState<Record<string, string> | null>(null)
  const [electrolyteRecs, setElectrolyteRecs] = useState<Record<string, any> | null>(null)
  const [timingGuidance, setTimingGuidance] = useState<Record<string, string> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<MealRecommendation | null>(null)
  const [mealCompleted, setMealCompleted] = useState<string[]>([])

  // User preferences
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([])
  const [preferredCuisines, setPreferredCuisines] = useState<string[]>([])

  const mealTypes = [
    { value: "pre_fast", label: "Pre-Fast Meal", icon: Timer },
    { value: "breaking_fast", label: "Breaking Fast", icon: Utensils },
    { value: "post_fast", label: "Post-Fast Recovery", icon: TrendingUp },
    { value: "regular", label: "Regular Meal", icon: ChefHat },
  ]

  const commonRestrictions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Keto",
    "Low-Carb",
    "Nut-Free",
    "Shellfish-Free",
  ]

  const cuisineTypes = ["Mediterranean", "Asian", "Mexican", "Indian", "American", "Italian", "Middle Eastern"]

  useEffect(() => {
    if (fastingDuration > 0) {
      if (fastingDuration < 12) {
        setSelectedMealType("regular")
      } else {
        setSelectedMealType("breaking_fast")
      }
    }
  }, [fastingDuration])

  const generateMealPlan = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/fasting/meal-planning", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          fastingDuration,
          currentGlucose,
          mealType: selectedMealType,
          preferences: {
            cuisine: preferredCuisines,
            avoidFoods: dietaryRestrictions,
          },
          userProfile: {
            // Add user profile data if available
            activityLevel: "moderate",
            healthConditions: ["diabetes"],
          },
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMealPlan(data.mealPlan)
        setHydrationGuidance(data.hydrationGuidance)
        setElectrolyteRecs(data.electrolyteRecommendations)
        setTimingGuidance(data.timingGuidance)
        toast.success("Meal plan generated successfully!")
      } else {
        throw new Error("Failed to generate meal plan")
      }
    } catch (error) {
      console.error("Error generating meal plan:", error)
      toast.error("Failed to generate meal plan")
    } finally {
      setIsLoading(false)
    }
  }

  const logMealCompletion = async (meal: MealRecommendation) => {
    try {
      // Log meal completion
      if (sessionId) {
        await fetch("/api/fasting/health-monitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            mealLogged: {
              name: meal.mealName,
              macros: meal.macros,
              timing: new Date().toISOString(),
            },
          }),
        })
      }

      setMealCompleted((prev) => [...prev, meal.mealName])
      toast.success(`${meal.mealName} logged successfully!`)

      if (onMealLogged) {
        onMealLogged(meal)
      }

      // Award HP for meal logging
      try {
        await fetch("/api/gamification/award-hp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "log_meal",
            points: 5,
            description: `Logged ${meal.mealName}`,
          }),
        })
      } catch (error) {
        console.error("Error awarding HP:", error)
      }
    } catch (error) {
      console.error("Error logging meal:", error)
      toast.error("Failed to log meal")
    }
  }

  const getGlucoseImpactColor = (impact: string) => {
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

  const getDigestibilityIcon = (digestibility: string) => {
    switch (digestibility) {
      case "easy":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "moderate":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "complex":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Meal Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Utensils className="h-5 w-5 text-orange-500" />
            <span>Smart Meal Planner</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {mealTypes.map((type) => (
              <Button
                key={type.value}
                variant={selectedMealType === type.value ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setSelectedMealType(type.value as MealType)}
              >
                <type.icon className="h-5 w-5" />
                <span className="text-sm">{type.label}</span>
              </Button>
            ))}
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Dietary Restrictions</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {commonRestrictions.map((restriction) => (
                  <div key={restriction} className="flex items-center space-x-2">
                    <Checkbox
                      id={restriction}
                      checked={dietaryRestrictions.includes(restriction)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setDietaryRestrictions((prev) => [...prev, restriction])
                        } else {
                          setDietaryRestrictions((prev) => prev.filter((r) => r !== restriction))
                        }
                      }}
                    />
                    <Label htmlFor={restriction} className="text-xs">
                      {restriction}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Preferred Cuisines</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {cuisineTypes.map((cuisine) => (
                  <div key={cuisine} className="flex items-center space-x-2">
                    <Checkbox
                      id={cuisine}
                      checked={preferredCuisines.includes(cuisine)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPreferredCuisines((prev) => [...prev, cuisine])
                        } else {
                          setPreferredCuisines((prev) => prev.filter((c) => c !== cuisine))
                        }
                      }}
                    />
                    <Label htmlFor={cuisine} className="text-xs">
                      {cuisine}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button onClick={generateMealPlan} disabled={isLoading} className="w-full">
            {isLoading ? "Generating Meal Plan..." : "Generate Smart Meal Plan"}
          </Button>
        </CardContent>
      </Card>

      {/* Meal Plan Results */}
      {mealPlan && (
        <Tabs defaultValue="meals" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="meals">Meals</TabsTrigger>
            <TabsTrigger value="hydration">Hydration</TabsTrigger>
            <TabsTrigger value="electrolytes">Electrolytes</TabsTrigger>
            <TabsTrigger value="timing">Timing</TabsTrigger>
          </TabsList>

          <TabsContent value="meals" className="space-y-4">
            {/* General Guidance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Meal Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline">{mealPlan.metabolicState.replace("_", " ")}</Badge>
                  {fastingDuration > 0 && <Badge variant="secondary">{fastingDuration}h fast</Badge>}
                </div>
                <p className="text-sm text-gray-700">{mealPlan.guidance}</p>
              </CardContent>
            </Card>

            {/* Meal Recommendations */}
            <div className="space-y-4">
              {mealPlan.meals.map((meal, index) => (
                <Card key={index} className="relative">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{meal.mealName}</span>
                      <div className="flex items-center space-x-2">
                        <Badge className={getGlucoseImpactColor(meal.glucoseImpact)}>
                          {meal.glucoseImpact} glucose impact
                        </Badge>
                        {getDigestibilityIcon(meal.digestibility)}
                      </div>
                    </CardTitle>
                    <p className="text-sm text-gray-600">{meal.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Macros */}
                    <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{meal.macros.calories}</div>
                        <div className="text-xs text-gray-600">Calories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{meal.macros.protein}g</div>
                        <div className="text-xs text-gray-600">Protein</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-600">{meal.macros.carbs}g</div>
                        <div className="text-xs text-gray-600">Carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{meal.macros.fat}g</div>
                        <div className="text-xs text-gray-600">Fat</div>
                      </div>
                    </div>

                    {/* Timing and Portion */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{meal.timing}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Utensils className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{meal.portionSize}</span>
                      </div>
                    </div>

                    {/* Ingredients */}
                    <div>
                      <h4 className="font-medium text-sm mb-2">Ingredients:</h4>
                      <div className="grid grid-cols-1 gap-1">
                        {meal.ingredients.map((ingredient, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-sm">
                            <div className="w-1 h-1 bg-gray-400 rounded-full" />
                            <span>{ingredient}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preparation */}
                    <div>
                      <h4 className="font-medium text-sm mb-2">Preparation:</h4>
                      <div className="space-y-1">
                        {meal.preparation.map((step, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-sm">
                            <span className="text-xs bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h4 className="font-medium text-sm mb-2">Benefits:</h4>
                      <div className="flex flex-wrap gap-1">
                        {meal.benefits.map((benefit, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Warnings */}
                    {meal.warnings && meal.warnings.length > 0 && (
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium text-yellow-900 text-sm">Important Notes:</span>
                        </div>
                        {meal.warnings.map((warning, idx) => (
                          <div key={idx} className="text-sm text-yellow-800">
                            • {warning}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      onClick={() => logMealCompletion(meal)}
                      disabled={mealCompleted.includes(meal.mealName)}
                      className="w-full"
                      variant={mealCompleted.includes(meal.mealName) ? "secondary" : "default"}
                    >
                      {mealCompleted.includes(meal.mealName) ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Meal Completed
                        </>
                      ) : (
                        <>
                          <Utensils className="h-4 w-4 mr-2" />
                          Mark as Completed
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hydration">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <span>Hydration Guidance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hydrationGuidance && (
                  <div className="space-y-3">
                    {Object.entries(hydrationGuidance).map(([key, value]) => (
                      <div key={key} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                        <Droplets className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-900 capitalize">{key.replace("_", " ")}</p>
                          <p className="text-sm text-blue-800">{value as string}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="electrolytes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span>Electrolyte Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {electrolyteRecs && (
                  <div className="space-y-4">
                    {Object.entries(electrolyteRecs).map(([key, value]) => (
                      <div key={key} className="p-4 border rounded-lg">
                        <h4 className="font-medium capitalize mb-2">{key}</h4>
                        {typeof value === "object" && value !== null ? (
                          <div className="space-y-2">
                            {Object.entries(value as any).map(([subKey, subValue]) => (
                              <div key={subKey} className="flex justify-between text-sm">
                                <span className="capitalize text-gray-600">{subKey.replace("_", " ")}:</span>
                                <span>{Array.isArray(subValue) ? subValue.join(", ") : (subValue as string)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-700">{value as string}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Timer className="h-5 w-5 text-purple-500" />
                  <span>Timing Guidance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {timingGuidance && (
                  <div className="space-y-3">
                    {Object.entries(timingGuidance).map(([key, value]) => (
                      <div key={key} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                        <Timer className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-purple-900 capitalize">{key.replace("_", " ")}</p>
                          <p className="text-sm text-purple-800">{value as string}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
