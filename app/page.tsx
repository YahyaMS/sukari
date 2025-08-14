import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Activity, Users, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">MetaReverse</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Reverse Diabetes & Obesity with <span className="text-blue-600">Medical-Grade Coaching</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Transform your health with personalized coaching, AI-powered insights, and proven lifestyle interventions.
            Join thousands who have successfully reversed their condition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Your Journey
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Activity className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Health Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Monitor glucose, weight, meals, and exercise with intelligent insights</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Expert Coaching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Get personalized guidance from certified diabetes and nutrition coaches</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Receive personalized meal plans and predictions based on your data</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle>Proven Results</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Average HbA1c reduction of 0.5-1.0% and 5-10% weight loss</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Patients Helped</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">85%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">1.2%</div>
              <div className="text-gray-600">Avg HbA1c Reduction</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
