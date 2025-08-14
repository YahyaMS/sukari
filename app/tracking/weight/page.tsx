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
import { Icon3D } from "@/components/ui/3d-icon"

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
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#21262D] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-xl animate-bounce"></div>
      </div>

      <header className="glass-card border-b border-white/10 relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <Icon3D shape="sphere" color="green" size="lg" icon={Scale} />
              <h1 className="text-2xl font-bold text-white">Weight Tracking</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Icon3D shape="cube" color="green" size="sm" icon={Scale} />
                Log Weight
              </CardTitle>
              <CardDescription className="text-text-secondary">
                Record your current weight and body composition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="weight" className="text-white">
                      Weight
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="Enter your weight"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="text-2xl font-bold text-center h-16 glass-input border-white/20 text-white placeholder:text-text-secondary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Unit</Label>
                    <Select value={unit} onValueChange={handleUnitChange}>
                      <SelectTrigger className="h-16 glass-input border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-white/20">
                        <SelectItem value="lbs">lbs</SelectItem>
                        <SelectItem value="kg">kg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bodyFat" className="text-white">
                    Body Fat % (optional)
                  </Label>
                  <Input
                    id="bodyFat"
                    type="number"
                    step="0.1"
                    placeholder="Enter body fat percentage"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                    className="glass-input border-white/20 text-white placeholder:text-text-secondary"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Progress Photo (optional)</Label>
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
                      className="w-full h-20 flex flex-col items-center justify-center space-y-2 glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      <Camera className="h-6 w-6" />
                      <span>Take Progress Photo</span>
                    </Button>
                  ) : (
                    <div className="relative">
                      <div className="w-full h-32 glass-card border-white/10 rounded-lg overflow-hidden">
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
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-white">
                    Notes (optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="How are you feeling? Any observations..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="glass-input border-white/20 text-white placeholder:text-text-secondary"
                  />
                </div>

                <Button type="submit" className="w-full gradient-primary" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Weight"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="glass-card border-accent-blue/30 bg-gradient-to-br from-accent-blue/10 to-accent-blue/5 hover:border-accent-blue/50 transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white">Current Weight</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent-blue">
                    {currentWeight} {unit}
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-accent-green/30 bg-gradient-to-br from-accent-green/10 to-accent-green/5 hover:border-accent-green/50 transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white">Total Lost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent-green">
                    -{weightLoss} {unit}
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-accent-purple/30 bg-gradient-to-br from-accent-purple/10 to-accent-purple/5 hover:border-accent-purple/50 transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white">Goal Weight</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent-purple">
                    {goalWeight} {unit}
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-accent-orange/30 bg-gradient-to-br from-accent-orange/10 to-accent-orange/5 hover:border-accent-orange/50 transition-all duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white">Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent-orange">{Math.round(progressToGoal)}%</div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon3D shape="torus" color="green" size="sm" icon={TrendingDown} />
                  7-Day Trend
                </CardTitle>
                <CardDescription className="text-text-secondary">Your weight progress this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockWeightData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" stroke="#94A3B8" />
                      <YAxis domain={["dataMin - 2", "dataMax + 2"]} stroke="#94A3B8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          borderRadius: "12px",
                          backdropFilter: "blur(12px)",
                          color: "#FFFFFF",
                        }}
                      />
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

            <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon3D shape="capsule" color="blue" size="sm" icon={Scale} />
                  Recent Entries
                </CardTitle>
                <CardDescription className="text-text-secondary">Your latest weight measurements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockWeightData
                  .slice(-4)
                  .reverse()
                  .map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 glass-card border-white/10 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-white">{entry.date}</p>
                        <p className="text-sm text-text-secondary">Morning weigh-in</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-white">
                          {entry.weight} {unit}
                        </p>
                        {index < mockWeightData.length - 1 && (
                          <div className="flex items-center text-sm text-accent-green">
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
