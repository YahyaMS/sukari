import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

interface MealPlanRequest {
  sessionId?: string
  fastingDuration?: number
  currentGlucose?: number
  userProfile?: {
    weight?: number
    height?: number
    age?: number
    activityLevel?: string
    dietaryRestrictions?: string[]
    healthConditions?: string[]
  }
  mealType: "pre_fast" | "breaking_fast" | "post_fast" | "regular"
  preferences?: {
    cuisine?: string[]
    avoidFoods?: string[]
    preferredMacros?: { protein: number; carbs: number; fat: number }
  }
}

interface MealRecommendation {
  mealName: string
  description: string
  macros: { protein: number; carbs: number; fat: number; calories: number }
  ingredients: string[]
  preparation: string[]
  timing: string
  portionSize: string
  glucoseImpact: "low" | "medium" | "high"
  digestibility: "easy" | "moderate" | "complex"
  benefits: string[]
  warnings?: string[]
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

    const mealRequest: MealPlanRequest = await request.json()

    // Get user's fasting history for context
    const { data: fastingHistory } = await supabase
      .from("fasting_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)

    // Get current session if provided
    let currentSession = null
    if (mealRequest.sessionId) {
      const { data: session } = await supabase
        .from("fasting_sessions")
        .select("*")
        .eq("id", mealRequest.sessionId)
        .eq("user_id", user.id)
        .single()
      currentSession = session
    }

    // Generate meal recommendations
    const mealPlan = await generateMealPlan(mealRequest, currentSession, fastingHistory || [])

    // Log meal planning request
    if (mealRequest.sessionId) {
      await supabase.from("fasting_logs").insert({
        session_id: mealRequest.sessionId,
        user_id: user.id,
        log_type: "meal_planning",
        value: {
          meal_type: mealRequest.mealType,
          recommendations: mealPlan.meals.length,
          fasting_duration: mealRequest.fastingDuration,
        },
      })
    }

    return NextResponse.json({
      mealPlan,
      hydrationGuidance: generateHydrationGuidance(mealRequest),
      electrolyteRecommendations: generateElectrolyteRecommendations(mealRequest),
      timingGuidance: generateTimingGuidance(mealRequest),
    })
  } catch (error) {
    console.error("Error in meal planning:", error)
    return NextResponse.json({ error: "Failed to generate meal plan" }, { status: 500 })
  }
}

async function generateMealPlan(
  request: MealPlanRequest,
  currentSession: any,
  fastingHistory: any[],
): Promise<{ meals: MealRecommendation[]; guidance: string; metabolicState: string }> {
  const { mealType, fastingDuration = 0, currentGlucose, userProfile, preferences } = request

  let metabolicState = "normal"
  if (fastingDuration > 16) metabolicState = "ketotic"
  if (fastingDuration > 24) metabolicState = "deep_ketosis"
  if (fastingDuration > 48) metabolicState = "extended_fasting"

  switch (mealType) {
    case "pre_fast":
      return generatePreFastMeals(userProfile, preferences)
    case "breaking_fast":
      return generateBreakingFastMeals(fastingDuration, currentGlucose, userProfile, metabolicState)
    case "post_fast":
      return generatePostFastMeals(fastingDuration, userProfile, preferences)
    case "regular":
      return generateRegularMeals(userProfile, preferences, fastingHistory)
    default:
      throw new Error("Invalid meal type")
  }
}

function generatePreFastMeals(
  userProfile: any,
  preferences: any,
): { meals: MealRecommendation[]; guidance: string; metabolicState: string } {
  const meals: MealRecommendation[] = [
    {
      mealName: "Balanced Pre-Fast Dinner",
      description: "A well-balanced meal to sustain you through your fast",
      macros: { protein: 35, carbs: 30, fat: 35, calories: 650 },
      ingredients: [
        "6 oz grilled salmon or chicken breast",
        "1 cup roasted sweet potato",
        "2 cups mixed leafy greens",
        "1/2 avocado",
        "2 tbsp olive oil",
        "1 tbsp nuts or seeds",
      ],
      preparation: [
        "Season and grill protein of choice",
        "Roast sweet potato with olive oil",
        "Prepare salad with avocado and nuts",
        "Drizzle with olive oil and lemon",
      ],
      timing: "2-4 hours before fasting starts",
      portionSize: "Standard dinner portion",
      glucoseImpact: "medium",
      digestibility: "moderate",
      benefits: [
        "Sustained energy release",
        "High satiety from protein and fat",
        "Complex carbs for stable glucose",
        "Fiber for digestive health",
      ],
    },
    {
      mealName: "High-Fat Low-Carb Pre-Fast",
      description: "Ketogenic-friendly meal for easier transition to fasting",
      macros: { protein: 30, carbs: 10, fat: 60, calories: 700 },
      ingredients: [
        "6 oz grass-fed beef or fatty fish",
        "2 cups sautéed spinach",
        "1 whole avocado",
        "2 tbsp MCT oil or coconut oil",
        "1 oz macadamia nuts",
        "Herbs and spices",
      ],
      preparation: [
        "Cook protein in coconut oil",
        "Sauté spinach with garlic",
        "Slice avocado and add nuts",
        "Season generously with herbs",
      ],
      timing: "3-4 hours before fasting starts",
      portionSize: "Generous portions of fat and protein",
      glucoseImpact: "low",
      digestibility: "moderate",
      benefits: ["Easier transition to ketosis", "Minimal glucose spike", "High satiety", "Anti-inflammatory fats"],
    },
  ]

  return {
    meals,
    guidance:
      "Choose a pre-fast meal that will sustain you without causing a large glucose spike. Focus on protein, healthy fats, and complex carbohydrates. Avoid refined sugars and processed foods.",
    metabolicState: "fed_state",
  }
}

