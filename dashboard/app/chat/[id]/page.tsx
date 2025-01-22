import { DashboardHeader } from "@/components/dashboard-header"
import { ChatInterface } from "@/components/chat-interface"

export default function ChatPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader title={`Chat ${params.id}`} />
      <ChatInterface chatId={params.id} />
    </div>
  )
}

