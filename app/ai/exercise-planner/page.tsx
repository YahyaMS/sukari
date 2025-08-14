"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Brain, Dumbbell, Clock, Target, ArrowLeft, Play, CheckCircle } from "lucide-react"
import Link from "next/link"

interface Exercise {
  id: string
  name: string
  type: "cardio" | "strength" | "flexibility" | "balance"
  duration: number
  intensity: "Low" | "Moderate" | "High"
  caloriesBurned: number
  glucoseImpact: number
  equipment: string[]
  instructions: string[]
  modifications: string[]
  benefits: string[]
}

interface WorkoutPlan {
  id: string
  name: string
  duration: number
  exercises: Exercise[]
  totalCalories: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  focus: string[]
}

const aiWorkoutPlans: WorkoutPlan[] = [
  {
    id: "1",
    name: "Glucose-Optimized Morning Routine",
    duration: 20,
    difficulty: "Beginner",
    focus: ["Glucose Control", "Energy Boost"],
    totalCalories: 150,
    exercises: [
      {
        id: "e1",
        name: "Gentle Walking",
        type: "cardio",
        duration: 10,
        intensity: "Low",
        caloriesBurned: 50,
        glucoseImpact: -15,
        equipment: [],
        instructions: ["Walk at a comfortable pace", "Focus on steady breathing", "Maintain good posture"],
        modifications: ["Use treadmill if weather is poor", "Start with 5 minutes if needed"],
        benefits: ["Improves insulin sensitivity", "Lowers morning glucose"],
      },
      {
        id: "e2",
        name: "Bodyweight Squats",
        type: "strength",
        duration: 5,
        intensity: "Moderate",
        caloriesBurned: 40,
        glucoseImpact: -10,
        equipment: [],
        instructions: ["Stand with feet shoulder-width apart", "Lower body as if sitting back", "Return to standing"],
        modifications: ["Use chair for support", "Reduce range of motion"],
        benefits: ["Builds leg strength", "Improves glucose uptake"],
      },
      {
        id: "e3",
        name: "Stretching Routine",
        type: "flexibility",
        duration: 5,
        intensity: "Low",
        caloriesBurned: 20,
        glucoseImpact: -5,
        equipment: [],
        instructions: ["Hold each stretch for 30 seconds", "Breathe deeply", "Don't bounce"],
        modifications: ["Use wall for support", "Reduce stretch intensity"],
        benefits: ["Improves flexibility", "Reduces stress"],
      },
    ],
  },
  {
    id: "2",
    name: "Post-Meal Glucose Control",
    duration: 15,
    difficulty: "Beginner",
    focus: ["Post-Meal Glucose", "Digestion"],
    totalCalories: 80,
    exercises: [
      {
        id: "e4",
        name: "Light Walking",
        type: "cardio",
        duration: 15,
        intensity: "Low",
        caloriesBurned: 80,
        glucoseImpact: -25,
        equipment: [],
        instructions: ["Walk at a leisurely pace", "Can be done indoors or outdoors", "Focus on consistency"],
        modifications: ["March in place if space is limited", "Use stairs for variety"],
        benefits: ["Significantly reduces post-meal glucose spikes", "Aids digestion"],
      },
    ],
  },
  {
    id: "3",
    name: "Strength & Glucose Management",
    duration: 30,
    difficulty: "Intermediate",
    focus: ["Muscle Building", "Glucose Control", "Metabolism"],
    totalCalories: 200,
    exercises: [
      {
        id: "e5",
        name: "Push-ups",
        type: "strength",
        duration: 5,
        intensity: "Moderate",
        caloriesBurned: 50,
        glucoseImpact: -12,
        equipment: [],
        instructions: ["Start in plank position", "Lower chest to floor", "Push back up"],
        modifications: ["Do on knees", "Use wall for incline push-ups"],
        benefits: ["Builds upper body strength", "Improves insulin sensitivity"],
      },
      {
        id: "e6",
        name: "Resistance Band Rows",
        type: "strength",
        duration: 10,
        intensity: "Moderate",
        caloriesBurned: 80,
        glucoseImpact: -15,
        equipment: ["Resistance band"],
        instructions: ["Anchor band at chest height", "Pull handles to chest", "Control the return"],
        modifications: ["Use lighter resistance", "Reduce range of motion"],
        benefits: ["Strengthens back muscles", "Improves posture"],
      },
      {
        id: "e7",
        name: "Stationary Bike",
        type: "cardio",
        duration: 15,
        intensity: "Moderate",
        caloriesBurned: 120,
        glucoseImpact: -20,
        equipment: ["Exercise bike"],
        instructions: ["Maintain steady pace", "Keep resistance moderate", "Monitor heart rate"],
        modifications: ["Reduce intensity", "Shorten duration"],
        benefits: ["Improves cardiovascular health", "Burns glucose effectively"],
      },
    ],
  },
]

