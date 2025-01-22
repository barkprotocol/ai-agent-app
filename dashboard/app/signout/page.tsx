"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignOutPage() {
  const router = useRouter()

  useEffect(() => {
    // Perform any necessary logout actions here
    // For example, clear local storage, cookies, etc.
    localStorage.clear()
  }, [])

  const handleBackToHome = () => {
    router.push("/")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Signed Out</CardTitle>
          <CardDescription>You have been successfully signed out</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={handleBackToHome}>
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

