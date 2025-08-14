"use client"

export interface VoiceCommand {
  command: string
  action: string
  parameters?: Record<string, any>
}

export interface VoiceResponse {
  text: string
  action?: string
  data?: any
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export class VoiceAssistant {
  private recognition: any | null = null
  private synthesis: SpeechSynthesis | null = null
  private isListening = false
  private onCommandCallback?: (command: VoiceCommand) => void
  private onStatusCallback?: (status: string) => void

  constructor() {
    if (typeof window !== "undefined") {
      // Initialize Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition()
        this.recognition.continuous = false
        this.recognition.interimResults = false
        this.recognition.lang = "en-US"

        this.recognition.onstart = () => {
          this.isListening = true
          this.onStatusCallback?.("listening")
        }

        this.recognition.onend = () => {
          this.isListening = false
          this.onStatusCallback?.("idle")
        }

        this.recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript.toLowerCase()
          this.processVoiceCommand(transcript)
        }

        this.recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          this.onStatusCallback?.("error")
        }
      }

      // Initialize Speech Synthesis
      this.synthesis = window.speechSynthesis
    }
  }

  setCommandCallback(callback: (command: VoiceCommand) => void) {
    this.onCommandCallback = callback
  }

  setStatusCallback(callback: (status: string) => void) {
    this.onStatusCallback = callback
  }

  startListening() {
    if (this.recognition && !this.isListening) {
      this.recognition.start()
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
    }
  }

  speak(text: string, options?: { rate?: number; pitch?: number; volume?: number }) {
    if (this.synthesis) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = options?.rate || 1
      utterance.pitch = options?.pitch || 1
      utterance.volume = options?.volume || 1
      this.synthesis.speak(utterance)
    }
  }

  private processVoiceCommand(transcript: string) {
    const command = this.parseCommand(transcript)
    if (command) {
      this.onCommandCallback?.(command)
    }
  }

  private parseCommand(transcript: string): VoiceCommand | null {
    // Fasting-related commands
    if (transcript.includes("log hunger") || transcript.includes("record hunger")) {
      return { command: "log_symptom", action: "log_hunger", parameters: { type: "hunger", severity: 5 } }
    }

    if (transcript.includes("log headache") || transcript.includes("record headache")) {
      return { command: "log_symptom", action: "log_headache", parameters: { type: "headache", severity: 4 } }
    }

    if (transcript.includes("log fatigue") || transcript.includes("record fatigue")) {
      return { command: "log_symptom", action: "log_fatigue", parameters: { type: "fatigue", severity: 6 } }
    }

    if (transcript.includes("add water") || transcript.includes("log water")) {
      return { command: "log_hydration", action: "add_water", parameters: { amount: 250 } }
    }

    if (transcript.includes("check time") || transcript.includes("how much time")) {
      return { command: "check_status", action: "check_time" }
    }

    if (transcript.includes("break fast") || transcript.includes("end fast")) {
      return { command: "break_fast", action: "end_session" }
    }

    if (transcript.includes("glucose") && (transcript.includes("log") || transcript.includes("record"))) {
      // Extract number if present
      const match = transcript.match(/(\d+)/)
      const glucose = match ? Number.parseInt(match[1]) : null
      return { command: "log_glucose", action: "record_glucose", parameters: { glucose } }
    }

    if (transcript.includes("help") || transcript.includes("what can you do")) {
      return { command: "help", action: "show_help" }
    }

    return null
  }

  getAvailableCommands(): string[] {
    return [
      "Log hunger",
      "Log headache",
      "Log fatigue",
      "Add water",
      "Check time",
      "Record glucose [number]",
      "Break fast",
      "Help",
    ]
  }

  isSupported(): boolean {
    return !!(this.recognition && this.synthesis)
  }
}