export default function ExercisePlannerPage() {
  const [preferences, setPreferences] = useState({
    fitnessLevel: "",
    timeAvailable: "",
    equipment: [] as string[],
    goals: [] as string[],
    limitations: [] as string[],
  })
  const [generatedPlans, setGeneratedPlans] = useState<WorkoutPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const equipmentOptions = [
    "None (Bodyweight only)",
    "Resistance bands",
    "Dumbbells",
    "Exercise bike",
    "Treadmill",
    "Yoga mat",
    "Stability ball",
  ]

  const goalOptions = [
    "Lower glucose levels",
    "Weight loss",
    "Build strength",
    "Improve endurance",
    "Increase flexibility",
    "Better sleep",
    "Stress reduction",
  ]

  const limitationOptions = [
    "Knee problems",
    "Back issues",
    "Heart condition",
    "Balance issues",
    "Limited mobility",
    "Recent injury",
    "High blood pressure",
  ]

  const handleGeneratePlans = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/exercise-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error("Failed to generate workout plans")
      }

      const data = await response.json()
      if (data.workoutPlans) {
        setGeneratedPlans(data.workoutPlans)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Error generating workout plans:", error)
      // Fallback to mock data if API fails
      setGeneratedPlans(aiWorkoutPlans)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEquipmentChange = (equipment: string, checked: boolean) => {
    if (checked) {
      setPreferences((prev) => ({ ...prev, equipment: [...prev.equipment, equipment] }))
    } else {
      setPreferences((prev) => ({ ...prev, equipment: prev.equipment.filter((e) => e !== equipment) }))
    }
  }

  const handleGoalChange = (goal: string, checked: boolean) => {
    if (checked) {
      setPreferences((prev) => ({ ...prev, goals: [...prev.goals, goal] }))
    } else {
      setPreferences((prev) => ({ ...prev, goals: prev.goals.filter((g) => g !== goal) }))
    }
  }

  const handleLimitationChange = (limitation: string, checked: boolean) => {
    if (checked) {
      setPreferences((prev) => ({ ...prev, limitations: [...prev.limitations, limitation] }))
    } else {
      setPreferences((prev) => ({ ...prev, limitations: prev.limitations.filter((l) => l !== limitation) }))
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "Low":
        return "bg-blue-100 text-blue-800"
      case "Moderate":
        return "bg-orange-100 text-orange-800"
      case "High":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">AI Exercise Planner</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Preferences Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>Exercise Preferences</span>
                </CardTitle>
                <CardDescription>Customize your AI-generated workout plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Fitness Level</Label>
                  <Select
                    value={preferences.fitnessLevel}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, fitnessLevel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fitness level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time Available</Label>
                  <Select
                    value={preferences.timeAvailable}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, timeAvailable: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Available Equipment</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {equipmentOptions.map((equipment) => (
                      <div key={equipment} className="flex items-center space-x-2">
                        <Checkbox
                          id={equipment}
                          checked={preferences.equipment.includes(equipment)}
                          onCheckedChange={(checked) => handleEquipmentChange(equipment, checked as boolean)}
                        />
                        <Label htmlFor={equipment} className="text-sm">
                          {equipment}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Health Goals</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {goalOptions.map((goal) => (
                      <div key={goal} className="flex items-center space-x-2">
                        <Checkbox
                          id={goal}
                          checked={preferences.goals.includes(goal)}
                          onCheckedChange={(checked) => handleGoalChange(goal, checked as boolean)}
                        />
                        <Label htmlFor={goal} className="text-sm">
                          {goal}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Physical Limitations</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {limitationOptions.map((limitation) => (
                      <div key={limitation} className="flex items-center space-x-2">
                        <Checkbox
                          id={limitation}
                          checked={preferences.limitations.includes(limitation)}
                          onCheckedChange={(checked) => handleLimitationChange(limitation, checked as boolean)}
                        />
                        <Label htmlFor={limitation} className="text-sm">
                          {limitation}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleGeneratePlans} className="w-full" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Brain className="h-4 w-4 mr-2 animate-pulse" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Generate AI Workout Plan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Generated Plans */}
          <div className="lg:col-span-2">
            {generatedPlans.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">AI-Powered Exercise Planning</h3>
                  <p className="text-gray-600 mb-4">
                    Get personalized workout plans optimized for glucose control, based on your fitness level, available
                    time, and health goals.
                  </p>
                  <p className="text-sm text-gray-500">
                    Set your preferences and click "Generate AI Workout Plan" to start
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">AI-Generated Workout Plans</h2>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    Optimized for glucose control
                  </Badge>
                </div>

                <div className="grid gap-6">
                  {generatedPlans.map((plan) => (
                    <Card key={plan.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center space-x-2">
                              <span>{plan.name}</span>
                              <Badge variant="secondary" className={getDifficultyColor(plan.difficulty)}>
                                {plan.difficulty}
                              </Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center space-x-4 mt-2">
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{plan.duration} min</span>
                              </span>
                              <span>{plan.totalCalories} calories</span>
                              <div className="flex space-x-1">
                                {plan.focus.map((focus) => (
                                  <Badge key={focus} variant="secondary" className="text-xs">
                                    {focus}
                                  </Badge>
                                ))}
                              </div>
                            </CardDescription>
                          </div>
                          <Button
                            variant={selectedPlan?.id === plan.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedPlan(selectedPlan?.id === plan.id ? null : plan)}
                            className={selectedPlan?.id !== plan.id ? "bg-transparent" : ""}
                          >
                            {selectedPlan?.id === plan.id ? "Hide Details" : "View Details"}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Exercises ({plan.exercises.length})</h4>
                            <div className="grid gap-2">
                              {plan.exercises.map((exercise) => (
                                <div
                                  key={exercise.id}
                                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                    <span className="font-medium text-sm">{exercise.name}</span>
                                    <Badge
                                      variant="secondary"
                                      className={getIntensityColor(exercise.intensity)}
                                      size="sm"
                                    >
                                      {exercise.intensity}
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {exercise.duration} min • {exercise.caloriesBurned} cal
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {selectedPlan?.id === plan.id && (
                            <div className="space-y-4 border-t pt-4">
                              <h4 className="font-medium">Detailed Exercise Instructions</h4>
                              {plan.exercises.map((exercise) => (
                                <Card key={exercise.id} className="bg-gray-50">
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center justify-between">
                                      <span>{exercise.name}</span>
                                      <div className="flex items-center space-x-2">
                                        <Badge variant="secondary" className="text-xs capitalize">
                                          {exercise.type}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">
                                          -{exercise.glucoseImpact} mg/dL
                                        </Badge>
                                      </div>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <div>
                                      <h5 className="font-medium text-sm mb-1">Instructions:</h5>
                                      <ul className="text-sm text-gray-600 space-y-1">
                                        {exercise.instructions.map((instruction, index) => (
                                          <li key={index}>• {instruction}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    {exercise.modifications.length > 0 && (
                                      <div>
                                        <h5 className="font-medium text-sm mb-1">Modifications:</h5>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                          {exercise.modifications.map((modification, index) => (
                                            <li key={index}>• {modification}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    <div>
                                      <h5 className="font-medium text-sm mb-1">Benefits:</h5>
                                      <ul className="text-sm text-gray-600 space-y-1">
                                        {exercise.benefits.map((benefit, index) => (
                                          <li key={index}>• {benefit}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                              <div className="flex space-x-2">
                                <Button className="flex-1">
                                  <Play className="h-4 w-4 mr-2" />
                                  Start Workout
                                </Button>
                                <Button variant="outline" className="flex-1 bg-transparent">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Save to My Plans
                                </Button>
                              </div>
                            </div>
                          )}
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
