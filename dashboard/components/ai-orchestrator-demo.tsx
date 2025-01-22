"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { orchestrator } from "@/lib/ai-orchestrator"

export function AIOrchestratorDemo() {
  const [request, setRequest] = useState("")
  const [tools, setTools] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleOrchestration = async () => {
    setIsLoading(true)
    try {
      const requiredTools = await orchestrator(request)
      setTools(requiredTools)
    } catch (error) {
      console.error("Orchestration failed:", error)
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">AI Orchestrator Demo</h2>
      <div className="flex space-x-2">
        <Input
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          placeholder="Enter your request..."
          className="flex-grow"
        />
        <Button onClick={handleOrchestration} disabled={isLoading}>
          {isLoading ? "Processing..." : "Orchestrate"}
        </Button>
      </div>
      {tools.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold">Required Tools:</h3>
          <ul className="list-disc list-inside">
            {tools.map((tool, index) => (
              <li key={index}>{tool}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

