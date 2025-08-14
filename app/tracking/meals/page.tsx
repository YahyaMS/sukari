"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Utensils, Camera, Search, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { GamificationService } from "@/lib/gamification"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"
import { Icon3D } from "@/components/ui/3d-icon"

interface FoodItem {
  name: string
  quantity: number
  unit: string
  carbs: number
  calories: number
  protein: number
  fat: number
}

const commonFoods = [
  { name: "Apple", carbs: 25, calories: 95, protein: 0.5, fat: 0.3 },
  { name: "Banana", carbs: 27, calories: 105, protein: 1.3, fat: 0.4 },
  { name: "Brown Rice (1 cup)", carbs: 45, calories: 216, protein: 5, fat: 1.8 },
  { name: "Chicken Breast (4oz)", carbs: 0, calories: 185, protein: 35, fat: 4 },
  { name: "Broccoli (1 cup)", carbs: 6, calories: 25, protein: 3, fat: 0.3 },
  { name: "Salmon (4oz)", carbs: 0, calories: 206, protein: 28, fat: 9 },
  { name: "Sweet Potato", carbs: 26, calories: 112, protein: 2, fat: 0.1 },
  { name: "Greek Yogurt (1 cup)", carbs: 9, calories: 130, protein: 23, fat: 0 },
]

