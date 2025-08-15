import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getChallenges } from "@/lib/challenges"

export async function GET() {
  try {
    const data = await getChallenges(cookies)
    return NextResponse.json({ data })
  } catch (error: any) {
    console.error("API Error fetching challenges:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
