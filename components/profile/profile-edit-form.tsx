"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Edit, Mail, Phone, Calendar, Upload, User } from "lucide-react"
import { Icon3D } from "@/components/ui/3d-icon"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface ProfileEditFormProps {
  user: any
  profile: {
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: string
    gender: string
    height: string
    location: string
    bio: string
    emergencyContact: string
    avatar_url?: string
  }
  onProfileUpdate: (updatedProfile: any) => void
}

export function ProfileEditForm({ user, profile: initialProfile, onProfileUpdate }: ProfileEditFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(initialProfile)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      // Upload to Vercel Blob
      const response = await fetch("/api/upload-avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      })

      if (!response.ok) throw new Error("Failed to get upload URL")

      const { url, downloadUrl } = await response.json()

      // Upload file to Blob
      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      })

      if (!uploadResponse.ok) throw new Error("Failed to upload image")

      // Update profile with new avatar URL
      setProfile((prev) => ({ ...prev, avatar_url: downloadUrl }))
      toast.success("Profile image uploaded successfully!")
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      // Update user metadata
      const { error: userError } = await supabase.auth.updateUser({
        data: {
          first_name: profile.firstName,
          last_name: profile.lastName,
          avatar_url: profile.avatar_url,
        },
      })

      if (userError) throw userError

      // Update or insert profile data
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        first_name: profile.firstName,
        last_name: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        date_of_birth: profile.dateOfBirth,
        gender: profile.gender,
        height: profile.height ? Number.parseInt(profile.height) : null,
        location: profile.location,
        bio: profile.bio,
        emergency_contact: profile.emergencyContact,
        avatar_url: profile.avatar_url,
        updated_at: new Date().toISOString(),
      })

      if (profileError) throw profileError

      setIsEditing(false)
      onProfileUpdate(profile)
      toast.success("Profile updated successfully!")
    } catch (error) {
      console.error("Error saving profile:", error)
      toast.error("Failed to save profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Icon3D shape="cube" color="blue" size="sm" />
              Personal Information
            </CardTitle>
            <CardDescription className="text-text-secondary">
              Your basic personal details and contact information
            </CardDescription>
          </div>
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}
            disabled={isSaving}
            className={
              isEditing
                ? "gradient-primary"
                : "glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
            }
          >
            <Edit className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 p-4 glass-card border-white/10 rounded-lg">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            {isEditing && (
              <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors">
                <Upload className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            )}
          </div>
          <div>
            <h3 className="text-white font-medium">Profile Picture</h3>
            <p className="text-text-secondary text-sm">
              {isUploading ? "Uploading..." : "Click the upload button to change your profile picture"}
            </p>
          </div>
        </div>

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
                placeholder="Enter phone number"
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
            <Select
              value={profile.gender}
              disabled={!isEditing}
              onValueChange={(value) => setProfile((prev) => ({ ...prev, gender: value }))}
            >
              <SelectTrigger className="glass-input border-white/20 text-white">
                <SelectValue placeholder="Select gender" />
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
              placeholder="Enter height"
              onChange={(e) => setProfile((prev) => ({ ...prev, height: e.target.value }))}
              className="glass-input border-white/20 text-white placeholder:text-text-secondary"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location" className="text-white">
            Location
          </Label>
          <Input
            id="location"
            value={profile.location}
            disabled={!isEditing}
            placeholder="Enter your location"
            onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
            className="glass-input border-white/20 text-white placeholder:text-text-secondary"
          />
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
            placeholder="Tell us about your health journey"
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
            placeholder="Name and phone number"
            onChange={(e) => setProfile((prev) => ({ ...prev, emergencyContact: e.target.value }))}
            className="glass-input border-white/20 text-white placeholder:text-text-secondary"
          />
        </div>
      </CardContent>
    </Card>
  )
}
