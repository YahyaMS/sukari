"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Activity } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { GamificationService } from "@/lib/gamification"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"

const mockGlucoseData = [
  { time: "6:00", value: 95, category: "fasting" },
  { time: "8:00", value: 140, category: "post-meal" },
  { time: "12:00", value: 110, category: "pre-meal" },
  { time: "14:00", value: 165, category: "post-meal" },
  { time: "18:00", value: 120, category: "pre-meal" },
  { time: "20:00", value: 145, category: "post-meal" },
]

const symptoms = [
  "Fatigue",
  "Thirsty",
  "Frequent urination",
  "Blurred vision",
  "Headache",
  "Dizziness",
  "Nausea",
  "Shaky/Jittery",
]

export default function GlucoseTrackingPage() {
  const [glucoseValue, setGlucoseValue] = useState("")
  const [category, setCategory] = useState("")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClientComponentClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("Please log in to track glucose")
        setIsLoading(false)
        return
      }

      // Save glucose reading to database
      const { error: insertError } = await supabase.from("glucose_readings").insert({
        user_id: user.id,
        value: Number.parseInt(glucoseValue),
        category: category,
        symptoms: selectedSymptoms,
        notes: notes,
        timestamp: new Date().toISOString(),
      })

      if (insertError) {
        console.error("Error saving glucose reading:", insertError)
        // Continue with HP awarding even if database save fails
      }

      // Award HP for glucose tracking
      const gamificationService = new GamificationService()
      const hpAwarded = await gamificationService.awardHealthPointsFallback(
        user.id,
        10,
        "glucose_tracking",
        "Logged glucose reading",
      )

      // Reset form
      setGlucoseValue("")
      setCategory("")
      setSelectedSymptoms([])
      setNotes("")

      if (hpAwarded) {
        toast.success("Glucose reading saved! +10 HP earned 🎉")
      } else {
        toast.success("Glucose reading saved successfully!")
      }

      // Refresh the page to update HP display
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error("Error in glucose tracking:", error)
      toast.error("Failed to save glucose reading")
    } finally {
      setIsLoading(false)
    }
  }

  const getGlucoseStatus = (value: number) => {
    if (value < 70) return { status: "Low", color: "text-red-600", bg: "bg-red-50" }
    if (value <= 140) return { status: "Normal", color: "text-green-600", bg: "bg-green-50" }
    if (value <= 180) return { status: "High", color: "text-orange-600", bg: "bg-orange-50" }
    return { status: "Very High", color: "text-red-600", bg: "bg-red-50" }
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
              <Activity className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Glucose Tracking</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Glucose Entry Form */}
          <Card>
            <CardHeader>
              <CardTitle>Log Glucose Reading</CardTitle>
              <CardDescription>Enter your current blood glucose measurement</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="glucose">Glucose Level (mg/dL)</Label>
                  <Input
                    id="glucose"
                    type="number"
                    placeholder="Enter glucose value"
                    value={glucoseValue}
                    onChange={(e) => setGlucoseValue(e.target.value)}
                    className="text-2xl font-bold text-center h-16"
                    required
                  />
                  {glucoseValue && (
                    <div className="text-center">
                      <Badge
                        className={`${getGlucoseStatus(Number(glucoseValue)).bg} ${getGlucoseStatus(Number(glucoseValue)).color} border-0`}
                      >
                        {getGlucoseStatus(Number(glucoseValue)).status}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Reading Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select when you took this reading" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fasting">Fasting (8+ hours)</SelectItem>
                      <SelectItem value="pre-meal">Before Meal</SelectItem>
                      <SelectItem value="post-meal">After Meal (2 hours)</SelectItem>
                      <SelectItem value="bedtime">Bedtime</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Symptoms (if any)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {symptoms.map((symptom) => (
                      <div key={symptom} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom}
                          checked={selectedSymptoms.includes(symptom)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSymptoms([...selectedSymptoms, symptom])
                            } else {
                              setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom))
                            }
                          }}
                        />
                        <Label htmlFor={symptom} className="text-sm">
                          {symptom}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional notes about this reading..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Reading"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Today's Trend */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Glucose Trend</CardTitle>
                <CardDescription>Your glucose readings throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockGlucoseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={[60, 200]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Readings</CardTitle>
                <CardDescription>Your last few glucose measurements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockGlucoseData
                  .slice(-4)
                  .reverse()
                  .map((reading, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{reading.time}</p>
                        <p className="text-sm text-gray-600 capitalize">{reading.category.replace("-", " ")}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{reading.value} mg/dL</p>
                        <Badge
                          variant="secondary"
                          className={`${getGlucoseStatus(reading.value).bg} ${getGlucoseStatus(reading.value).color} border-0`}
                        >
                          {getGlucoseStatus(reading.value).status}
                        </Badge>
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
