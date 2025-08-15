import { createClient } from "./supabase/client"

export interface UserGamification {
  id: string
  user_id: string
  health_points: number
  level: number
  total_hp_earned: number
  level_progress: number
}

export interface Streak {
  id: string
  user_id: string
  streak_type: string
  current_count: number
  longest_count: number
  last_activity_date: string
  freeze_count: number
  max_freezes: number
  is_active: boolean
}

export interface Achievement {
  achievement_key: string
  name: string
  description: string
  category: string
  badge_icon: string
  hp_reward: number
  rarity: string
  progress?: number
  target?: number
  completed?: boolean
  unlocked_at?: string
}

export interface HPActivity {
  id: string
  activity_type: string
  hp_earned: number
  description: string
  created_at: string
}

// Health Points earning structure
export const HP_REWARDS = {
  logGlucose: 10,
  logMeal: 15,
  logWeight: 5,
  logExercise: 20,
  completeCoachTask: 25,
  takeProgressPhoto: 10,
  logMedication: 5,
  drinkWaterGoal: 10,
  streakBonus: 50,
  achievementUnlock: 100,
}

// Level system configuration
export const LEVEL_SYSTEM = [
  { level: 1, name: "Health Novice", hpRequired: 0, badge: "🌱" },
  { level: 2, name: "Glucose Guardian", hpRequired: 100, badge: "🛡️" },
  { level: 3, name: "Meal Master", hpRequired: 300, badge: "🍎" },
  { level: 4, name: "Exercise Expert", hpRequired: 600, badge: "💪" },
  { level: 5, name: "Wellness Warrior", hpRequired: 1000, badge: "⚔️" },
  { level: 10, name: "Health Hero", hpRequired: 5000, badge: "🦸" },
  { level: 15, name: "Diabetes Destroyer", hpRequired: 12000, badge: "🏆" },
  { level: 20, name: "Metabolic Master", hpRequired: 25000, badge: "👑" },
]

export class GamificationService {
  private supabase = createClient()

  private isTableNotFoundError(error: any): boolean {
    return (
      error?.code === "PGRST116" || error?.message?.includes("relation") || error?.message?.includes("does not exist")
    )
  }

  async getUserGamification(userId: string): Promise<UserGamification | null> {
    try {
      const { data, error } = await this.supabase.from("user_gamification").select("*").eq("user_id", userId).single()

      if (error) {
        if (this.isTableNotFoundError(error)) {
          console.warn("Gamification tables not yet created, returning default values")
          return null
        }
        console.error("Error fetching user gamification:", error)
        return null
      }

      return data
    } catch (error) {
      console.warn("Database error, gamification tables may not exist yet:", error)
      return null
    }
  }

