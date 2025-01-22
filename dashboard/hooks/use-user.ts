import { useState, useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"
import type { BarkUser } from "@/app/types/db"

export function useUser() {
  const { user: privyUser, authenticated, ready } = usePrivy()
  const [user, setUser] = useState<BarkUser | null>(null)

  useEffect(() => {
    if (ready && authenticated && privyUser) {
      // This is a simplified example. In a real application, you'd fetch the full BarkUser data from your backend.
      setUser({
        id: privyUser.id,
        privyId: privyUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        earlyAccess: false, // This would be determined by your backend
        wallets: [], // This would be populated with actual wallet data
        privyUser: privyUser,
        hasEAP: false, // This would be determined by your backend
        // telegramId is optional, so we don't need to include it if it's not available
      })
    } else {
      setUser(null)
    }
  }, [privyUser, authenticated, ready])

  return { user, isLoading: !ready }
}

