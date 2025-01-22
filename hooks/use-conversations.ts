import { useState, useEffect } from "react"

interface Conversation {
  id: string
  title: string
  lastMessage: string
  timestamp: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
}

export function useConversations(initialPage = 1, initialLimit = 10) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: initialPage,
    limit: initialLimit,
    total: 0,
  })

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/conversations?page=${pagination.page}&limit=${pagination.limit}`)
        if (!response.ok) {
          throw new Error("Failed to fetch conversations")
        }
        const data = await response.json()
        setConversations(data.data)
        setPagination(data.pagination)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [pagination.page, pagination.limit])

  const loadMore = () => {
    if (pagination.page * pagination.limit < pagination.total) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
    }
  }

  return { conversations, loading, error, pagination, loadMore }
}

