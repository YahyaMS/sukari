"use client"

import { useEffect, useCallback, useState } from "react"
import { toast } from "sonner"
import { EnhancedFastingService, type FastingSession } from "@/lib/enhanced-fasting"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Brain, Droplets, Lightbulb, Play, Square, Timer, ChefHat } from "lucide-react"
import MealPlanningRefeeding from "@/components/fasting/meal-planning-refeeding"
import VoiceAssistantWidget from "@/components/voice/voice-assistant-widget"
import { FadeIn, SlideIn, ProgressRing } from "@/components/ui/advanced-animations"

const fastingPlans = [
  {
    type: "16:8",
    name: "16:8 Intermittent Fasting",
    description: "Fast for 16 hours, eat within 8 hours",
    difficulty: "Beginner",
    duration: 16,
    benefits: ["Improved insulin sensitivity", "Weight loss", "Better glucose control"],
    color: "bg-green-100 text-green-800",
    bgColor: "bg-green-50",
  },
  {
    type: "18:6",
    name: "18:6 Extended Fast",
    description: "Fast for 18 hours, eat within 6 hours",
    difficulty: "Intermediate",
    duration: 18,
    benefits: ["Enhanced autophagy", "Greater glucose stability", "Increased fat burning"],
    color: "bg-blue-100 text-blue-800",
    bgColor: "bg-blue-50",
  },
  {
    type: "20:4",
    name: "20:4 Warrior Diet",
    description: "Fast for 20 hours, eat within 4 hours",
    difficulty: "Advanced",
    duration: 20,
    benefits: ["Maximum metabolic benefits", "Significant glucose improvement", "Mental clarity"],
    color: "bg-purple-100 text-purple-800",
    bgColor: "bg-purple-50",
  },
  {
    type: "OMAD",
    name: "One Meal A Day",
    description: "Fast for 23 hours, eat one meal",
    difficulty: "Expert",
    duration: 23,
    benefits: ["Deep autophagy", "Maximum insulin sensitivity", "Rapid results"],
    color: "bg-orange-100 text-orange-800",
    bgColor: "bg-orange-50",
  },
]

