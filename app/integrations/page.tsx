"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Hospital, FileText, Shield, Download, Upload, Settings, CheckCircle, AlertCircle, Clock } from "lucide-react"
import Link from "next/link"

const integrations = [
  {
    id: "ehr",
    name: "Electronic Health Records",
    description: "Connect with your healthcare provider's EHR system for seamless data sharing",
    icon: Hospital,
    status: "connected",
    provider: "Epic MyChart",
    lastSync: "2 hours ago",
    features: ["FHIR R4 Compatible", "Real-time sync", "Secure data transfer"],
  },
  {
    id: "lab",
    name: "Lab Results",
    description: "Automatically import lab results including HbA1c, glucose, and lipid panels",
    icon: FileText,
    status: "connected",
    provider: "Quest Diagnostics",
    lastSync: "1 day ago",
    features: ["Auto-import results", "Trend analysis", "Alert notifications"],
  },
  {
    id: "insurance",
    name: "Insurance Portal",
    description: "Connect with your insurance provider for coverage verification and claims",
    icon: Shield,
    status: "pending",
    provider: "Blue Cross Blue Shield",
    lastSync: "Not connected",
    features: ["Coverage verification", "Claims tracking", "Prior authorization"],
  },
]

const dataExports = [
  {
    name: "Comprehensive Health Report",
    description: "Complete health summary for healthcare providers",
    format: "PDF",
    lastGenerated: "3 days ago",
  },
  {
    name: "Glucose Data Export",
    description: "Detailed glucose readings and trends",
    format: "CSV",
    lastGenerated: "1 week ago",
  },
  {
    name: "FHIR Bundle",
    description: "Standardized health data in FHIR format",
    format: "JSON",
    lastGenerated: "2 weeks ago",
  },
]

export default function IntegrationsPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-red-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="destructive">Disconnected</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Healthcare Integrations</h1>
        <p className="text-lg text-gray-600">
          Connect with healthcare providers and systems for seamless data sharing and comprehensive care
        </p>
      </div>

      {/* HIPAA Compliance Notice */}
      <Card className="mb-8 border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-blue-900">HIPAA Compliant</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-blue-800 mb-4">
            All healthcare integrations are HIPAA compliant with end-to-end encryption and secure data transmission.
            Your health information is protected according to federal privacy regulations.
          </p>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              View Privacy Policy
            </Button>
            <Button variant="outline" size="sm">
              Data Usage Agreement
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Healthcare System Integrations */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Healthcare System Connections</h2>
        <div className="space-y-6">
          {integrations.map((integration) => {
            const IconComponent = integration.icon
            return (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-blue-50">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{integration.name}</CardTitle>
                        <CardDescription>{integration.description}</CardDescription>
                        {integration.status === "connected" && (
                          <p className="text-sm text-gray-500 mt-1">
                            Connected to {integration.provider} • Last sync: {integration.lastSync}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(integration.status)}
                      {getStatusBadge(integration.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-wrap gap-2">
                      {integration.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Auto-sync</span>
                      <Switch checked={integration.status === "connected"} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {integration.status === "connected" ? (
                      <>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm">
                          View Data
                        </Button>
                      </>
                    ) : (
                      <Button size="sm">Connect to {integration.provider}</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Healthcare Provider Portal */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Healthcare Provider Access</h2>
        <Card>
          <CardHeader>
            <CardTitle>Provider Portal</CardTitle>
            <CardDescription>
              Grant your healthcare providers secure access to your health data and progress reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Dr. Sarah Johnson, MD</h4>
                <p className="text-sm text-gray-600">Endocrinologist • Metro Health Center</p>
                <p className="text-xs text-gray-500">Access granted: Full health data</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">Active</Badge>
                <Button variant="outline" size="sm">
                  Manage Access
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Dr. Michael Chen, MD</h4>
                <p className="text-sm text-gray-600">Primary Care • City Medical Group</p>
                <p className="text-xs text-gray-500">Access granted: Summary reports only</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">Active</Badge>
                <Button variant="outline" size="sm">
                  Manage Access
                </Button>
              </div>
            </div>
            <Button className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Invite New Provider
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Data Export & Sharing */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Data Export & Sharing</h2>
        <Card>
          <CardHeader>
            <CardTitle>Export Health Data</CardTitle>
            <CardDescription>
              Generate reports and export your health data for healthcare providers or personal records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataExports.map((exportItem, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{exportItem.name}</h4>
                    <p className="text-sm text-gray-600">{exportItem.description}</p>
                    <p className="text-xs text-gray-500">
                      Format: {exportItem.format} • Last generated: {exportItem.lastGenerated}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      Generate New
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-6" />
            <div className="flex gap-4">
              <Link href="/integrations/provider-portal" className="flex-1">
                <Button className="w-full">
                  <Hospital className="h-4 w-4 mr-2" />
                  Provider Portal
                </Button>
              </Link>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Shield className="h-4 w-4 mr-2" />
                Privacy Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
