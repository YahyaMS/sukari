// Client-side service functions that call server actions
import { getChallenges, getUserChallenges, joinChallenge } from "@/app/server/challenges"
import { getUserGamification, getUserAchievements, awardHealthPoints } from "@/app/server/gamification"
import { getFriends, getFriendRequests, getSocialFeed, sendFriendRequest } from "@/app/server/social"

// Re-export server actions for client components
export {
  getChallenges,
  getUserChallenges,
  joinChallenge,
  getUserGamification,
  getUserAchievements,
  awardHealthPoints,
  getFriends,
  getFriendRequests,
  getSocialFeed,
  sendFriendRequest,
}

// Client-side utilities that don't need server context
export const formatHealthPoints = (points: number): string => {
  return points.toLocaleString()
}

export const calculateLevel = (totalHP: number): number => {
  return Math.floor(totalHP / 100) + 1
}

export const getNextLevelProgress = (totalHP: number): number => {
  return (totalHP % 100) / 100
}
