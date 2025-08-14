"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Camera, Edit, MapPin, Phone, Mail, Calendar, Activity, Target, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1978-05-15",
    gender: "female",
    height: "165",
    location: "San Francisco, CA",
    bio: "Managing Type 2 diabetes with lifestyle changes. Love hiking and cooking healthy meals.",
    emergencyContact: "John Johnson - +1 (555) 987-6543",
  })

  const healthStats = {
    currentWeight: 68.5,
    targetWeight: 65,
    avgGlucose: 142,
    targetGlucose: 120,
    hba1c: 7.2,
    targetHba1c: 6.5,
  }

  const achievements = [
    { title: "30-Day Streak", description: "Logged glucose for 30 consecutive days", icon: "🔥", earned: true },
    { title: "Weight Goal", description: "Lost 5kg towards target weight", icon: "⚖️", earned: true },
    { title: "Exercise Champion", description: "Completed 20 workout sessions", icon: "💪", earned: false },
    { title: "Glucose Master", description: "Maintained target range for 7 days", icon: "🎯", earned: true },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <p className="text-sm text-gray-600">Manage your personal information</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant={isEditing ? "default" : "outline"} size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/professional-woman-smiling.png" />
                    <AvatarFallback className="text-lg">SJ</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0">
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-gray-600 flex items-center justify-center md:justify-start gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </p>
                  <p className="text-gray-700 mt-2">{profile.bio}</p>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                    <Badge variant="secondary">Type 2 Diabetes</Badge>
                    <Badge variant="secondary">Weight Management</Badge>
                    <Badge variant="outline">Coach: Dr. Emily Chen</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    disabled={!isEditing}
                    onChange={(e) => setProfile((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    disabled={!isEditing}
                    onChange={(e) => setProfile((prev) => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      value={profile.email}
                      disabled={!isEditing}
                      className="pl-10"
                      onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={profile.phone}
                      disabled={!isEditing}
                      className="pl-10"
                      onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profile.dateOfBirth}
                      disabled={!isEditing}
                      className="pl-10"
                      onChange={(e) => setProfile((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={profile.gender} disabled={!isEditing}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    value={profile.height}
                    disabled={!isEditing}
                    onChange={(e) => setProfile((prev) => ({ ...prev, height: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  disabled={!isEditing}
                  rows={3}
                  onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={profile.emergencyContact}
                  disabled={!isEditing}
                  onChange={(e) => setProfile((prev) => ({ ...prev, emergencyContact: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Health Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Health Overview
              </CardTitle>
              <CardDescription>Current health metrics and progress toward goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{healthStats.currentWeight}kg</div>
                  <div className="text-sm text-gray-600">Current Weight</div>
                  <Progress value={75} className="mt-2" />
                  <div className="text-xs text-gray-500 mt-1">Target: {healthStats.targetWeight}kg</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{healthStats.avgGlucose}</div>
                  <div className="text-sm text-gray-600">Avg Glucose (mg/dL)</div>
                  <Progress value={60} className="mt-2" />
                  <div className="text-xs text-gray-500 mt-1">Target: {healthStats.targetGlucose}</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{healthStats.hba1c}%</div>
                  <div className="text-sm text-gray-600">HbA1c</div>
                  <Progress value={45} className="mt-2" />
                  <div className="text-xs text-gray-500 mt-1">Target: {healthStats.targetHba1c}%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements
              </CardTitle>
              <CardDescription>Your health journey milestones and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      achievement.earned ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${achievement.earned ? "text-green-800" : "text-gray-600"}`}>
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                      {achievement.earned && (
                        <Badge variant="default" className="bg-green-600">
                          Earned
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/profile/medical">
                  <Button variant="outline" className="w-full bg-transparent">
                    Update Medical Info
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="outline" className="w-full bg-transparent">
                    Privacy Settings
                  </Button>
                </Link>
                <Link href="/coaching">
                  <Button variant="outline" className="w-full bg-transparent">
                    Contact Coach
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
