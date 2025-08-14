import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type and size
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, JPG, and PNG files are allowed." },
        { status: 400 },
      )
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      return NextResponse.json({ error: "File size too large. Maximum size is 10MB." }, { status: 400 })
    }

    // Generate unique filename
    const uniqueFilename = `lab-results/${Date.now()}-${file.name}`

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: "public",
    })

    return NextResponse.json({
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("Lab results upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
