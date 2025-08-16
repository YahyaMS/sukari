import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon3D } from "@/components/ui/3d-icon"

export default function HomePage() {
  return (
    <div className="page-background">
      <div className="absolute inset-0 overflow-hidden">
        <div className="animated-bg-element -top-40 -right-40 w-80 h-80 bg-purple-500/20" />
        <div className="animated-bg-element -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 delay-1000" />
        <div className="animated-bg-element top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 delay-2000" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md relative z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon3D shape="sphere" color="blue" size="lg" className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-white">MetaReverse</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Reverse Diabetes & Obesity with <span className="text-gradient-primary">Medical-Grade Coaching</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Transform your health with personalized coaching, AI-powered insights, and proven lifestyle interventions.
            Join thousands who have successfully reversed their condition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg shadow-purple-500/25"
              >
                Start Your Journey
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center glass-card glass-hover hover-scale">
            <CardHeader>
              <Icon3D shape="cube" color="blue" size="xl" className="mx-auto mb-4" glow />
              <CardTitle className="text-white">Health Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Monitor glucose, weight, meals, and exercise with intelligent insights
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center glass-card glass-hover hover-scale">
            <CardHeader>
              <Icon3D shape="sphere" color="green" size="xl" className="mx-auto mb-4" glow />
              <CardTitle className="text-white">Expert Coaching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Get personalized guidance from certified diabetes and nutrition coaches
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center glass-card glass-hover hover-scale">
            <CardHeader>
              <Icon3D shape="capsule" color="purple" size="xl" className="mx-auto mb-4" glow />
              <CardTitle className="text-white">AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Receive personalized meal plans and predictions based on your data
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center glass-card glass-hover hover-scale">
            <CardHeader>
              <Icon3D shape="torus" color="orange" size="xl" className="mx-auto mb-4" glow />
              <CardTitle className="text-white">Proven Results</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Average HbA1c reduction of 0.5-1.0% and 5-10% weight loss
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="glass-card p-8 shadow-xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
                10,000+
              </div>
              <div className="text-gray-300">Patients Helped</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-2">
                85%
              </div>
              <div className="text-gray-300">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                1.2%
              </div>
              <div className="text-gray-300">Avg HbA1c Reduction</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
