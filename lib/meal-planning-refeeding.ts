export interface RefeedingMeal {
  id: string
  name: string
  description: string
  calories: number
  macros: {
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
  ingredients: string[]
  instructions: string[]
  timing: "immediate" | "30min" | "1hour" | "2hours"
  difficulty: "easy" | "medium" | "hard"
  prepTime: number
  diabeticFriendly: boolean
  glycemicImpact: "low" | "medium" | "high"
}

export interface RefeedingPlan {
  id: string
  fastingDuration: number
  fastingType: string
  totalCalories: number
  meals: RefeedingMeal[]
  hydrationPlan: {
    water: number
    electrolytes: boolean
    timing: string[]
  }
  supplements: string[]
  warnings: string[]
  aiRecommendations: string[]
}

export class MealPlanningRefeedingService {
  private static instance: MealPlanningRefeedingService

  static getInstance(): MealPlanningRefeedingService {
    if (!MealPlanningRefeedingService.instance) {
      MealPlanningRefeedingService.instance = new MealPlanningRefeedingService()
    }
    return MealPlanningRefeedingService.instance
  }

  async generateRefeedingPlan(
    fastingDuration: number,
    fastingType: string,
    userProfile: {
      weight: number
      height: number
      age: number
      activityLevel: string
      diabetesType: string
      medications: string[]
      allergies: string[]
      preferences: string[]
    },
  ): Promise<RefeedingPlan> {
    try {
      // AI-powered refeeding plan generation
      const plan = await this.createPersonalizedRefeedingPlan(fastingDuration, fastingType, userProfile)

      return plan
    } catch (error) {
      console.warn("Error generating refeeding plan:", error)
      return this.getFallbackRefeedingPlan(fastingDuration, fastingType)
    }
  }

  private async createPersonalizedRefeedingPlan(duration: number, type: string, profile: any): Promise<RefeedingPlan> {
    // Calculate optimal refeeding strategy based on fasting duration
    const refeedingStrategy = this.calculateRefeedingStrategy(duration, type, profile)

    // Generate meal recommendations
    const meals = await this.generateRefeedingMeals(refeedingStrategy, profile)

    // Create hydration plan
    const hydrationPlan = this.createHydrationPlan(duration, profile.weight)

    // Generate AI recommendations
    const aiRecommendations = this.generateAIRecommendations(duration, type, profile)

    return {
      id: `refeeding_${Date.now()}`,
      fastingDuration: duration,
      fastingType: type,
      totalCalories: meals.reduce((sum, meal) => sum + meal.calories, 0),
      meals,
      hydrationPlan,
      supplements: this.recommendSupplements(duration, profile),
      warnings: this.generateWarnings(duration, profile),
      aiRecommendations,
    }
  }

  private calculateRefeedingStrategy(duration: number, type: string, profile: any) {
    // Determine refeeding approach based on fasting duration
    if (duration < 16) {
      return { approach: "gentle", phases: 1, totalHours: 2 }
    } else if (duration < 24) {
      return { approach: "moderate", phases: 2, totalHours: 4 }
    } else if (duration < 48) {
      return { approach: "careful", phases: 3, totalHours: 6 }
    } else {
      return { approach: "extended", phases: 4, totalHours: 8 }
    }
  }

  private async generateRefeedingMeals(strategy: any, profile: any): Promise<RefeedingMeal[]> {
    const meals: RefeedingMeal[] = []

    // Phase 1: Gentle reintroduction (always first)
    meals.push({
      id: "phase1_gentle",
      name: "Gentle Reintroduction Broth",
      description: "Warm, nutrient-rich bone broth with electrolytes to gently break your fast",
      calories: 50,
      macros: { protein: 8, carbs: 2, fat: 1, fiber: 0 },
      ingredients: [
        "1 cup bone broth (low sodium)",
        "1/4 tsp pink Himalayan salt",
        "1 tsp apple cider vinegar",
        "Fresh herbs (optional)",
      ],
      instructions: [
        "Warm bone broth gently (do not boil)",
        "Add salt and apple cider vinegar",
        "Sip slowly over 15-20 minutes",
        "Wait 30 minutes before next meal",
      ],
      timing: "immediate",
      difficulty: "easy",
      prepTime: 5,
      diabeticFriendly: true,
      glycemicImpact: "low",
    })

    // Phase 2: Light protein and healthy fats
    if (strategy.phases >= 2) {
      meals.push({
        id: "phase2_protein",
        name: "Avocado & Egg Bowl",
        description: "Gentle protein and healthy fats to stabilize blood sugar",
        calories: 280,
        macros: { protein: 12, carbs: 8, fat: 22, fiber: 7 },
        ingredients: [
          "1/2 ripe avocado",
          "1 soft-boiled egg",
          "1 tbsp olive oil",
          "Pinch of sea salt",
          "Fresh lemon juice",
          "Handful of spinach",
        ],
        instructions: [
          "Soft-boil egg for 6-7 minutes",
          "Mash avocado with lemon and salt",
          "Serve over fresh spinach",
          "Drizzle with olive oil",
          "Eat slowly and mindfully",
        ],
        timing: "1hour",
        difficulty: "easy",
        prepTime: 10,
        diabeticFriendly: true,
        glycemicImpact: "low",
      })
    }

    // Phase 3: Balanced meal with complex carbs
    if (strategy.phases >= 3) {
      meals.push({
        id: "phase3_balanced",
        name: "Quinoa Buddha Bowl",
        description: "Balanced meal with complex carbs, protein, and vegetables",
        calories: 420,
        macros: { protein: 18, carbs: 45, fat: 16, fiber: 12 },
        ingredients: [
          "1/2 cup cooked quinoa",
          "3 oz grilled chicken or tofu",
          "1 cup roasted vegetables",
          "2 tbsp tahini dressing",
          "1/4 cup chickpeas",
          "Mixed greens",
        ],
        instructions: [
          "Cook quinoa according to package directions",
          "Grill protein of choice",
          "Roast vegetables with minimal oil",
          "Combine in bowl with greens",
          "Drizzle with tahini dressing",
        ],
        timing: "2hours",
        difficulty: "medium",
        prepTime: 25,
        diabeticFriendly: true,
        glycemicImpact: "low",
      })
    }

    // Phase 4: Full meal (for extended fasts)
    if (strategy.phases >= 4) {
      meals.push({
        id: "phase4_complete",
        name: "Mediterranean Salmon Plate",
        description: "Complete, nutrient-dense meal for full refeeding",
        calories: 520,
        macros: { protein: 35, carbs: 25, fat: 28, fiber: 8 },
        ingredients: [
          "4 oz wild salmon",
          "1/2 cup sweet potato",
          "1 cup steamed broccoli",
          "2 tbsp olive oil",
          "1/4 cup walnuts",
          "Lemon and herbs",
        ],
        instructions: [
          "Bake salmon with lemon and herbs",
          "Roast sweet potato until tender",
          "Steam broccoli until bright green",
          "Drizzle with olive oil",
          "Top with crushed walnuts",
        ],
        timing: "2hours",
        difficulty: "medium",
        prepTime: 30,
        diabeticFriendly: true,
        glycemicImpact: "medium",
      })
    }

    return meals
  }

  private createHydrationPlan(duration: number, weight: number) {
    const baseWater = Math.round(weight * 0.5) // 0.5 oz per pound
    const fastingBonus = Math.min(duration * 2, 16) // Extra water for longer fasts

    return {
      water: baseWater + fastingBonus,
      electrolytes: duration > 16,
      timing: [
        "Start with 8oz warm water with lemon",
        "Sip 4-6oz every 30 minutes",
        "Add electrolytes if fasting >16 hours",
        "Monitor urine color for hydration status",
      ],
    }
  }

  private recommendSupplements(duration: number, profile: any): string[] {
    const supplements = []

    if (duration > 16) {
      supplements.push("Electrolyte supplement (sodium, potassium, magnesium)")
    }

    if (duration > 24) {
      supplements.push("B-complex vitamin")
      supplements.push("Omega-3 fatty acids")
    }

    if (profile.diabetesType) {
      supplements.push("Chromium (consult doctor first)")
      supplements.push("Alpha-lipoic acid (consult doctor first)")
    }

    return supplements
  }

  private generateWarnings(duration: number, profile: any): string[] {
    const warnings = []

    if (duration > 24) {
      warnings.push("Break fast gradually - eating too much too quickly can cause digestive distress")
      warnings.push("Monitor blood sugar closely, especially if diabetic")
    }

    if (profile.medications?.length > 0) {
      warnings.push("Consult healthcare provider about medication timing with refeeding")
    }

    if (profile.diabetesType) {
      warnings.push("Check blood glucose before and after each refeeding phase")
      warnings.push("Have glucose tablets available in case of hypoglycemia")
    }

    warnings.push("Stop eating if you experience nausea, cramping, or discomfort")
    warnings.push("Chew slowly and eat mindfully to aid digestion")

    return warnings
  }

  private generateAIRecommendations(duration: number, type: string, profile: any): string[] {
    const recommendations = []

    // Personalized timing recommendations
    if (profile.activityLevel === "high") {
      recommendations.push("Consider breaking your fast 1-2 hours before your workout for optimal performance")
    }

    // Diabetes-specific recommendations
    if (profile.diabetesType === "type1") {
      recommendations.push("Monitor ketones if fasting >24 hours and adjust insulin accordingly")
    } else if (profile.diabetesType === "type2") {
      recommendations.push("Focus on protein and healthy fats first to minimize blood sugar spikes")
    }

    // Duration-specific recommendations
    if (duration < 16) {
      recommendations.push("Your fast was relatively short - you can resume normal eating patterns more quickly")
    } else if (duration > 48) {
      recommendations.push("Extended fast detected - take extra care with refeeding and consider medical supervision")
    }

    // Personalized meal timing
    const currentHour = new Date().getHours()
    if (currentHour < 10) {
      recommendations.push("Breaking fast in the morning - consider adding some complex carbs for sustained energy")
    } else if (currentHour > 18) {
      recommendations.push("Breaking fast in the evening - focus on lighter, easily digestible foods")
    }

    return recommendations
  }

  private getFallbackRefeedingPlan(duration: number, type: string): RefeedingPlan {
    return {
      id: `fallback_${Date.now()}`,
      fastingDuration: duration,
      fastingType: type,
      totalCalories: 350,
      meals: [
        {
          id: "fallback_gentle",
          name: "Simple Bone Broth",
          description: "Gentle way to break your fast",
          calories: 50,
          macros: { protein: 8, carbs: 2, fat: 1, fiber: 0 },
          ingredients: ["1 cup bone broth", "Pinch of salt"],
          instructions: ["Warm gently", "Sip slowly"],
          timing: "immediate",
          difficulty: "easy",
          prepTime: 5,
          diabeticFriendly: true,
          glycemicImpact: "low",
        },
        {
          id: "fallback_balanced",
          name: "Avocado & Protein",
          description: "Balanced refeeding meal",
          calories: 300,
          macros: { protein: 15, carbs: 10, fat: 20, fiber: 8 },
          ingredients: ["1/2 avocado", "2 eggs", "Spinach"],
          instructions: ["Scramble eggs gently", "Serve with avocado"],
          timing: "1hour",
          difficulty: "easy",
          prepTime: 10,
          diabeticFriendly: true,
          glycemicImpact: "low",
        },
      ],
      hydrationPlan: {
        water: 64,
        electrolytes: duration > 16,
        timing: ["Sip water regularly", "Add electrolytes if needed"],
      },
      supplements: duration > 16 ? ["Electrolytes"] : [],
      warnings: ["Break fast gently", "Monitor how you feel"],
      aiRecommendations: ["Take your time", "Listen to your body"],
    }
  }

  async saveRefeedingSession(planId: string, userId: string, feedback: any) {
    try {
      // In a real implementation, this would save to database
      console.log("Saving refeeding session:", { planId, userId, feedback })
      return true
    } catch (error) {
      console.warn("Error saving refeeding session:", error)
      return false
    }
  }

  async getRefeedingHistory(userId: string) {
    try {
      // In a real implementation, this would fetch from database
      return []
    } catch (error) {
      console.warn("Error fetching refeeding history:", error)
      return []
    }
  }
}
