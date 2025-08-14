import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Snowflake } from "lucide-react"
import type { Streak } from "@/lib/gamification"

interface StreakDisplayProps {
  streaks: Streak[]
  className?: string
}

export function StreakDisplay({ streaks, className }: StreakDisplayProps) {
  const getStreakIcon = (streakType: string) => {
    switch (streakType) {
      case "glucose_logging":
        return "🩸"
      case "meal_logging":
        return "🍽️"
      case "exercise_streak":
        return "🏃"
      case "overall_health":
        return "🌟"
      default:
        return "📊"
    }
  }

  const getStreakName = (streakType: string) => {
    switch (streakType) {
      case "glucose_logging":
        return "Glucose Guardian"
      case "meal_logging":
        return "Nutrition Ninja"
      case "exercise_streak":
        return "Fitness Fighter"
      case "overall_health":
        return "Master Health"
      default:
        return "Health Streak"
    }
  }

  const getFlameColor = (count: number) => {
    if (count >= 100) return "text-purple-500"
    if (count >= 30) return "text-pink-500"
    if (count >= 7) return "text-red-500"
    return "text-orange-500"
  }

  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      {streaks.map((streak) => (
        <Card key={streak.id} className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{getStreakIcon(streak.streak_type)}</span>
              <div>
                <h4 className="font-medium text-sm">{getStreakName(streak.streak_type)}</h4>
                <p className="text-xs text-muted-foreground">Best: {streak.longest_count} days</p>
              </div>
            </div>
            {streak.freeze_count > 0 && <Snowflake className="h-4 w-4 text-blue-400" />}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className={`h-5 w-5 ${getFlameColor(streak.current_count)}`} />
              <span className="font-bold text-lg">{streak.current_count}</span>
              <span className="text-sm text-muted-foreground">days</span>
            </div>

            {streak.current_count >= 7 && (
              <Badge variant="secondary" className="text-xs">
                {streak.current_count >= 100
                  ? "Legend"
                  : streak.current_count >= 30
                    ? "Master"
                    : streak.current_count >= 7
                      ? "Strong"
                      : ""}
              </Badge>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            Freezes: {streak.freeze_count}/{streak.max_freezes}
          </div>
        </Card>
      ))}
    </div>
  )
}
