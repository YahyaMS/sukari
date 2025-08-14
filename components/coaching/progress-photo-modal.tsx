"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Upload, X } from "lucide-react"

interface ProgressPhotoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (fileUrl: string, photoType: string, notes: string) => void
}

export default function ProgressPhotoModal({ isOpen, onClose, onSubmit }: ProgressPhotoModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [photoType, setPhotoType] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file type
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file)
        // Create preview URL
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
      } else {
        alert("Please select an image file (JPG, PNG)")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !photoType) return

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("photoType", photoType)

      const uploadResponse = await fetch("/api/upload-progress-photo", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload photo")
      }

      const { url } = await uploadResponse.json()

      // Pass the Blob URL instead of the raw file
      await onSubmit(url, photoType, notes)

      // Reset form
      setSelectedFile(null)
      setPhotoType("")
      setNotes("")
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
    } catch (error) {
      console.error("Error submitting progress photo:", error)
      alert("Failed to upload progress photo. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setPhotoType("")
    setNotes("")
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Send Progress Photo</span>
          </DialogTitle>
          <DialogDescription>Share a progress photo with your coach to track your health journey</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photoType">Photo Type</Label>
            <Select value={photoType} onValueChange={setPhotoType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select photo type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight">Weight Progress</SelectItem>
                <SelectItem value="meal">Meal Photo</SelectItem>
                <SelectItem value="exercise">Exercise/Activity</SelectItem>
                <SelectItem value="general">General Progress</SelectItem>
                <SelectItem value="medical">Medical/Health Related</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photoFile">Photo</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {selectedFile && previewUrl ? (
                <div className="space-y-2">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="max-w-full max-h-32 mx-auto rounded"
                  />
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{selectedFile.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedFile(null)
                        if (previewUrl) {
                          URL.revokeObjectURL(previewUrl)
                          setPreviewUrl(null)
                        }
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Take a photo or upload from gallery</p>
                  <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
                </div>
              )}
              <Input
                id="photoFile"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
              {!selectedFile && (
                <div className="flex gap-2 mt-2 justify-center">
                  <Button type="button" variant="outline" onClick={() => document.getElementById("photoFile")?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any context about this photo..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedFile || !photoType || isSubmitting}>
              {isSubmitting ? "Sending..." : "Send to Coach"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
