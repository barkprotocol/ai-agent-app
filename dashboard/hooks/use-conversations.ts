import useSWR from "swr"

interface Conversation {
  id: string
  title: string
  updatedAt: string
  messages: { content: string }[]
}

interface ConversationsResponse {
  data: Conversation[]
  pagination: {
    page: number
    limit: number
    total: number
  }
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useConversations(page = 1, limit = 10) {
  const { data, error, isLoading, mutate } = useSWR<ConversationsResponse>(
    `/api/conversations?page=${page}&limit=${limit}`,
    fetcher,
  )

  return {
    conversations: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    isError: error,
    mutate,
  }
}

