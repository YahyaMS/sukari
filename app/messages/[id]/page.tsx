"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  Heart,
  ThumbsUp,
  Reply,
  Users,
  Bot,
  ImageIcon,
  File,
  Mic,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

export default function ChatPage({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock conversation data based on ID
  const conversation = {
    id: params.id,
    name:
      params.id === "1" ? "Dr. Emily Chen" : params.id === "2" ? "Weight Loss Warriors" : "MetaReverse AI Assistant",
    type: params.id === "1" ? "coach" : params.id === "2" ? "group" : "ai",
    avatar: params.id === "1" ? "/professional-female-doctor.png" : null,
    online: true,
    participants: params.id === "2" ? 456 : undefined,
  }

  const messages = [
    {
      id: 1,
      sender: "Dr. Emily Chen",
      avatar: "/professional-female-doctor.png",
      content:
        "Hi Sarah! I've reviewed your glucose readings from this week. Overall, you're showing great improvement!",
      timestamp: "10:30 AM",
      type: "text",
      isOwn: false,
      reactions: [{ emoji: "👍", count: 1 }],
    },
    {
      id: 2,
      sender: "You",
      avatar: "/professional-woman-smiling.png",
      content: "Thank you! I've been really focused on following the meal plan you suggested.",
      timestamp: "10:32 AM",
      type: "text",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Dr. Emily Chen",
      avatar: "/professional-female-doctor.png",
      content:
        "That's wonderful to hear! I noticed your post-meal readings have been much more stable. Let's discuss some adjustments to optimize your progress even further.",
      timestamp: "10:35 AM",
      type: "text",
      isOwn: false,
    },
    {
      id: 4,
      sender: "You",
      avatar: "/professional-woman-smiling.png",
      content: "I'd love that! I've been tracking everything in the app. Should I share my meal photos with you?",
      timestamp: "10:37 AM",
      type: "text",
      isOwn: true,
    },
    {
      id: 5,
      sender: "Dr. Emily Chen",
      avatar: "/professional-female-doctor.png",
      content: "Visual tracking helps me understand your portion sizes and food combinations better.",
      timestamp: "10:38 AM",
      type: "text",
      isOwn: false,
    },
    {
      id: 6,
      sender: "You",
      avatar: "/professional-woman-smiling.png",
      content: "Here's my lunch from yesterday - grilled salmon with quinoa and roasted vegetables",
      timestamp: "10:40 AM",
      type: "image",
      imageUrl: "/healthy-salmon-quinoa.png",
      isOwn: true,
      reactions: [
        { emoji: "❤️", count: 1 },
        { emoji: "👍", count: 1 },
      ],
    },
    {
      id: 7,
      sender: "Dr. Emily Chen",
      avatar: "/professional-female-doctor.png",
      content:
        "Perfect! This is exactly the kind of balanced meal that supports stable blood sugar. The protein-to-carb ratio is ideal, and the fiber from the vegetables will help slow glucose absorption.",
      timestamp: "10:42 AM",
      type: "text",
      isOwn: false,
    },
    {
      id: 8,
      sender: "Dr. Emily Chen",
      avatar: "/professional-female-doctor.png",
      content:
        "I'm attaching an updated meal plan with some new recipe ideas that follow the same principles. Let me know what you think!",
      timestamp: "10:43 AM",
      type: "file",
      fileName: "Updated_Meal_Plan_Sarah.pdf",
      fileSize: "2.3 MB",
      isOwn: false,
    },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getConversationHeader = () => {
    if (conversation.type === "group") {
      return (
        <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
          <Users className="h-6 w-6 text-white" />
        </div>
      )
    }
    if (conversation.type === "ai") {
      return (
        <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Bot className="h-6 w-6 text-white" />
        </div>
      )
    }
    return (
      <Avatar className="h-12 w-12">
        <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
        <AvatarFallback>
          {conversation.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/messages">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="relative">
                {getConversationHeader()}
                {conversation.online && (
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">{conversation.name}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {conversation.online && <span className="text-green-600">Online</span>}
                  {conversation.participants && (
                    <Badge variant="outline" className="text-xs">
                      {conversation.participants} members
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {conversation.type === "coach" && (
                <>
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.isOwn ? "flex-row-reverse" : ""}`}>
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={msg.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xs">
                  {msg.sender
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className={`flex-1 max-w-md ${msg.isOwn ? "items-end" : "items-start"} flex flex-col`}>
                <div className="flex items-center gap-2 mb-1">
                  {!msg.isOwn && <span className="text-sm font-medium text-gray-900">{msg.sender}</span>}
                  <span className="text-xs text-gray-500">{msg.timestamp}</span>
                </div>

                <div
                  className={`rounded-lg px-4 py-2 ${
                    msg.isOwn ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-900"
                  }`}
                >
                  {msg.type === "text" && <p className="text-sm">{msg.content}</p>}

                  {msg.type === "image" && (
                    <div>
                      <p className="text-sm mb-2">{msg.content}</p>
                      <img
                        src={msg.imageUrl || "/placeholder.svg"}
                        alt="Shared image"
                        className="rounded-lg max-w-full h-auto"
                      />
                    </div>
                  )}

                  {msg.type === "file" && (
                    <div>
                      <p className="text-sm mb-2">{msg.content}</p>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <File className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{msg.fileName}</p>
                          <p className="text-xs text-gray-500">{msg.fileSize}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Download
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reactions */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {msg.reactions.map((reaction, index) => (
                      <button
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs hover:bg-gray-200 transition-colors"
                      >
                        <span>{reaction.emoji}</span>
                        <span>{reaction.count}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Message Actions */}
                <div className="flex gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Heart className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <ThumbsUp className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Reply className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xs">
                  {conversation.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Mic className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1">
              <Textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={1}
                className="resize-none min-h-[40px] max-h-32"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Smile className="h-4 w-4" />
              </Button>
              <Button onClick={handleSendMessage} disabled={!message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
