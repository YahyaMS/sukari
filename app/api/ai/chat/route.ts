import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { message, userId } = await req.json()

    // Get user profile for personalization
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, condition_type, goals")
      .eq("id", userId)
      .single()

    const userName = profile?.first_name || "there"
    const condition = profile?.condition_type || "diabetes"
    const goals = profile?.goals || []

    // Create empathetic system prompt based on brand voice
    const systemPrompt = `You are an empathetic AI health coach for MetaReverse, like a caring doctor who combines clinical expertise with genuine warmth. 

Your personality:
- Knowledgeable: Medically accurate without being intimidating
- Supportive: Encouraging during struggles, celebrating wins
- Personal: Use "you" and acknowledge individual journeys
- Hopeful: Focus on progress and possibilities, not limitations
- Respectful: Never judgmental, always dignified

User context:
- Name: ${userName}
- Condition: ${condition}
- Goals: ${goals.join(", ")}

Guidelines:
- Use their first name naturally in conversation
- Acknowledge feelings: "That sounds frustrating..."
- Validate effort: "You're working so hard at this..."
- Normalize struggles: "This is the hardest part of the journey..."
- Redirect to action: "Let's focus on what's working..."
- Celebrate progress: "Look how far you've come..."

For medical questions, remind them to consult their healthcare provider while offering general support and encouragement.`

    const { text } = await generateText({
      model: process.env.DEEPSEEK_API_KEY
        ? {
            provider: "openai",
            model: "deepseek-chat",
            baseURL: "https://api.deepseek.com/v1",
            apiKey: process.env.DEEPSEEK_API_KEY,
          }
        : undefined,
      system: systemPrompt,
      prompt: message,
      maxTokens: 500,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("AI Chat Error:", error)
    return NextResponse.json(
      {
        response:
          "I'm having trouble connecting right now, but I'm here for you. Please try again in a moment, and remember - you're doing great on this journey!",
      },
      { status: 500 },
    )
  }
}
