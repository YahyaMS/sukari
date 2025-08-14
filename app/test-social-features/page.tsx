"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Play, Users, MessageSquare, Heart, Trophy } from "lucide-react"
import Link from "next/link"

interface TestResult {
  name: string
  status: "pass" | "fail" | "warning" | "pending"
  description: string
  link?: string
}

export default function TestSocialFeaturesPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([
    {
      name: "Success Story Sharing",
      status: "pending",
      description: "Test creating and sharing success stories with the modal form",
      link: "/community/stories",
    },
    {
      name: "Story Likes & Reactions",
      status: "pending",
      description: "Test liking success stories and updating counts in real-time",
      link: "/community/stories",
    },
    {
      name: "Friend Suggestions",
      status: "pending",
      description: "Test AI-powered friend suggestions based on health profiles",
      link: "/social",
    },
    {
      name: "Friend Requests",
      status: "pending",
      description: "Test sending, accepting, and rejecting friend requests",
      link: "/social",
    },
    {
      name: "Social Feed Reactions",
      status: "pending",
      description: "Test like and fire reactions on social feed posts",
      link: "/social",
    },
    {
      name: "Comments System",
      status: "pending",
      description: "Test posting, editing, deleting, and replying to comments",
      link: "/social",
    },
    {
      name: "Community Groups",
      status: "pending",
      description: "Test individual group pages and discussions",
      link: "/community/groups",
    },
    {
      name: "Challenge Participation",
      status: "pending",
      description: "Test joining challenges and viewing leaderboards",
      link: "/challenges",
    },
    {
      name: "Gamification Integration",
      status: "pending",
      description: "Test HP rewards, achievements, and streak tracking",
      link: "/dashboard",
    },
    {
      name: "Navigation Integration",
      status: "pending",
      description: "Test all navigation links and feature accessibility",
      link: "/dashboard",
    },
  ])

  const updateTestResult = (index: number, status: "pass" | "fail" | "warning") => {
    setTestResults((prev) => prev.map((result, i) => (i === index ? { ...result, status } : result)))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "fail":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      default:
        return <Play className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pass":
        return <Badge className="bg-green-100 text-green-800">Pass</Badge>
      case "fail":
        return <Badge className="bg-red-100 text-red-800">Fail</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  const passCount = testResults.filter((r) => r.status === "pass").length
  const failCount = testResults.filter((r) => r.status === "fail").length
  const warningCount = testResults.filter((r) => r.status === "warning").length
  const pendingCount = testResults.filter((r) => r.status === "pending").length

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Social Features Test Suite</h1>
          <p className="text-gray-600">
            Comprehensive testing of all social features in MetaReverse to ensure functionality and user experience.
          </p>
        </div>

        {/* Test Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{passCount}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{failCount}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
              <div className="text-sm text-gray-600">Warnings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Play className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-600">{pendingCount}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
        </div>

        {/* Test Cases */}
        <div className="space-y-4">
          {testResults.map((test, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <CardTitle className="text-lg">{test.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(test.status)}
                    {test.link && (
                      <Link href={test.link}>
                        <Button variant="outline" size="sm">
                          Test
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{test.description}</p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => updateTestResult(index, "pass")} variant="outline">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                    Pass
                  </Button>
                  <Button size="sm" onClick={() => updateTestResult(index, "fail")} variant="outline">
                    <XCircle className="h-4 w-4 mr-1 text-red-600" />
                    Fail
                  </Button>
                  <Button size="sm" onClick={() => updateTestResult(index, "warning")} variant="outline">
                    <AlertCircle className="h-4 w-4 mr-1 text-yellow-600" />
                    Warning
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Links */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Access to Social Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/social">
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <Users className="h-4 w-4" />
                  Social Hub
                </Button>
              </Link>
              <Link href="/community/stories">
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <Trophy className="h-4 w-4" />
                  Success Stories
                </Button>
              </Link>
              <Link href="/challenges">
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <MessageSquare className="h-4 w-4" />
                  Challenges
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <Heart className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Test Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Success Story Features:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Click "Share Your Story" button and fill out the modal form</li>
                <li>Test like buttons on existing stories</li>
                <li>Verify story filtering and sorting works</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Social Hub Features:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Test friend suggestions and sending friend requests</li>
                <li>Test like and fire reactions on social feed posts</li>
                <li>Test commenting, replying, editing, and deleting comments</li>
                <li>Verify friend leaderboards display correctly</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Integration Testing:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Verify all navigation links work properly</li>
                <li>Test gamification features (HP, achievements, streaks)</li>
                <li>Check that tracking actions award HP and create social posts</li>
                <li>Ensure dark mode works across all social features</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
