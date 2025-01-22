import { AITradingAgent } from "@/components/ai-trading-agent"

export default function TradingAssistantPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">AI Trading Assistant</h1>
      <AITradingAgent />
    </div>
  )
}

