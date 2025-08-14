import { type NextRequest, NextResponse } from "next/server"
import { MealPlanningRefeedingService } from "@/lib/meal-planning-refeeding"

export async function POST(request: NextRequest) {
  try {
    const { fastingDuration, fastingType, userProfile } = await request.json()

    if (!fastingDuration || !fastingType) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const mealService = MealPlanningRefeedingService.getInstance()

    const refeedingPlan = await mealService.generateRefeedingPlan(
      fastingDuration,
      fastingType,
      userProfile || {
        weight: 150,
        height: 68,
        age: 35,
        activityLevel: "moderate",
        diabetesType: "type2",
        medications: [],
        allergies: [],
        preferences: [],
      },
    )

    return NextResponse.json({ refeedingPlan })
  } catch (error) {
    console.error("Error generating refeeding plan:", error)
    return NextResponse.json({ error: "Failed to generate refeeding plan" }, { status: 500 })
  }
}
