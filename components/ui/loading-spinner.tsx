import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: number
  className?: string
}

export function LoadingSpinner({ size = 24, className }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Loader2 className={cn("animate-spin text-primary", className)} size={size} />
    </div>
  )
}

