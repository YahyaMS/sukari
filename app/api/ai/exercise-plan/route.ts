import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { google } from "@ai-sdk/google"

const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fitnessLevel, timeAvailable, equipment, goals, limitations } = body

    const prompt = `As a diabetes exercise specialist, create personalized workout plans with these requirements:
    - Fitness level: ${fitnessLevel}
    - Time available: ${timeAvailable} minutes
    - Available equipment: ${equipment.join(", ") || "bodyweight only"}
    - Health goals: ${goals.join(", ")}
    - Physical limitations: ${limitations.join(", ") || "none"}
    
    Generate 2-3 workout plans optimized for glucose control in JSON format:
    {
      "workoutPlans": [
        {
          "id": "unique_id",
          "name": "workout name",
          "duration": number_in_minutes,
          "difficulty": "Beginner/Intermediate/Advanced",
          "focus": ["focus area 1", "focus area 2"],
          "totalCalories": number,
          "exercises": [
            {
              "id": "exercise_id",
              "name": "exercise name",
              "type": "cardio/strength/flexibility/balance",
              "duration": number_in_minutes,
              "intensity": "Low/Moderate/High",
              "caloriesBurned": number,
              "glucoseImpact": number_negative_for_reduction,
              "equipment": ["equipment needed"],
              "instructions": ["step 1", "step 2"],
              "modifications": ["modification 1"],
              "benefits": ["benefit 1", "benefit 2"]
            }
          ]
        }
      ]
    }
    
    Focus on exercises that improve insulin sensitivity and glucose control. Include glucose impact estimates.`

    const model = process.env.DEEPSEEK_API_KEY ? deepseek("deepseek-chat") : google("gemini-1.5-flash")

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.7,
    })

    let workoutPlans
    try {
      workoutPlans = JSON.parse(text)
    } catch (parseError) {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 })
    }

    return NextResponse.json(workoutPlans)
  } catch (error) {
    console.error("AI exercise planning error:", error)
    return NextResponse.json({ error: "Failed to generate workout plan" }, { status: 500 })
  }
}
