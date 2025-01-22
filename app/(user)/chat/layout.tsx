import { Suspense } from "react"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { AppSidebarConversations } from "@/components/dashboard/app-sidebar-conversations"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface ChatLayoutProps {
  children: React.ReactNode
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Suspense fallback={<LoadingSpinner />}>
        <AppSidebar />
      </Suspense>
      <div className="flex flex-1 overflow-hidden">
        <Suspense fallback={<LoadingSpinner />}>
          <AppSidebarConversations className="hidden md:flex w-64 flex-shrink-0 border-r" />
        </Suspense>
        <main
          className="flex-1 overflow-auto transition-all duration-200 ease-in-out
          md:pl-[var(--sidebar-width)] 
          md:group-data-[collapsible=icon]/sidebar:pl-[var(--sidebar-width-collapsed)]"
        >
          {children}
        </main>
      </div>
    </div>
  )
}

