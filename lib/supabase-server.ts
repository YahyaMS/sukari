import "server-only"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

// Type-safe reference to Next's cookies() function (erased at build time)
export type CookiesFn = typeof import("next/headers").cookies

// Factory: creates a Supabase client that can read auth cookies on the server
export function supabaseServer(cookiesFn: CookiesFn) {
  return createServerComponentClient({ cookies: cookiesFn })
}
