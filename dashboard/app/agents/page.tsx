import { AgentsGrid } from "@/components/agents-grid"

export default function AgentsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">BARK AI Agents</h1>
      <AgentsGrid />
    </div>
  )
}

