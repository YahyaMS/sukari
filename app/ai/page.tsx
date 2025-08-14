"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icon3D } from "@/components/ui/3d-icon"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const aiFeatures = [
  {
    id: "meal-planner",
    title: "AI Meal Planner",
    description: "Get personalized meal suggestions based on your glucose response patterns and dietary preferences",
    shape: "utensils",
    color: "green",
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
    shape: "heart",
    color: "blue",
    href: "/ai/exercise-planner",
    features: ["Personalized workouts", "Glucose impact analysis", "Equipment-based plans", "Progress tracking"],
    status: "Available",
  },
  {
    id: "fasting-coach",
    title: "AI Fasting Coach",
    description: "Smart intermittent fasting guidance with personalized timing and glucose monitoring",
    shape: "capsule",
    color: "purple",
    href: "/ai/fasting-coach",
    features: ["Multiple fasting protocols", "Smart timing", "Progress tracking", "Glucose optimization"],
    status: "Available",
  },
  {
    id: "insights",
    title: "Health Insights",
    description: "AI-powered analysis of your health patterns with predictive recommendations",
    shape: "sphere",
    color: "orange",
    href: "/analytics/insights",
    features: ["Pattern recognition", "Predictive modeling", "Risk assessment", "Personalized tips"],
    status: "Available",
  },
]

const upcomingFeatures = [
  {
    title: "Medication Optimizer",
    description: "AI recommendations for medication timing based on glucose patterns",
    shape: "cube",
    color: "gray",
    status: "Coming Soon",
  },
  {
    title: "Risk Predictor",
    description: "Early warning system for potential health complications",
    shape: "torus",
    color: "gray",
    status: "In Development",
  },
]

export default function AIPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#21262D] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-xl animate-bounce"></div>
      </div>

      <header className="glass-card border-b border-white/10 sticky top-0 z-50 relative">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Icon3D shape="sphere" color="gradient" size="lg" glow />
              <div>
                <h1 className="text-2xl font-bold text-white">Your AI Health Companion</h1>
                <p className="text-sm text-text-secondary">Like having a caring medical professional by your side</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-6xl relative z-10">
        <div className="mb-8 animate-fade-in-up">
          <p className="text-lg text-gray-300 leading-relaxed">
            Here to support, guide, and celebrate your progress every step of the way
          </p>
        </div>

        {/* Available AI Features */}
        <div className="mb-12 animate-fade-in-up">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
            <Icon3D shape="cube" color="blue" size="md" />
            AI Tools Ready to Help You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiFeatures.map((feature) => (
              <Card
                key={feature.id}
                className="glass-card border-white/10 hover:border-white/20 transition-all duration-300 hover-lift"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="mb-4">
                      <Icon3D shape={feature.shape as any} color={feature.color as any} size="xl" glow />
                    </div>
                    <Badge className="bg-accent-green/20 text-accent-green border-accent-green/30">Ready to help</Badge>
                  </div>
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {empathicDescriptions[feature.id] || feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-white mb-2">How we'll support you:</h4>
                      <div className="flex flex-wrap gap-2">
                        {feature.features.map((feat, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs bg-white/5 border-white/20 text-gray-300"
                          >
                            {feat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Link href={feature.href}>
                      <Button className="w-full gradient-primary hover:scale-105 transition-all duration-200 shadow-lg text-white font-semibold">
                        Let's explore together
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Features */}
        <div className="animate-fade-in-up">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
            <Icon3D shape="torus" color="purple" size="md" />
            More Support Coming Soon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingFeatures.map((feature, index) => (
              <Card
                key={index}
                className="glass-card border-white/10 opacity-75 hover:opacity-90 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="mb-4">
                      <Icon3D shape={feature.shape as any} color="gray" size="xl" />
                    </div>
                    <Badge variant="outline" className="bg-white/5 border-white/20 text-gray-400">
                      {feature.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-gray-300">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-400">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button disabled className="w-full bg-white/5 border-white/20 text-gray-400 cursor-not-allowed">
                    We're working on this for you
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
