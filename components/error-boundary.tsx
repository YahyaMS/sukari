"use client"

import React from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo)

    // In production, send to error monitoring service
    if (process.env.NODE_ENV === "production") {
      // TODO: Send to error monitoring service (Sentry, LogRocket, etc.)
      this.logErrorToService(error, errorInfo)
    }

    this.setState({ errorInfo })
  }

  private logErrorToService = (error: Error, errorInfo: React.ErrorInfo) => {
    // Placeholder for error logging service integration
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    // In production, replace with actual error service
    console.error("Production Error:", errorData)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback

      if (FallbackComponent && this.state.error) {
        return <FallbackComponent error={this.state.error} retry={this.handleRetry} />
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#21262D] p-4">
          <div className="glass-card p-8 max-w-md w-full text-center">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-text-secondary mb-6">
              We're sorry, but something unexpected happened. Our team has been notified.
            </p>
            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Go Home
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-red-400 mb-2">Error Details (Development)</summary>
                <pre className="text-xs bg-black/20 p-2 rounded overflow-auto max-h-32">{this.state.error.stack}</pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Specialized error boundary for API errors
export function APIErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, retry }) => (
        <div className="glass-card p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">Connection Error</h3>
          <p className="text-text-secondary mb-4">
            Unable to connect to our servers. Please check your internet connection.
          </p>
          <Button onClick={retry} size="sm" className="bg-yellow-600 hover:bg-yellow-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}
