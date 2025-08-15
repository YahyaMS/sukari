"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Icon3D } from "@/components/ui/3d-icon"
import { ArrowLeft, RefreshCw, ShoppingCart, Clock } from "lucide-react"
import Link from "next/link"

interface MealPlan {
  id: string
  name: string
  type: "breakfast" | "lunch" | "dinner" | "snack"
  carbs: number
  calories: number
  protein: number
  fat: number
  fiber: number
  ingredients: string[]
  instructions: string[]
  prepTime: number
  difficulty: "Easy" | "Medium" | "Hard"
  glucoseImpact: "Low" | "Medium" | "High"
}

const aiMealSuggestions: MealPlan[] = [
  {
    id: "1",
    name: "Protein-Packed Veggie Scramble",
    type: "breakfast",
    carbs: 8,
    calories: 285,
    protein: 22,
    fat: 18,
    fiber: 4,
    ingredients: ["3 eggs", "1 cup spinach", "1/2 bell pepper", "1/4 avocado", "2 tbsp olive oil", "Salt & pepper"],
    instructions: [
      "Heat olive oil in non-stick pan",
      "Sauté bell pepper for 2 minutes",
      "Add spinach until wilted",
      "Beat eggs and pour into pan",
      "Scramble gently, top with avocado",
    ],
    prepTime: 10,
    difficulty: "Easy",
    glucoseImpact: "Low",
  },
  {
    id: "2",
    name: "Mediterranean Quinoa Bowl",
    type: "lunch",
    carbs: 35,
    calories: 420,
    protein: 18,
    fat: 16,
    fiber: 8,
    ingredients: [
      "1/2 cup cooked quinoa",
      "4 oz grilled chicken",
      "1/2 cucumber",
      "1/4 cup chickpeas",
      "2 tbsp feta cheese",
      "Olive oil & lemon dressing",
    ],
    instructions: [
      "Cook quinoa according to package directions",
      "Grill chicken breast and slice",
      "Dice cucumber and drain chickpeas",
      "Combine all ingredients in bowl",
      "Drizzle with dressing and crumble feta",
    ],
    prepTime: 20,
    difficulty: "Medium",
    glucoseImpact: "Medium",
  },
  {
    id: "3",
    name: "Herb-Crusted Salmon with Roasted Vegetables",
    type: "dinner",
    carbs: 18,
    calories: 485,
    protein: 35,
    fat: 28,
    fiber: 6,
    ingredients: [
      "6 oz salmon fillet",
      "1 cup broccoli",
      "1/2 cup cauliflower",
      "Fresh herbs (dill, parsley)",
      "2 tbsp olive oil",
      "Lemon juice",
    ],
    instructions: [
      "Preheat oven to 400°F",
      "Season salmon with herbs and lemon",
      "Toss vegetables with olive oil",
      "Roast vegetables for 15 minutes",
      "Add salmon, cook 12-15 minutes more",
    ],
    prepTime: 30,
    difficulty: "Medium",
    glucoseImpact: "Low",
  },
]

