import type { LucideIcon } from "lucide-react"

interface ComingSoonPageProps {
  icon: LucideIcon
  title: string
  description: string
}

export function ComingSoonPage({ icon: Icon, title, description }: ComingSoonPageProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4 text-center">
      <div className="mb-6 rounded-full bg-muted p-4">
        <Icon className="h-12 w-12 text-primary" aria-hidden="true" />
      </div>
      <h1 className="mb-2 text-3xl font-bold">{title}</h1>
      <p className="max-w-md text-muted-foreground">{description}</p>
    </div>
  )
}

