"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, Send, AlertTriangle, Heart, Lightbulb, Target } from "lucide-react"
import { toast } from "sonner"

interface ChatMessage {
  id: string
  type: "user" | "coach"
  message: string
  timestamp: Date
  urgency?: "low" | "medium" | "high"
  tips?: string[]
  recommendations?: string[]
  actions?: string[]
  encouragement?: string
  warning?: string
}

interface IntelligentCoachChatProps {
  sessionId?: string
  currentPhase?: string
  timeIntoFast?: number
  glucoseLevel?: number
  onEmergencyAction?: (action: string) => void
}

export default function IntelligentCoachChat({
  sessionId,
  currentPhase,
  timeIntoFast,
  glucoseLevel,
  onEmergencyAction,
}: IntelligentCoachChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "coach",
      message:
        "Hello! I'm your AI Fasting Coach. I'm here to support you through your fasting journey. How are you feeling right now?",
      timestamp: new Date(),
      tips: [
        "Ask me anything about your current fast",
        "Let me know if you're experiencing any symptoms",
        "I can provide motivation when you need it",
        "Say 'emergency' if you need immediate help",
      ],
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/fasting-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          sessionId,
          currentPhase,
          timeIntoFast,
          glucoseLevel,
          emergencyLevel: detectEmergencyLevel(inputMessage),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const coachResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "coach",
          message: data.response.message,
          timestamp: new Date(),
          urgency: data.response.urgency,
          tips: data.response.tips,
          recommendations: data.response.recommendations,
          actions: data.response.actions,
          encouragement: data.response.encouragement,
          warning: data.response.warning,
        }

        setMessages((prev) => [...prev, coachResponse])

        // Handle emergency actions
        if (data.response.actions?.includes("break_fast") && onEmergencyAction) {
          onEmergencyAction("break_fast")
        }

        // Show urgent notifications
        if (data.response.urgency === "high") {
          toast.error("Important Safety Alert", {
            description: data.response.message,
          })
        }
      } else {
        throw new Error("Failed to get coach response")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to get coach response")

      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "coach",
        message:
          "I'm sorry, I'm having trouble responding right now. If this is an emergency, please break your fast and contact your healthcare provider.",
        timestamp: new Date(),
        urgency: "medium",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const detectEmergencyLevel = (message: string): "low" | "medium" | "high" => {
    const lowerMessage = message.toLowerCase()

    if (
      lowerMessage.includes("chest pain") ||
      lowerMessage.includes("emergency") ||
      lowerMessage.includes("severe") ||
      lowerMessage.includes("can't breathe")
    ) {
      return "high"
    }

    if (
      lowerMessage.includes("dizzy") ||
      lowerMessage.includes("nauseous") ||
      lowerMessage.includes("weak") ||
      lowerMessage.includes("help")
    ) {
      return "medium"
    }

    return "low"
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickActions = [
    { text: "I'm feeling hungry", icon: Target },
    { text: "I'm dizzy", icon: AlertTriangle },
    { text: "Need motivation", icon: Heart },
    { text: "How am I doing?", icon: Lightbulb },
  ]

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span>AI Fasting Coach</span>
          {sessionId && (
            <Badge variant="secondary" className="ml-auto">
              Session Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 p-4">
        {/* Messages */}
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === "user"
                      ? "bg-purple-600 text-white"
                      : message.urgency === "high"
                        ? "bg-red-50 border border-red-200"
                        : message.urgency === "medium"
                          ? "bg-yellow-50 border border-yellow-200"
                          : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  {/* Main message */}
                  <p
                    className={`text-sm ${
                      message.type === "user"
                        ? "text-white"
                        : message.urgency === "high"
                          ? "text-red-900"
                          : message.urgency === "medium"
                            ? "text-yellow-900"
                            : "text-gray-900"
                    }`}
                  >
                    {message.message}
                  </p>

                  {/* Warning */}
                  {message.warning && (
                    <div className="mt-2 p-2 bg-red-100 rounded border border-red-200">
                      <div className="flex items-center space-x-1">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <p className="text-xs font-medium text-red-900">Warning</p>
                      </div>
                      <p className="text-xs text-red-800 mt-1">{message.warning}</p>
                    </div>
                  )}

                  {/* Encouragement */}
                  {message.encouragement && (
                    <div className="mt-2 p-2 bg-green-100 rounded border border-green-200">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4 text-green-600" />
                        <p className="text-xs font-medium text-green-900">Encouragement</p>
                      </div>
                      <p className="text-xs text-green-800 mt-1">{message.encouragement}</p>
                    </div>
                  )}

                  {/* Tips */}
                  {message.tips && message.tips.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center space-x-1">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                        <p className="text-xs font-medium text-blue-900">Tips</p>
                      </div>
                      {message.tips.map((tip, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-1 h-1 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-xs text-blue-800">{tip}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recommendations */}
                  {message.recommendations && message.recommendations.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center space-x-1">
                        <Target className="h-4 w-4 text-purple-600" />
                        <p className="text-xs font-medium text-purple-900">Recommendations</p>
                      </div>
                      {message.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-1 h-1 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-xs text-purple-800">{rec}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <p className={`text-xs mt-2 ${message.type === "user" ? "text-purple-200" : "text-gray-500"}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    <p className="text-sm text-gray-600">Coach is thinking...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs h-8 bg-transparent"
              onClick={() => {
                setInputMessage(action.text)
                inputRef.current?.focus()
              }}
            >
              <action.icon className="h-3 w-3 mr-1" />
              {action.text}
            </Button>
          ))}
        </div>

        {/* Input */}
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your fasting coach anything..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Emergency Notice */}
        <div className="text-center">
          <p className="text-xs text-gray-500">For medical emergencies, contact your healthcare provider immediately</p>
        </div>
      </CardContent>
    </Card>
  )
}
