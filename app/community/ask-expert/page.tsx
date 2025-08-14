"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MessageCircle, Star, Clock, Bot, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icon3D } from "@/components/ui/3d-icon"
import { useToast } from "@/hooks/use-toast"

export default function AskExpertPage() {
  const [questionCategory, setQuestionCategory] = useState("")
  const [question, setQuestion] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmitQuestion = async () => {
    if (!questionCategory || !question.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a category and enter your question.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/community/ask-expert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: questionCategory,
          question: question.trim(),
          priority: "medium",
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Question Submitted!",
          description: data.message,
        })
        setQuestion("")
        setQuestionCategory("")
      } else {
        throw new Error(data.error || "Failed to submit question")
      }
    } catch (error) {
      console.error("Error submitting question:", error)
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your question. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const experts = [
    {
      id: "dr-sarah-kim",
      name: "Dr. Sarah Kim",
      title: "Endocrinologist & Diabetes Specialist",
      avatar: "/professional-female-doctor.png",
      specialties: ["Type 2 Diabetes", "Insulin Management", "Complications Prevention"],
      rating: 4.9,
      sessionsCompleted: 234,
      nextAvailable: "Tomorrow, 2:00 PM",
      bio: "15+ years specializing in diabetes care and metabolic disorders",
    },
    {
      id: "dr-michael-rodriguez",
      name: "Dr. Michael Rodriguez",
      title: "Nutritionist & Metabolic Health Expert",
      avatar: "/middle-aged-man-contemplative.png",
      specialties: ["Nutrition Planning", "Weight Management", "Metabolic Syndrome"],
      rating: 4.8,
      sessionsCompleted: 189,
      nextAvailable: "Today, 4:30 PM",
      bio: "Certified nutritionist with focus on diabetes-friendly meal planning",
    },
    {
      id: "dr-jennifer-lee",
      name: "Dr. Jennifer Lee",
      title: "Exercise Physiologist",
      avatar: "/smiling-hispanic-woman.png",
      specialties: ["Exercise Prescription", "Fitness for Diabetes", "Injury Prevention"],
      rating: 4.9,
      sessionsCompleted: 156,
      nextAvailable: "Friday, 10:00 AM",
      bio: "Specializes in safe, effective exercise programs for people with diabetes",
    },
  ]

  const upcomingSessions = [
    {
      title: "Managing Diabetes with Dr. Sarah Kim",
      date: "Tomorrow, 2:00 PM",
      participants: 234,
      topic: "Latest advances in Type 2 diabetes management",
      expert: "Dr. Sarah Kim",
    },
    {
      title: "Nutrition Q&A with Dr. Michael Rodriguez",
      date: "Friday, 1:00 PM",
      participants: 156,
      topic: "Meal planning for optimal blood sugar control",
      expert: "Dr. Michael Rodriguez",
    },
    {
      title: "Exercise Safety with Dr. Jennifer Lee",
      date: "Next Monday, 11:00 AM",
      participants: 89,
      topic: "Safe exercise routines for diabetic complications",
      expert: "Dr. Jennifer Lee",
    },
  ]

  const recentQuestions = [
    {
      question: "How do I manage dawn phenomenon?",
      category: "Blood Sugar",
      expert: "Dr. Sarah Kim",
      answers: 12,
      likes: 45,
      timeAgo: "2 hours ago",
    },
    {
      question: "Best pre-workout snacks for diabetics?",
      category: "Exercise",
      expert: "Dr. Jennifer Lee",
      answers: 8,
      likes: 23,
      timeAgo: "4 hours ago",
    },
    {
      question: "Carb counting for restaurant meals?",
      category: "Nutrition",
      expert: "Dr. Michael Rodriguez",
      answers: 15,
      likes: 67,
      timeAgo: "1 day ago",
    },
  ]

  const aiSuggestions = [
    "How can I prevent blood sugar spikes after meals?",
    "What's the best time to exercise with diabetes?",
    "How do I adjust my diet during illness?",
    "What are the warning signs of diabetic complications?",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#21262D] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <header className="glass-card border-b border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/community">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Icon3D type="sphere" color="blue" size="sm" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Ask an Expert</h1>
                  <p className="text-sm text-text-secondary">Get professional guidance from healthcare experts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 ring-gradient animate-fade-in-up">
              <div className="flex items-center gap-2 mb-2">
                <Icon3D type="capsule" color="blue" size="sm" />
                <h2 className="text-xl font-bold text-white">Ask Your Question</h2>
              </div>
              <p className="text-text-secondary mb-6">Get expert answers to your health questions</p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="category" className="text-white">
                    Question Category
                  </Label>
                  <Select value={questionCategory} onValueChange={setQuestionCategory}>
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/20">
                      <SelectItem value="blood-sugar">Blood Sugar Management</SelectItem>
                      <SelectItem value="nutrition">Nutrition & Diet</SelectItem>
                      <SelectItem value="exercise">Exercise & Fitness</SelectItem>
                      <SelectItem value="medication">Medications</SelectItem>
                      <SelectItem value="complications">Complications</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="question" className="text-white">
                    Your Question
                  </Label>
                  <Textarea
                    id="question"
                    placeholder="Describe your question in detail. Include relevant context like your current medications, symptoms, or specific situations..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={4}
                    className="glass-input"
                  />
                </div>

                <div className="glass-card p-4 border border-accent-purple/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="h-4 w-4 text-accent-purple" />
                    <span className="text-sm font-medium text-white">AI Suggested Questions</span>
                    <Badge className="bg-accent-purple/20 text-accent-purple border-accent-purple/30 text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setQuestion(suggestion)}
                        className="block w-full text-left text-sm text-text-secondary hover:text-white hover:bg-white/10 p-2 rounded transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="btn btn-primary flex-1" onClick={handleSubmitQuestion} disabled={isSubmitting}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Submitting..." : "Submit Question"}
                  </Button>
                  <Link href="/coaching/schedule">
                    <Button className="btn btn-secondary">
                      <Icon3D type="cube" color="white" size="xs" className="mr-2" />
                      Schedule 1:1 Session
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 ring-gradient animate-fade-in-up">
              <h2 className="text-xl font-bold text-white mb-2">Recent Community Questions</h2>
              <p className="text-text-secondary mb-6">See what others are asking and learn from expert answers</p>

              <div className="space-y-4">
                {recentQuestions.map((item, index) => (
                  <div key={index} className="glass-card p-4 border border-white/10 hover-glow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-white">{item.question}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-accent-blue/20 text-accent-blue border-accent-blue/30 text-xs">
                            {item.category}
                          </Badge>
                          <span className="text-sm text-text-secondary">Answered by {item.expert}</span>
                        </div>
                      </div>
                      <span className="text-xs text-text-muted">{item.timeAgo}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {item.answers} answers
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {item.likes} helpful
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto text-white hover:bg-white/10">
                        View Answer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6 ring-gradient animate-fade-in-up">
              <h2 className="text-xl font-bold text-white mb-2">Featured Experts</h2>
              <p className="text-text-secondary mb-6">Healthcare professionals ready to help</p>

              <div className="space-y-4">
                {experts.map((expert, index) => (
                  <div key={index} className="glass-card p-3 border border-white/10">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar>
                        <AvatarImage src={expert.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-accent-blue/20 text-accent-blue">
                          {expert.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm">{expert.name}</h4>
                        <p className="text-xs text-text-secondary">{expert.title}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-accent-yellow" />
                          <span className="text-xs text-text-secondary">{expert.rating}</span>
                          <span className="text-xs text-text-muted">({expert.sessionsCompleted} sessions)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {expert.specialties.map((specialty, idx) => (
                        <Badge
                          key={idx}
                          className="bg-accent-green/20 text-accent-green border-accent-green/30 text-xs"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-text-secondary">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {expert.nextAvailable}
                      </div>
                      <Link href={`/coaching/schedule?expert=${expert.id}`}>
                        <Button size="sm" className="btn btn-secondary text-xs">
                          Book Session
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 ring-gradient animate-fade-in-up">
              <div className="flex items-center gap-2 mb-2">
                <Icon3D type="cube" color="green" size="sm" />
                <h2 className="text-xl font-bold text-white">Upcoming Sessions</h2>
              </div>

              <div className="space-y-4 mt-6">
                {upcomingSessions.map((session, index) => (
                  <div key={index} className="border-l-4 border-accent-blue pl-3">
                    <h4 className="font-medium text-white text-sm">{session.title}</h4>
                    <p className="text-xs text-text-secondary mb-1">{session.topic}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-muted">{session.date}</span>
                      <span className="text-xs text-text-muted">{session.participants} joining</span>
                    </div>
                  </div>
                ))}
                <Button className="btn btn-secondary w-full text-sm">View All Sessions</Button>
              </div>
            </div>

            <div className="glass-card p-6 ring-gradient animate-fade-in-up">
              <h2 className="text-xl font-bold text-white mb-4">Expert Tips</h2>

              <div className="space-y-3">
                <div className="glass-card p-3 border border-accent-blue/20">
                  <p className="text-sm text-accent-blue font-medium">💡 Tip of the Day</p>
                  <p className="text-sm text-text-secondary mt-1">
                    Check your blood sugar 2 hours after meals to understand how different foods affect you.
                  </p>
                </div>
                <div className="glass-card p-3 border border-accent-green/20">
                  <p className="text-sm text-accent-green font-medium">🥗 Nutrition Tip</p>
                  <p className="text-sm text-text-secondary mt-1">
                    Pair carbs with protein and fiber to slow glucose absorption and reduce spikes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
