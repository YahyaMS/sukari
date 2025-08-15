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

    const model = process.env.DEEPSEEK_API_KEY ? deepseek("deepseek-chat") : google("gemini-1.5-flash")

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.6,
      maxOutputTokens: 800,
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
