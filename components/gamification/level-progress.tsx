import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { LEVEL_SYSTEM } from "@/lib/gamification"

interface LevelProgressProps {
  healthPoints: number
  level: number
  className?: string
}

export function LevelProgress({ healthPoints, level, className }: LevelProgressProps) {
  const currentLevelInfo = LEVEL_SYSTEM.find((l) => l.level === level) || LEVEL_SYSTEM[0]
  const nextLevelInfo = LEVEL_SYSTEM.find((l) => l.level === level + 1)

  const progressToNext = nextLevelInfo
    ? ((healthPoints - currentLevelInfo.hpRequired) / (nextLevelInfo.hpRequired - currentLevelInfo.hpRequired)) * 100
    : 100

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentLevelInfo.badge}</span>
          <div>
            <h3 className="font-semibold text-lg">{currentLevelInfo.name}</h3>
            <p className="text-sm text-muted-foreground">Level {level}</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          {healthPoints.toLocaleString()} HP
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress to {nextLevelInfo?.name || "Max Level"}</span>
          <span>{Math.round(progressToNext)}%</span>
        </div>
        <Progress value={Math.min(progressToNext, 100)} className="h-3 bg-gradient-to-r from-blue-200 to-purple-200" />
        {nextLevelInfo && (
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{currentLevelInfo.hpRequired.toLocaleString()} HP</span>
            <span>{nextLevelInfo.hpRequired.toLocaleString()} HP</span>
          </div>
        )}
      </div>
    </div>
  )
}
