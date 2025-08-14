import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

interface CoachRequest {
  message: string
  sessionId?: string
  currentPhase?: string
  timeIntoFast?: number
  symptoms?: string[]
  glucoseLevel?: number
  emergencyLevel?: "low" | "medium" | "high"
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: CoachRequest = await request.json()
    const { message, sessionId, currentPhase, timeIntoFast, symptoms, glucoseLevel, emergencyLevel } = body

    // Classify the intent of the user's message
    const intent = classifyIntent(message)

    // Get user's fasting history for context
    const { data: fastingHistory } = await supabase
      .from("fasting_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)

    // Get current session details if provided
    let currentSession = null
    if (sessionId) {
      const { data: session } = await supabase
        .from("fasting_sessions")
        .select("*")
        .eq("id", sessionId)
        .eq("user_id", user.id)
        .single()
      currentSession = session
    }

    // Generate AI response based on intent and context
    const response = await generateCoachResponse({
      intent,
      message,
      currentSession,
      currentPhase,
      timeIntoFast,
      symptoms,
      glucoseLevel,
      emergencyLevel,
      fastingHistory: fastingHistory || [],
      userProfile: { id: user.id },
    })

    // Log the interaction
    if (sessionId) {
      await supabase.from("fasting_logs").insert({
        session_id: sessionId,
        user_id: user.id,
        log_type: "coach_interaction",
        value: {
          user_message: message,
          coach_response: response.message,
          intent: intent,
          emergency_level: emergencyLevel,
        },
        ai_response: response.message,
      })
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in fasting coach:", error)
    return NextResponse.json({ error: "Failed to get coach response" }, { status: 500 })
  }
}

function classifyIntent(message: string): string {
  const lowerMessage = message.toLowerCase()

  // Emergency keywords
  if (
    lowerMessage.includes("dizzy") ||
    lowerMessage.includes("nauseous") ||
    lowerMessage.includes("chest pain") ||
    lowerMessage.includes("emergency") ||
    lowerMessage.includes("help") ||
    lowerMessage.includes("stop")
  ) {
    return "emergency"
  }

  // Difficulty/struggle keywords
  if (
    lowerMessage.includes("hungry") ||
    lowerMessage.includes("craving") ||
    lowerMessage.includes("difficult") ||
    lowerMessage.includes("hard") ||
    lowerMessage.includes("tired") ||
    lowerMessage.includes("weak")
  ) {
    return "fasting_difficulty"
  }

  // Health concern keywords
  if (
    lowerMessage.includes("glucose") ||
    lowerMessage.includes("blood sugar") ||
    lowerMessage.includes("symptom") ||
    lowerMessage.includes("feel")
  ) {
    return "health_concern"
  }

  // Motivation keywords
  if (
    lowerMessage.includes("quit") ||
    lowerMessage.includes("give up") ||
    lowerMessage.includes("motivation") ||
    lowerMessage.includes("encourage")
  ) {
    return "motivation_need"
  }

  // Schedule adjustment keywords
  if (
    lowerMessage.includes("extend") ||
    lowerMessage.includes("shorten") ||
    lowerMessage.includes("adjust") ||
    lowerMessage.includes("change")
  ) {
    return "schedule_adjustment"
  }

  // Default to information request
  return "information_request"
}

async function generateCoachResponse(context: any) {
  const {
    intent,
    message,
    currentSession,
    currentPhase,
    timeIntoFast,
    symptoms,
    glucoseLevel,
    emergencyLevel,
    fastingHistory,
  } = context

  // Handle emergency situations first
  if (intent === "emergency" || emergencyLevel === "high") {
    return handleEmergency(context)
  }

  // Handle different intents
  switch (intent) {
    case "fasting_difficulty":
      return handleFastingDifficulty(context)
    case "health_concern":
      return handleHealthConcern(context)
    case "motivation_need":
      return provideMotivation(context)
    case "schedule_adjustment":
      return handleScheduleAdjustment(context)
    case "information_request":
      return provideEducation(context)
    default:
      return provideGeneralSupport(context)
  }
}

function handleEmergency(context: any) {
  const { symptoms, glucoseLevel, timeIntoFast } = context

  return {
    message:
      "I'm concerned about your symptoms. For your safety, I recommend breaking your fast immediately. Please have a small snack with some carbohydrates and contact your healthcare provider if symptoms persist.",
    urgency: "high",
    actions: ["break_fast", "contact_healthcare"],
    recommendations: [
      "Have 15-20g of fast-acting carbohydrates",
      "Sit down and rest",
      "Monitor your symptoms",
      "Contact your doctor if symptoms worsen",
    ],
    followUp: "Please let me know how you're feeling in 15-20 minutes.",
  }
}

function handleFastingDifficulty(context: any) {
  const { message, timeIntoFast, currentPhase, fastingHistory } = context
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("hungry")) {
    return {
      message: `I understand you're feeling hungry. This is completely normal around hour ${timeIntoFast || "X"}. Your body is transitioning to fat burning mode. This feeling typically passes in 20-30 minutes.`,
      tips: [
        "Drink a large glass of water with a pinch of sea salt",
        "Try some light movement or a short walk",
        "Practice deep breathing exercises",
        "Remember why you started this journey",
      ],
      encouragement: "You're doing amazing! This is exactly when the metabolic magic happens.",
      phase_info: currentPhase
        ? `You're in the ${currentPhase} phase where your body is optimizing fat burning.`
        : null,
    }
  }