export default function MealPlannerPage() {
  const [preferences, setPreferences] = useState({
    targetCarbs: "45",
    mealType: "",
    dietaryRestrictions: [] as string[],
    cookingTime: "",
    difficulty: "",
  })
  const [generatedMeals, setGeneratedMeals] = useState<MealPlan[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedMeals, setSelectedMeals] = useState<string[]>([])

  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-free",
    "Dairy-free",
    "Low-sodium",
    "Keto-friendly",
    "Mediterranean",
  ]

  const handleGenerateMeals = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/meal-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error("Failed to generate meal plan")
      }

      const data = await response.json()
      if (data.meals) {
        setGeneratedMeals(data.meals)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Error generating meals:", error)
      // Fallback to mock data if API fails
      setGeneratedMeals(aiMealSuggestions)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDietaryRestrictionChange = (restriction: string, checked: boolean) => {
    if (checked) {
      setPreferences((prev) => ({
        ...prev,
        dietaryRestrictions: [...prev.dietaryRestrictions, restriction],
      }))
    } else {
      setPreferences((prev) => ({
        ...prev,
        dietaryRestrictions: prev.dietaryRestrictions.filter((r) => r !== restriction),
      }))
    }
  }

  const toggleMealSelection = (mealId: string) => {
    if (selectedMeals.includes(mealId)) {
      setSelectedMeals(selectedMeals.filter((id) => id !== mealId))
    } else {
      setSelectedMeals([...selectedMeals, mealId])
    }
  }

  const getGlucoseImpactColor = (impact: string) => {
    switch (impact) {
      case "Low":
        return "bg-accent-green/20 text-accent-green border-accent-green/30"
      case "Medium":
        return "bg-accent-orange/20 text-accent-orange border-accent-orange/30"
      case "High":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-white/5 border-white/20 text-gray-300"
    }
  }

  const totalNutrition = generatedMeals
    .filter((meal) => selectedMeals.includes(meal.id))
    .reduce(
      (totals, meal) => ({
        carbs: totals.carbs + meal.carbs,
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.protein,
        fat: totals.fat + meal.fat,
        fiber: totals.fiber + meal.fiber,
      }),
      { carbs: 0, calories: 0, protein: 0, fat: 0, fiber: 0 },
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#21262D] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-xl animate-bounce"></div>
      </div>

      {/* Header */}
      <header className="glass-card border-b border-white/10 sticky top-0 z-50 relative">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/ai">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <Icon3D shape="utensils" color="green" size="lg" glow />
              <div>
                <h1 className="text-2xl font-bold text-white">AI Meal Planner</h1>
                <p className="text-sm text-text-secondary">Personalized meals for optimal glucose control</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Preferences Panel */}
          <div className="space-y-6 animate-fade-in-up">
            <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Icon3D shape="cube" color="blue" size="sm" />
                  <span>Meal Preferences</span>
                </CardTitle>
                <CardDescription className="text-gray-300">Customize your AI-generated meal plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="targetCarbs" className="text-gray-200 font-medium">
                    Target Carbs per Meal (g)
                  </Label>
                  <Input
                    id="targetCarbs"
                    type="number"
                    value={preferences.targetCarbs}
                    onChange={(e) => setPreferences((prev) => ({ ...prev, targetCarbs: e.target.value }))}
                    placeholder="45"
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-[#8b5cf6]/50 focus:ring-[#8b5cf6]/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mealType" className="text-gray-200 font-medium">
                    Meal Type
                  </Label>
                  <Select
                    value={preferences.mealType}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, mealType: value }))}
                  >
                    <SelectTrigger className="glass-input border-white/20 text-white">
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/20">
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                      <SelectItem value="all">All Meals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cookingTime" className="text-gray-200 font-medium">
                    Max Cooking Time
                  </Label>
                  <Select
                    value={preferences.cookingTime}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, cookingTime: value }))}
                  >
                    <SelectTrigger className="glass-input border-white/20 text-white">
                      <SelectValue placeholder="Select time limit" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/20">
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty" className="text-gray-200 font-medium">
                    Difficulty Level
                  </Label>
                  <Select
                    value={preferences.difficulty}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger className="glass-input border-white/20 text-white">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/20">
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-200 font-medium">Dietary Restrictions</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {dietaryOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={preferences.dietaryRestrictions.includes(option)}
                          onCheckedChange={(checked) => handleDietaryRestrictionChange(option, checked as boolean)}
                        />
                        <Label htmlFor={option} className="text-sm text-gray-300">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleGenerateMeals}
                  className="w-full gradient-primary hover:scale-105 transition-all duration-200 shadow-lg text-white font-semibold"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Icon3D shape="sphere" color="purple" size="sm" className="mr-2" />
                      Generate AI Meal Plan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Nutrition Summary */}
            {selectedMeals.length > 0 && (
              <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white">Selected Meals Nutrition</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-2 glass-card border-accent-blue/30 bg-gradient-to-br from-accent-blue/10 to-accent-blue/5 rounded">
                      <div className="font-bold text-accent-blue">{Math.round(totalNutrition.carbs)}g</div>
                      <div className="text-gray-300">Carbs</div>
                    </div>
                    <div className="text-center p-2 glass-card border-accent-green/30 bg-gradient-to-br from-accent-green/10 to-accent-green/5 rounded">
                      <div className="font-bold text-accent-green">{Math.round(totalNutrition.calories)}</div>
                      <div className="text-gray-300">Calories</div>
                    </div>
                    <div className="text-center p-2 glass-card border-accent-purple/30 bg-gradient-to-br from-accent-purple/10 to-accent-purple/5 rounded">
                      <div className="font-bold text-accent-purple">{Math.round(totalNutrition.protein)}g</div>
                      <div className="text-gray-300">Protein</div>
                    </div>
                    <div className="text-center p-2 glass-card border-accent-orange/30 bg-gradient-to-br from-accent-orange/10 to-accent-orange/5 rounded">
                      <div className="font-bold text-accent-orange">{Math.round(totalNutrition.fat)}g</div>
                      <div className="text-gray-300">Fat</div>
                    </div>
                  </div>
                  <Separator className="my-4 bg-white/20" />
                  <Button
                    className="w-full gradient-primary hover:scale-105 transition-all duration-200 shadow-lg text-white font-semibold"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Generate Shopping List
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Generated Meals */}
          <div className="lg:col-span-2 animate-fade-in-up">
            {generatedMeals.length === 0 ? (
              <Card className="glass-card border-white/10">
                <CardContent className="text-center py-12">
                  <Icon3D shape="utensils" color="gray" size="xl" className="mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">AI-Powered Meal Planning</h3>
                  <p className="text-gray-300 mb-4">
                    Get personalized meal suggestions based on your glucose response patterns, dietary preferences, and
                    health goals.
                  </p>
                  <p className="text-sm text-gray-400">
                    Set your preferences and click "Generate AI Meal Plan" to start
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">AI-Generated Meal Suggestions</h2>
                  <Badge className="bg-accent-purple/20 text-accent-purple border-accent-purple/30">
                    Personalized for you
                  </Badge>
                </div>

                <div className="grid gap-6">
                  {generatedMeals.map((meal) => (
                    <Card
                      key={meal.id}
                      className={`cursor-pointer transition-all duration-300 hover-lift ${
                        selectedMeals.includes(meal.id)
                          ? "glass-card border-accent-blue/50 bg-gradient-to-br from-accent-blue/10 to-accent-blue/5"
                          : "glass-card border-white/10 hover:border-white/20"
                      }`}
                      onClick={() => toggleMealSelection(meal.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center space-x-2 text-white">
                              <span>{meal.name}</span>
                              <Badge
                                variant="secondary"
                                className="capitalize bg-white/10 text-gray-300 border-white/20"
                              >
                                {meal.type}
                              </Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center space-x-4 mt-2 text-gray-300">
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{meal.prepTime} min</span>
                              </span>
                              <span>{meal.difficulty}</span>
                              <Badge className={getGlucoseImpactColor(meal.glucoseImpact)}>
                                {meal.glucoseImpact} glucose impact
                              </Badge>
                            </CardDescription>
                          </div>
                          <Checkbox checked={selectedMeals.includes(meal.id)} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-2 text-white">Nutrition Facts</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-300">Carbs:</span>
                                <span className="font-medium text-white">{meal.carbs}g</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">Calories:</span>
                                <span className="font-medium text-white">{meal.calories}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">Protein:</span>
                                <span className="font-medium text-white">{meal.protein}g</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">Fat:</span>
                                <span className="font-medium text-white">{meal.fat}g</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2 text-white">Ingredients</h4>
                            <ul className="text-sm text-gray-300 space-y-1">
                              {meal.ingredients.slice(0, 4).map((ingredient, index) => (
                                <li key={index}>• {ingredient}</li>
                              ))}
                              {meal.ingredients.length > 4 && (
                                <li className="text-accent-blue">+ {meal.ingredients.length - 4} more...</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
