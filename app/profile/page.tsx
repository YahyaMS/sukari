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
import { Icon3D } from "@/components/ui/3d-icon"

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
    {
      title: "30-Day Streak",
      description: "Logged glucose for 30 consecutive days",
      shape: "sphere",
      color: "orange",
      earned: true,
    },
    {
      title: "Weight Goal",
      description: "Lost 5kg towards target weight",
      shape: "cube",
      color: "green",
      earned: true,
    },
    {
      title: "Exercise Champion",
      description: "Completed 20 workout sessions",
      shape: "capsule",
      color: "purple",
      earned: false,
    },
    {
      title: "Glucose Master",
      description: "Maintained target range for 7 days",
      shape: "torus",
      color: "blue",
      earned: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1117] via-[#161B22] to-[#21262D] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-xl animate-bounce"></div>
      </div>

      <div className="glass-card border-b border-white/10 relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Icon3D shape="sphere" color="purple" size="sm" icon={Activity} />
                <div>
                  <h1 className="text-2xl font-bold text-white">Profile</h1>
                  <p className="text-sm text-text-secondary">Manage your personal information</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isEditing ? "default" : "outline"}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className={
                  isEditing
                    ? "gradient-primary"
                    : "glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                }
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <div className="grid gap-6">
          <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 ring-4 ring-purple-500/30">
                    <AvatarImage src="/professional-woman-smiling.png" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-lg">
                      SJ
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 gradient-primary">
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-white">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-text-secondary flex items-center justify-center md:justify-start gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </p>
                  <p className="text-text-primary mt-2">{profile.bio}</p>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                    <Badge className="bg-accent-purple/20 text-accent-purple border-accent-purple/30">
                      Type 2 Diabetes
                    </Badge>
                    <Badge className="bg-accent-green/20 text-accent-green border-accent-green/30">
                      Weight Management
                    </Badge>
                    <Badge className="bg-accent-blue/20 text-accent-blue border-accent-blue/30">
                      Coach: Dr. Emily Chen
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Icon3D shape="cube" color="blue" size="sm" icon={Edit} />
                Personal Information
              </CardTitle>
              <CardDescription className="text-text-secondary">
                Your basic personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-white">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    disabled={!isEditing}
                    onChange={(e) => setProfile((prev) => ({ ...prev, firstName: e.target.value }))}
                    className="glass-input border-white/20 text-white placeholder:text-text-secondary"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-white">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    disabled={!isEditing}
                    onChange={(e) => setProfile((prev) => ({ ...prev, lastName: e.target.value }))}
                    className="glass-input border-white/20 text-white placeholder:text-text-secondary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
                    <Input
                      id="email"
                      value={profile.email}
                      disabled={!isEditing}
                      className="pl-10 glass-input border-white/20 text-white placeholder:text-text-secondary"
                      onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone" className="text-white">
                    Phone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
                    <Input
                      id="phone"
                      value={profile.phone}
                      disabled={!isEditing}
                      className="pl-10 glass-input border-white/20 text-white placeholder:text-text-secondary"
                      onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth" className="text-white">
                    Date of Birth
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profile.dateOfBirth}
                      disabled={!isEditing}
                      className="pl-10 glass-input border-white/20 text-white placeholder:text-text-secondary"
                      onChange={(e) => setProfile((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="gender" className="text-white">
                    Gender
                  </Label>
                  <Select value={profile.gender} disabled={!isEditing}>
                    <SelectTrigger className="glass-input border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/20">
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="height" className="text-white">
                    Height (cm)
                  </Label>
                  <Input
                    id="height"
                    value={profile.height}
                    disabled={!isEditing}
                    onChange={(e) => setProfile((prev) => ({ ...prev, height: e.target.value }))}
                    className="glass-input border-white/20 text-white placeholder:text-text-secondary"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio" className="text-white">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  disabled={!isEditing}
                  rows={3}
                  onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                  className="glass-input border-white/20 text-white placeholder:text-text-secondary"
                />
              </div>

              <div>
                <Label htmlFor="emergencyContact" className="text-white">
                  Emergency Contact
                </Label>
                <Input
                  id="emergencyContact"
                  value={profile.emergencyContact}
                  disabled={!isEditing}
                  onChange={(e) => setProfile((prev) => ({ ...prev, emergencyContact: e.target.value }))}
                  className="glass-input border-white/20 text-white placeholder:text-text-secondary"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Icon3D shape="heart" color="green" size="sm" icon={Activity} />
                Health Overview
              </CardTitle>
              <CardDescription className="text-text-secondary">
                Current health metrics and progress toward goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 glass-card border-accent-blue/30 bg-gradient-to-br from-accent-blue/10 to-accent-blue/5 rounded-lg">
                  <div className="text-2xl font-bold text-accent-blue">{healthStats.currentWeight}kg</div>
                  <div className="text-sm text-text-secondary">Current Weight</div>
                  <Progress value={75} className="mt-2" />
                  <div className="text-xs text-text-secondary mt-1">Target: {healthStats.targetWeight}kg</div>
                </div>
                <div className="text-center p-4 glass-card border-accent-green/30 bg-gradient-to-br from-accent-green/10 to-accent-green/5 rounded-lg">
                  <div className="text-2xl font-bold text-accent-green">{healthStats.avgGlucose}</div>
                  <div className="text-sm text-text-secondary">Avg Glucose (mg/dL)</div>
                  <Progress value={60} className="mt-2" />
                  <div className="text-xs text-text-secondary mt-1">Target: {healthStats.targetGlucose}</div>
                </div>
                <div className="text-center p-4 glass-card border-accent-orange/30 bg-gradient-to-br from-accent-orange/10 to-accent-orange/5 rounded-lg">
                  <div className="text-2xl font-bold text-accent-orange">{healthStats.hba1c}%</div>
                  <div className="text-sm text-text-secondary">HbA1c</div>
                  <Progress value={45} className="mt-2" />
                  <div className="text-xs text-text-secondary mt-1">Target: {healthStats.targetHba1c}%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Icon3D shape="torus" color="purple" size="sm" icon={Award} />
                Achievements
              </CardTitle>
              <CardDescription className="text-text-secondary">
                Your health journey milestones and accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg glass-card transition-all duration-300 ${
                      achievement.earned
                        ? "border-accent-green/30 bg-gradient-to-br from-accent-green/10 to-accent-green/5 hover:border-accent-green/50"
                        : "border-white/10 bg-gradient-to-br from-white/5 to-white/2 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon3D
                        shape={achievement.shape as any}
                        color={achievement.color as any}
                        size="sm"
                        icon={Award}
                      />
                      <div className="flex-1">
                        <h4
                          className={`font-semibold ${achievement.earned ? "text-accent-green" : "text-text-secondary"}`}
                        >
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-text-secondary">{achievement.description}</p>
                      </div>
                      {achievement.earned && (
                        <Badge className="bg-accent-green/20 text-accent-green border-accent-green/30">Earned</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Icon3D shape="capsule" color="orange" size="sm" icon={Target} />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/profile/medical">
                  <Button
                    variant="outline"
                    className="w-full glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Update Medical Info
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button
                    variant="outline"
                    className="w-full glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Privacy Settings
                  </Button>
                </Link>
                <Link href="/coaching">
                  <Button
                    variant="outline"
                    className="w-full glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
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
