"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Send, Edit2, Trash2, Reply } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Comment {
  id: string
  content: string
  created_at: string
  updated_at: string
  user_id: string
  parent_id: string | null
  profiles: {
    first_name: string
    last_name: string
    avatar_url: string | null
  }
}

interface CommentsSectionProps {
  postId: string
  initialCommentCount?: number
  currentUserId?: string
}

export function CommentsSection({ postId, initialCommentCount = 0, currentUserId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const { toast } = useToast()

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/social/posts/${postId}/comments`)
      if (response.ok) {
        const { comments } = await response.json()
        setComments(comments)
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  useEffect(() => {
    if (showComments) {
      fetchComments()
    }
  }, [showComments, postId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/social/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (response.ok) {
        const { comment } = await response.json()
        setComments((prev) => [...prev, comment])
        setNewComment("")
        toast({
          title: "Comment added!",
          description: "Your comment has been posted.",
        })
      } else {
        throw new Error("Failed to post comment")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return

    try {
      const response = await fetch(`/api/social/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editContent }),
      })

      if (response.ok) {
        const { comment } = await response.json()
        setComments((prev) => prev.map((c) => (c.id === commentId ? comment : c)))
        setEditingComment(null)
        setEditContent("")
        toast({
          title: "Comment updated!",
          description: "Your comment has been updated.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comment.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/social/comments/${commentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId))
        toast({
          title: "Comment deleted",
          description: "Your comment has been removed.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment.",
        variant: "destructive",
      })
    }
  }

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim()) return

    try {
      const response = await fetch(`/api/social/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: replyContent, parentId }),
      })

      if (response.ok) {
        const { comment } = await response.json()
        setComments((prev) => [...prev, comment])
        setReplyingTo(null)
        setReplyContent("")
        toast({
          title: "Reply posted!",
          description: "Your reply has been added.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply.",
        variant: "destructive",
      })
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const topLevelComments = comments.filter((comment) => !comment.parent_id)
  const getReplies = (parentId: string) => comments.filter((comment) => comment.parent_id === parentId)

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" className="gap-2" onClick={() => setShowComments(!showComments)}>
        <MessageCircle className="h-4 w-4" />
        {comments.length || initialCommentCount} {comments.length === 1 ? "comment" : "comments"}
      </Button>

      {showComments && (
        <div className="space-y-4">
          {/* New Comment Form */}
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={loading || !newComment.trim()} size="sm">
                <Send className="h-4 w-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {topLevelComments.map((comment) => (
              <div key={comment.id} className="space-y-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.profiles.avatar_url || undefined} />
                        <AvatarFallback>
                          {comment.profiles.first_name[0]}
                          {comment.profiles.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {comment.profiles.first_name} {comment.profiles.last_name}
                          </span>
                          <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.created_at)}</span>
                        </div>

                        {editingComment === comment.id ? (
                          <div className="space-y-2">
                            <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={2} />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleEditComment(comment.id)}>
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingComment(null)
                                  setEditContent("")
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => setReplyingTo(comment.id)}>
                                <Reply className="h-3 w-3 mr-1" />
                                Reply
                              </Button>
                              {currentUserId === comment.user_id && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setEditingComment(comment.id)
                                      setEditContent(comment.content)
                                    }}
                                  >
                                    <Edit2 className="h-3 w-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id)}>
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Delete
                                  </Button>
                                </>
                              )}
                            </div>
                          </>
                        )}

                        {/* Reply Form */}
                        {replyingTo === comment.id && (
                          <div className="space-y-2 mt-3">
                            <Textarea
                              placeholder="Write a reply..."
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleReply(comment.id)}>
                                Reply
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setReplyingTo(null)
                                  setReplyContent("")
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Replies */}
                {getReplies(comment.id).map((reply) => (
                  <div key={reply.id} className="ml-8">
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={reply.profiles.avatar_url || undefined} />
                            <AvatarFallback className="text-xs">
                              {reply.profiles.first_name[0]}
                              {reply.profiles.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs">
                                {reply.profiles.first_name} {reply.profiles.last_name}
                              </span>
                              <span className="text-xs text-muted-foreground">{formatTimeAgo(reply.created_at)}</span>
                            </div>
                            <p className="text-xs text-gray-700">{reply.content}</p>
                            {currentUserId === reply.user_id && (
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(reply.id)}>
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
