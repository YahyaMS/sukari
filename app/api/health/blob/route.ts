import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if Blob storage is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ status: "unhealthy", error: "Blob storage not configured" }, { status: 500 })
    }

    return NextResponse.json({ status: "healthy", timestamp: new Date().toISOString() })
  } catch (error) {
    return NextResponse.json({ status: "unhealthy", error: "Blob storage check failed" }, { status: 500 })
  }
}
