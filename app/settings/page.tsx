"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Icon3D } from "@/components/ui/3d-icon"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    glucose: true,
    meals: true,
    exercise: false,
    coaching: true,
    reminders: true,
    emergency: true,
  })

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
                <Icon3D shape="cube" color="purple" size="sm" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Settings</h1>
                  <p className="text-sm text-text-secondary">Manage your preferences and account</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Icon3D shape="heart" color="blue" size="sm" />
              <span className="font-semibold text-white">MetaReverse</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <div className="grid gap-6">
          <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Icon3D shape="sphere" color="blue" size="sm" />
                Account Settings
              </CardTitle>
              <CardDescription className="text-text-secondary">
                Manage your personal information and account preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Profile Information</p>
                  <p className="text-sm text-text-secondary">Update your personal details</p>
                </div>
                <Link href="/profile">
                  <Button
                    variant="outline"
                    size="sm"
                    className="glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Edit Profile
                  </Button>
                </Link>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Medical Information</p>
                  <p className="text-sm text-text-secondary">Update health conditions and medications</p>
                </div>
                <Link href="/profile/medical">
                  <Button
                    variant="outline"
                    size="sm"
                    className="glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Update Medical
                  </Button>
                </Link>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Password & Security</p>
                  <p className="text-sm text-text-secondary">Change password and security settings</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Icon3D shape="capsule" color="orange" size="sm" />
                Notifications
              </CardTitle>
              <CardDescription className="text-text-secondary">
                Control when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Glucose Reminders</p>
                  <p className="text-sm text-text-secondary">Reminders to check blood glucose</p>
                </div>
                <Switch
                  checked={notifications.glucose}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, glucose: checked }))}
                />
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Meal Logging</p>
                  <p className="text-sm text-text-secondary">Reminders to log meals and snacks</p>
                </div>
                <Switch
                  checked={notifications.meals}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, meals: checked }))}
                />
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Exercise Reminders</p>
                  <p className="text-sm text-text-secondary">Daily activity and exercise prompts</p>
                </div>
                <Switch
                  checked={notifications.exercise}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, exercise: checked }))}
                />
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Coach Messages</p>
                  <p className="text-sm text-text-secondary">New messages from your health coach</p>
                </div>
                <Switch
                  checked={notifications.coaching}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, coaching: checked }))}
                />
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Emergency Alerts</p>
                  <p className="text-sm text-text-secondary">Critical health alerts and warnings</p>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs mt-1">Required</Badge>
                </div>
                <Switch
                  checked={notifications.emergency}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, emergency: checked }))}
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Icon3D shape="torus" color="green" size="sm" />
                Privacy & Security
              </CardTitle>
              <CardDescription className="text-text-secondary">
                Control your data privacy and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Data Sharing with Healthcare Providers</p>
                  <p className="text-sm text-text-secondary">Allow sharing health data with your doctor</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Anonymous Analytics</p>
                  <p className="text-sm text-text-secondary">Help improve the app with anonymous usage data</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-text-secondary">Add extra security to your account</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Enable 2FA
                </Button>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Export Health Data</p>
                  <p className="text-sm text-text-secondary">Download your health data in standard format</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Icon3D shape="cube" color="purple" size="sm" />
                App Preferences
              </CardTitle>
              <CardDescription className="text-text-secondary">Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Theme</p>
                  <p className="text-sm text-text-secondary">Choose your preferred app theme</p>
                </div>
                <Badge className="bg-accent-purple/20 text-accent-purple border-accent-purple/30">Dark Mode</Badge>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Units</p>
                  <p className="text-sm text-text-secondary">Glucose and weight measurement units</p>
                </div>
                <Select defaultValue="mg-dl">
                  <SelectTrigger className="w-32 glass-input border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/20">
                    <SelectItem value="mg-dl">mg/dL</SelectItem>
                    <SelectItem value="mmol-l">mmol/L</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Language</p>
                  <p className="text-sm text-text-secondary">App display language</p>
                </div>
                <Select defaultValue="en">
                  <SelectTrigger className="w-32 glass-input border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/20">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 hover:border-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Icon3D shape="sphere" color="blue" size="sm" />
                Support & Help
              </CardTitle>
              <CardDescription className="text-text-secondary">
                Get help and support for using MetaReverse
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Help Center</p>
                  <p className="text-sm text-text-secondary">Browse frequently asked questions</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  View FAQ
                </Button>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Contact Support</p>
                  <p className="text-sm text-text-secondary">Get help from our support team</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Contact Us
                </Button>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">App Version</p>
                  <p className="text-sm text-text-secondary">MetaReverse v1.0.0</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Check Updates
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-red-500/30 hover:border-red-500/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Icon3D shape="capsule" color="orange" size="sm" />
                Account Actions
              </CardTitle>
              <CardDescription className="text-text-secondary">Manage your account status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Sign Out</p>
                  <p className="text-sm text-text-secondary">Sign out of your account on this device</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="glass-button border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Sign Out
                </Button>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-400">Delete Account</p>
                  <p className="text-sm text-text-secondary">Permanently delete your account and all data</p>
                </div>
                <Button className="bg-red-600 hover:bg-red-700 text-white" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
