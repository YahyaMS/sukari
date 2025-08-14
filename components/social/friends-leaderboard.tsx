import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Flame, Zap, Crown } from "lucide-react"
import type { Friend } from "@/lib/social"

interface FriendsLeaderboardProps {
  friends: Friend[]
  currentUserId: string
}

export function FriendsLeaderboard({ friends, currentUserId }: FriendsLeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />
      case 3:
        return <Trophy className="h-5 w-5 text-orange-500" />
      default:
        return <span className="text-sm font-bold text-gray-500">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500"
      case 3:
        return "bg-gradient-to-r from-orange-400 to-orange-600"
      default:
        return "bg-gradient-to-r from-blue-400 to-blue-600"
    }
  }

  if (friends.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No leaderboard yet</h3>
          <p className="text-gray-500">
            Add friends to see how you compare in your health journey! Friendly competition can be great motivation.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Friends Leaderboard
          </CardTitle>
          <CardDescription>See how you and your friends are doing this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {friends.map((friend, index) => (
              <div
                key={friend.id}
                className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                  friend.id === currentUserId
                    ? "border-blue-500 bg-blue-50"
                    : friend.rank && friend.rank <= 3
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10">
                    {getRankIcon(friend.rank || index + 1)}
                  </div>
                  <Avatar>
                    <AvatarFallback>
                      {friend.first_name?.[0]}
                      {friend.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold flex items-center gap-2">
                      {friend.first_name} {friend.last_name}
                      {friend.id === currentUserId && (
                        <Badge variant="secondary" className="text-xs">
                          You
                        </Badge>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">Level {friend.level || 1}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span className="font-bold">{friend.health_points?.toLocaleString() || 0}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Health Points</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="font-bold">{friend.longest_streak || 0}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Best Streak</p>
                  </div>

                  {friend.rank && friend.rank <= 3 && (
                    <Badge className={`${getRankColor(friend.rank)} text-white`}>
                      {friend.rank === 1 ? "Champion" : friend.rank === 2 ? "Runner-up" : "3rd Place"}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Most Health Points</CardTitle>
          </CardHeader>
          <CardContent>
            {friends[0] && (
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold text-sm">
                  {friends[0].first_name} {friends[0].last_name}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {friends[0].health_points?.toLocaleString()} HP
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Longest Streak</CardTitle>
          </CardHeader>
          <CardContent>
            {friends.sort((a, b) => (b.longest_streak || 0) - (a.longest_streak || 0))[0] && (
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="font-semibold text-sm">
                  {friends.sort((a, b) => (b.longest_streak || 0) - (a.longest_streak || 0))[0].first_name}{" "}
                  {friends.sort((a, b) => (b.longest_streak || 0) - (a.longest_streak || 0))[0].last_name}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {friends.sort((a, b) => (b.longest_streak || 0) - (a.longest_streak || 0))[0].longest_streak} days
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Highest Level</CardTitle>
          </CardHeader>
          <CardContent>
            {friends.sort((a, b) => (b.level || 0) - (a.level || 0))[0] && (
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-blue-500" />
                <span className="font-semibold text-sm">
                  {friends.sort((a, b) => (b.level || 0) - (a.level || 0))[0].first_name}{" "}
                  {friends.sort((a, b) => (b.level || 0) - (a.level || 0))[0].last_name}
                </span>
                <Badge variant="secondary" className="text-xs">
                  Level {friends.sort((a, b) => (b.level || 0) - (a.level || 0))[0].level}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
