"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Bell, Shield, User, Smartphone, Heart, HelpCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SettingsPage() {
  const { theme } = useTheme()
  const [notifications, setNotifications] = useState({
    glucose: true,
    meals: true,
    exercise: false,
    coaching: true,
    reminders: true,
    emergency: true,
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your preferences and account</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-foreground">MetaReverse</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Settings
              </CardTitle>
              <CardDescription>Manage your personal information and account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Profile Information</p>
                  <p className="text-sm text-muted-foreground">Update your personal details</p>
                </div>
                <Link href="/profile">
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                </Link>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Medical Information</p>
                  <p className="text-sm text-muted-foreground">Update health conditions and medications</p>
                </div>
                <Link href="/profile/medical">
                  <Button variant="outline" size="sm">
                    Update Medical
                  </Button>
                </Link>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Password & Security</p>
                  <p className="text-sm text-muted-foreground">Change password and security settings</p>
                </div>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Control when and how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Glucose Reminders</p>
                  <p className="text-sm text-muted-foreground">Reminders to check blood glucose</p>
                </div>
                <Switch
                  checked={notifications.glucose}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, glucose: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Meal Logging</p>
                  <p className="text-sm text-muted-foreground">Reminders to log meals and snacks</p>
                </div>
                <Switch
                  checked={notifications.meals}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, meals: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Exercise Reminders</p>
                  <p className="text-sm text-muted-foreground">Daily activity and exercise prompts</p>
                </div>
                <Switch
                  checked={notifications.exercise}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, exercise: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Coach Messages</p>
                  <p className="text-sm text-muted-foreground">New messages from your health coach</p>
                </div>
                <Switch
                  checked={notifications.coaching}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, coaching: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Emergency Alerts</p>
                  <p className="text-sm text-muted-foreground">Critical health alerts and warnings</p>
                  <Badge variant="destructive" className="text-xs mt-1">
                    Required
                  </Badge>
                </div>
                <Switch
                  checked={notifications.emergency}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, emergency: checked }))}
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Control your data privacy and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Data Sharing with Healthcare Providers</p>
                  <p className="text-sm text-muted-foreground">Allow sharing health data with your doctor</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Anonymous Analytics</p>
                  <p className="text-sm text-muted-foreground">Help improve the app with anonymous usage data</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                </div>
                <Button variant="outline" size="sm">
                  Enable 2FA
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Export Health Data</p>
                  <p className="text-sm text-muted-foreground">Download your health data in standard format</p>
                </div>
                <Button variant="outline" size="sm">
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                App Preferences
              </CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-muted-foreground">Choose your preferred app theme</p>
                </div>
                <ThemeToggle showLabel />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Units</p>
                  <p className="text-sm text-muted-foreground">Glucose and weight measurement units</p>
                </div>
                <Select defaultValue="mg-dl">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mg-dl">mg/dL</SelectItem>
                    <SelectItem value="mmol-l">mmol/L</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Language</p>
                  <p className="text-sm text-muted-foreground">App display language</p>
                </div>
                <Select defaultValue="en">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Support & Help */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Support & Help
              </CardTitle>
              <CardDescription>Get help and support for using MetaReverse</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Help Center</p>
                  <p className="text-sm text-muted-foreground">Browse frequently asked questions</p>
                </div>
                <Button variant="outline" size="sm">
                  View FAQ
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Contact Support</p>
                  <p className="text-sm text-muted-foreground">Get help from our support team</p>
                </div>
                <Button variant="outline" size="sm">
                  Contact Us
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">App Version</p>
                  <p className="text-sm text-muted-foreground">MetaReverse v1.0.0</p>
                </div>
                <Button variant="outline" size="sm">
                  Check Updates
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <LogOut className="h-5 w-5" />
                Account Actions
              </CardTitle>
              <CardDescription>Manage your account status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sign Out</p>
                  <p className="text-sm text-muted-foreground">Sign out of your account on this device</p>
                </div>
                <Button variant="outline" size="sm">
                  Sign Out
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-600 dark:text-red-400">Delete Account</p>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive" size="sm">
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
