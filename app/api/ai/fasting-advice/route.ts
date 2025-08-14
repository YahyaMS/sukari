import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

const deepseek = createOpenAI({
  apiKey: "sk-672c9c6817334df590f21e0aa2d9fb0f",
  baseURL: "https://api.deepseek.com/v1",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fastingType, currentGlucose, timeIntoFast, symptoms, previousSessions } = body

    const prompt = `As a diabetes and intermittent fasting expert, provide personalized advice for:
    - Fasting type: ${fastingType}
    - Current glucose: ${currentGlucose || "not provided"} mg/dL
    - Time into fast: ${timeIntoFast || 0} hours
    - Current symptoms: ${symptoms?.join(", ") || "none"}
    - Previous sessions: ${previousSessions || 0} completed
    
    Provide advice in JSON format:
    {
      "advice": {
        "status": "continue/modify/stop",
        "message": "main advice message",
        "tips": ["tip 1", "tip 2", "tip 3"],
        "warnings": ["warning if any"],
        "nextSteps": ["action 1", "action 2"],
        "glucoseGuidance": "specific glucose monitoring advice",
        "hydrationReminder": "hydration advice",
        "breakingFastAdvice": "when and how to break fast if needed"
      }
    }
    
    Focus on safety for diabetic patients and glucose management during fasting.`

    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      prompt,
      temperature: 0.6,
    })

    let fastingAdvice
    try {
      fastingAdvice = JSON.parse(text)
    } catch (parseError) {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 })
    }

    return NextResponse.json(fastingAdvice)
  } catch (error) {
    console.error("AI fasting advice error:", error)
    return NextResponse.json({ error: "Failed to generate fasting advice" }, { status: 500 })
  }
}
