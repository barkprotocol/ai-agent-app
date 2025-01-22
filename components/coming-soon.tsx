import React from "react"
import type { LucideIcon } from "lucide-react"

interface ComingSoonPageProps {
  icon: LucideIcon
  title: string
  description: string
}

export function ComingSoonPage({ icon: Icon, title, description }: ComingSoonPageProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4 text-center">
      <Icon className="mb-4 h-16 w-16 text-muted-foreground" />
      <h1 className="mb-2 text-2xl font-bold">{title}</h1>
      <p className="max-w-md text-muted-foreground">{description}</p>
    </div>
  )
}

