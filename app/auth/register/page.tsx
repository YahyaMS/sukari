"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Icon3D } from "@/components/ui/3d-icon"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { signUpWithPassword } from "@/lib/actions"
import { signInWithGoogleClient } from "@/lib/supabase/auth-helpers"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [agreedToHipaa, setAgreedToHipaa] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!agreedToTerms || !agreedToHipaa) {
      setError("Please agree to the terms and HIPAA authorization")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)

    try {
      const result = await signUpWithPassword(formData.email, formData.password, formData.firstName, formData.lastName)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(result.success || "Account created successfully! Check your email to confirm.")
        // Redirect to medical onboarding after a short delay
        setTimeout(() => {
          router.push("/onboarding/medical")
        }, 2000)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    setError("")

    try {
      await signInWithGoogleClient()
      // The redirect will happen automatically, no need to manually navigate
    } catch (err: any) {
      setError(err.message || "Failed to sign up with Google. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#21262d] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#8b5cf6]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#3b82f6]/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#10b981]/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6 group">
            <Icon3D
              shape="sphere"
              color="gradient"
              size="lg"
              glow
              className="group-hover:scale-110 transition-transform"
            />
            <span className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              MetaReverse
            </span>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Start Your Journey</h1>
          <p className="text-gray-300">Create your account to begin health transformation</p>
        </div>

        <Card className="glass-card border-white/10 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Create Account</CardTitle>
            <CardDescription className="text-gray-300">Fill in your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 text-sm text-red-300 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 text-sm text-green-300 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-200 font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-[#8b5cf6]/50 focus:ring-[#8b5cf6]/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-200 font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-[#8b5cf6]/50 focus:ring-[#8b5cf6]/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-[#8b5cf6]/50 focus:ring-[#8b5cf6]/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-200 font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-[#8b5cf6]/50 focus:ring-[#8b5cf6]/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-[#8b5cf6]/50 focus:ring-[#8b5cf6]/20 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-white/10 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-200 font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-[#8b5cf6]/50 focus:ring-[#8b5cf6]/20 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-white/10 text-gray-400 hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-300">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#8b5cf6] hover:text-[#7c3aed] transition-colors">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#8b5cf6] hover:text-[#7c3aed] transition-colors">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hipaa"
                    checked={agreedToHipaa}
                    onCheckedChange={(checked) => setAgreedToHipaa(checked as boolean)}
                  />
                  <Label htmlFor="hipaa" className="text-sm text-gray-300">
                    I authorize the collection and use of my health information as described in the{" "}
                    <Link href="/hipaa" className="text-[#8b5cf6] hover:text-[#7c3aed] transition-colors">
                      HIPAA Authorization
                    </Link>
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary hover:scale-105 transition-all duration-200 shadow-lg text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <Separator className="my-6 bg-white/20" />

            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
              >
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full bg-white/5 border-white/20 text-gray-400 cursor-not-allowed"
                disabled
              >
                Continue with Apple (Coming Soon)
              </Button>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-300">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-[#8b5cf6] hover:text-[#7c3aed] transition-colors font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