function generateBreakingFastMeals(
  fastingDuration: number,
  currentGlucose: number | undefined,
  userProfile: any,
  metabolicState: string,
): { meals: MealRecommendation[]; guidance: string; metabolicState: string } {
  const meals: MealRecommendation[] = []

  // First meal - gentle refeeding
  if (fastingDuration >= 16) {
    meals.push({
      mealName: "Gentle Refeeding Starter",
      description: "Easy-to-digest foods to gently break your fast",
      macros: { protein: 15, carbs: 20, fat: 25, calories: 200 },
      ingredients: [
        "1 cup bone broth",
        "1/4 cup sauerkraut or kimchi",
        "1 tbsp MCT oil or coconut oil",
        "Pinch of sea salt",
        "Fresh herbs",
      ],
      preparation: [
        "Warm bone broth gently",
        "Add MCT oil and sea salt",
        "Serve with small portion of fermented vegetables",
        "Sip slowly over 15-20 minutes",
      ],
      timing: "First 30 minutes after breaking fast",
      portionSize: "Small starter portion",
      glucoseImpact: "low",
      digestibility: "easy",
      benefits: [
        "Gentle on digestive system",
        "Electrolyte replenishment",
        "Probiotic support",
        "Minimal glucose impact",
      ],
    })
  }

  // Main breaking fast meal
  if (fastingDuration < 16) {
    meals.push({
      mealName: "Standard Fast-Breaking Meal",
      description: "Balanced meal for shorter fasts",
      macros: { protein: 30, carbs: 35, fat: 35, calories: 500 },
      ingredients: [
        "4 oz lean protein (chicken, fish, tofu)",
        "1 cup steamed vegetables",
        "1/2 cup quinoa or brown rice",
        "1 tbsp olive oil",
        "Mixed herbs and spices",
      ],
      preparation: [
        "Cook protein gently (avoid frying)",
        "Steam vegetables until tender",
        "Prepare quinoa or rice",
        "Combine with olive oil and herbs",
      ],
      timing: "30-60 minutes after breaking fast",
      portionSize: "Moderate portion",
      glucoseImpact: "medium",
      digestibility: "moderate",
      benefits: ["Balanced nutrition", "Steady energy", "Good digestibility"],
    })
  } else {
    meals.push({
      mealName: "Extended Fast Recovery Meal",
      description: "Carefully designed meal for longer fasts",
      macros: { protein: 25, carbs: 25, fat: 50, calories: 400 },
      ingredients: [
        "3 oz wild-caught salmon",
        "1 cup steamed broccoli",
        "1/2 avocado",
        "1 tbsp olive oil",
        "Lemon and herbs",
        "Small handful of nuts",
      ],
      preparation: [
        "Gently poach or bake salmon",
        "Steam broccoli until just tender",
        "Slice avocado and add nuts",
        "Dress with olive oil and lemon",
      ],
      timing: "45-90 minutes after initial starter",
      portionSize: "Small to moderate portion",
      glucoseImpact: "low",
      digestibility: "easy",
      benefits: ["High-quality protein", "Anti-inflammatory fats", "Easy digestion", "Nutrient dense"],
      warnings: ["Eat slowly", "Chew thoroughly", "Stop if feeling too full"],
    })
  }

  let guidance = "Break your fast gently with easily digestible foods. "
  if (fastingDuration >= 24) {
    guidance += "For extended fasts, start with liquids and progress slowly to solid foods. "
  }
  guidance += "Listen to your body and eat mindfully."

  return { meals, guidance, metabolicState }
}

