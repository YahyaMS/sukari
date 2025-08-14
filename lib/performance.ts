// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  trackPageLoad(pageName: string) {
    if (typeof window !== "undefined" && "performance" in window) {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
      const loadTime = navigation.loadEventEnd - navigation.fetchStart

      this.metrics.set(`page_load_${pageName}`, loadTime)

      // In production, send to analytics service
      if (process.env.NODE_ENV === "production") {
        this.sendMetric("page_load", pageName, loadTime)
      }
    }
  }

  trackAPICall(endpoint: string, duration: number, success: boolean) {
    const metricName = `api_${endpoint.replace(/[^a-zA-Z0-9]/g, "_")}`
    this.metrics.set(metricName, duration)

    if (process.env.NODE_ENV === "production") {
      this.sendMetric("api_call", endpoint, duration, { success })
    }
  }

  trackUserAction(action: string, metadata?: Record<string, any>) {
    const timestamp = Date.now()

    if (process.env.NODE_ENV === "production") {
      this.sendMetric("user_action", action, timestamp, metadata)
    }
  }

  private sendMetric(type: string, name: string, value: number, metadata?: Record<string, any>) {
    // Placeholder for analytics service integration
    const metric = {
      type,
      name,
      value,
      metadata,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    // In production, replace with actual analytics service
    console.log("Performance Metric:", metric)
  }

  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics)
  }
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ data: T | null; error: string | null }> {
  const startTime = performance.now()

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    const duration = performance.now() - startTime

    if (!response.ok) {
      const errorText = await response.text()
      PerformanceMonitor.getInstance().trackAPICall(endpoint, duration, false)

      return {
        data: null,
        error: `HTTP ${response.status}: ${errorText || response.statusText}`,
      }
    }

    const data = await response.json()
    PerformanceMonitor.getInstance().trackAPICall(endpoint, duration, true)

    return { data, error: null }
  } catch (error) {
    const duration = performance.now() - startTime
    PerformanceMonitor.getInstance().trackAPICall(endpoint, duration, false)

    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export function getOptimizedImageUrl(url: string, width?: number, height?: number): string {
  if (!url) return ""

  // For Vercel Blob URLs, add optimization parameters
  if (url.includes("blob.vercel-storage.com")) {
    const params = new URLSearchParams()
    if (width) params.set("w", width.toString())
    if (height) params.set("h", height.toString())
    params.set("q", "85") // Quality

    return `${url}?${params.toString()}`
  }

  return url
}
