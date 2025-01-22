"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { loginWithPrivy, loginWithSolana } from "@/lib/auth"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handlePrivyLogin = async () => {
    setIsLoading(true)
    try {
      await loginWithPrivy()
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to login with Privy:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSolanaLogin = async () => {
    setIsLoading(true)
    try {
      await loginWithSolana()
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to login with Solana:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Choose your preferred login method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" onClick={handlePrivyLogin} disabled={isLoading}>
            Sign in with Privy
          </Button>
          <Button className="w-full" onClick={handleSolanaLogin} disabled={isLoading}>
            Sign in with Solana
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

