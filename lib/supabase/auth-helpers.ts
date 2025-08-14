import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export async function signInWithGoogleClient() {
  const supabase = createClientComponentClient()

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/dashboard`,
      },
    })

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Google sign in error:", error)
    throw error
  }
}
