"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Lightbulb, Calendar, MessageCircle, Star, Clock, Bot, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/community">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ask an Expert</h1>
                <p className="text-sm text-gray-600">Get professional guidance from healthcare experts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ask a Question */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                  Ask Your Question
                </CardTitle>
                <CardDescription>Get expert answers to your health questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Question Category</Label>
                  <Select value={questionCategory} onValueChange={setQuestionCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
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
                  <Label htmlFor="question">Your Question</Label>
                  <Textarea
                    id="question"
                    placeholder="Describe your question in detail. Include relevant context like your current medications, symptoms, or specific situations..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={4}
                  />
                </div>

                {/* AI Suggestions */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">AI Suggested Questions</span>
                    <Badge variant="secondary" className="text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setQuestion(suggestion)}
                        className="block w-full text-left text-sm text-purple-700 hover:text-purple-900 hover:bg-purple-100 p-2 rounded transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1" onClick={handleSubmitQuestion} disabled={isSubmitting}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Submitting..." : "Submit Question"}
                  </Button>
                  <Link href="/coaching/schedule">
                    <Button variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule 1:1 Session
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Questions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Community Questions</CardTitle>
                <CardDescription>See what others are asking and learn from expert answers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentQuestions.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.question}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          <span className="text-sm text-gray-600">Answered by {item.expert}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{item.timeAgo}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {item.answers} answers
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {item.likes} helpful
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        View Answer
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Experts */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Experts</CardTitle>
                <CardDescription>Healthcare professionals ready to help</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {experts.map((expert, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar>
                        <AvatarImage src={expert.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {expert.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{expert.name}</h4>
                        <p className="text-xs text-gray-600">{expert.title}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs text-gray-600">{expert.rating}</span>
                          <span className="text-xs text-gray-500">({expert.sessionsCompleted} sessions)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {expert.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-600">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {expert.nextAvailable}
                      </div>
                      <Link href={`/coaching/schedule?expert=${expert.id}`}>
                        <Button size="sm" variant="outline">
                          Book Session
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingSessions.map((session, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-3">
                    <h4 className="font-medium text-gray-900 text-sm">{session.title}</h4>
                    <p className="text-xs text-gray-600 mb-1">{session.topic}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{session.date}</span>
                      <span className="text-xs text-gray-500">{session.participants} joining</span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View All Sessions
                </Button>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Expert Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">💡 Tip of the Day</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Check your blood sugar 2 hours after meals to understand how different foods affect you.
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">🥗 Nutrition Tip</p>
                  <p className="text-sm text-green-700 mt-1">
                    Pair carbs with protein and fiber to slow glucose absorption and reduce spikes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
