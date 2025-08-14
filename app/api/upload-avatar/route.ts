import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { filename, contentType } = await request.json()

    // Generate unique filename
    const uniqueFilename = `avatars/${Date.now()}-${filename}`

    // Create upload URL
    const blob = await put(uniqueFilename, new Blob(), {
      access: "public",
      contentType,
    })

    return NextResponse.json({
      url: blob.url,
      downloadUrl: blob.url,
    })
  } catch (error) {
    console.error("Error creating upload URL:", error)
    return NextResponse.json({ error: "Failed to create upload URL" }, { status: 500 })
  }
}
