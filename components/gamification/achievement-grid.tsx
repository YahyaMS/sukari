import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Achievement } from "@/lib/gamification"
import { Lock, Trophy } from "lucide-react"

interface AchievementGridProps {
  achievements: Achievement[]
  className?: string
}

export function AchievementGrid({ achievements, className }: AchievementGridProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-green-200 bg-green-50"
      case "uncommon":
        return "border-blue-200 bg-blue-50"
      case "rare":
        return "border-orange-200 bg-orange-50"
      case "epic":
        return "border-purple-200 bg-purple-50"
      case "legendary":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-green-600"
      case "uncommon":
        return "text-blue-600"
      case "rare":
        return "text-orange-600"
      case "epic":
        return "text-purple-600"
      case "legendary":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  const completedAchievements = achievements.filter((a) => a.completed)
  const inProgressAchievements = achievements.filter((a) => !a.completed && (a.progress || 0) > 0)
  const lockedAchievements = achievements.filter((a) => !a.completed && (a.progress || 0) === 0)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Completed Achievements */}
      {completedAchievements.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Unlocked ({completedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedAchievements.map((achievement) => (
              <Card key={achievement.achievement_key} className={`p-4 ${getRarityColor(achievement.rarity)} border-2`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{achievement.badge_icon}</span>
                    <div>
                      <h4 className="font-semibold">{achievement.name}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                  <Badge className={getRarityTextColor(achievement.rarity)}>+{achievement.hp_reward} HP</Badge>
                </div>
                {achievement.unlocked_at && (
                  <p className="text-xs text-muted-foreground">
                    Unlocked {new Date(achievement.unlocked_at).toLocaleDateString()}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* In Progress Achievements */}
      {inProgressAchievements.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-3">In Progress ({inProgressAchievements.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgressAchievements.map((achievement) => (
              <Card key={achievement.achievement_key} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl opacity-70">{achievement.badge_icon}</span>
                    <div>
                      <h4 className="font-semibold">{achievement.name}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getRarityTextColor(achievement.rarity)}>
                    {achievement.rarity}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {achievement.progress}/{achievement.target}
                    </span>
                  </div>
                  <Progress value={((achievement.progress || 0) / (achievement.target || 1)) * 100} className="h-2" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Lock className="h-5 w-5 text-gray-400" />
            Locked ({lockedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedAchievements.map((achievement) => (
              <Card key={achievement.achievement_key} className="p-4 opacity-60">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl grayscale">{achievement.badge_icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-600">{achievement.name}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-gray-500">
                    +{achievement.hp_reward} HP
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
