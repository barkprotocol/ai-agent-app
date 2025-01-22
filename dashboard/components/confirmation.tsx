import type React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ConfirmationProps {
  message: string
  result: string | undefined
  toolCallId: string
  addResultUtility: (result: string) => void
}

/**
 * Confirmation component
 *
 * This component renders a confirmation dialog with a customizable message and action buttons.
 * It supports showing loading state, confirmed state, and interactive confirmation buttons.
 *
 * @param message - The confirmation message to display
 * @param result - The current result of the confirmation ('confirm', 'deny', or undefined)
 * @param toolCallId - The ID of the associated tool call
 * @param addResultUtility - Function to call when a user confirms or denies the action
 */
export const Confirmation: React.FC<ConfirmationProps> = ({ message, result, toolCallId, addResultUtility }) => {
  const hasMessage = Boolean(message)

  return (
    <div className={cn("w-full", { "rounded-lg bg-muted/40 px-3 py-2": hasMessage })}>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div
          className={cn(
            "h-1.5 w-1.5 rounded-full ring-2",
            hasMessage ? "bg-emerald-500 ring-emerald-500/20" : "animate-pulse bg-amber-500 ring-amber-500/20",
          )}
        />
        <span className="truncate text-xs font-medium text-foreground/90">⚠️ Confirmation</span>
        <span className="ml-auto font-mono text-[10px] text-muted-foreground/70">{toolCallId.slice(0, 9)}</span>
      </div>
      <div className="mt-2 px-4">
        {!hasMessage && (
          <div className="mt-px px-3">
            <div
              className="h-20 animate-pulse rounded-lg bg-muted/40"
              role="status"
              aria-label="Loading confirmation message"
            />
          </div>
        )}
        {hasMessage && (
          <Card className="flex flex-col gap-3 bg-card p-6">
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground" aria-live="polite">
                {message}
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              {result === "deny" && (
                <Button variant="outline" size="sm" disabled aria-disabled="true">
                  Denied
                </Button>
              )}
              {result === "confirm" && (
                <Button variant="secondary" size="sm" disabled aria-disabled="true">
                  Confirmed
                </Button>
              )}
              {!result && addResultUtility && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addResultUtility("deny")}
                    aria-label="Deny confirmation"
                  >
                    Deny
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => addResultUtility("confirm")}
                    aria-label="Confirm action"
                  >
                    Confirm
                  </Button>
                </>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

