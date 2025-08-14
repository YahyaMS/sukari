"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { useMonitoring } from "@/lib/monitoring"

export function HealthStatus() {
  const { systemHealth, checkHealth } = useMonitoring()
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    checkHealth()
  }, [])

  const handleRefresh = async () => {
    setIsChecking(true)
    await checkHealth()
    setIsChecking(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "unhealthy":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <RefreshCw className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500"
      case "degraded":
        return "bg-yellow-500"
      case "unhealthy":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (!systemHealth) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-purple-400" />
            <span className="ml-2 text-text-secondary">Checking system health...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-white">
          {getStatusIcon(systemHealth.status)}
          System Health
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isChecking}
          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(systemHealth.status)}`} />
          <span className="text-white font-medium">
            Overall Status: {systemHealth.status.charAt(0).toUpperCase() + systemHealth.status.slice(1)}
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-text-secondary">Services</h4>
          {systemHealth.services.map((service) => (
            <div key={service.service} className="flex items-center justify-between p-2 rounded bg-white/5">
              <div className="flex items-center gap-2">
                {getStatusIcon(service.status)}
                <span className="text-white capitalize">{service.service.replace("_", " ")}</span>
              </div>
              <div className="flex items-center gap-2">
                {service.responseTime && <span className="text-xs text-text-secondary">{service.responseTime}ms</span>}
                <Badge variant={service.status === "healthy" ? "default" : "destructive"}>{service.status}</Badge>
              </div>
            </div>
          ))}
        </div>

        {Object.keys(systemHealth.metrics).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-text-secondary">Metrics</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(systemHealth.metrics).map(([key, value]) => (
                <div key={key} className="p-2 rounded bg-white/5">
                  <div className="text-xs text-text-secondary capitalize">{key.replace(/([A-Z])/g, " $1")}</div>
                  <div className="text-white font-medium">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
