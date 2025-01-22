import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to the BARK AI Chatbot",
}

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to BARK AI Chatbot</h1>
      <p className="text-xl">Start exploring our features and capabilities.</p>
    </div>
  )
}

