"use client"

import { useState, useEffect } from "react"
import { ActionEmitter } from "./action-emitter"
import { Button } from "@/components/ui/button"
import { EVENTS } from "@/lib/events"

export function ActionCreator() {
  const [actionId, setActionId] = useState<string>("")
  const [lastEvent, setLastEvent] = useState<string>("")

  useEffect(() => {
    const handleActionCreated = () => {
      setLastEvent(`Action Created at ${new Date().toLocaleTimeString()}`)
    }

    window.addEventListener(EVENTS.ACTION_CREATED, handleActionCreated)

    return () => {
      window.removeEventListener(EVENTS.ACTION_CREATED, handleActionCreated)
    }
  }, [])

  const createAction = () => {
    // Simulate action creation with a random ID
    const newActionId = Math.random().toString(36).substring(7)
    setActionId(newActionId)
  }

  return (
    <div className="space-y-4 p-4">
      <Button onClick={createAction}>Create Action</Button>
      {actionId && (
        <>
          <p className="text-sm text-muted-foreground">Action ID: {actionId}</p>
          <ActionEmitter actionId={actionId} />
        </>
      )}
      {lastEvent && <p className="text-sm text-muted-foreground">Last Event: {lastEvent}</p>}
    </div>
  )
}