function generatePostFastMeals(
  fastingDuration: number,
  userProfile: any,
  preferences: any,
): { meals: MealRecommendation[]; guidance: string; metabolicState: string } {
  const meals: MealRecommendation[] = [
    {
      mealName: "Post-Fast Recovery Meal",
      description: "Nutrient-dense meal to support recovery and maintain benefits",
      macros: { protein: 35, carbs: 30, fat: 35, calories: 600 },
      ingredients: [
        "5 oz grass-fed beef or wild fish",
        "2 cups mixed vegetables",
        "1 medium sweet potato",
        "2 tbsp avocado oil",
        "Fresh herbs and spices",
      ],
      preparation: [
        "Cook protein to preference",
        "Roast vegetables with avocado oil",
        "Bake sweet potato",
        "Season with herbs and spices",
      ],
      timing: "2-4 hours after breaking fast",
      portionSize: "Full meal portion",
      glucoseImpact: "medium",
      digestibility: "moderate",
      benefits: ["Complete amino acid profile", "Micronutrient replenishment", "Sustained energy", "Metabolic support"],
    },
  ]

  return {
    meals,
    guidance:
      "Focus on nutrient-dense whole foods to replenish what was used during fasting. Maintain the metabolic benefits by avoiding processed foods and excessive carbohydrates.",
    metabolicState: "recovery",
  }
}

function generateRegularMeals(
  userProfile: any,
  preferences: any,
  fastingHistory: any[],
): { meals: MealRecommendation[]; guidance: string; metabolicState: string } {
  const meals: MealRecommendation[] = [
    {
      mealName: "Metabolically Optimized Meal",
      description: "Balanced meal to support your fasting lifestyle",
      macros: { protein: 30, carbs: 35, fat: 35, calories: 550 },
      ingredients: [
        "4 oz lean protein source",
        "1.5 cups non-starchy vegetables",
        "1/2 cup complex carbohydrates",
        "1-2 tbsp healthy fats",
        "Herbs and spices",
      ],
      preparation: [
        "Prepare protein using healthy cooking methods",
        "Include variety of colorful vegetables",
        "Choose whole grain or legume carbs",
        "Add healthy fats for satiety",
      ],
      timing: "During eating window",
      portionSize: "Balanced portions",
      glucoseImpact: "medium",
      digestibility: "moderate",
      benefits: ["Supports metabolic health", "Maintains fasting benefits", "Balanced nutrition", "Sustained energy"],
    },
  ]

  return {
    meals,
    guidance:
      "Maintain the benefits of fasting by choosing nutrient-dense, whole foods during your eating windows. Focus on protein, vegetables, and healthy fats.",
    metabolicState: "maintenance",
  }
}

function generateHydrationGuidance(request: MealPlanRequest) {
  const { fastingDuration = 0, mealType } = request

  if (mealType === "breaking_fast") {
    return {
      immediate: "Drink 8-12 oz of water 15-30 minutes before eating",
      during: "Sip small amounts of water during the meal, avoid large quantities",
      after: "Wait 30-60 minutes after eating before drinking large amounts",
      daily: "Aim for 8-10 glasses of water throughout the day",
      electrolytes: fastingDuration > 16 ? "Add electrolytes to first glass of water" : "Regular water is fine",
    }
  }

  return {
    general: "Stay well hydrated throughout your eating window",
    timing: "Drink most fluids between meals rather than during",
    quality: "Choose filtered water and herbal teas",
    amount: "Half your body weight in ounces per day",
  }
}

function generateElectrolyteRecommendations(request: MealPlanRequest) {
  const { fastingDuration = 0, mealType } = request

  if (fastingDuration > 16 || mealType === "breaking_fast") {
    return {
      sodium: {
        amount: "1-2g with first meal",
        sources: ["Sea salt", "Pink Himalayan salt", "Bone broth"],
        timing: "With breaking fast meal",
      },
      potassium: {
        amount: "2-3g throughout the day",
        sources: ["Avocado", "Leafy greens", "Coconut water"],
        timing: "Spread throughout eating window",
      },
      magnesium: {
        amount: "300-400mg",
        sources: ["Dark leafy greens", "Nuts", "Seeds"],
        timing: "With evening meal for better sleep",
      },
    }
  }

  return {
    general: "Focus on whole foods rich in natural electrolytes",
    sources: ["Vegetables", "Fruits", "Nuts", "Seeds"],
    timing: "Throughout eating window",
  }
}

function generateTimingGuidance(request: MealPlanRequest) {
  const { mealType, fastingDuration = 0 } = request

  switch (mealType) {
    case "pre_fast":
      return {
        optimal: "2-4 hours before fasting begins",
        latest: "2 hours before fasting begins",
        reasoning: "Allows for proper digestion before fasting state",
      }
    case "breaking_fast":
      return {
        immediate: "Start with liquids or very light foods",
        progression: fastingDuration > 16 ? "Wait 30-60 minutes between courses" : "Can eat normally",
        reasoning: "Gentle reintroduction prevents digestive discomfort",
      }
    case "post_fast":
      return {
        timing: "2-4 hours after breaking fast",
        reasoning: "Allows digestive system to readjust",
      }
    default:
      return {
        general: "Eat during your designated eating window",
        spacing: "Allow 3-4 hours between meals",
      }
  }
}
