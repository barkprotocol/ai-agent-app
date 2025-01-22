import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ToolResultProps {
  toolName: string
  result: any
  header?: ReactNode
}

export function ToolResult({ toolName, result, header }: ToolResultProps) {
  const isError = result && typeof result === "object" && "error" in result
  const content = typeof result === "string" ? result : JSON.stringify(result, null, 2)

  return (
    <div className={cn("w-full", header && "rounded-lg bg-muted/40 px-3 py-2")}>
      {header}
      <div className="mt-2 px-4">
        <Card className={cn("flex flex-col gap-3 bg-card p-6", isError && "border-destructive/50 bg-destructive/5")}>
          <div className="flex items-center gap-3">
            <pre className={cn("text-sm", isError ? "text-destructive" : "text-muted-foreground")}>{content}</pre>
          </div>
        </Card>
      </div>
    </div>
  )
}

