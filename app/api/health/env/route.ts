import { NextResponse } from "next/server"
import { validateServerEnv, getAvailableAIProviders, isBlobStorageAvailable } from "@/lib/env-validation"

/**
 * Health check endpoint for environment configuration
 * Returns the status of required environment variables
 */
export async function GET() {
  try {
    // Validate environment variables
    const env = validateServerEnv()
    const aiProviders = getAvailableAIProviders()
    const blobAvailable = isBlobStorageAvailable()

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      configuration: {
        supabase: {
          configured: !!(
            env.NEXT_PUBLIC_SUPABASE_URL &&
            env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
            env.SUPABASE_SERVICE_ROLE_KEY
          ),
          url: env.NEXT_PUBLIC_SUPABASE_URL ? "configured" : "missing",
          keys: {
            anon: env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "configured" : "missing",
            service: env.SUPABASE_SERVICE_ROLE_KEY ? "configured" : "missing",
          },
        },
        ai: {
          available: aiProviders.hasAnyProvider,
          primary: aiProviders.primaryProvider,
          providers: {
            deepseek: aiProviders.deepseek,
            gemini: aiProviders.gemini,
          },
        },
        storage: {
          blob: blobAvailable,
        },
        urls: {
          site: env.NEXT_PUBLIC_SITE_URL || "default",
          app: env.NEXT_PUBLIC_APP_URL || "not set",
          devRedirect: env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || "not set",
        },
      },
    })
  } catch (error) {
    console.error("Environment validation failed:", error)

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Environment configuration error",
        help: {
          documentation: "Check .env.example for required variables",
          integrations: "Add Supabase and Blob integrations in Vercel dashboard",
          apiKeys: "Get AI API keys from DeepSeek and/or Google AI Studio",
        },
      },
      { status: 500 },
    )
  }
}
