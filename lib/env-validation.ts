/**
 * Environment variable validation utility
 * Validates required environment variables and provides helpful error messages
 */

interface EnvConfig {
  // Supabase (Required)
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY: string

  // AI APIs (At least one required)
  DEEPSEEK_API_KEY?: string
  GOOGLE_GENERATIVE_AI_API_KEY?: string

  // Blob Storage (Required for file uploads)
  BLOB_READ_WRITE_TOKEN: string

  // Optional
  NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL?: string
  NEXT_PUBLIC_SITE_URL?: string
  NEXT_PUBLIC_APP_URL?: string
  NODE_ENV?: string
}

class EnvironmentValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "EnvironmentValidationError"
  }
}

/**
 * Validates that all required environment variables are present
 * @throws {EnvironmentValidationError} If required variables are missing
 */
export function validateEnvironmentVariables(): EnvConfig {
  const missing: string[] = []
  const warnings: string[] = []

  // Required Supabase variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL")
  if (!supabaseAnonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  if (!supabaseServiceKey) missing.push("SUPABASE_SERVICE_ROLE_KEY")

  // AI API keys (at least one required)
  const deepseekKey = process.env.DEEPSEEK_API_KEY
  const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

  if (!deepseekKey && !geminiKey) {
    missing.push("DEEPSEEK_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY (at least one required)")
  }

  if (!deepseekKey) {
    warnings.push("DEEPSEEK_API_KEY not found - will fallback to Google Gemini")
  }

  if (!geminiKey) {
    warnings.push("GOOGLE_GENERATIVE_AI_API_KEY not found - will fallback to DeepSeek")
  }

  // Blob storage (required for file uploads)
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  if (!blobToken) missing.push("BLOB_READ_WRITE_TOKEN")

  // Throw error if any required variables are missing
  if (missing.length > 0) {
    const errorMessage = [
      "❌ Missing required environment variables:",
      ...missing.map((key) => `  - ${key}`),
      "",
      "📝 Please check your .env.local file and ensure all required variables are set.",
      "📖 See .env.example for reference.",
      "",
      "🔗 Integration setup:",
      "  - Supabase: Add integration in Vercel dashboard",
      "  - Blob Storage: Add integration in Vercel dashboard",
      "  - AI APIs: Get keys from DeepSeek/Google AI Studio",
    ].join("\n")

    throw new EnvironmentValidationError(errorMessage)
  }

  // Log warnings for optional but recommended variables
  if (warnings.length > 0 && process.env.NODE_ENV === "development") {
    console.warn("⚠️  Environment warnings:")
    warnings.forEach((warning) => console.warn(`  - ${warning}`))
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey!,
    SUPABASE_SERVICE_ROLE_KEY: supabaseServiceKey!,
    DEEPSEEK_API_KEY: deepseekKey,
    GOOGLE_GENERATIVE_AI_API_KEY: geminiKey,
    BLOB_READ_WRITE_TOKEN: blobToken!,
    NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
  }
}

/**
 * Gets validated environment configuration
 * Safe to use after validateEnvironmentVariables() has been called
 */
export function getEnvConfig(): EnvConfig {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN!,
    NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
  }
}

/**
 * Validates environment variables for server-side usage
 * Use this in API routes and server components
 */
export function validateServerEnv() {
  try {
    return validateEnvironmentVariables()
  } catch (error) {
    if (error instanceof EnvironmentValidationError) {
      console.error(error.message)
      throw new Error("Server configuration error - check environment variables")
    }
    throw error
  }
}

/**
 * Checks if AI features are available based on API keys
 */
export function getAvailableAIProviders() {
  const deepseekAvailable = !!process.env.DEEPSEEK_API_KEY
  const geminiAvailable = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY

  return {
    deepseek: deepseekAvailable,
    gemini: geminiAvailable,
    hasAnyProvider: deepseekAvailable || geminiAvailable,
    primaryProvider: deepseekAvailable ? "deepseek" : geminiAvailable ? "gemini" : null,
  }
}

/**
 * Checks if blob storage is configured
 */
export function isBlobStorageAvailable(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN
}

/**
 * Gets the appropriate site URL for the current environment
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  return "http://localhost:3000"
}
