"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Sign in action with password
export async function signInWithPassword(email: string, password: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Sign up action with password
export async function signUpWithPassword(email: string, password: string, firstName: string, lastName: string) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard`,
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { success: "Check your email to confirm your account." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Sign in action
export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Sign up action
export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const firstName = formData.get("firstName")
  const lastName = formData.get("lastName")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const { error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard`,
        data: {
          first_name: firstName?.toString() || "",
          last_name: lastName?.toString() || "",
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { success: "Check your email to confirm your account." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Sign out action
export async function signOut() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  await supabase.auth.signOut()
  redirect("/auth/login")
}

// Update user profile action
export async function updateProfile(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const firstName = formData.get("firstName")
  const lastName = formData.get("lastName")
  const phone = formData.get("phone")
  const dateOfBirth = formData.get("dateOfBirth")
  const gender = formData.get("gender")
  const heightCm = formData.get("heightCm")

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Not authenticated" }
    }

    const { error } = await supabase.from("user_profiles").upsert({
      id: user.id,
      first_name: firstName?.toString(),
      last_name: lastName?.toString(),
      phone: phone?.toString(),
      date_of_birth: dateOfBirth?.toString() || null,
      gender: gender?.toString(),
      height_cm: heightCm ? Number.parseInt(heightCm.toString()) : null,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      return { error: error.message }
    }

    return { success: "Profile updated successfully" }
  } catch (error) {
    console.error("Profile update error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Save medical profile action
export async function saveMedicalProfile(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const conditionType = formData.get("conditionType")
  const diagnosisDate = formData.get("diagnosisDate")
  const medications = formData.get("medications")
  const allergies = formData.get("allergies")
  const dietaryRestrictions = formData.get("dietaryRestrictions")
  const targetHba1c = formData.get("targetHba1c")
  const targetWeight = formData.get("targetWeight")

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Not authenticated" }
    }

    const { error } = await supabase.from("medical_profiles").upsert({
      user_id: user.id,
      condition_type: conditionType?.toString(),
      diagnosis_date: diagnosisDate?.toString() || null,
      current_medications: medications ? JSON.parse(medications.toString()) : [],
      allergies: allergies
        ? allergies
            .toString()
            .split(",")
            .map((a) => a.trim())
        : [],
      dietary_restrictions: dietaryRestrictions
        ? dietaryRestrictions
            .toString()
            .split(",")
            .map((d) => d.trim())
        : [],
      target_hba1c: targetHba1c ? Number.parseFloat(targetHba1c.toString()) : null,
      target_weight_kg: targetWeight ? Number.parseFloat(targetWeight.toString()) : null,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      return { error: error.message }
    }

    return { success: "Medical profile saved successfully" }
  } catch (error) {
    console.error("Medical profile save error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}