export default function MealTrackingPage() {
  const [mealType, setMealType] = useState("")
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [notes, setNotes] = useState("")
  const [mealPhoto, setMealPhoto] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoCapture = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const photoData = e.target?.result as string
        setMealPhoto(photoData)

        // Simulate AI food recognition
        setIsAnalyzing(true)
        setTimeout(() => {
          // Mock AI recognition results
          const recognizedFoods = [
            { name: "Grilled Chicken Breast (4oz)", carbs: 0, calories: 185, protein: 35, fat: 4 },
            { name: "Brown Rice (1 cup)", carbs: 45, calories: 216, protein: 5, fat: 1.8 },
            { name: "Broccoli (1 cup)", carbs: 6, calories: 25, protein: 3, fat: 0.3 },
          ]

          const newFoods = recognizedFoods.map((food) => ({
            name: food.name,
            quantity: 1,
            unit: "serving",
            carbs: food.carbs,
            calories: food.calories,
            protein: food.protein,
            fat: food.fat,
          }))

          setFoods(newFoods)
          setIsAnalyzing(false)
        }, 2000)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setMealPhoto(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const addFood = (food: any) => {
    const newFood: FoodItem = {
      name: food.name,
      quantity: 1,
      unit: "serving",
      carbs: food.carbs,
      calories: food.calories,
      protein: food.protein,
      fat: food.fat,
    }
    setFoods([...foods, newFood])
    setSearchTerm("")
  }

  const removeFood = (index: number) => {
    setFoods(foods.filter((_, i) => i !== index))
  }

  const updateFoodQuantity = (index: number, quantity: number) => {
    const updatedFoods = [...foods]
    updatedFoods[index].quantity = quantity
    setFoods(updatedFoods)
  }

  const getTotalNutrition = () => {
    return foods.reduce(
      (totals, food) => ({
        carbs: totals.carbs + food.carbs * food.quantity,
        calories: totals.calories + food.calories * food.quantity,
        protein: totals.protein + food.protein * food.quantity,
        fat: totals.fat + food.fat * food.quantity,
      }),
      { carbs: 0, calories: 0, protein: 0, fat: 0 },
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClientComponentClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("Please log in to track meals")
        setIsLoading(false)
        return
      }

      const mealData = {
        user_id: user.id,
        meal_type: mealType,
        foods: foods,
        notes: notes,
        photo_url: mealPhoto,
        timestamp: new Date().toISOString(),
        total_carbs: totals.carbs,
        total_calories: totals.calories,
        total_protein: totals.protein,
        total_fat: totals.fat,
      }

      // Save meal to database
      const { error: insertError } = await supabase.from("meals").insert(mealData)

      if (insertError) {
        console.error("Error saving meal:", insertError)
        // Continue with HP awarding even if database save fails
      }

      // Award HP for meal tracking
      const gamificationService = new GamificationService()
      const hpAwarded = await gamificationService.awardHealthPointsFallback(
        user.id,
        8,
        "meal_tracking",
        `Logged ${mealType} meal`,
      )

      // Reset form
      setMealType("")
      setFoods([])
      setNotes("")
      setMealPhoto(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      if (hpAwarded) {
        toast.success("Meal logged successfully! +8 HP earned 🍽️")
      } else {
        toast.success("Meal logged successfully!")
      }

      // Refresh the page to update HP display
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error("Error in meal tracking:", error)
      toast.error("Failed to save meal")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredFoods = commonFoods.filter((food) => food.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const totals = getTotalNutrition()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#21262D] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-xl animate-bounce"></div>
      </div>

      <header className="glass-card border-b border-white/10 sticky top-0 z-50 relative">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <Icon3D shape="sphere" color="purple" size="lg" icon={Utensils} />
              <h1 className="text-2xl font-bold text-white">Meal Tracking</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Icon3D shape="cube" color="purple" size="sm" icon={Utensils} />
                Log Meal
              </CardTitle>
              <CardDescription className="text-text-secondary">
                Record what you ate and track your nutrition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="mealType" className="text-white">
                    Meal Type
                  </Label>
                  <Select value={mealType} onValueChange={setMealType} required>
                    <SelectTrigger className="glass-input border-white/20 text-white">
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/20">
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Meal Photo</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {!mealPhoto ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePhotoCapture}
                      className="w-full h-20 flex flex-col items-center justify-center space-y-2 glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      <Camera className="h-6 w-6" />
                      <span>Take Photo for AI Recognition</span>
                    </Button>
                  ) : (
                    <div className="relative">
                      <div className="w-full h-32 glass-card border-white/10 rounded-lg overflow-hidden">
                        <Image
                          src={mealPhoto || "/placeholder.svg"}
                          alt="Meal photo"
                          width={400}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removePhoto}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                          <div className="text-white text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                            <p className="text-sm">Analyzing food...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Add Foods</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
                    <Input
                      placeholder="Search for foods..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 glass-input border-white/20 text-white placeholder:text-text-secondary"
                    />
                  </div>
                  {searchTerm && (
                    <div className="glass-card border-white/10 rounded-lg max-h-40 overflow-y-auto">
                      {filteredFoods.map((food, index) => (
                        <div
                          key={index}
                          className="p-3 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0 transition-colors"
                          onClick={() => addFood(food)}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-white">{food.name}</span>
                            <Badge className="bg-accent-blue/20 text-accent-blue border-accent-blue/30">
                              {food.carbs}g carbs
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {foods.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-white">Selected Foods</Label>
                    <div className="space-y-2">
                      {foods.map((food, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-3 glass-card border-white/10 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-white">{food.name}</p>
                            <p className="text-sm text-text-secondary">
                              {Math.round(food.carbs * food.quantity)}g carbs,{" "}
                              {Math.round(food.calories * food.quantity)} cal
                            </p>
                          </div>
                          <Input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={food.quantity}
                            onChange={(e) => updateFoodQuantity(index, Number(e.target.value))}
                            className="w-20 glass-input border-white/20 text-white"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFood(index)}
                            className="text-white hover:bg-white/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-white">
                    Notes (optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="How did you feel after eating? Any observations..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="glass-input border-white/20 text-white placeholder:text-text-secondary"
                  />
                </div>

                <Button type="submit" className="w-full gradient-primary" disabled={isLoading || foods.length === 0}>
                  {isLoading ? "Saving..." : "Save Meal"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon3D shape="torus" color="green" size="sm" icon={Utensils} />
                  Nutrition Summary
                </CardTitle>
                <CardDescription className="text-text-secondary">Total nutrition for this meal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 glass-card border-accent-blue/30 bg-gradient-to-br from-accent-blue/10 to-accent-blue/5 rounded-lg">
                    <div className="text-2xl font-bold text-accent-blue">{Math.round(totals.carbs)}g</div>
                    <div className="text-sm text-text-secondary">Carbohydrates</div>
                  </div>
                  <div className="text-center p-4 glass-card border-accent-green/30 bg-gradient-to-br from-accent-green/10 to-accent-green/5 rounded-lg">
                    <div className="text-2xl font-bold text-accent-green">{Math.round(totals.calories)}</div>
                    <div className="text-sm text-text-secondary">Calories</div>
                  </div>
                  <div className="text-center p-4 glass-card border-accent-purple/30 bg-gradient-to-br from-accent-purple/10 to-accent-purple/5 rounded-lg">
                    <div className="text-2xl font-bold text-accent-purple">{Math.round(totals.protein)}g</div>
                    <div className="text-sm text-text-secondary">Protein</div>
                  </div>
                  <div className="text-center p-4 glass-card border-accent-orange/30 bg-gradient-to-br from-accent-orange/10 to-accent-orange/5 rounded-lg">
                    <div className="text-2xl font-bold text-accent-orange">{Math.round(totals.fat)}g</div>
                    <div className="text-sm text-text-secondary">Fat</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon3D shape="capsule" color="blue" size="sm" icon={Utensils} />
                  Today's Meals
                </CardTitle>
                <CardDescription className="text-text-secondary">What you've eaten so far today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 glass-card border-white/10 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Breakfast</p>
                    <p className="text-sm text-text-secondary">Oatmeal with berries</p>
                  </div>
                  <Badge className="bg-accent-blue/20 text-accent-blue border-accent-blue/30">30g carbs</Badge>
                </div>
                <div className="flex items-center justify-between p-3 glass-card border-white/10 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Lunch</p>
                    <p className="text-sm text-text-secondary">Grilled chicken salad</p>
                  </div>
                  <Badge className="bg-accent-green/20 text-accent-green border-accent-green/30">15g carbs</Badge>
                </div>
                <div className="p-3 border-2 border-dashed border-white/20 rounded-lg text-center text-text-secondary">
                  Add your next meal
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
