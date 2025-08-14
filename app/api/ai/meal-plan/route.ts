import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

// Create DeepSeek client using OpenAI-compatible API
const deepseek = createOpenAI({
  apiKey: "sk-672c9c6817334df590f21e0aa2d9fb0f",
  baseURL: "https://api.deepseek.com/v1",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { targetCarbs, mealType, dietaryRestrictions, cookingTime, difficulty } = body

    const prompt = `As a diabetes nutrition expert, create a personalized meal plan with the following requirements:
    - Target carbs per meal: ${targetCarbs}g
    - Meal type: ${mealType || "any"}
    - Dietary restrictions: ${dietaryRestrictions.join(", ") || "none"}
    - Max cooking time: ${cookingTime || "30"} minutes
    - Difficulty level: ${difficulty || "medium"}
    
    Generate 3 meal suggestions in JSON format with this exact structure:
    {
      "meals": [
        {
          "id": "unique_id",
          "name": "meal name",
          "type": "breakfast/lunch/dinner/snack",
          "carbs": number,
          "calories": number,
          "protein": number,
          "fat": number,
          "fiber": number,
          "ingredients": ["ingredient 1", "ingredient 2"],
          "instructions": ["step 1", "step 2"],
          "prepTime": number_in_minutes,
          "difficulty": "Easy/Medium/Hard",
          "glucoseImpact": "Low/Medium/High"
        }
      ]
    }
    
    Focus on diabetes-friendly, low glycemic index foods. Ensure accurate nutritional calculations.`

    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      prompt,
      temperature: 0.7,
    })

    // Parse the AI response
    let mealPlan
    try {
      mealPlan = JSON.parse(text)
    } catch (parseError) {
      // If JSON parsing fails, return a structured error
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 })
    }

    return NextResponse.json(mealPlan)
  } catch (error) {
    console.error("AI meal planning error:", error)
    return NextResponse.json({ error: "Failed to generate meal plan" }, { status: 500 })
  }
}
