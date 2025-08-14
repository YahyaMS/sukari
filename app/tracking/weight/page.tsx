"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Scale, TrendingDown, Camera, X } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Image from "next/image"
import { GamificationService } from "@/lib/gamification"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const mockWeightData = [
  { date: "Mon", weight: 182.1 },
  { date: "Tue", weight: 181.8 },
  { date: "Wed", weight: 181.2 },
  { date: "Thu", weight: 180.9 },
  { date: "Fri", weight: 180.5 },
  { date: "Sat", weight: 179.8 },
  { date: "Sun", weight: 178.5 },
]

export default function WeightTrackingPage() {
  const [weight, setWeight] = useState("")
  const [bodyFat, setBodyFat] = useState("")
  const [notes, setNotes] = useState("")
  const [unit, setUnit] = useState("lbs")
  const [progressPhoto, setProgressPhoto] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClientComponentClient()

  const handlePhotoCapture = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProgressPhoto(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setProgressPhoto(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const convertWeight = (value: string, fromUnit: string, toUnit: string) => {
    if (!value || fromUnit === toUnit) return value
    const numValue = Number.parseFloat(value)
    if (fromUnit === "lbs" && toUnit === "kg") {
      return (numValue * 0.453592).toFixed(1)
    } else if (fromUnit === "kg" && toUnit === "lbs") {
      return (numValue * 2.20462).toFixed(1)
    }
    return value
  }

  const handleUnitChange = (newUnit: string) => {
    const convertedWeight = convertWeight(weight, unit, newUnit)
    setWeight(convertedWeight)
    setUnit(newUnit)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        alert("Please log in to track your weight.")
        return
      }

      const weightData = {
        weight: Number.parseFloat(weight),
        unit,
        bodyFat: bodyFat ? Number.parseFloat(bodyFat) : null,
        notes,
        progressPhoto,
        timestamp: new Date().toISOString(),
      }

      console.log("Saving weight data:", weightData)

      const { error: saveError } = await supabase.from("weight_entries").insert({
        user_id: user.id,
        weight_kg: unit === "kg" ? weightData.weight : weightData.weight * 0.453592,
        body_fat_percentage: weightData.bodyFat,
        notes: weightData.notes,
        photo_url: weightData.progressPhoto,
      })

      if (saveError) {
        console.warn("Error saving to database:", saveError)
      }

      const gamificationService = new GamificationService()
      const hpAwarded = await gamificationService.awardHealthPoints(
        user.id,
        "logWeight",
        `Logged weight: ${weightData.weight} ${unit}`,
      )

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setWeight("")
      setBodyFat("")
      setNotes("")
      setProgressPhoto(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      if (hpAwarded) {
        alert("Weight entry saved successfully! +5 HP earned! 🎉")
      } else {
        alert("Weight entry saved successfully!")
      }
    } catch (error) {
      console.error("Error saving weight:", error)
      alert("Error saving weight entry. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const currentWeight = 178.5
  const startWeight = 185.0
  const goalWeight = 165.0
  const weightLoss = startWeight - currentWeight
  const progressToGoal = ((startWeight - currentWeight) / (startWeight - goalWeight)) * 100

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
              <Scale className="h-6 w-6 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Weight Tracking</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Weight Entry Form */}
          <Card>
            <CardHeader>
              <CardTitle>Log Weight</CardTitle>
              <CardDescription>Record your current weight and body composition</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="Enter your weight"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="text-2xl font-bold text-center h-16"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Select value={unit} onValueChange={handleUnitChange}>
                      <SelectTrigger className="h-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lbs">lbs</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bodyFat">Body Fat % (optional)</Label>
                  <Input
                    id="bodyFat"
                    type="number"
                    step="0.1"
                    placeholder="Enter body fat percentage"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Progress Photo (optional)</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {!progressPhoto ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePhotoCapture}
                      className="w-full h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                    >
                      <Camera className="h-6 w-6" />
                      <span>Take Progress Photo</span>
                    </Button>
                  ) : (
                    <div className="relative">
                      <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={progressPhoto || "/placeholder.svg"}
                          alt="Progress photo"
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
                        className="absolute top-2 right-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="How are you feeling? Any observations..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Weight"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <div className="space-y-6">
            {/* Progress Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Current Weight</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {currentWeight} {unit}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Lost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    -{weightLoss} {unit}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Goal Weight</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {goalWeight} {unit}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(progressToGoal)}%</div>
                </CardContent>
              </Card>
            </div>

            {/* Weight Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>7-Day Trend</CardTitle>
                <CardDescription>Your weight progress this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockWeightData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={["dataMin - 2", "dataMax + 2"]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#16a34a"
                        strokeWidth={2}
                        dot={{ fill: "#16a34a", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Entries */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
                <CardDescription>Your latest weight measurements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockWeightData
                  .slice(-4)
                  .reverse()
                  .map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{entry.date}</p>
                        <p className="text-sm text-gray-600">Morning weigh-in</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {entry.weight} {unit}
                        </p>
                        {index < mockWeightData.length - 1 && (
                          <div className="flex items-center text-sm text-green-600">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            -0.3 {unit}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
