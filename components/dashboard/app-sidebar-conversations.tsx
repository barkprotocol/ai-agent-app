"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { MessageSquare, Plus, Loader2 } from "lucide-react"
import { useUser } from "@/hooks/use-user"

interface Conversation {
  id: string
  title: string
}

export function AppSidebarConversations() {
  const router = useRouter()
  const { user } = useUser()
  const [conversations, setConversations] = useState<Conversation[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/conversations?userId=${user.id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch conversations")
      }
      const data = await response.json()
      setConversations(data)
    } catch (error) {
      console.error("Failed to fetch conversations:", error)
      setError("Failed to load conversations")
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  const handleCreateConversation = useCallback(async () => {
    if (isCreating || !user) return
    setIsCreating(true)
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "New Conversation", userId: user.id }),
      })
      if (!response.ok) throw new Error("Failed to create conversation")
      const newConversation = await response.json()
      router.push(`/chat/${newConversation.id}`)
      await fetchConversations() // Refresh the conversation list
    } catch (error) {
      console.error("Failed to create conversation:", error)
      toast.error("Failed to create a new conversation. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }, [router, isCreating, user, fetchConversations])

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Conversations</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleCreateConversation} disabled={isCreating || !user}>
              {isCreating ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </span>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  New Chat
                </>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
          {isLoading ? (
            <SidebarMenuItem>
              <Button variant="ghost" className="w-full justify-start" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Loading conversations...</span>
              </Button>
            </SidebarMenuItem>
          ) : error ? (
            <SidebarMenuItem>
              <Button variant="ghost" className="w-full justify-start" onClick={fetchConversations}>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span className="text-destructive">{error}</span>
              </Button>
            </SidebarMenuItem>
          ) : conversations && conversations.length > 0 ? (
            conversations.map((conversation) => (
              <SidebarMenuItem key={conversation.id}>
                <SidebarMenuButton asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => router.push(`/chat/${conversation.id}`)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {conversation.title}
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          ) : (
            <SidebarMenuItem>
              <Button variant="ghost" className="w-full justify-start" disabled>
                <span className="text-muted-foreground">No conversations yet</span>
              </Button>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

