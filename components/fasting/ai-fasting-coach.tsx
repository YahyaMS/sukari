"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Brain, MessageCircle, Lightbulb, AlertTriangle, Heart, Zap } from "lucide-react"

interface AIMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  context?: any
}

interface FastingInsight {
  type: "recommendation" | "warning" | "encouragement" | "milestone"
  title: string
  content: string
  priority: "low" | "medium" | "high"
  actionable: boolean
}

export function AIFastingCoach({ sessionId, currentState }: { sessionId?: string; currentState?: any }) {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [insights, setInsights] = useState<FastingInsight[]>([])
  const [voiceEnabled, setVoiceEnabled] = useState(false)

  useEffect(() => {
    // Initialize with welcome message and current insights
    initializeCoach()
  }, [sessionId])

  useEffect(() => {
    // Generate real-time insights based on current state
    if (currentState) {
      generateRealTimeInsights(currentState)
    }
  }, [currentState])

  const initializeCoach = async () => {
    const welcomeMessage: AIMessage = {
      id: Date.now().toString(),
      type: "ai",
      content: sessionId
        ? "I'm here to guide you through your fasting journey! How are you feeling right now? I can help with hunger, energy levels, or any concerns you might have."
        : "Hello! I'm your AI Fasting Coach. I'm here to help you start your intermittent fasting journey safely and effectively. What would you like to know about fasting?",
      timestamp: new Date(),
    }

    setMessages([welcomeMessage])

    if (sessionId) {
      await generateContextualInsights()
    }
  }

  const generateRealTimeInsights = (state: any) => {
    const newInsights: FastingInsight[] = []

    // Hydration insights
    if (state.hydrationMl < state.hoursElapsed * 100) {
      newInsights.push({
        type: "warning",
        title: "Hydration Alert",
        content: "You're behind on your hydration goals. Aim for 100ml per hour of fasting.",
        priority: "medium",
        actionable: true,
      })
    }

    // Energy level insights
    if (state.energyLevel < 4) {
      newInsights.push({
        type: "recommendation",
        title: "Energy Boost",
        content: "Try a 5-minute walk or some light stretching to naturally boost your energy levels.",
        priority: "low",
        actionable: true,
      })
    }

    // Milestone insights
    if (state.hoursElapsed >= 12 && state.hoursElapsed < 12.5) {
      newInsights.push({
        type: "milestone",
        title: "Glycogen Depletion Achieved!",
        content:
          "Congratulations! Your body has likely depleted its glycogen stores and is now transitioning to fat burning.",
        priority: "high",
        actionable: false,
      })
    }

    if (state.hoursElapsed >= 16 && state.hoursElapsed < 16.5) {
      newInsights.push({
        type: "milestone",
        title: "Autophagy Activation!",
        content:
          "Amazing! Your body has entered autophagy - the cellular cleanup process that helps repair and regenerate cells.",
        priority: "high",
        actionable: false,
      })
    }

    setInsights(newInsights)
  }

  const generateContextualInsights = async () => {
    // This would typically call an AI service
    const contextualInsights: FastingInsight[] = [
      {
        type: "encouragement",
        title: "You're Doing Great!",
        content:
          "Based on your fasting history, you typically feel your best around the 8-hour mark. You're building incredible metabolic flexibility!",
        priority: "low",
        actionable: false,
      },
      {
        type: "recommendation",
        title: "Optimal Timing",
        content:
          "Your glucose levels tend to stabilize better when you start fasting after 7 PM. Consider this for your next fast.",
        priority: "medium",
        actionable: true,
      },
    ]

    setInsights(contextualInsights)
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      // Call AI service for response
      const response = await fetch("/api/ai/fasting-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage,
          sessionId,
          currentState,
          context: { messages: messages.slice(-5) }, // Last 5 messages for context
        }),
      })

      const data = await response.json()

      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.response || "I'm here to help! Could you tell me more about what you're experiencing?",
        timestamp: new Date(),
        context: data.context,
      }

      setMessages((prev) => [...prev, aiMessage])

      // Add any new insights from the AI response
      if (data.insights) {
        setInsights((prev) => [...prev, ...data.insights])
      }
    } catch (error) {
      console.error("Error getting AI response:", error)
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "I'm having trouble connecting right now, but I'm still here to support you! Try asking your question again, or feel free to break your fast if you're feeling unwell.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = async (action: string) => {
    let message = ""
    switch (action) {
      case "feeling_hungry":
        message = "I'm feeling really hungry right now. Is this normal?"
        break
      case "low_energy":
        message = "I'm feeling low on energy. What should I do?"
        break
      case "headache":
        message = "I have a headache. Should I be concerned?"
        break
      case "should_continue":
        message = "Should I continue my fast or break it?"
        break
      case "break_fast":
        message = "I think I need to break my fast. What's the best way to do this?"
        break
      default:
        return
    }

    setInputMessage(message)
    await sendMessage()
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "recommendation":
        return <Lightbulb className="h-4 w-4 text-blue-500" />
      case "encouragement":
        return <Heart className="h-4 w-4 text-green-500" />
      case "milestone":
        return <Zap className="h-4 w-4 text-purple-500" />
      default:
        return <Brain className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50"
      case "medium":
        return "border-orange-200 bg-orange-50"
      case "low":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Real-time Insights */}
      {insights.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Insights
          </h3>
          {insights.map((insight, index) => (
            <Card key={index} className={`${getPriorityColor(insight.priority)} border`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-700">{insight.content}</p>
                    {insight.actionable && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        Actionable
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Chat with AI Coach
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Messages */}
          <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction("feeling_hungry")}
              disabled={isLoading}
            >
              I'm Hungry
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickAction("low_energy")} disabled={isLoading}>
              Low Energy
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickAction("headache")} disabled={isLoading}>
              Headache
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction("should_continue")}
              disabled={isLoading}
            >
              Should I Continue?
            </Button>
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about your fast..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              disabled={isLoading}
            />
            <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
