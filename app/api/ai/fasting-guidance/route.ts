import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, currentState, context } = await request.json()

    // This would typically call your AI service (DeepSeek, OpenAI, etc.)
    // For now, we'll provide intelligent rule-based responses
    const response = await generateFastingGuidance(message, currentState, context)

    return NextResponse.json({
      response: response.message,
      insights: response.insights,
      context: response.context,
    })
  } catch (error) {
    console.error("Error generating fasting guidance:", error)
    return NextResponse.json({ error: "Failed to generate guidance" }, { status: 500 })
  }
}

async function generateFastingGuidance(message: string, currentState: any, context: any) {
  const lowerMessage = message.toLowerCase()

  // Analyze the message for intent and provide contextual responses
  if (lowerMessage.includes("hungry") || lowerMessage.includes("hunger")) {
    const hoursElapsed = currentState?.hoursElapsed || 0

    if (hoursElapsed < 4) {
      return {
        message:
          "Feeling hungry early in your fast is completely normal! Your body is used to regular meals and is sending hunger signals. This typically passes within 20-30 minutes. Try drinking some water, herbal tea, or go for a short walk to distract yourself. Remember, hunger comes in waves - this feeling will pass! 💪",
        insights: [
          {
            type: "encouragement",
            title: "Hunger is Temporary",
            content:
              "Early hunger pangs are your body's way of asking for familiar comfort. Stay strong - this feeling typically passes in 20-30 minutes.",
            priority: "low",
            actionable: false,
          },
        ],
        context: { topic: "hunger_management", phase: "early" },
      }
    } else if (hoursElapsed >= 4 && hoursElapsed < 12) {
      return {
        message:
          "You're doing great! At ${Math.round(hoursElapsed)} hours, your body is transitioning from burning glucose to burning fat. Hunger during this phase is normal as your metabolism shifts. Try some electrolyte water, stay busy with an activity you enjoy, or practice deep breathing. Your body is learning to be metabolically flexible! 🌟",
        insights: [
          {
            type: "milestone",
            title: "Metabolic Transition",
            content:
              "Your body is shifting from glucose to fat burning. This is where the real benefits of fasting begin!",
            priority: "medium",
            actionable: false,
          },
        ],
        context: { topic: "metabolic_transition", phase: "adaptation" },
      }
    } else {
      return {
        message:
          "Impressive! You're ${Math.round(hoursElapsed)} hours into your fast. At this point, hunger should be minimal as your body is efficiently burning fat for fuel. If you're experiencing intense hunger now, it might be psychological or habitual. Try meditation, light exercise, or engaging in a hobby. You're in the therapeutic zone now! ✨",
        insights: [
          {
            type: "encouragement",
            title: "Deep Fasting Benefits",
            content:
              "You're now in the therapeutic fasting zone where maximum benefits occur. Any hunger now is likely psychological.",
            priority: "low",
            actionable: false,
          },
        ],
        context: { topic: "deep_fasting", phase: "therapeutic" },
      }
    }
  }

  if (lowerMessage.includes("energy") || lowerMessage.includes("tired") || lowerMessage.includes("fatigue")) {
    return {
      message:
        "Low energy during fasting can happen, especially as your body adapts. Here's what I recommend: 1) Check your hydration - dehydration is a common cause of fatigue. 2) Try some light movement like a 5-minute walk. 3) Ensure you're getting electrolytes if you've been fasting over 12 hours. 4) Consider your sleep quality from last night. Your energy often increases once you're fully fat-adapted. How long have you been fasting regularly?",
      insights: [
        {
          type: "recommendation",
          title: "Energy Optimization",
          content: "Light movement and proper hydration can naturally boost energy levels during fasting.",
          priority: "medium",
          actionable: true,
        },
      ],
      context: { topic: "energy_management", needs_followup: true },
    }
  }

  if (lowerMessage.includes("headache") || lowerMessage.includes("head")) {
    const severity = lowerMessage.includes("severe") || lowerMessage.includes("bad") ? "high" : "medium"

    if (severity === "high") {
      return {
        message:
          "A severe headache during fasting is concerning and shouldn't be ignored. This could indicate dehydration, electrolyte imbalance, or low blood pressure. I recommend: 1) Drink water with a pinch of sea salt immediately. 2) Sit or lie down in a quiet, dark room. 3) Consider breaking your fast if the headache doesn't improve in 30 minutes. 4) Monitor your blood pressure if possible. Your safety is the priority - there's no shame in breaking a fast early! 🚨",
        insights: [
          {
            type: "warning",
            title: "Severe Headache Alert",
            content:
              "Severe headaches during fasting may indicate dehydration or electrolyte imbalance. Consider breaking your fast if it doesn't improve.",
            priority: "high",
            actionable: true,
          },
        ],
        context: { topic: "safety_concern", severity: "high" },
      }
    } else {
      return {
        message:
          "Headaches are common during fasting, especially in the first few days as your body adapts. This is often due to: 1) Dehydration - drink more water. 2) Electrolyte imbalance - try water with a pinch of sea salt. 3) Caffeine withdrawal if you usually drink coffee. 4) Low blood sugar as your body transitions. Try resting in a dark room and staying hydrated. If it worsens, don't hesitate to break your fast. 💧",
        insights: [
          {
            type: "recommendation",
            title: "Headache Management",
            content:
              "Most fasting headaches are due to dehydration or electrolyte imbalance. Increase water and electrolyte intake.",
            priority: "medium",
            actionable: true,
          },
        ],
        context: { topic: "common_symptom", manageable: true },
      }
    }
  }

  if (lowerMessage.includes("break") || lowerMessage.includes("stop") || lowerMessage.includes("quit")) {
    return {
      message:
        "It's completely okay to break your fast! Listening to your body is the most important skill in fasting. If you're feeling unwell, experiencing severe symptoms, or just feel like you need to stop - that's perfectly fine. Here's how to break your fast gently: 1) Start with something small like bone broth, a few nuts, or half an avocado. 2) Eat slowly and chew thoroughly. 3) Wait 30-60 minutes before having a larger meal. 4) Avoid large meals or refined sugars initially. Remember, every fast is a learning experience! 🤗",
      insights: [
        {
          type: "encouragement",
          title: "Breaking Fast Safely",
          content:
            "There's no shame in breaking a fast early. Start with small, easily digestible foods and eat slowly.",
          priority: "medium",
          actionable: true,
        },
      ],
      context: { topic: "breaking_fast", supportive: true },
    }
  }

  if (lowerMessage.includes("continue") || lowerMessage.includes("should i")) {
    const riskFactors = []
    let recommendation = "continue"

    if (currentState?.symptoms?.includes("severe_dizziness")) {
      riskFactors.push("severe dizziness")
      recommendation = "break"
    }
    if (currentState?.glucose && currentState.glucose < 60) {
      riskFactors.push("low blood glucose")
      recommendation = "break"
    }
    if (currentState?.energyLevel && currentState.energyLevel < 2) {
      riskFactors.push("extremely low energy")
      recommendation = "consider_breaking"
    }

    if (recommendation === "break") {
      return {
        message: `Based on your current state (${riskFactors.join(", ")}), I recommend breaking your fast now. Your safety is the priority, and these symptoms suggest your body needs nourishment. Please break your fast gently with something small and easily digestible. You can always try again another day when you're better prepared! 🛡️`,
        insights: [
          {
            type: "warning",
            title: "Safety First",
            content:
              "Current symptoms suggest it's time to break your fast. Listen to your body and prioritize safety.",
            priority: "high",
            actionable: true,
          },
        ],
        context: { topic: "safety_assessment", recommendation: "break_fast" },
      }
    } else if (recommendation === "consider_breaking") {
      return {
        message:
          "You're showing some signs that suggest caution. While not immediately dangerous, your body might be telling you it needs nourishment. Consider how you're feeling overall - if you're struggling significantly, it's okay to break your fast. If you want to continue, please monitor yourself closely and don't hesitate to stop if symptoms worsen. What matters most is building a sustainable practice! ⚖️",
        insights: [
          {
            type: "recommendation",
            title: "Monitor Closely",
            content:
              "Your current state suggests caution. Continue only if you feel safe, and monitor symptoms closely.",
            priority: "medium",
            actionable: true,
          },
        ],
        context: { topic: "cautious_continuation", needs_monitoring: true },
      }
    } else {
      return {
        message:
          "Based on your current state, you seem to be doing well! Your body appears to be handling the fast appropriately. Continue to monitor how you feel, stay hydrated, and remember that it's always okay to stop if anything changes. You're building incredible metabolic flexibility and giving your body amazing benefits. Keep up the great work! 🌟",
        insights: [
          {
            type: "encouragement",
            title: "You're Doing Great!",
            content:
              "Your current state indicates you're handling the fast well. Continue monitoring and stay hydrated.",
            priority: "low",
            actionable: false,
          },
        ],
        context: { topic: "positive_assessment", encouraging: true },
      }
    }
  }

  // Default response for general questions
  return {
    message:
      "I'm here to support you through your fasting journey! I can help with questions about hunger, energy levels, symptoms, whether to continue or break your fast, and general fasting guidance. What specific aspect of your fast would you like to discuss? Remember, I'm here to help you fast safely and effectively for your diabetes management goals. 🤝",
    insights: [
      {
        type: "recommendation",
        title: "I'm Here to Help",
        content:
          "Feel free to ask about any aspect of your fasting experience. I'm here to provide personalized guidance.",
        priority: "low",
        actionable: false,
      },
    ],
    context: { topic: "general_support", open_ended: true },
  }
}
