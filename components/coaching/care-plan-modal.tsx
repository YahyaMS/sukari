"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Target, Pill, Utensils, Dumbbell, Calendar, Download } from "lucide-react"

interface CarePlanModalProps {
  isOpen: boolean
  onClose: () => void
  carePlan: any
}

export default function CarePlanModal({ isOpen, onClose, carePlan }: CarePlanModalProps) {
  if (!carePlan) return null

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    console.log("Downloading care plan...")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>My Care Plan</span>
              </DialogTitle>
              <DialogDescription>Your personalized health management plan</DialogDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Health Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span>Health Goals</span>
              </CardTitle>
              <CardDescription>Your target outcomes for the next 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {carePlan.goals.map((goal: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">{goal}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Medications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Pill className="h-5 w-5 text-green-600" />
                <span>Current Medications</span>
              </CardTitle>
              <CardDescription>Your prescribed medication regimen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {carePlan.current_medications.map((med: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">{med.name}</p>
                      <p className="text-sm text-gray-600">{med.dosage}</p>
                    </div>
                    <Badge variant="secondary">{med.frequency}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dietary Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Utensils className="h-5 w-5 text-orange-600" />
                <span>Dietary Guidelines</span>
              </CardTitle>
              <CardDescription>Nutrition recommendations for optimal health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {carePlan.dietary_guidelines.map((guideline: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <span className="text-sm">{guideline}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Exercise Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Dumbbell className="h-5 w-5 text-purple-600" />
                <span>Exercise Plan</span>
              </CardTitle>
              <CardDescription>Your personalized fitness routine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {carePlan.exercise_plan.map((exercise: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-sm">{exercise}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Plan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-600" />
                <span>Plan Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">{new Date(carePlan.last_updated).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Next Review:</span>
                  <span className="font-medium">{new Date(carePlan.next_review).toLocaleDateString()}</span>
                </div>
              </div>
              <Separator />
              <div className="text-xs text-gray-500">
                <p>
                  This care plan was developed in collaboration with your healthcare team. Please follow the
                  recommendations and contact your coach if you have any questions or concerns.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
