"use client"

import React from "react"

// Privacy-compliant analytics for health management app
interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  timestamp: string
  sessionId: string
  userId?: string // Hashed user ID, never actual user data
}

interface HealthMetrics {
  feature: string
  action: string
  category: "tracking" | "social" | "ai" | "gamification" | "coaching"
  value?: number
  metadata?: Record<string, any>
}

class AnalyticsService {
  private static instance: AnalyticsService
  private sessionId: string
  private userId?: string
  private events: AnalyticsEvent[] = []
  private isProduction: boolean

  constructor() {
    this.sessionId = this.generateSessionId()
    this.isProduction = process.env.NODE_ENV === "production"
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private hashUserId(userId: string): string {
    // Simple hash for privacy - in production, use proper hashing
    let hash = 0
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return `user_${Math.abs(hash)}`
  }

  setUserId(userId: string) {
    this.userId = this.hashUserId(userId)
  }

  // Track general app events
  track(event: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: this.sanitizeProperties(properties),
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
    }

    this.events.push(analyticsEvent)

    if (this.isProduction) {
      this.sendToAnalyticsService(analyticsEvent)
    } else {
      console.log("📊 Analytics Event:", analyticsEvent)
    }
  }

  // Track health-specific metrics (privacy-compliant)
  trackHealthMetric(metrics: HealthMetrics) {
    const event = `health_${metrics.category}_${metrics.action}`
    const properties = {
      feature: metrics.feature,
      category: metrics.category,
      // Never include actual health values, only patterns
      hasValue: metrics.value !== undefined,
      metadata: this.sanitizeProperties(metrics.metadata),
    }

    this.track(event, properties)
  }

  // Track user engagement patterns
  trackEngagement(action: string, feature: string, duration?: number) {
    this.track("user_engagement", {
      action,
      feature,
      duration,
      timestamp: Date.now(),
    })
  }

  // Track feature usage
  trackFeatureUsage(feature: string, action: "view" | "interact" | "complete") {
    this.track("feature_usage", {
      feature,
      action,
      timestamp: Date.now(),
    })
  }

  // Track errors (sanitized)
  trackError(error: Error, context?: string) {
    this.track("error_occurred", {
      errorType: error.name,
      context,
      hasStack: !!error.stack,
      timestamp: Date.now(),
      // Never include actual error messages that might contain PII
    })
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number, context?: string) {
    this.track("performance_metric", {
      metric,
      value,
      context,
      timestamp: Date.now(),
    })
  }

  private sanitizeProperties(properties?: Record<string, any>): Record<string, any> | undefined {
    if (!properties) return undefined

    const sanitized: Record<string, any> = {}

    for (const [key, value] of Object.entries(properties)) {
      // Remove any potential PII
      if (this.isPotentialPII(key, value)) {
        continue
      }

      // Sanitize values
      if (typeof value === "string" && value.length > 100) {
        sanitized[key] = `${value.substring(0, 100)}...`
      } else if (typeof value === "number" && key.includes("glucose")) {
        // For health values, only track ranges for privacy
        sanitized[key] = this.getHealthValueRange(value)
      } else {
        sanitized[key] = value
      }
    }

    return sanitized
  }

  private isPotentialPII(key: string, value: any): boolean {
    const piiKeys = ["email", "name", "phone", "address", "ssn", "dob"]
    const keyLower = key.toLowerCase()

    return piiKeys.some((piiKey) => keyLower.includes(piiKey)) || (typeof value === "string" && value.includes("@"))
  }

  private getHealthValueRange(value: number): string {
    // Convert actual health values to ranges for privacy
    if (value < 70) return "low"
    if (value < 100) return "normal"
    if (value < 140) return "elevated"
    return "high"
  }

  private async sendToAnalyticsService(event: AnalyticsEvent) {
    try {
      // In production, send to your analytics service
      // Example: Mixpanel, Amplitude, or custom analytics endpoint
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      })
    } catch (error) {
      console.error("Failed to send analytics event:", error)
    }
  }

  // Get analytics summary (for admin dashboard)
  getSessionSummary() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      eventCount: this.events.length,
      sessionDuration: Date.now() - Number.parseInt(this.sessionId.split("_")[1]),
      features: [...new Set(this.events.map((e) => e.properties?.feature).filter(Boolean))],
    }
  }
}

export const analytics = AnalyticsService.getInstance()

// React hooks for analytics
export function useAnalytics() {
  const trackEvent = (event: string, properties?: Record<string, any>) => {
    analytics.track(event, properties)
  }

  const trackHealthMetric = (metrics: HealthMetrics) => {
    analytics.trackHealthMetric(metrics)
  }

  const trackFeatureUsage = (feature: string, action: "view" | "interact" | "complete") => {
    analytics.trackFeatureUsage(feature, action)
  }

  const trackEngagement = (action: string, feature: string, duration?: number) => {
    analytics.trackEngagement(action, feature, duration)
  }

  return {
    trackEvent,
    trackHealthMetric,
    trackFeatureUsage,
    trackEngagement,
  }
}

// Page view tracking hook
export function usePageView(pageName: string) {
  React.useEffect(() => {
    analytics.track("page_view", {
      page: pageName,
      timestamp: Date.now(),
    })

    const startTime = Date.now()

    return () => {
      const duration = Date.now() - startTime
      analytics.trackEngagement("page_exit", pageName, duration)
    }
  }, [pageName])
}