  async getUserStreaks(userId: string): Promise<Streak[]> {
    try {
      const { data, error } = await this.supabase
        .from("streaks")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)

      if (error) {
        if (this.isTableNotFoundError(error)) {
          console.warn("Streaks table not yet created, returning empty array")
          return []
        }
        console.error("Error fetching user streaks:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.warn("Database error, streaks table may not exist yet:", error)
      return []
    }
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    try {
      const { data, error } = await this.supabase
        .from("user_achievements")
        .select(`
          *,
          achievements (
            name,
            description,
            category,
            badge_icon,
            hp_reward,
            rarity
          )
        `)
        .eq("user_id", userId)

      if (error) {
        if (this.isTableNotFoundError(error)) {
          console.warn("Achievements tables not yet created, returning empty array")
          return []
        }
        console.error("Error fetching user achievements:", error)
        return []
      }

      return (
        data?.map((item) => ({
          achievement_key: item.achievement_key,
          name: item.achievements.name,
          description: item.achievements.description,
          category: item.achievements.category,
          badge_icon: item.achievements.badge_icon,
          hp_reward: item.achievements.hp_reward,
          rarity: item.achievements.rarity,
          progress: item.progress,
          target: item.target,
          completed: item.completed,
          unlocked_at: item.unlocked_at,
        })) || []
      )
    } catch (error) {
      console.warn("Database error, achievements tables may not exist yet:", error)
      return []
    }
  }

  async getRecentHPActivities(userId: string, limit = 10): Promise<HPActivity[]> {
    try {
      const { data, error } = await this.supabase
        .from("hp_activities")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) {
        if (this.isTableNotFoundError(error)) {
          console.warn("HP activities table not yet created, returning empty array")
          return []
        }
        console.error("Error fetching HP activities:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.warn("Database error, HP activities table may not exist yet:", error)
      return []
    }
  }

  async awardHealthPoints(
    userId: string,
    activityType: keyof typeof HP_REWARDS,
    description?: string,
    referenceId?: string,
  ): Promise<boolean> {
    const hpAmount = HP_REWARDS[activityType]

    try {
      // Try stored procedure first
      const { error } = await this.supabase.rpc("award_health_points", {
        user_id: userId,
        activity_type: activityType,
        hp_amount: hpAmount,
        description: description || `Earned ${hpAmount} HP for ${activityType}`,
        reference_id: referenceId,
      })

      if (error) {
        console.warn("Stored procedure not available, using fallback HP awarding:", error.message)
        return await this.awardHealthPointsFallback(userId, activityType, hpAmount, description)
      }

      return true
    } catch (error) {
      console.warn("Error with stored procedure, using fallback:", error)
      return await this.awardHealthPointsFallback(userId, activityType, hpAmount, description)
    }
  }

  private async awardHealthPointsFallback(
    userId: string,
    activityType: string,
    hpAmount: number,
    description?: string,
  ): Promise<boolean> {
    try {
      // Check if tables exist
      const { error: testError } = await this.supabase.from("user_gamification").select("id").limit(1)

      if (testError && this.isTableNotFoundError(testError)) {
        console.warn("Gamification tables don't exist yet, HP awarding skipped")
        return false
      }

      // Get or create user gamification record
      let { data: userGamification, error: fetchError } = await this.supabase
        .from("user_gamification")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (fetchError || !userGamification) {
        // Create new gamification record
        const { data: newRecord, error: createError } = await this.supabase
          .from("user_gamification")
          .insert({
            user_id: userId,
            health_points: hpAmount,
            level: 1,
            total_hp_earned: hpAmount,
            level_progress: 0,
          })
          .select()
          .single()

        if (createError) {
          console.error("Error creating gamification record:", createError)
          return false
        }
        userGamification = newRecord
      } else {
        // Update existing record
        const newHP = userGamification.health_points + hpAmount
        const newTotalHP = userGamification.total_hp_earned + hpAmount
        const levelInfo = this.getLevelInfo(newHP)

        const { error: updateError } = await this.supabase
          .from("user_gamification")
          .update({
            health_points: newHP,
            level: levelInfo.currentLevel.level,
            total_hp_earned: newTotalHP,
            level_progress: levelInfo.progressToNext,
          })
          .eq("user_id", userId)

        if (updateError) {
          console.error("Error updating gamification record:", updateError)
          return false
        }
      }

      // Log HP activity
      const { error: activityError } = await this.supabase.from("hp_activities").insert({
        user_id: userId,
        activity_type: activityType,
        hp_earned: hpAmount,
        description: description || `Earned ${hpAmount} HP for ${activityType}`,
        reference_id: null,
      })

      if (activityError) {
        console.warn("Error logging HP activity:", activityError)
        // Don't fail the whole operation if activity logging fails
      }

      console.log(`Successfully awarded ${hpAmount} HP to user ${userId} for ${activityType}`)
      return true
    } catch (error) {
      console.error("Error in fallback HP awarding:", error)
      return false
    }
  }

  async updateStreak(userId: string, streakType: string): Promise<boolean> {
    const { error } = await this.supabase.rpc("update_streak", {
      user_id: userId,
      streak_type: streakType,
    })

    if (error) {
      console.error("Error updating streak:", error)
      return false
    }

    return true
  }

  async initializeUserGamification(userId: string): Promise<boolean> {
    try {
      // Try to use the stored function first
      const { error } = await this.supabase.rpc("initialize_user_gamification", {
        user_id: userId,
      })

      if (error) {
        console.warn("Stored function not available, using fallback initialization:", error.message)
        return await this.initializeUserGamificationFallback(userId)
      }

      return true
    } catch (error) {
      console.warn("Error with stored function, using fallback:", error)
      return await this.initializeUserGamificationFallback(userId)
    }
  }

  private async initializeUserGamificationFallback(userId: string): Promise<boolean> {
    try {
      const { error: testError } = await this.supabase.from("user_gamification").select("id").limit(1)

      if (testError && this.isTableNotFoundError(testError)) {
        console.warn("Gamification tables don't exist yet, skipping initialization")
        return false
      }

      // Create gamification profile
      const { error: gamificationError } = await this.supabase.from("user_gamification").upsert(
        {
          user_id: userId,
          health_points: 0,
          level: 1,
          total_hp_earned: 0,
          level_progress: 0,
        },
        {
          onConflict: "user_id",
          ignoreDuplicates: true,
        },
      )

      if (gamificationError) {
        console.error("Error creating gamification profile:", gamificationError)
        return false
      }

      // Initialize streak types
      const streakTypes = ["glucose_logging", "meal_logging", "exercise_streak", "overall_health"]
      for (const streakType of streakTypes) {
        const { error: streakError } = await this.supabase.from("streaks").upsert(
          {
            user_id: userId,
            streak_type: streakType,
            current_count: 0,
            longest_count: 0,
            freeze_count: 0,
            max_freezes: 2,
            is_active: true,
          },
          {
            onConflict: "user_id,streak_type",
            ignoreDuplicates: true,
          },
        )

        if (streakError) {
          console.error(`Error creating ${streakType} streak:`, streakError)
        }
      }

      return true
    } catch (error) {
      console.error("Error in fallback initialization:", error)
      return false
    }
  }

  async getOrCreateUserGamification(userId: string): Promise<UserGamification | null> {
    let gamification = await this.getUserGamification(userId)

    if (!gamification) {
      // Try to initialize gamification for the user
      const initialized = await this.initializeUserGamification(userId)
      if (initialized) {
        // Try to fetch again after initialization
        gamification = await this.getUserGamification(userId)
      }

      if (!gamification) {
        console.info("Returning default gamification values - run SQL scripts to enable full gamification features")
        return {
          id: `default-${userId}`,
          user_id: userId,
          health_points: 0,
          level: 1,
          total_hp_earned: 0,
          level_progress: 0,
        }
      }
    }

    return gamification
  }

  getLevelInfo(healthPoints: number) {
    let currentLevel = LEVEL_SYSTEM[0]
    let nextLevel = LEVEL_SYSTEM[1]

    for (let i = 0; i < LEVEL_SYSTEM.length; i++) {
      if (healthPoints >= LEVEL_SYSTEM[i].hpRequired) {
        currentLevel = LEVEL_SYSTEM[i]
        nextLevel = LEVEL_SYSTEM[i + 1] || LEVEL_SYSTEM[i]
      } else {
        break
      }
    }

    const progressToNext =
      nextLevel.hpRequired > currentLevel.hpRequired
        ? ((healthPoints - currentLevel.hpRequired) / (nextLevel.hpRequired - currentLevel.hpRequired)) * 100
        : 100

    return {
      currentLevel,
      nextLevel,
      progressToNext: Math.min(progressToNext, 100),
    }
  }

  getStreakFlameColor(streakCount: number): string {
    if (streakCount >= 100) return "text-purple-500"
    if (streakCount >= 30) return "text-pink-500"
    if (streakCount >= 7) return "text-red-500"
    return "text-orange-500"
  }

  getRarityColor(rarity: string): string {
    switch (rarity) {
      case "common":
        return "text-green-500"
      case "uncommon":
        return "text-blue-500"
      case "rare":
        return "text-orange-500"
      case "epic":
        return "text-purple-500"
      case "legendary":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }
}

export async function getUserGamification(userId: string): Promise<UserGamification | null> {
  const service = new GamificationService()
  return service.getUserGamification(userId)
}

export async function getUserStreaks(userId: string): Promise<Streak[]> {
  const service = new GamificationService()
  return service.getUserStreaks(userId)
}

export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  const service = new GamificationService()
  return service.getUserAchievements(userId)
}

export async function getRecentHPActivities(userId: string, limit = 10): Promise<HPActivity[]> {
  const service = new GamificationService()
  return service.getRecentHPActivities(userId, limit)
}

export async function awardHealthPoints(
  userId: string,
  activityType: keyof typeof HP_REWARDS,
  description?: string,
  referenceId?: string,
): Promise<boolean> {
  const service = new GamificationService()
  return service.awardHealthPoints(userId, activityType, description, referenceId)
}

export async function getOrCreateUserGamification(userId: string): Promise<UserGamification | null> {
  const service = new GamificationService()
  return service.getOrCreateUserGamification(userId)
}
