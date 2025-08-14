"use client"

import React from "react"

// Application health monitoring
interface HealthCheck {
  service: string
  status: "healthy" | "degraded" | "unhealthy"
  responseTime?: number
  error?: string
  timestamp: string
}

interface SystemMetrics {
  memory?: number
  cpu?: number
  activeUsers?: number
  errorRate?: number
  responseTime?: number
}

class MonitoringService {
  private static instance: MonitoringService
  private healthChecks: Map<string, HealthCheck> = new Map()
  private metrics: SystemMetrics = {}

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService()
    }
    return MonitoringService.instance
  }

  // Check database connectivity
  async checkDatabase(): Promise<HealthCheck> {
    const startTime = Date.now()

    try {
      // Simple database ping
      const response = await fetch("/api/health/database", {
        method: "GET",
        timeout: 5000,
      })

      const responseTime = Date.now() - startTime
      const status = response.ok ? "healthy" : "degraded"

      const healthCheck: HealthCheck = {
        service: "database",
        status,
        responseTime,
        timestamp: new Date().toISOString(),
      }

      this.healthChecks.set("database", healthCheck)
      return healthCheck
    } catch (error) {
      const healthCheck: HealthCheck = {
        service: "database",
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      }

      this.healthChecks.set("database", healthCheck)
      return healthCheck
    }
  }

  // Check external API connectivity
  async checkExternalAPIs(): Promise<HealthCheck[]> {
    const apis = [
      { name: "supabase", url: "/api/health/supabase" },
      { name: "blob_storage", url: "/api/health/blob" },
    ]

    const checks = await Promise.all(
      apis.map(async (api) => {
        const startTime = Date.now()

        try {
          const response = await fetch(api.url, {
            method: "GET",
            timeout: 5000,
          })

          const responseTime = Date.now() - startTime
          const status = response.ok ? "healthy" : "degraded"

          const healthCheck: HealthCheck = {
            service: api.name,
            status,
            responseTime,
            timestamp: new Date().toISOString(),
          }

          this.healthChecks.set(api.name, healthCheck)
          return healthCheck
        } catch (error) {
          const healthCheck: HealthCheck = {
            service: api.name,
            status: "unhealthy",
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
          }

          this.healthChecks.set(api.name, healthCheck)
          return healthCheck
        }
      }),
    )

    return checks
  }

  // Get overall system health
  getSystemHealth(): {
    status: "healthy" | "degraded" | "unhealthy"
    services: HealthCheck[]
    metrics: SystemMetrics
  } {
    const services = Array.from(this.healthChecks.values())

    let status: "healthy" | "degraded" | "unhealthy" = "healthy"

    if (services.some((s) => s.status === "unhealthy")) {
      status = "unhealthy"
    } else if (services.some((s) => s.status === "degraded")) {
      status = "degraded"
    }

    return {
      status,
      services,
      metrics: this.metrics,
    }
  }

  // Update system metrics
  updateMetrics(metrics: Partial<SystemMetrics>) {
    this.metrics = { ...this.metrics, ...metrics }
  }

  // Log critical errors
  logCriticalError(error: Error, context: string) {
    const errorLog = {
      level: "critical",
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "server",
      url: typeof window !== "undefined" ? window.location.href : "server",
    }

    // In production, send to error monitoring service
    if (process.env.NODE_ENV === "production") {
      this.sendToErrorService(errorLog)
    } else {
      console.error("🚨 Critical Error:", errorLog)
    }
  }

  private async sendToErrorService(errorLog: any) {
    try {
      await fetch("/api/monitoring/errors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(errorLog),
      })
    } catch (error) {
      console.error("Failed to send error log:", error)
    }
  }
}

export const monitoring = MonitoringService.getInstance()

// React hook for monitoring
export function useMonitoring() {
  const [systemHealth, setSystemHealth] = React.useState<{
    status: "healthy" | "degraded" | "unhealthy"
    services: HealthCheck[]
    metrics: SystemMetrics
  } | null>(null)

  const checkHealth = async () => {
    await monitoring.checkDatabase()
    await monitoring.checkExternalAPIs()
    setSystemHealth(monitoring.getSystemHealth())
  }

  const logError = (error: Error, context: string) => {
    monitoring.logCriticalError(error, context)
  }

  return {
    systemHealth,
    checkHealth,
    logError,
  }
}
