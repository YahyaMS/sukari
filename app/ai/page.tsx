"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Utensils, Dumbbell, Clock, Brain, TrendingUp, Target } from "lucide-react"
import Link from "next/link"

const aiFeatures = [
  {
    id: "meal-planner",
    title: "AI Meal Planner",
    description: "Get personalized meal suggestions based on your glucose response patterns and dietary preferences",
    icon: Utensils,
    color: "text-green-600",
    bgColor: "bg-green-50",
    href: "/ai/meal-planner",
    features: [
      "Carb-optimized recipes",
      "Glucose impact prediction",
      "Shopping list generation",
      "Dietary restrictions",
    ],
    status: "Available",
  },
  {
    id: "exercise-planner",
    title: "AI Exercise Planner",
    description: "Receive workout plans optimized for glucose control based on your fitness level and goals",
    icon: Dumbbell,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    href: "/ai/exercise-planner",
    features: ["Personalized workouts", "Glucose impact analysis", "Equipment-based plans", "Progress tracking"],
    status: "Available",
  },
  {
    id: "fasting-coach",
    title: "AI Fasting Coach",
    description: "Smart intermittent fasting guidance with personalized timing and glucose monitoring",
    icon: Clock,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    href: "/ai/fasting-coach",
    features: ["Multiple fasting protocols", "Smart timing", "Progress tracking", "Glucose optimization"],
    status: "Available",
  },
  {
    id: "insights",
    title: "Health Insights",
    description: "AI-powered analysis of your health patterns with predictive recommendations",
    icon: Brain,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    href: "/analytics/insights",
    features: ["Pattern recognition", "Predictive modeling", "Risk assessment", "Personalized tips"],
    status: "Available",
  },
]

const upcomingFeatures = [
  {
    title: "Medication Optimizer",
    description: "AI recommendations for medication timing based on glucose patterns",
    icon: Target,
    status: "Coming Soon",
  },
  {
    title: "Risk Predictor",
    description: "Early warning system for potential health complications",
    icon: TrendingUp,
    status: "In Development",
  },
]

export default function AIPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your AI Health Companion</h1>
        <p className="text-lg text-gray-600">
          Like having a caring medical professional by your side - here to support, guide, and celebrate your progress
        </p>
      </div>

      {/* Available AI Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">AI Tools Ready to Help You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aiFeatures.map((feature) => {
            const IconComponent = feature.icon
            const empathicDescriptions = {
              "meal-planner":
                "We'll help you discover meals that work with your body, not against it. Every suggestion is personalized for your glucose response.",
              "exercise-planner":
                "Movement that feels good and helps your health. We'll find workouts that fit your life and support your glucose goals.",
              "fasting-coach":
                "Gentle guidance for intermittent fasting. We'll help you find the rhythm that works for your body and lifestyle.",
              insights:
                "Understanding your patterns so you can make informed choices. We celebrate your progress and help you learn from every data point.",
            }

            return (
              <Card key={feature.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${feature.bgColor} mb-4`}>
                      <IconComponent className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Ready to help
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {empathicDescriptions[feature.id] || feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">How we'll support you:</h4>
                      <div className="flex flex-wrap gap-2">
                        {feature.features.map((feat, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Link href={feature.href}>
                      <Button className="w-full">Let's explore together</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Upcoming Features */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">More Support Coming Soon</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingFeatures.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Card key={index} className="opacity-75">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-lg bg-gray-100 mb-4">
                      <IconComponent className="h-6 w-6 text-gray-500" />
                    </div>
                    <Badge variant="outline" className="text-gray-600">
                      {feature.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-gray-700">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-500">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button disabled className="w-full">
                    We're working on this for you
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
