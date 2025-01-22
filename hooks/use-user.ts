import { useState, useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"

interface User {
  id: string
  username: string | null
  profileImage: string | null
  earlyAccess: boolean
}

export function useUser() {
  const { user: privyUser, authenticated } = usePrivy()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (authenticated && privyUser) {
      // In a real application, you might want to fetch additional user data from your backend
      setUser({
        id: privyUser.id,
        username: privyUser.google?.name || privyUser.twitter?.username || null,
        profileImage: privyUser.google?.picture || privyUser.twitter?.profileImageUrl || null,
        earlyAccess: false, // This should be set based on your actual logic
      })
    } else {
      setUser(null)
    }
    setIsLoading(false)
  }, [authenticated, privyUser])

  return { user, isLoading }
}