export default function EnhancedFastingCoachPage() {
  const [fastingService] = useState(() => new EnhancedFastingService())
  const [currentSession, setCurrentSession] = useState<FastingSession | null>(null)
  const [selectedPlan, setSelectedPlan] = useState("16:8")
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [currentPhase, setCurrentPhase] = useState("preparation")
  const [isLoading, setIsLoading] = useState(false)
  const [showStartForm, setShowStartForm] = useState(false)
  const [aiGuidance, setAiGuidance] = useState<any>(null)
  const [readinessAssessment, setReadinessAssessment] = useState<any>(null)
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [hydrationMl, setHydrationMl] = useState(0)
  const [showMealPlanning, setShowMealPlanning] = useState(false)

  // Form states
  const [glucoseStart, setGlucoseStart] = useState("")
  const [weightStart, setWeightStart] = useState("")
  const [energyStart, setEnergyStart] = useState("5")
  const [moodStart, setMoodStart] = useState("5")
  const [lastMealHours, setLastMealHours] = useState("3")
  const [sleepQuality, setSleepQuality] = useState("7")
  const [stressLevel, setStressLevel] = useState("3")
  const [hydrationLevel, setHydrationLevel] = useState("7")

  const loadCurrentSession = useCallback(async () => {
    const session = await fastingService.getCurrentSession()
    setCurrentSession(session)

    if (session) {
      const now = new Date()
      const start = new Date(session.start_time)
      const plannedEnd = new Date(session.planned_end_time)

      const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000)
      const remaining = Math.max(0, Math.floor((plannedEnd.getTime() - now.getTime()) / 1000))

      setTimeElapsed(elapsed)
      setTimeRemaining(remaining)
      setCurrentPhase(session.current_phase)

      const hoursRemaining = remaining / 3600
      if (hoursRemaining <= 2 || remaining === 0) {
        setShowMealPlanning(true)
      }

      // Get real-time AI guidance
      const guidance = await fastingService.getRealTimeGuidance(session.id, {
        hoursElapsed: elapsed / 3600,
        currentPhase: session.current_phase,
        glucose: session.glucose_start,
        symptoms,
        energyLevel: Number.parseInt(energyStart),
        hydrationMl,
      })
      setAiGuidance(guidance)
    }
  }, [fastingService, symptoms, energyStart, hydrationMl])

  useEffect(() => {
    loadCurrentSession()
  }, [loadCurrentSession])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (currentSession && currentSession.status === "active") {
      interval = setInterval(async () => {
        const now = new Date()
        const start = new Date(currentSession.start_time)
        const plannedEnd = new Date(currentSession.planned_end_time)

        const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000)
        const remaining = Math.max(0, Math.floor((plannedEnd.getTime() - now.getTime()) / 1000))

        setTimeElapsed(elapsed)
        setTimeRemaining(remaining)

        const hoursRemaining = remaining / 3600
        if (hoursRemaining <= 2 && !showMealPlanning) {
          setShowMealPlanning(true)
          toast.info("Your fast is almost complete! Check out your personalized refeeding plan.")
        }

        // Update AI guidance every 5 minutes
        if (elapsed % 300 === 0) {
          const guidance = await fastingService.getRealTimeGuidance(currentSession.id, {
            hoursElapsed: elapsed / 3600,
            currentPhase: currentSession.current_phase,
            symptoms,
            hydrationMl,
          })
          setAiGuidance(guidance)
        }

        if (remaining === 0) {
          toast.success("Fasting session completed! Great job!")
          setShowMealPlanning(true)
          loadCurrentSession()
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [currentSession, fastingService, symptoms, hydrationMl, loadCurrentSession, showMealPlanning])

  const assessReadiness = async () => {
    setIsLoading(true)
    try {
      const assessment = await fastingService.assessFastingReadiness("user-id", {
        glucose: glucoseStart ? Number.parseInt(glucoseStart) : undefined,
        lastMealHours: Number.parseInt(lastMealHours),
        sleepQuality: Number.parseInt(sleepQuality),
        stressLevel: Number.parseInt(stressLevel),
        hydrationLevel: Number.parseInt(hydrationLevel),
      })
      setReadinessAssessment(assessment)
    } catch (error) {
      toast.error("Failed to assess readiness")
    } finally {
      setIsLoading(false)
    }
  }

  const startFasting = async () => {
    if (!readinessAssessment?.canStart) {
      toast.error("Please complete readiness assessment first")
      return
    }

    setIsLoading(true)
    try {
      const plan = fastingPlans.find((p) => p.type === selectedPlan)
      if (!plan) return

      const session = await fastingService.startEnhancedFastingSession({
        fasting_type: selectedPlan,
        duration_hours: plan.duration,
        glucose_start: glucoseStart ? Number.parseInt(glucoseStart) : undefined,
        weight_start: weightStart ? Number.parseFloat(weightStart) : undefined,
        energy_level_start: Number.parseInt(energyStart),
        mood_start: Number.parseInt(moodStart),
        readiness_score: readinessAssessment.readinessScore,
      })

      if (session) {
        toast.success("Fasting session started! Good luck!")
        setShowStartForm(false)
        setShowMealPlanning(false) // Reset meal planning for new session
        loadCurrentSession()
      } else {
        toast.error("Failed to start fasting session")
      }
    } catch (error) {
      toast.error("Failed to start fasting session")
    } finally {
      setIsLoading(false)
    }
  }

  const logSymptom = async (symptomType: string, severity: number, description?: string) => {
    if (!currentSession) return

    const hoursElapsed = timeElapsed / 3600
    const result = await fastingService.logSymptom(currentSession.id, {
      type: symptomType,
      severity,
      description,
      hoursIntoFast: hoursElapsed,
      glucose: currentSession.glucose_start,
    })

    if (result.logged) {
      toast.success("Symptom logged")
      if (result.interventionNeeded) {
        toast.warning(result.aiRecommendation)
      }

      // Update symptoms list
      setSymptoms((prev) => [...prev, symptomType])
    }
  }

  const breakFast = async () => {
    if (!currentSession) return

    const success = await fastingService.breakFastingSession(currentSession.id, "User initiated")
    if (success) {
      toast.success("Fast broken successfully")
      setShowMealPlanning(true)
      loadCurrentSession()
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "preparation":
        return "bg-gray-100 text-gray-800"
      case "early":
        return "bg-yellow-100 text-yellow-800"
      case "adaptation":
        return "bg-blue-100 text-blue-800"
      case "deep":
        return "bg-green-100 text-green-800"
      case "extended":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const handleVoiceCommand = (command: any) => {
    switch (command.action) {
      case "log_hunger":
        logSymptom("hunger", 5)
        break
      case "log_headache":
        logSymptom("headache", 4)
        break
      case "log_fatigue":
        logSymptom("fatigue", 6)
        break
      case "add_water":
        setHydrationMl((prev) => prev + 250)
        break
      case "end_session":
        breakFast()
        break
    }
  }

  if (currentSession && currentSession.status === "active") {
    const hoursElapsed = timeElapsed / 3600
    const totalHours =
      (new Date(currentSession.planned_end_time).getTime() - new Date(currentSession.start_time).getTime()) /
      (1000 * 3600)
    const progressPercentage = (hoursElapsed / totalHours) * 100

    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <FadeIn>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">AI Fasting Coach</h1>
            <p className="text-muted-foreground">Intelligent guidance for your fasting journey</p>
          </div>
        </FadeIn>

        <Tabs defaultValue="timer" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="timer">Fasting Timer</TabsTrigger>
            <TabsTrigger value="guidance">AI Guidance</TabsTrigger>
            <TabsTrigger value="voice">Voice Assistant</TabsTrigger>
            <TabsTrigger value="refeeding" disabled={!showMealPlanning}>
              <ChefHat className="h-4 w-4 mr-2" />
              Refeeding Plan
              {showMealPlanning && <Badge className="ml-2 bg-green-500 text-white text-xs">Ready!</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="space-y-6">
            <SlideIn direction="up">
              {/* Main Timer Display */}
              <Card>
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="relative w-48 h-48 mx-auto mb-6">
                      <ProgressRing progress={progressPercentage} size={192} strokeWidth={6} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold">{formatTime(timeElapsed)}</div>
                        <div className="text-sm text-muted-foreground">Elapsed</div>
                        <div className="text-lg font-semibold mt-2">{formatTime(timeRemaining)}</div>
                        <div className="text-xs text-muted-foreground">Remaining</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 mb-4">
                      <Badge className={getPhaseColor(currentPhase)}>
                        {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} Phase
                      </Badge>
                      <Badge variant="outline">{currentSession.fasting_type} Fast</Badge>
                      {aiGuidance && (
                        <Badge className={getRiskColor(aiGuidance.riskLevel)}>Risk: {aiGuidance.riskLevel}</Badge>
                      )}
                    </div>

                    <Progress value={progressPercentage} className="w-full max-w-md mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      {Math.round(progressPercentage)}% Complete • {Math.round(hoursElapsed * 10) / 10} hours elapsed
                    </p>

                    {showMealPlanning && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-center gap-2">
                          <ChefHat className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            Your personalized refeeding plan is ready!
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </SlideIn>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Hydration: {hydrationMl}ml</span>
                    <Button size="sm" variant="outline" onClick={() => setHydrationMl((prev) => prev + 250)}>
                      +250ml
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" onClick={() => logSymptom("hunger", 5)}>
                      Log Hunger
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => logSymptom("headache", 4)}>
                      Log Headache
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => logSymptom("fatigue", 6)}>
                      Log Fatigue
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => logSymptom("dizziness", 7)}>
                      Log Dizziness
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="destructive" size="sm" className="w-full" onClick={breakFast}>
                      <Square className="h-4 w-4 mr-2" />
                      Break Fast
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guidance" className="space-y-6">
            {/* AI Guidance */}
            {aiGuidance && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Guidance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">{aiGuidance.guidance}</p>
                    </div>

                    {aiGuidance.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Recommendations:</h4>
                        <ul className="space-y-1">
                          {aiGuidance.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiGuidance.nextMilestone && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-900">Next Milestone: {aiGuidance.nextMilestone}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="voice" className="space-y-6">
            <SlideIn direction="left">
              <VoiceAssistantWidget onCommand={handleVoiceCommand} />
            </SlideIn>
          </TabsContent>

          <TabsContent value="refeeding" className="space-y-6">
            {showMealPlanning && currentSession ? (
              <MealPlanningRefeeding
                fastingDuration={Math.round(hoursElapsed)}
                fastingType={currentSession.fasting_type}
                onPlanGenerated={(plan) => {
                  toast.success("Refeeding plan generated successfully!")
                }}
              />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Refeeding Plan Not Ready</h3>
                  <p className="text-gray-600">
                    Your personalized refeeding plan will be available when your fast is nearing completion (last 2
                    hours) or when you break your fast.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Fasting Coach</h1>
        <p className="text-muted-foreground">Intelligent guidance for your fasting journey</p>
      </div>

      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plans">Fasting Plans</TabsTrigger>
          <TabsTrigger value="start">Start Fasting</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {fastingPlans.map((plan) => (
              <Card
                key={plan.type}
                className={`cursor-pointer transition-all ${selectedPlan === plan.type ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => setSelectedPlan(plan.type)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <Badge className={plan.color}>{plan.difficulty}</Badge>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">{plan.duration} hours</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Benefits:</h4>
                      <ul className="text-xs space-y-1">
                        {plan.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-green-500 rounded-full" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="start" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fasting Readiness Assessment</CardTitle>
              <CardDescription>Let our AI assess your readiness to start fasting safely</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="glucose">Current Glucose (mg/dL)</Label>
                  <Input
                    id="glucose"
                    type="number"
                    value={glucoseStart}
                    onChange={(e) => setGlucoseStart(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Current Weight (lbs)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={weightStart}
                    onChange={(e) => setWeightStart(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label htmlFor="lastMeal">Hours Since Last Meal</Label>
                  <Select value={lastMealHours} onValueChange={setLastMealHours}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="3">3 hours</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="6">6+ hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sleep">Sleep Quality (1-10)</Label>
                  <Select value={sleepQuality} onValueChange={setSleepQuality}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="stress">Stress Level (1-10)</Label>
                  <Select value={stressLevel} onValueChange={setStressLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hydration">Hydration Level (1-10)</Label>
                  <Select value={hydrationLevel} onValueChange={setHydrationLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="energy">Energy Level (1-10)</Label>
                  <Select value={energyStart} onValueChange={setEnergyStart}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="mood">Mood (1-10)</Label>
                  <Select value={moodStart} onValueChange={setMoodStart}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(10)].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={assessReadiness} disabled={isLoading} className="w-full">
                {isLoading ? "Assessing..." : "Assess Readiness"}
              </Button>

              {readinessAssessment && (
                <Card className="mt-4">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          readinessAssessment.readinessScore >= 80
                            ? "bg-green-500"
                            : readinessAssessment.readinessScore >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                      <span className="font-medium">Readiness Score: {readinessAssessment.readinessScore}/100</span>
                      <Badge className={getRiskColor(readinessAssessment.riskLevel)}>
                        {readinessAssessment.riskLevel} risk
                      </Badge>
                    </div>

                    {readinessAssessment.recommendations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">AI Recommendations:</h4>
                        <ul className="space-y-1">
                          {readinessAssessment.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {readinessAssessment.canStart ? (
                      <Button onClick={startFasting} disabled={isLoading} className="w-full mt-4">
                        <Play className="h-4 w-4 mr-2" />
                        {isLoading ? "Starting..." : `Start ${selectedPlan} Fast`}
                      </Button>
                    ) : (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-red-900">Not Ready to Fast</p>
                          <p className="text-sm text-red-700">
                            Please address the recommendations above before starting your fast.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
