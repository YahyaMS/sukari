"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Pill, AlertTriangle, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function MedicalProfilePage() {
  const [medications, setMedications] = useState([
    { name: "Metformin", dosage: "500mg", frequency: "Twice daily", prescriber: "Dr. Smith" },
    { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", prescriber: "Dr. Smith" },
  ])

  const [allergies, setAllergies] = useState(["Penicillin", "Shellfish"])
  const [conditions, setConditions] = useState(["Type 2 Diabetes", "Hypertension"])

  const addMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "", prescriber: "" }])
  }

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Medical Profile</h1>
                <p className="text-sm text-gray-600">Manage your health conditions and medications</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">MetaReverse</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Health Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Health Conditions
              </CardTitle>
              <CardDescription>Current diagnosed health conditions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {conditions.map((condition, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {condition}
                  </Badge>
                ))}
              </div>
              <div>
                <Label htmlFor="newCondition">Add Condition</Label>
                <div className="flex gap-2 mt-1">
                  <Input id="newCondition" placeholder="Enter health condition" />
                  <Button size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Medications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Current Medications
              </CardTitle>
              <CardDescription>List all medications you are currently taking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {medications.map((medication, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor={`med-name-${index}`}>Medication Name</Label>
                      <Input
                        id={`med-name-${index}`}
                        value={medication.name}
                        placeholder="e.g., Metformin"
                        onChange={(e) => {
                          const updated = [...medications]
                          updated[index].name = e.target.value
                          setMedications(updated)
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`med-dosage-${index}`}>Dosage</Label>
                      <Input
                        id={`med-dosage-${index}`}
                        value={medication.dosage}
                        placeholder="e.g., 500mg"
                        onChange={(e) => {
                          const updated = [...medications]
                          updated[index].dosage = e.target.value
                          setMedications(updated)
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`med-frequency-${index}`}>Frequency</Label>
                      <Select value={medication.frequency}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Once daily">Once daily</SelectItem>
                          <SelectItem value="Twice daily">Twice daily</SelectItem>
                          <SelectItem value="Three times daily">Three times daily</SelectItem>
                          <SelectItem value="As needed">As needed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeMedication(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Label htmlFor={`med-prescriber-${index}`}>Prescribing Doctor</Label>
                    <Input
                      id={`med-prescriber-${index}`}
                      value={medication.prescriber}
                      placeholder="e.g., Dr. Smith"
                      onChange={(e) => {
                        const updated = [...medications]
                        updated[index].prescriber = e.target.value
                        setMedications(updated)
                      }}
                    />
                  </div>
                </div>
              ))}

              <Button onClick={addMedication} variant="outline" className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </CardContent>
          </Card>

          {/* Allergies & Reactions */}
          <Card>
            <CardHeader>
              <CardTitle>Allergies & Adverse Reactions</CardTitle>
              <CardDescription>List any known allergies or adverse reactions to medications or foods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="text-sm">
                    {allergy}
                    <button
                      onClick={() => setAllergies(allergies.filter((_, i) => i !== index))}
                      className="ml-2 hover:bg-red-700 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div>
                <Label htmlFor="newAllergy">Add Allergy</Label>
                <div className="flex gap-2 mt-1">
                  <Input id="newAllergy" placeholder="Enter allergy or adverse reaction" />
                  <Button size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Lab Results */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Lab Results</CardTitle>
              <CardDescription>Upload or enter your most recent lab test results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hba1c">HbA1c (%)</Label>
                  <Input id="hba1c" placeholder="e.g., 7.2" />
                </div>
                <div>
                  <Label htmlFor="fastingGlucose">Fasting Glucose (mg/dL)</Label>
                  <Input id="fastingGlucose" placeholder="e.g., 126" />
                </div>
                <div>
                  <Label htmlFor="cholesterol">Total Cholesterol (mg/dL)</Label>
                  <Input id="cholesterol" placeholder="e.g., 180" />
                </div>
                <div>
                  <Label htmlFor="bloodPressure">Blood Pressure</Label>
                  <Input id="bloodPressure" placeholder="e.g., 120/80" />
                </div>
              </div>
              <div>
                <Label htmlFor="labDate">Lab Test Date</Label>
                <Input id="labDate" type="date" />
              </div>
              <div>
                <Label htmlFor="labNotes">Additional Notes</Label>
                <Textarea id="labNotes" placeholder="Any additional notes about your lab results..." rows={3} />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Information */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Emergency Information</CardTitle>
              <CardDescription>Critical information for emergency situations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input id="emergencyContact" placeholder="Name and phone number" />
                </div>
                <div>
                  <Label htmlFor="primaryDoctor">Primary Care Doctor</Label>
                  <Input id="primaryDoctor" placeholder="Dr. Name and phone number" />
                </div>
              </div>
              <div>
                <Label htmlFor="medicalAlert">Medical Alert Information</Label>
                <Textarea
                  id="medicalAlert"
                  placeholder="Important medical information for emergency responders..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Changes */}
          <div className="flex justify-end gap-4">
            <Link href="/profile">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button>Save Medical Profile</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
