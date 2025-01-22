"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpRight, ArrowDownLeft, Zap, Brain } from "lucide-react"

type Activity = {
  id: string
  type: "send" | "receive" | "blink" | "ai"
  amount: string
  token: string
  date: string
  counterparty: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[] | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      // Simulating an API call to fetch recent activities
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setActivities([
        { id: "1", type: "send", amount: "10.5", token: "SOL", date: "2025-01-01", counterparty: "Alice" },
        { id: "2", type: "receive", amount: "100", token: "BARK", date: "2025-01-31", counterparty: "Bob" },
        { id: "3", type: "blink", amount: "5", token: "Blinks", date: "2025-01-30", counterparty: "Charlie" },
        { id: "4", type: "ai", amount: "1", token: "Agent", date: "2025-01-29", counterparty: "AI Network" },
      ])
    }

    fetchActivities()
  }, [])

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case "receive":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case "blink":
        return <Zap className="h-4 w-4 text-yellow-500" />
      case "ai":
        return <Brain className="h-4 w-4 text-blue-500" />
    }
  }

  const getActivityDescription = (activity: Activity) => {
    switch (activity.type) {
      case "send":
        return `Sent ${activity.amount} ${activity.token} to ${activity.counterparty}`
      case "receive":
        return `Received ${activity.amount} ${activity.token} from ${activity.counterparty}`
      case "blink":
        return `Used ${activity.amount} Blinks with ${activity.counterparty}`
      case "ai":
        return `Deployed ${activity.amount} AI Agent to the network`
    }
  }

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Recent Activity</CardTitle>
        <CardDescription>Your latest transactions and interactions</CardDescription>
      </CardHeader>
      <CardContent>
        {activities ? (
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li key={activity.id} className="flex items-center space-x-4">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{getActivityIcon(activity.type)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{getActivityDescription(activity)}</p>
                  <p className="text-sm text-muted-foreground">{activity.date}</p>
                </div>
                <div className="font-medium">
                  {activity.type === "receive" ? "+" : "-"}
                  {activity.amount} {activity.token}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

