"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, HelpCircle } from "lucide-react"
import { VoiceAssistant, type VoiceCommand } from "@/lib/voice-assistant"
import { toast } from "sonner"

interface VoiceAssistantWidgetProps {
  onCommand?: (command: VoiceCommand) => void
  className?: string
}

export default function VoiceAssistantWidget({ onCommand, className }: VoiceAssistantWidgetProps) {
  const [voiceAssistant] = useState(() => new VoiceAssistant())
  const [status, setStatus] = useState<"idle" | "listening" | "error">("idle")
  const [isSupported, setIsSupported] = useState(false)
  const [showCommands, setShowCommands] = useState(false)

  useEffect(() => {
    setIsSupported(voiceAssistant.isSupported())

    voiceAssistant.setStatusCallback((newStatus) => {
      setStatus(newStatus as any)
    })

    voiceAssistant.setCommandCallback((command) => {
      handleVoiceCommand(command)
      onCommand?.(command)
    })
  }, [voiceAssistant, onCommand])

  const handleVoiceCommand = (command: VoiceCommand) => {
    switch (command.action) {
      case "log_hunger":
        toast.success("Logged hunger symptom")
        voiceAssistant.speak("Hunger logged successfully")
        break
      case "log_headache":
        toast.success("Logged headache symptom")
        voiceAssistant.speak("Headache logged successfully")
        break
      case "log_fatigue":
        toast.success("Logged fatigue symptom")
        voiceAssistant.speak("Fatigue logged successfully")
        break
      case "add_water":
        toast.success("Added 250ml water")
        voiceAssistant.speak("Water intake recorded")
        break
      case "check_time":
        voiceAssistant.speak("Checking your fasting progress")
        break
      case "record_glucose":
        if (command.parameters?.glucose) {
          toast.success(`Logged glucose: ${command.parameters.glucose} mg/dL`)
          voiceAssistant.speak(`Glucose level ${command.parameters.glucose} recorded`)
        } else {
          voiceAssistant.speak("Please specify your glucose reading")
        }
        break
      case "end_session":
        voiceAssistant.speak("Are you sure you want to break your fast?")
        break
      case "show_help":
        setShowCommands(true)
        voiceAssistant.speak("Here are the available voice commands")
        break
    }
  }

  const toggleListening = () => {
    if (status === "listening") {
      voiceAssistant.stopListening()
    } else {
      voiceAssistant.startListening()
    }
  }

  if (!isSupported) {
    return (
      <Card className={className}>
        <CardContent className="p-4 text-center">
          <MicOff className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Voice assistant not supported in this browser</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Voice Assistant
        </CardTitle>
        <CardDescription>Use voice commands to manage your fasting</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Button
            variant={status === "listening" ? "destructive" : "default"}
            size="sm"
            onClick={toggleListening}
            className="flex items-center gap-2"
          >
            {status === "listening" ? (
              <>
                <MicOff className="h-4 w-4" />
                Stop
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                Listen
              </>
            )}
          </Button>

          <Badge variant={status === "listening" ? "default" : "secondary"}>
            {status === "listening" ? "Listening..." : status === "error" ? "Error" : "Ready"}
          </Badge>

          <Button variant="ghost" size="sm" onClick={() => setShowCommands(!showCommands)}>
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>

        {showCommands && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Available Commands:</h4>
            <div className="grid grid-cols-1 gap-1">
              {voiceAssistant.getAvailableCommands().map((command, index) => (
                <Badge key={index} variant="outline" className="text-xs justify-start">
                  "{command}"
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>💡 Try saying: "Log hunger" or "Add water"</p>
        </div>
      </CardContent>
    </Card>
  )
}
