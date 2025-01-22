"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/hooks/use-user"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { WalletIcon, UserIcon, ActivityIcon, BrainIcon, ZapIcon } from "lucide-react"

const TokenIcon = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src || "/placeholder.svg"} alt={alt} className="h-5 w-5 mr-2" />
)

export function UserOverview() {
  const { user } = useUser()
  const [balances, setBalances] = useState<{ [key: string]: string | null }>({
    SOL: null,
    BARK: null,
    USDC: null,
  })
  const [blinks, setBlinks] = useState<number | null>(null)
  const [aiAgents, setAiAgents] = useState<{ active: number; total: number } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      // Simulating API calls to fetch data
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setBalances({
        SOL: "134.56",
        BARK: "980,000,00.00",
        USDC: "2500.00",
      })
      setBlinks(750)
      setAiAgents({ active: 3, total: 5 })
    }

    fetchData()
  }, [])

  const renderBalance = (token: string, iconUrl: string) => (
    <div className="flex items-center space-x-2">
      <TokenIcon src={iconUrl} alt={`${token} icon`} />
      <div>
        <p className="text-sm font-medium">{token} Balance</p>
        {balances[token] ? (
          <p className="text-lg font-semibold">{balances[token]}</p>
        ) : (
          <Skeleton className="h-6 w-24" />
        )}
      </div>
    </div>
  )

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">User Overview</CardTitle>
        <CardDescription>Your account information and assets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.profileImage} alt={user?.username} />
            <AvatarFallback>
              <UserIcon className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{user?.username || "Anonymous User"}</h3>
            <p className="text-sm text-muted-foreground">{user?.email || "No email provided"}</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            {renderBalance("SOL", "https://cryptologos.cc/logos/solana-sol-logo.png")}
            {renderBalance("BARK", "https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp")}
            {renderBalance("USDC", "https://cryptologos.cc/logos/usd-coin-usdc-logo.png")}
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ZapIcon className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Solana Blinks</p>
                {blinks !== null ? (
                  <p className="text-lg font-semibold">{blinks}</p>
                ) : (
                  <Skeleton className="h-6 w-24" />
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <BrainIcon className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium">AI Agents</p>
                </div>
                {aiAgents ? (
                  <p className="text-sm font-semibold">
                    {aiAgents.active} / {aiAgents.total} active
                  </p>
                ) : (
                  <Skeleton className="h-4 w-16" />
                )}
              </div>
              {aiAgents ? (
                <Progress value={(aiAgents.active / aiAgents.total) * 100} className="h-2" />
              ) : (
                <Skeleton className="h-2 w-full" />
              )}
            </div>
            <div className="flex items-center space-x-2">
              <ActivityIcon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Recent Activity</p>
                <p className="text-lg font-semibold">3 transactions</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

