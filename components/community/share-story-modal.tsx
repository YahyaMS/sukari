"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareStoryModalProps {
  children: React.ReactNode
  onStoryShared?: () => void
}

export function ShareStoryModal({ children, onStoryShared }: ShareStoryModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    achievement: "",
    story: "",
    category: "",
    metrics: {
      metric1: "",
      metric2: "",
      metric3: "",
    },
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/community/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success Story Shared!",
          description: "Your inspiring journey has been shared with the community.",
        })
        setOpen(false)
        setFormData({
          title: "",
          achievement: "",
          story: "",
          category: "",
          metrics: { metric1: "", metric2: "", metric3: "" },
        })
        onStoryShared?.()
      } else {
        throw new Error("Failed to share story")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share your story. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Share Your Success Story
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Story Title</Label>
            <Input
              id="title"
              placeholder="e.g., From Pre-Diabetic to Healthiest I've Ever Been"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievement">Key Achievement</Label>
            <Input
              id="achievement"
              placeholder="e.g., Lost 25lbs in 6 months"
              value={formData.achievement}
              onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight-loss">Weight Loss</SelectItem>
                <SelectItem value="diabetes">Diabetes Management</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="story">Your Story</Label>
            <Textarea
              id="story"
              placeholder="Share your journey, challenges, and how the community helped you succeed..."
              value={formData.story}
              onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              rows={6}
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Key Metrics (Optional)</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="e.g., 25 lbs lost"
                value={formData.metrics.metric1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metrics: { ...formData.metrics, metric1: e.target.value },
                  })
                }
              />
              <Input
                placeholder="e.g., HbA1c 6.8% to 5.4%"
                value={formData.metrics.metric2}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metrics: { ...formData.metrics, metric2: e.target.value },
                  })
                }
              />
              <Input
                placeholder="e.g., 6 months"
                value={formData.metrics.metric3}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metrics: { ...formData.metrics, metric3: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Share Story
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