  if (lowerMessage.includes("tired") || lowerMessage.includes("weak")) {
    return {
      message: `Feeling tired during fasting is common as your body adapts. You're currently ${timeIntoFast || "X"} hours into your fast, which is when energy levels often dip before stabilizing.`,
      tips: [
        "Ensure you're staying well hydrated",
        "Consider some light stretching or yoga",
        "Get some fresh air if possible",
        "Avoid intense physical activity right now",
      ],
      warning:
        timeIntoFast && timeIntoFast > 20
          ? "Since you've been fasting for over 20 hours, listen to your body carefully. If fatigue is severe, consider breaking your fast."
          : null,
    }
  }

  return {
    message:
      "I hear that you're finding this challenging. That's completely normal and shows you're pushing your comfort zone in a healthy way.",
    tips: [
      "Focus on staying hydrated",
      "Distract yourself with a light activity",
      "Remember that cravings come in waves and will pass",
      "Think about how accomplished you'll feel when you complete this",
    ],
    encouragement: "Every minute you continue is improving your insulin sensitivity and metabolic health!",
  }
}

function handleHealthConcern(context: any) {
  const { glucoseLevel, symptoms, timeIntoFast } = context

  if (glucoseLevel) {
    if (glucoseLevel < 70) {
      return {
        message:
          "Your glucose level of " +
          glucoseLevel +
          " mg/dL is concerning. This is considered hypoglycemic. Please break your fast immediately for your safety.",
        urgency: "high",
        actions: ["break_fast_immediately"],
        recommendations: [
          "Have 15-20g of fast-acting carbohydrates immediately",
          "Recheck glucose in 15 minutes",
          "Contact your healthcare provider",
        ],
      }
    } else if (glucoseLevel < 80) {
      return {
        message:
          "Your glucose level of " +
          glucoseLevel +
          " mg/dL is on the lower side. Please monitor closely and consider breaking your fast if you feel unwell.",
        urgency: "medium",
        recommendations: [
          "Stay close to food and glucose tablets",
          "Monitor for symptoms of hypoglycemia",
          "Consider shortening your fast today",
        ],
      }
    } else {
      return {
        message:
          "Your glucose level of " + glucoseLevel + " mg/dL looks good for fasting. This is within a healthy range.",
        encouragement: "Great job! Your body is responding well to the fast.",
        tips: ["Continue staying hydrated", "Monitor how you feel"],
      }
    }
  }

  return {
    message: "I'm here to help with any health concerns during your fast. Your safety is the top priority.",
    recommendations: [
      "Always listen to your body",
      "Break your fast if you feel unwell",
      "Stay hydrated throughout",
      "Contact healthcare providers for serious concerns",
    ],
  }
}

