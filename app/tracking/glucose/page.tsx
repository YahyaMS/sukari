"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle, ElevatedCard } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Icon3D } from "@/components/ui/3d-icon"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { GamificationService } from "@/lib/gamification"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"

interface GlucoseReading {
  id: string
  value: number
  category: string
  symptoms: string[]
  notes: string
  timestamp: string
}

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
  const [readings, setReadings] = useState<GlucoseReading[]>([])
  const [isLoadingReadings, setIsLoadingReadings] = useState(true)

  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchGlucoseReadings()
  }, [])

  const fetchGlucoseReadings = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from("glucose_readings")
        .select("*")
        .eq("user_id", user.id)
        .order("timestamp", { ascending: false })
        .limit(20)

      if (error) {
        console.error("Error fetching glucose readings:", error)
        return
      }

      setReadings(data || [])
    } catch (error) {
      console.error("Error fetching glucose readings:", error)
    } finally {
      setIsLoadingReadings(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
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
        toast.error("Failed to save glucose reading")
        setIsLoading(false)
        return
      }

      // Award HP for glucose tracking
      const gamificationService = new GamificationService()
      await gamificationService.awardHealthPoints(user.id, "logGlucose", "Logged glucose reading")

      // Reset form
      setGlucoseValue("")
      setCategory("")
      setSelectedSymptoms([])
      setNotes("")

      toast.success("Glucose reading saved! +10 HP earned 🎉")

      // Refresh readings
      await fetchGlucoseReadings()
    } catch (error) {
      console.error("Error in glucose tracking:", error)
      toast.error("Failed to save glucose reading")
    } finally {
      setIsLoading(false)
    }
  }

  const getGlucoseStatus = (value: number) => {
    if (value < 70) return { status: "Low", color: "text-red-400", bg: "bg-red-500/20" }
    if (value <= 140) return { status: "Normal", color: "text-green-400", bg: "bg-green-500/20" }
    if (value <= 180) return { status: "High", color: "text-orange-400", bg: "bg-orange-500/20" }
    return { status: "Very High", color: "text-red-400", bg: "bg-red-500/20" }
  }

  // Prepare chart data from real readings
  const todayReadings = readings.filter((reading) => {
    const today = new Date().toDateString()
    const readingDate = new Date(reading.timestamp).toDateString()
    return today === readingDate
  })

  const chartData = todayReadings
    .map((reading) => ({
      time: new Date(reading.timestamp).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      }),
      value: reading.value,
      category: reading.category,
      timestamp: reading.timestamp,
    }))
    .reverse() // Show chronological order

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
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <Icon3D shape="sphere" color="blue" size="lg" glow />
              <h1 className="text-2xl font-bold text-white">Glucose Tracking</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8">
          <ElevatedCard className="glass-card border-white/10 hover:border-white/20 transition-all duration-300 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Icon3D shape="sphere" color="blue" size="md" />
                Log Glucose Reading
              </CardTitle>
              <CardDescription className="text-text-secondary">
                Enter your current blood glucose measurement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="glucose" className="text-white font-medium">
                    Glucose Level (mg/dL)
                  </Label>
                  <Input
                    id="glucose"
                    type="number"
                    placeholder="Enter glucose value"
                    value={glucoseValue}
                    onChange={(e) => setGlucoseValue(e.target.value)}
                    className="text-3xl font-bold text-center h-20 glass-input border-white/20 text-white placeholder:text-text-secondary"
                    required
                  />
                  {glucoseValue && (
                    <div className="text-center">
                      <Badge
                        className={`${getGlucoseStatus(Number(glucoseValue)).bg} ${getGlucoseStatus(Number(glucoseValue)).color} border-0 px-4 py-2 text-sm font-semibold`}
                      >
                        {getGlucoseStatus(Number(glucoseValue)).status}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="category" className="text-white font-medium">
                    Reading Category
                  </Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger className="glass-input border-white/20 text-white">
                      <SelectValue placeholder="Select when you took this reading" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/20">
                      <SelectItem value="fasting">Fasting (8+ hours)</SelectItem>
                      <SelectItem value="pre-meal">Before Meal</SelectItem>
                      <SelectItem value="post-meal">After Meal (2 hours)</SelectItem>
                      <SelectItem value="bedtime">Bedtime</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-white font-medium">Symptoms (if any)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {symptoms.map((symptom) => (
                      <div
                        key={symptom}
                        className="flex items-center space-x-3 glass-card border-white/10 p-3 rounded-xl"
                      >
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
                          className="border-white/30"
                        />
                        <Label htmlFor={symptom} className="text-sm text-text-secondary">
                          {symptom}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="notes" className="text-white font-medium">
                    Notes (optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional notes about this reading..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="glass-input border-white/20 text-white placeholder:text-text-secondary"
                  />
                </div>

                <Button type="submit" className="w-full gradient-primary" size="lg" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Reading"}
                  <Icon3D shape="sphere" color="white" size="sm" className="ml-2" />
                </Button>
              </form>
            </CardContent>
          </ElevatedCard>

          <div className="space-y-6">
            <ElevatedCard className="glass-card border-white/10 hover:border-white/20 transition-all duration-300 animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Icon3D shape="cube" color="blue" size="md" />
                  Today's Glucose Trend
                </CardTitle>
                <CardDescription className="text-text-secondary">
                  Your glucose readings throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="time" stroke="#94A3B8" />
                        <YAxis domain={[60, 200]} stroke="#94A3B8" />
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
                          dataKey="value"
                          stroke="#3B82F6"
                          strokeWidth={3}
                          dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, fill: "#8B5CF6" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <Icon3D shape="sphere" color="blue" size="lg" className="mx-auto mb-4" />
                      <h3 className="text-white font-medium mb-2">No readings today</h3>
                      <p className="text-text-secondary text-sm">
                        Log your first glucose reading to see your daily trend
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </ElevatedCard>

            <ElevatedCard className="glass-card border-white/10 hover:border-white/20 transition-all duration-300 animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <Icon3D shape="torus" color="green" size="md" />
                  Recent Readings
                </CardTitle>
                <CardDescription className="text-text-secondary">Your last few glucose measurements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingReadings ? (
                  <div className="text-center py-8">
                    <p className="text-text-secondary">Loading your readings...</p>
                  </div>
                ) : readings.length > 0 ? (
                  readings.slice(0, 4).map((reading) => (
                    <div
                      key={reading.id}
                      className="flex items-center justify-between p-4 glass-card border-white/10 rounded-xl hover-lift transition-smooth"
                    >
                      <div className="flex items-center gap-3">
                        <Icon3D shape="sphere" color="blue" size="sm" />
                        <div>
                          <p className="font-semibold text-white">
                            {new Date(reading.timestamp).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                          <p className="text-sm text-text-secondary capitalize">{reading.category.replace("-", " ")}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-white">{reading.value} mg/dL</p>
                        <Badge
                          className={`${getGlucoseStatus(reading.value).bg} ${getGlucoseStatus(reading.value).color} border-0 mt-1`}
                        >
                          {getGlucoseStatus(reading.value).status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Icon3D shape="sphere" color="blue" size="lg" className="mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">No readings yet</h3>
                    <p className="text-text-secondary text-sm mb-4">
                      Start tracking your glucose levels to see your progress and earn Health Points
                    </p>
                    <Badge className="bg-accent-blue/20 text-accent-blue border-accent-blue/30">
                      +10 HP per reading
                    </Badge>
                  </div>
                )}
              </CardContent>
            </ElevatedCard>
          </div>
        </div>
      </main>
    </div>
  )
}
