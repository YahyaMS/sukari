import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { CommunityService } from "@/lib/community"
import { CommunityGroupsClient } from "@/components/community/community-groups-client"

export default async function SupportGroupsPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const communityService = new CommunityService()
  const allGroups = await communityService.getAllGroups()
  const userGroups = await communityService.getUserGroups(user.id)
  const recommendedGroups = await communityService.getRecommendedGroups(user.id)

  return (
    <CommunityGroupsClient
      allGroups={allGroups}
      userGroups={userGroups}
      recommendedGroups={recommendedGroups}
      userId={user.id}
    />
  )
}
