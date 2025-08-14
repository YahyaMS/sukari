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
    const { glucoseData, weightData, exerciseData, mealData, sleepData } = body

    const prompt = `As a diabetes data analyst, analyze this health data and provide insights:
    
    Glucose readings: ${JSON.stringify(glucoseData?.slice(-10) || [])}
    Weight entries: ${JSON.stringify(weightData?.slice(-5) || [])}
    Exercise sessions: ${JSON.stringify(exerciseData?.slice(-5) || [])}
    Recent meals: ${JSON.stringify(mealData?.slice(-5) || [])}
    Sleep data: ${JSON.stringify(sleepData?.slice(-5) || [])}
    
    Generate personalized health insights in JSON format:
    {
      "insights": [
        {
          "id": "unique_id",
          "type": "pattern/correlation/prediction/anomaly",
          "priority": "high/medium/low",
          "title": "insight title",
          "description": "detailed description",
          "impact": "High/Medium/Low",
          "confidence": number_0_to_100,
          "actionable": boolean,
          "recommendation": "specific actionable advice",
          "data": "supporting data description"
        }
      ],
      "riskFactors": [
        {
          "factor": "risk factor name",
          "risk": "Low/Medium/High",
          "score": number_0_to_100,
          "trend": "improving/stable/declining",
          "description": "brief description"
        }
      ],
      "predictions": {
        "hba1c": {
          "predicted": number,
          "confidence": number_0_to_100,
          "timeframe": "timeframe description"
        },
        "weight": {
          "predicted": number,
          "confidence": number_0_to_100,
          "timeframe": "timeframe description"
        }
      }
    }
    
    Focus on actionable insights for diabetes management and glucose control.`

    const { text } = await generateText({
      model: deepseek("deepseek-chat"),
      prompt,
      temperature: 0.5,
    })

    let healthInsights
    try {
      healthInsights = JSON.parse(text)
    } catch (parseError) {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 })
    }

    return NextResponse.json(healthInsights)
  } catch (error) {
    console.error("AI health insights error:", error)
    return NextResponse.json({ error: "Failed to generate health insights" }, { status: 500 })
  }
}
