#!/usr/bin/env tsx

/**
 * Deployment validation script
 * Run this before deploying to catch issues early
 */

import { execSync } from "child_process"
import { existsSync, readFileSync } from "fs"

interface ValidationResult {
  name: string
  status: "pass" | "fail" | "warning"
  message: string
  details?: string[]
}

class DeploymentValidator {
  private results: ValidationResult[] = []

  private addResult(name: string, status: "pass" | "fail" | "warning", message: string, details?: string[]) {
    this.results.push({ name, status, message, details })
  }

  private runCommand(command: string): { success: boolean; output: string } {
    try {
      const output = execSync(command, { encoding: "utf8", stdio: "pipe" })
      return { success: true, output }
    } catch (error: any) {
      return { success: false, output: error.message || "Command failed" }
    }
  }

  async validateEnvironment() {
    console.log("🔍 Validating environment configuration...")

    // Check .env.local exists
    const envExists = existsSync(".env.local")
    if (!envExists) {
      this.addResult("Environment File", "fail", ".env.local file not found", [
        "Copy .env.example to .env.local",
        "Fill in required environment variables",
      ])
      return
    }

    // Check required environment variables
    const envContent = readFileSync(".env.local", "utf8")
    const requiredVars = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
      "BLOB_READ_WRITE_TOKEN",
    ]

    const missingVars = requiredVars.filter((varName) => !envContent.includes(varName))

    if (missingVars.length > 0) {
      this.addResult("Required Variables", "fail", "Missing required environment variables", missingVars)
    } else {
      this.addResult("Required Variables", "pass", "All required environment variables found")
    }

    // Check AI API keys
    const hasDeepSeek = envContent.includes("DEEPSEEK_API_KEY")
    const hasGemini = envContent.includes("GOOGLE_GENERATIVE_AI_API_KEY")

    if (!hasDeepSeek && !hasGemini) {
      this.addResult("AI API Keys", "fail", "No AI API keys configured", [
        "Add DEEPSEEK_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY",
        "At least one is required for AI features",
      ])
    } else if (!hasDeepSeek) {
      this.addResult("AI API Keys", "warning", "Only Gemini API key found, will fallback from DeepSeek")
    } else if (!hasGemini) {
      this.addResult("AI API Keys", "warning", "Only DeepSeek API key found, no fallback available")
    } else {
      this.addResult("AI API Keys", "pass", "Both DeepSeek and Gemini API keys configured")
    }
  }

  async validateTypeScript() {
    console.log("🔍 Validating TypeScript...")

    const { success, output } = this.runCommand("npx tsc --noEmit")

    if (success) {
      this.addResult("TypeScript", "pass", "No TypeScript errors found")
    } else {
      this.addResult("TypeScript", "fail", "TypeScript compilation errors", [output])
    }
  }

  async validateBuild() {
    console.log("🔍 Testing build...")

    const { success, output } = this.runCommand("npm run build")

    if (success) {
      this.addResult("Build", "pass", "Build completed successfully")
    } else {
      this.addResult("Build", "fail", "Build failed", [output])
    }
  }

  async validateDependencies() {
    console.log("🔍 Validating dependencies...")

    // Check package.json exists
    if (!existsSync("package.json")) {
      this.addResult("Dependencies", "fail", "package.json not found")
      return
    }

    // Check for critical dependencies
    const packageJson = JSON.parse(readFileSync("package.json", "utf8"))
    const criticalDeps = [
      "next",
      "react",
      "typescript",
      "@supabase/supabase-js",
      "@supabase/ssr",
      "ai",
      "@ai-sdk/google",
    ]

    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies }
    const missingDeps = criticalDeps.filter((dep) => !allDeps[dep])

    if (missingDeps.length > 0) {
      this.addResult("Dependencies", "fail", "Missing critical dependencies", missingDeps)
    } else {
      this.addResult("Dependencies", "pass", "All critical dependencies found")
    }

    // Check for deprecated packages
    const deprecatedPackages = ["@supabase/auth-helpers-nextjs", "@supabase/auth-helpers-shared"]

    const foundDeprecated = deprecatedPackages.filter((dep) => allDeps[dep])
    if (foundDeprecated.length > 0) {
      this.addResult("Deprecated Packages", "warning", "Found deprecated packages", [
        ...foundDeprecated,
        "Consider upgrading to @supabase/ssr",
      ])
    }
  }

  async validateConfiguration() {
    console.log("🔍 Validating configuration files...")

    // Check tsconfig.json
    if (!existsSync("tsconfig.json")) {
      this.addResult("TypeScript Config", "fail", "tsconfig.json not found")
    } else {
      const tsconfig = JSON.parse(readFileSync("tsconfig.json", "utf8"))
      if (tsconfig.compilerOptions?.paths?.["@/*"]) {
        this.addResult("TypeScript Config", "pass", "Path aliases configured correctly")
      } else {
        this.addResult("TypeScript Config", "warning", "Path aliases may not be configured")
      }
    }

    // Check next.config.mjs
    if (!existsSync("next.config.mjs") && !existsSync("next.config.js")) {
      this.addResult("Next.js Config", "warning", "No Next.js config file found")
    } else {
      this.addResult("Next.js Config", "pass", "Next.js config file found")
    }
  }

  printResults() {
    console.log("\n📊 Validation Results:")
    console.log("=".repeat(50))

    let passCount = 0
    let failCount = 0
    let warningCount = 0

    this.results.forEach((result) => {
      const icon = result.status === "pass" ? "✅" : result.status === "fail" ? "❌" : "⚠️"
      console.log(`${icon} ${result.name}: ${result.message}`)

      if (result.details) {
        result.details.forEach((detail) => {
          console.log(`   • ${detail}`)
        })
      }

      if (result.status === "pass") passCount++
      else if (result.status === "fail") failCount++
      else warningCount++
    })

    console.log("\n📈 Summary:")
    console.log(`✅ Passed: ${passCount}`)
    console.log(`❌ Failed: ${failCount}`)
    console.log(`⚠️  Warnings: ${warningCount}`)

    if (failCount === 0) {
      console.log("\n🎉 Deployment validation passed! Ready to deploy.")
      return true
    } else {
      console.log("\n🚨 Deployment validation failed. Please fix the issues above.")
      return false
    }
  }

  async run() {
    console.log("🚀 Starting deployment validation...\n")

    await this.validateEnvironment()
    await this.validateDependencies()
    await this.validateConfiguration()
    await this.validateTypeScript()
    await this.validateBuild()

    return this.printResults()
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new DeploymentValidator()
  validator
    .run()
    .then((success) => {
      process.exit(success ? 0 : 1)
    })
    .catch((error) => {
      console.error("Validation failed:", error)
      process.exit(1)
    })
}

export { DeploymentValidator }
