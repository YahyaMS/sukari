"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Upload, X } from "lucide-react"

interface LabResultsModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (file: File, notes: string) => void
}

export default function LabResultsModal({ isOpen, onClose, onSubmit }: LabResultsModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file)
      } else {
        alert("Please select a PDF or image file")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    setIsSubmitting(true)
    try {
      await onSubmit(selectedFile, notes)
      // Reset form
      setSelectedFile(null)
      setNotes("")
    } catch (error) {
      console.error("Error submitting lab results:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setNotes("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Share Lab Results</span>
          </DialogTitle>
          <DialogDescription>
            Upload your latest lab results to share with your coach. Accepted formats: PDF, JPG, PNG
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="labFile">Lab Results File</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {selectedFile ? (
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{selectedFile.name}</span>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                </div>
              )}
              <Input
                id="labFile"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              {!selectedFile && (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 bg-transparent"
                  onClick={() => document.getElementById("labFile")?.click()}
                >
                  Choose File
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes for Coach (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any specific questions or concerns about these results?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedFile || isSubmitting}>
              {isSubmitting ? "Sharing..." : "Share with Coach"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
