import type { ReactNode } from "react"

export default function MemoriesLayout({ children }: { children: ReactNode }) {
  return <div className="container mx-auto max-w-4xl py-8">{children}</div>
}

