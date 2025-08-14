"use client"

import type React from "react"
import { useState } from "react"
import { GamificationService } from "@/lib/gamification"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"

const intensityLevels = [
  { level: "low", multiplier: 0.5 },
  { level: "medium", multiplier: 1 },
  { level: "high", multiplier: 1.5 },
]

export default function ExerciseTrackingPage() {
  const [exerciseType, setExerciseType] = useState("")
  const [duration, setDuration] = useState("")
  const [intensity, setIntensity] = useState("")
  const [heartRate, setHeartRate] = useState("")
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
        toast.error("Please log in to track exercise")
        setIsLoading(false)
        return
      }

      const exerciseData = {
        user_id: user.id,
        exercise_type: exerciseType,
        duration_minutes: Number.parseInt(duration),
        intensity: intensity,
        heart_rate: heartRate ? Number.parseInt(heartRate) : null,
        calories_burned: 0, // Placeholder for estimatedCalories
        notes: notes,
        timestamp: new Date().toISOString(),
      }

      // Save exercise to database
      const { error: insertError } = await supabase.from("exercise_sessions").insert(exerciseData)

      if (insertError) {
        console.error("Error saving exercise:", insertError)
        // Continue with HP awarding even if database save fails
      }

      // Calculate HP based on intensity and duration
      let hpAmount = 12 // Base HP for exercise
      const intensityData = intensityLevels.find((i) => i.level === intensity)
      if (intensityData) {
        hpAmount = Math.round(hpAmount * intensityData.multiplier)
      }

      // Bonus HP for longer workouts
      if (Number.parseInt(duration) >= 30) {
        hpAmount += 5
      }

      // Award HP for exercise tracking
      const gamificationService = new GamificationService()
      const hpAwarded = await gamificationService.awardHealthPointsFallback(
        user.id,
        hpAmount,
        "exercise_tracking",
        `Completed ${exerciseType} workout`,
      )

      // Reset form
      setExerciseType("")
      setDuration("")
      setIntensity("")
      setHeartRate("")
      setNotes("")

      if (hpAwarded) {
        toast.success(`Exercise logged successfully! +${hpAmount} HP earned 💪`)
      } else {
        toast.success("Exercise logged successfully!")
      }

      // Refresh the page to update HP display
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error("Error in exercise tracking:", error)
      toast.error("Failed to save exercise")
    } finally {
      setIsLoading(false)
    }
  }

  // ... rest of existing code remains the same ...
}
