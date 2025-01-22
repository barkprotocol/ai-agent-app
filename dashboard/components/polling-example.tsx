"use client"

import React, { useState } from "react"
import usePolling from "@/hooks/use-polling"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

interface PollingData {
  message: string
  timestamp: number
}

export function PollingExample() {
  const [data, setData] = useState<PollingData | null>(null)
  const [isPolling, setIsPolling] = useState(true)

  const { forceUpdate } = usePolling<PollingData>({
    url: "/api/polling-example", // You'll need to create this API route
    id: "example",
    onUpdate: setData,
    interval: 5000, // Poll every 5 seconds
    enabled: isPolling,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Polling Example</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch checked={isPolling} onCheckedChange={setIsPolling} id="polling-switch" />
            <label htmlFor="polling-switch">Enable Polling</label>
          </div>
          <Button onClick={forceUpdate}>Force Update</Button>
          {data && (
            <div>
              <p>Message: {data.message}</p>
              <p>Last updated: {new Date(data.timestamp).toLocaleString()}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

