"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, MessageCircle, Search, Plus, Users, Bot, Heart, Pin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const conversations = [
    {
      id: 1,
      type: "coach",
      name: "Dr. Emily Chen",
      avatar: "/professional-female-doctor.png",
      lastMessage: "Great progress on your glucose readings this week! Let's discuss your meal plan adjustments.",
      timestamp: "2 min ago",
      unread: 2,
      online: true,
      pinned: true,
    },
    {
      id: 2,
      type: "group",
      name: "Weight Loss Warriors",
      avatar: null,
      participants: 456,
      lastMessage: "Sarah: Just hit my 20lb milestone! Thank you all for the support 🎉",
      timestamp: "5 min ago",
      unread: 5,
      online: false,
      pinned: false,
    },
    {
      id: 3,
      type: "ai",
      name: "MetaReverse AI Assistant",
      avatar: null,
      lastMessage: "Based on your recent data, I have some personalized meal suggestions for you.",
      timestamp: "15 min ago",
      unread: 1,
      online: true,
      pinned: false,
    },
    {
      id: 4,
      type: "peer",
      name: "Maria Rodriguez",
      avatar: "/smiling-hispanic-woman.png",
      lastMessage: "Thanks for the recipe recommendation! My family loved the diabetic-friendly pasta.",
      timestamp: "1 hour ago",
      unread: 0,
      online: false,
      pinned: false,
    },
    {
      id: 5,
      type: "group",
      name: "Newly Diagnosed T2D Support",
      avatar: null,
      participants: 234,
      lastMessage: "Dr. Kim: Remember, small consistent changes lead to big results over time.",
      timestamp: "2 hours ago",
      unread: 3,
      online: false,
      pinned: true,
    },
    {
      id: 6,
      type: "peer",
      name: "David Chen",
      avatar: "/middle-aged-man-contemplative.png",
      lastMessage: "How do you handle glucose spikes during stressful work days?",
      timestamp: "3 hours ago",
      unread: 0,
      online: true,
      pinned: false,
    },
    {
      id: 7,
      type: "coach",
      name: "Nutritionist Lisa Park",
      avatar: "/professional-woman-smiling.png",
      lastMessage: "I've updated your meal plan based on your preferences. Check it out!",
      timestamp: "1 day ago",
      unread: 0,
      online: false,
      pinned: false,
    },
  ]

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "coaches" && conv.type === "coach") ||
      (activeTab === "groups" && conv.type === "group") ||
      (activeTab === "peers" && conv.type === "peer") ||
      (activeTab === "ai" && conv.type === "ai")

    return matchesSearch && matchesTab
  })

  const pinnedConversations = filteredConversations.filter((conv) => conv.pinned)
  const regularConversations = filteredConversations.filter((conv) => !conv.pinned)

  const getConversationIcon = (type: string) => {
    switch (type) {
      case "coach":
        return <Heart className="h-4 w-4 text-blue-600" />
      case "group":
        return <Users className="h-4 w-4 text-green-600" />
      case "ai":
        return <Bot className="h-4 w-4 text-purple-600" />
      case "peer":
        return <MessageCircle className="h-4 w-4 text-orange-600" />
      default:
        return <MessageCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getConversationAvatar = (conv: any) => {
    if (conv.type === "group") {
      return (
        <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
          <Users className="h-6 w-6 text-white" />
        </div>
      )
    }
    if (conv.type === "ai") {
      return (
        <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Bot className="h-6 w-6 text-white" />
        </div>
      )
    }
    return (
      <Avatar className="h-12 w-12">
        <AvatarImage src={conv.avatar || "/placeholder.svg"} />
        <AvatarFallback>
          {conv.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
    )
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                <p className="text-sm text-gray-600">Stay connected with your health community</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-blue-600" />
                <span className="font-semibold text-gray-900">MetaReverse</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="coaches">Coaches</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="peers">Peers</TabsTrigger>
            <TabsTrigger value="ai">AI Assistant</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Conversations */}
        <div className="space-y-4">
          {/* Pinned Conversations */}
          {pinnedConversations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Pin className="h-4 w-4 text-gray-600" />
                <h3 className="font-medium text-gray-900">Pinned</h3>
              </div>
              <div className="space-y-2">
                {pinnedConversations.map((conversation) => (
                  <Link key={conversation.id} href={`/messages/${conversation.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            {getConversationAvatar(conversation)}
                            {conversation.online && (
                              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {getConversationIcon(conversation.type)}
                              <h3 className="font-semibold text-gray-900 truncate">{conversation.name}</h3>
                              {conversation.type === "group" && (
                                <Badge variant="outline" className="text-xs">
                                  {conversation.participants} members
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                            {conversation.unread > 0 && (
                              <Badge
                                variant="default"
                                className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                              >
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Regular Conversations */}
          {regularConversations.length > 0 && (
            <div>
              {pinnedConversations.length > 0 && <h3 className="font-medium text-gray-900 mb-3">Recent</h3>}
              <div className="space-y-2">
                {regularConversations.map((conversation) => (
                  <Link key={conversation.id} href={`/messages/${conversation.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            {getConversationAvatar(conversation)}
                            {conversation.online && (
                              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {getConversationIcon(conversation.type)}
                              <h3 className="font-semibold text-gray-900 truncate">{conversation.name}</h3>
                              {conversation.type === "group" && (
                                <Badge variant="outline" className="text-xs">
                                  {conversation.participants} members
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                            {conversation.unread > 0 && (
                              <Badge
                                variant="default"
                                className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                              >
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {filteredConversations.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
              <p className="text-gray-600 mb-4">Start a new conversation or adjust your search.</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Start New Chat
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
