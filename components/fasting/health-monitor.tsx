"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Activity, Droplets, Brain, AlertTriangle, CheckCircle, XCircle, Zap, Target } from "lucide-react"
import { toast } from "sonner"

interface HealthMonitorProps {
  sessionId: string
  onEmergencyBreak?: () => void
  onRiskLevelChange?: (level: string) => void
}

interface VitalSigns {
  heartRate?: number
  bloodPressure?: { systolic: number; diastolic: number }
  oxygenSaturation?: number
  bodyTemperature?: number
}

interface HealthData {
  vitalSigns?: VitalSigns
  symptoms: string[]
  glucoseLevel?: number
  hydrationLevel: number
  energyLevel: number
  moodLevel: number
  painLevel: number
}

const commonSymptoms = [
  "Headache",
  "Dizziness",
  "Nausea",
  "Fatigue",
  "Irritability",
  "Difficulty concentrating",
  "Hunger pangs",
  "Cold hands/feet",
  "Muscle weakness",
  "Heart palpitations",
  "Shortness of breath",
  "Chest pain",
]

export default function HealthMonitor({ sessionId, onEmergencyBreak, onRiskLevelChange }: HealthMonitorProps) {
  const [healthData, setHealthData] = useState<HealthData>({
    symptoms: [],
    hydrationLevel: 5,
    energyLevel: 5,
    moodLevel: 5,
    painLevel: 0,
  })

  const [vitalSigns, setVitalSigns] = useState<VitalSigns>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastAssessment, setLastAssessment] = useState<any>(null)
  const [autoMonitoring, setAutoMonitoring] = useState(false)

  // Auto-monitoring every 30 minutes if enabled
  useEffect(() => {
    if (!autoMonitoring) return

    const interval = setInterval(
      () => {
        if (healthData.symptoms.length > 0 || healthData.energyLevel <= 3 || healthData.hydrationLevel <= 3) {
          submitHealthData()
        }
      },
      30 * 60 * 1000,
    ) // 30 minutes

    return () => clearInterval(interval)
  }, [autoMonitoring, healthData])

  const submitHealthData = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/fasting/health-monitor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          vitalSigns,
          symptoms: healthData.symptoms,
          glucoseLevel: healthData.glucoseLevel,
          hydrationLevel: healthData.hydrationLevel,
          energyLevel: healthData.energyLevel,
          moodLevel: healthData.moodLevel,
          painLevel: healthData.painLevel,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setLastAssessment(result)

        // Handle emergency situations
        if (result.emergencyBreak && onEmergencyBreak) {
          toast.error("Emergency fast break initiated for your safety!")
          onEmergencyBreak()
        }

        // Notify parent of risk level change
        if (onRiskLevelChange) {
          onRiskLevelChange(result.riskAssessment.level)
        }

        // Show appropriate notifications
        if (result.riskAssessment.level === "critical") {
          toast.error("Critical health risk detected!", {
            description: "Please follow the emergency protocols immediately.",
          })
        } else if (result.riskAssessment.level === "high") {
          toast.error("High health risk detected", {
            description: "Please review the recommendations carefully.",
          })
        } else if (result.riskAssessment.level === "medium") {
          toast.warning("Some health concerns detected", {
            description: "Monitor your condition closely.",
          })
        } else {
          toast.success("Health check completed", {
            description: "All indicators look good!",
          })
        }
      } else {
        throw new Error("Failed to submit health data")
      }
    } catch (error) {
      console.error("Error submitting health data:", error)
      toast.error("Failed to submit health data")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleSymptom = (symptom: string) => {
    setHealthData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }))
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "critical":
        return <XCircle className="h-4 w-4" />
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <AlertTriangle className="h-4 w-4" />
      case "low":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Health Status Overview */}
      {lastAssessment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Health Status</span>
              <Badge className={getRiskLevelColor(lastAssessment.riskAssessment.level)}>
                {getRiskIcon(lastAssessment.riskAssessment.level)}
                <span className="ml-1 capitalize">{lastAssessment.riskAssessment.level} Risk</span>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lastAssessment.riskAssessment.factors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Risk Factors:</h4>
                {lastAssessment.riskAssessment.factors.map((factor: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            )}

            {lastAssessment.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Recommendations:</h4>
                {lastAssessment.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            )}

            {lastAssessment.interventions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-red-700">Required Actions:</h4>
                {lastAssessment.interventions.map((intervention: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-red-700">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>{intervention}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Vital Signs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span>Vital Signs</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
              <Input
                id="heartRate"
                type="number"
                placeholder="72"
                value={vitalSigns.heartRate || ""}
                onChange={(e) =>
                  setVitalSigns((prev) => ({
                    ...prev,
                    heartRate: e.target.value ? Number.parseInt(e.target.value) : undefined,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="temperature">Temperature (°F)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="98.6"
                value={vitalSigns.bodyTemperature || ""}
                onChange={(e) =>
                  setVitalSigns((prev) => ({
                    ...prev,
                    bodyTemperature: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="systolic">Blood Pressure</Label>
              <div className="flex space-x-2">
                <Input
                  id="systolic"
                  type="number"
                  placeholder="120"
                  value={vitalSigns.bloodPressure?.systolic || ""}
                  onChange={(e) =>
                    setVitalSigns((prev) => ({
                      ...prev,
                      bloodPressure: {
                        ...prev.bloodPressure,
                        systolic: Number.parseInt(e.target.value) || 0,
                        diastolic: prev.bloodPressure?.diastolic || 0,
                      },
                    }))
                  }
                />
                <span className="self-center">/</span>
                <Input
                  type="number"
                  placeholder="80"
                  value={vitalSigns.bloodPressure?.diastolic || ""}
                  onChange={(e) =>
                    setVitalSigns((prev) => ({
                      ...prev,
                      bloodPressure: {
                        systolic: prev.bloodPressure?.systolic || 0,
                        diastolic: Number.parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="oxygen">Oxygen Saturation (%)</Label>
              <Input
                id="oxygen"
                type="number"
                placeholder="98"
                value={vitalSigns.oxygenSaturation || ""}
                onChange={(e) =>
                  setVitalSigns((prev) => ({
                    ...prev,
                    oxygenSaturation: e.target.value ? Number.parseInt(e.target.value) : undefined,
                  }))
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="glucose">Current Glucose (mg/dL)</Label>
            <Input
              id="glucose"
              type="number"
              placeholder="85"
              value={healthData.glucoseLevel || ""}
              onChange={(e) =>
                setHealthData((prev) => ({
                  ...prev,
                  glucoseLevel: e.target.value ? Number.parseInt(e.target.value) : undefined,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Symptoms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span>Symptoms</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {commonSymptoms.map((symptom) => (
              <div key={symptom} className="flex items-center space-x-2">
                <Checkbox
                  id={symptom}
                  checked={healthData.symptoms.includes(symptom)}
                  onCheckedChange={() => toggleSymptom(symptom)}
                />
                <Label htmlFor={symptom} className="text-sm">
                  {symptom}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subjective Measures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-500" />
            <span>How You Feel</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Energy Level</span>
              </Label>
              <Badge variant="outline">{healthData.energyLevel}/10</Badge>
            </div>
            <Slider
              value={[healthData.energyLevel]}
              onValueChange={(value) => setHealthData((prev) => ({ ...prev, energyLevel: value[0] }))}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Very Low</span>
              <span>Excellent</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="flex items-center space-x-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span>Hydration Level</span>
              </Label>
              <Badge variant="outline">{healthData.hydrationLevel}/10</Badge>
            </div>
            <Slider
              value={[healthData.hydrationLevel]}
              onValueChange={(value) => setHealthData((prev) => ({ ...prev, hydrationLevel: value[0] }))}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Dehydrated</span>
              <span>Well Hydrated</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-pink-500" />
                <span>Mood Level</span>
              </Label>
              <Badge variant="outline">{healthData.moodLevel}/10</Badge>
            </div>
            <Slider
              value={[healthData.moodLevel]}
              onValueChange={(value) => setHealthData((prev) => ({ ...prev, moodLevel: value[0] }))}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Very Low</span>
              <span>Excellent</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-red-500" />
                <span>Pain Level</span>
              </Label>
              <Badge variant="outline">{healthData.painLevel}/10</Badge>
            </div>
            <Slider
              value={[healthData.painLevel]}
              onValueChange={(value) => setHealthData((prev) => ({ ...prev, painLevel: value[0] }))}
              max={10}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>No Pain</span>
              <span>Severe Pain</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="autoMonitoring"
              checked={autoMonitoring}
              onCheckedChange={(checked) => setAutoMonitoring(checked as boolean)}
            />
            <Label htmlFor="autoMonitoring" className="text-sm">
              Enable automatic health monitoring (every 30 minutes)
            </Label>
          </div>

          <Button onClick={submitHealthData} disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Analyzing Health Data..." : "Submit Health Check"}
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              For medical emergencies, contact your healthcare provider immediately
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
