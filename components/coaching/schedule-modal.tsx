"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Video, Phone } from "lucide-react"
import { toast } from "sonner"

interface ScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  type: "video" | "phone"
}

export function ScheduleModal({ isOpen, onClose, type }: ScheduleModalProps) {
  const [formData, setFormData] = useState({
    preferredDate: "",
    preferredTime: "",
    notes: "",
    urgency: "normal",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/coaching/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          ...formData,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message)
        onClose()
        setFormData({
          preferredDate: "",
          preferredTime: "",
          notes: "",
          urgency: "normal",
        })
      } else {
        toast.error(data.error || "Failed to schedule appointment")
      }
    } catch (error) {
      console.error("Error scheduling appointment:", error)
      toast.error("Failed to schedule appointment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {type === "video" ? <Video className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
            <span>Schedule {type === "video" ? "Video Call" : "Phone Call"}</span>
          </DialogTitle>
          <DialogDescription>
            Request a {type === "video" ? "video consultation" : "phone consultation"} with your coach. They'll confirm
            the appointment within 24 hours.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredDate">Preferred Date</Label>
              <Input
                id="preferredDate"
                type="date"
                min={today}
                value={formData.preferredDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, preferredDate: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredTime">Preferred Time</Label>
              <Select
                value={formData.preferredTime}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, preferredTime: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                  <SelectItem value="17:00">5:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency</Label>
            <Select
              value={formData.urgency}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, urgency: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="urgent">Urgent (within 24 hours)</SelectItem>
                <SelectItem value="emergency">Emergency (ASAP)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="What would you like to discuss?"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
