"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Activity, Heart, Scale, FileText, Download, Share } from "lucide-react"

export default function ProviderPortalPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Healthcare Provider Portal</h1>
        <p className="text-lg text-gray-600">Comprehensive health data dashboard for healthcare providers</p>
      </div>

      {/* Patient Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Patient Summary</CardTitle>
          <CardDescription>John Doe • DOB: 01/15/1978 • Type 2 Diabetes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">7.2%</div>
              <div className="text-sm text-blue-700">Latest HbA1c</div>
              <Badge className="mt-1 bg-yellow-100 text-yellow-800">Improving</Badge>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Scale className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">185 lbs</div>
              <div className="text-sm text-green-700">Current Weight</div>
              <Badge className="mt-1 bg-green-100 text-green-800">-12 lbs</Badge>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">142</div>
              <div className="text-sm text-purple-700">Avg Glucose (mg/dL)</div>
              <Badge className="mt-1 bg-green-100 text-green-800">In Range</Badge>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Heart className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-900">78%</div>
              <div className="text-sm text-orange-700">Time in Range</div>
              <Badge className="mt-1 bg-green-100 text-green-800">Excellent</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Data Tabs */}
      <Tabs defaultValue="glucose" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="glucose">Glucose</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="glucose" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Glucose Management</CardTitle>
              <CardDescription>30-day glucose trends and patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Average Readings</h4>
                    <div className="text-2xl font-bold text-blue-600">142 mg/dL</div>
                    <p className="text-sm text-gray-600">Target: 80-180 mg/dL</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Time in Range</h4>
                    <div className="text-2xl font-bold text-green-600">78%</div>
                    <p className="text-sm text-gray-600">Target: &gt;70%</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Hypoglycemic Events</h4>
                    <div className="text-2xl font-bold text-orange-600">3</div>
                    <p className="text-sm text-gray-600">This month</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Clinical Notes</h4>
                  <p className="text-sm text-gray-700">
                    Patient shows significant improvement in glucose control. Post-meal spikes have decreased by 25%
                    since last visit. Continue current medication regimen and dietary modifications.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weight" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weight Management</CardTitle>
              <CardDescription>Weight trends and body composition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Current Weight</h4>
                    <div className="text-2xl font-bold text-blue-600">185 lbs</div>
                    <p className="text-sm text-green-600">-12 lbs from baseline</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">BMI</h4>
                    <div className="text-2xl font-bold text-blue-600">26.8</div>
                    <p className="text-sm text-gray-600">Overweight (target: &lt;25)</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Progress Notes</h4>
                  <p className="text-sm text-gray-700">
                    Steady weight loss of 1-2 lbs per week. Patient reports improved energy levels and better sleep
                    quality. Recommend continuing current dietary plan.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Medications</CardTitle>
              <CardDescription>Active prescriptions and adherence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Metformin", dose: "1000mg", frequency: "Twice daily", adherence: "95%" },
                  { name: "Glipizide", dose: "5mg", frequency: "Once daily", adherence: "88%" },
                  { name: "Lisinopril", dose: "10mg", frequency: "Once daily", adherence: "92%" },
                ].map((med, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{med.name}</h4>
                      <p className="text-sm text-gray-600">
                        {med.dose} • {med.frequency}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">{med.adherence}</div>
                      <div className="text-xs text-gray-500">Adherence</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifestyle" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lifestyle Factors</CardTitle>
              <CardDescription>Diet, exercise, and behavioral patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Exercise Activity</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Weekly Sessions</span>
                      <span className="text-sm font-medium">4.2 avg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Duration</span>
                      <span className="text-sm font-medium">35 min avg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Primary Activities</span>
                      <span className="text-sm font-medium">Walking, Swimming</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Dietary Patterns</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Daily Carbs</span>
                      <span className="text-sm font-medium">145g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Meal Timing</span>
                      <span className="text-sm font-medium">Consistent</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Intermittent Fasting</span>
                      <span className="text-sm font-medium">16:8 protocol</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Reports</CardTitle>
              <CardDescription>Generated reports and data exports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "30-Day Comprehensive Report", date: "Dec 15, 2024", type: "PDF" },
                  { name: "Glucose Trend Analysis", date: "Dec 10, 2024", type: "PDF" },
                  { name: "Medication Adherence Report", date: "Dec 5, 2024", type: "PDF" },
                  { name: "Raw Data Export", date: "Dec 1, 2024", type: "CSV" },
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-gray-600">Generated: {report.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{report.type}</Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 pt-4">
                <Button className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate New Report
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Share className="h-4 w-4 mr-2" />
                  Share with Patient
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
