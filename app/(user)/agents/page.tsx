import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Agents",
  description: "Manage your AI agents",
}

export default function AgentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Agents</h1>
      <p className="text-xl">Manage your AI agents and their configurations.</p>
    </div>
  )
}