function provideMotivation(context: any) {
  const { timeIntoFast, fastingHistory, currentPhase } = context

  const completedFasts = fastingHistory?.filter((f: any) => f.status === "completed").length || 0

  return {
    message: `Remember why you started this journey - to improve your health and reverse diabetes. You've already completed ${completedFasts} successful fasts!`,
    motivation: [
      "Every hour of fasting is improving your insulin sensitivity",
      "You're literally giving your digestive system a healing break",
      "Your body is learning to burn fat more efficiently",
      "You're building mental resilience and discipline",
    ],
    progress: timeIntoFast ? `You're already ${timeIntoFast} hours in - that's incredible progress!` : null,
    encouragement: "You're stronger than you think, and your future self will thank you for not giving up.",
    phase_benefits:
      currentPhase === "deep"
        ? "You're in the deep fasting phase where autophagy is ramping up - your cells are literally cleaning and repairing themselves!"
        : null,
  }
}

function handleScheduleAdjustment(context: any) {
  const { message, timeIntoFast, currentSession } = context

  if (message.toLowerCase().includes("extend")) {
    return {
      message: "I can help you safely extend your fast. However, let's make sure you're feeling well first.",
      safety_check: [
        "How are your energy levels (1-10)?",
        "Any concerning symptoms?",
        "What's your current glucose level?",
        "How much water have you had today?",
      ],
      recommendations: [
        "Only extend if you're feeling strong and energetic",
        "Don't extend beyond your experience level",
        "Have an exit strategy ready",
      ],
    }
  }

  if (message.toLowerCase().includes("shorten")) {
    return {
      message: "It's perfectly fine to shorten your fast. Listening to your body is always the right choice.",
      encouragement: "Any amount of fasting provides benefits. You should be proud of what you've accomplished so far!",
      tips: [
        "Break your fast gently with something light",
        "Focus on protein and healthy fats",
        "Avoid large meals immediately",
      ],
    }
  }

  return {
    message: "I can help you adjust your fasting schedule. What specific changes would you like to make?",
    options: [
      "Extend current fast (with safety checks)",
      "Shorten current fast",
      "Adjust future fasting windows",
      "Change fasting frequency",
    ],
  }
}

function provideEducation(context: any) {
  const { message, currentPhase, timeIntoFast } = context
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("autophagy")) {
    return {
      message:
        "Autophagy is your body's cellular cleanup process. It typically begins around 12-16 hours of fasting and increases significantly after 24 hours.",
      education: [
        "Autophagy removes damaged proteins and organelles",
        "It's like a cellular recycling program",
        "This process may help with longevity and disease prevention",
        "Exercise and certain foods can also stimulate autophagy",
      ],
      current_status:
        timeIntoFast && timeIntoFast >= 12
          ? "Based on your current fast duration, autophagy processes are likely active!"
          : "You're getting close to the autophagy activation window!",
    }
  }

  if (lowerMessage.includes("ketosis")) {
    return {
      message: "Ketosis is when your body switches from burning glucose to burning fat for fuel, producing ketones.",
      education: [
        "Ketosis typically begins 12-24 hours into a fast",
        "Signs include reduced hunger, mental clarity, and slight metallic taste",
        "Ketones are an efficient fuel source for your brain",
        "This is when you get the 'fasting high' feeling",
      ],
      tips: [
        "Stay hydrated to support ketone production",
        "Light exercise can help accelerate ketosis",
        "Don't worry if you don't feel it immediately - everyone is different",
      ],
    }
  }

  return {
    message: "I'm here to educate you about fasting! What would you like to learn about?",
    topics: [
      "Autophagy and cellular repair",
      "Ketosis and fat burning",
      "Insulin sensitivity improvements",
      "Different fasting protocols",
      "Breaking fasts safely",
    ],
  }
}

function provideGeneralSupport(context: any) {
  return {
    message: "I'm your AI fasting coach, here to support you through your fasting journey. How can I help you today?",
    capabilities: [
      "Answer questions about fasting",
      "Provide motivation and encouragement",
      "Help with fasting difficulties",
      "Offer safety guidance",
      "Adjust your fasting schedule",
    ],
    reminder: "Remember, I'm here 24/7 to support you. Never hesitate to reach out if you need help or have concerns.",
  }
}
