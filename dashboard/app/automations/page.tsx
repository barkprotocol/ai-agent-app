import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Automations",
  description: "Set up and manage your automations",
}

export default function AutomationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Automations</h1>
      <p className="text-xl">Set up and manage your AI-powered automations.</p>
    </div>
  )
}

